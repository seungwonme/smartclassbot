
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaign.service';
import { contentService } from '@/services/content.service';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import { useToast } from '@/hooks/use-toast';
import { useCampaignWorkflow } from '@/hooks/useCampaignWorkflow';
import { Clock } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import CampaignWorkflowProgress from '@/components/campaign/CampaignWorkflowProgress';
import ContentPlansTab from '@/components/campaign/ContentPlansTab';
import ContentProductionTab from '@/components/campaign/ContentProductionTab';
import ContentReviewTab from '@/components/campaign/ContentReviewTab';
import ContentUploadForm from '@/components/content/ContentUploadForm';
import { ContentSubmission } from '@/types/contentSubmission';

const AdminContentPlanning: React.FC = () => {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [selectedContentType, setSelectedContentType] = useState<'image' | 'video'>('image');

  // URL에서 캠페인 ID 추출
  const campaignId = params.id || params.campaignId || window.location.pathname.split('/')[3];

  console.log('=== AdminContentPlanning 렌더링 시작 ===');
  console.log('추출된 캠페인 ID:', campaignId);

  // 데이터 로드
  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignService.getCampaignById(campaignId!),
    enabled: !!campaignId,
    retry: 3,
    retryDelay: 1000
  });
  
  const { data: contentPlans = [] } = useQuery({
    queryKey: ['contentPlans', campaignId],
    queryFn: () => contentService.getContentPlans(campaignId!),
    enabled: !!campaignId
  });

  const { data: contentSubmissions = [] } = useQuery({
    queryKey: ['contentSubmissions', campaignId],
    queryFn: () => contentSubmissionService.getContentSubmissions(campaignId!),
    enabled: !!campaignId
  });

  // 워크플로우 관리
  const { workflowStage, workflowSteps, isTabEnabled, getDefaultTab } = useCampaignWorkflow(campaign);

  // Mutations
  const approvePlanMutation = useMutation({
    mutationFn: (planId: string) => contentService.updateContentPlan(campaignId!, planId, { status: 'approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans', campaignId] });
      toast({
        title: "기획 승인",
        description: "콘텐츠 기획이 승인되었습니다."
      });
    }
  });

  const requestRevisionMutation = useMutation({
    mutationFn: ({ planId, feedback }: { planId: string; feedback: string }) =>
      contentService.updateContentPlan(campaignId!, planId, {
        status: 'revision',
        revisions: [
          {
            id: `revision_${Date.now()}`,
            revisionNumber: 1,
            feedback,
            requestedBy: 'brand',
            requestedByName: '브랜드 관리자',
            requestedAt: new Date().toISOString(),
            status: 'pending'
          }
        ],
        currentRevisionNumber: 1
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans', campaignId] });
      toast({
        title: "수정 요청 전송",
        description: "콘텐츠 기획 수정 요청이 전송되었습니다."
      });
    }
  });

  const createSubmissionMutation = useMutation({
    mutationFn: (submissionData: Partial<ContentSubmission>) =>
      contentSubmissionService.createContentSubmission(campaignId!, submissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSubmissions', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      setShowUploadForm(false);
      setSelectedInfluencer(null);
      toast({
        title: "콘텐츠 업로드 완료",
        description: "콘텐츠가 성공적으로 업로드되었습니다."
      });
    }
  });

  const approveSubmissionMutation = useMutation({
    mutationFn: (submissionId: string) =>
      contentSubmissionService.updateContentSubmission(campaignId!, submissionId, { status: 'approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSubmissions', campaignId] });
      toast({
        title: "콘텐츠 승인",
        description: "콘텐츠가 승인되었습니다."
      });
    }
  });

  const requestSubmissionRevisionMutation = useMutation({
    mutationFn: ({ submissionId, feedback }: { submissionId: string; feedback: string }) =>
      contentSubmissionService.updateContentSubmission(campaignId!, submissionId, {
        status: 'revision',
        revisions: [
          {
            id: `revision_${Date.now()}`,
            revisionNumber: 1,
            feedback,
            requestedBy: 'brand',
            requestedByName: '브랜드 관리자',
            requestedAt: new Date().toISOString(),
            status: 'pending'
          }
        ],
        currentRevisionNumber: 1
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSubmissions', campaignId] });
      toast({
        title: "수정 요청 전송",
        description: "콘텐츠 수정 요청이 전송되었습니다."
      });
    }
  });

  // 핸들러들
  const handleUploadSubmit = (submissionData: Partial<ContentSubmission>) => {
    createSubmissionMutation.mutate(submissionData);
  };

  const handleShowUploadForm = (influencer: any, contentType: 'image' | 'video') => {
    setSelectedInfluencer(influencer);
    setSelectedContentType(contentType);
    setShowUploadForm(true);
  };

  // 에러 및 로딩 처리
  if (!campaignId) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">캠페인 ID를 찾을 수 없습니다.</p>
            <Button onClick={() => window.history.back()} className="mt-4">
              이전 페이지로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (campaignLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>캠페인 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">캠페인 정보를 불러오는데 실패했습니다.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
              <p className="text-gray-600">콘텐츠 제작 및 검수 관리</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {workflowStage.title}
            </Badge>
          </div>

          <CampaignWorkflowProgress
            campaign={campaign}
            workflowStage={workflowStage}
            workflowSteps={workflowSteps}
            contentPlansCount={contentPlans.length}
            contentSubmissionsCount={contentSubmissions.length}
          />

          <Tabs defaultValue={getDefaultTab()} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="content-plans" 
                disabled={!isTabEnabled('content-plans')}
                className="flex items-center gap-2"
              >
                📋 기획안 검토
              </TabsTrigger>
              <TabsTrigger 
                value="content-production" 
                disabled={!isTabEnabled('content-production')}
                className="flex items-center gap-2"
              >
                🎬 콘텐츠 제작
              </TabsTrigger>
              <TabsTrigger 
                value="content-review" 
                disabled={!isTabEnabled('content-review')}
                className="flex items-center gap-2"
              >
                🔍 콘텐츠 검수
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content-plans">
              <ContentPlansTab
                contentPlans={contentPlans}
                onApprove={(planId) => approvePlanMutation.mutate(planId)}
                onRequestRevision={(planId, feedback) => 
                  requestRevisionMutation.mutate({ planId, feedback })
                }
              />
            </TabsContent>

            <TabsContent value="content-production">
              <ContentProductionTab
                campaign={campaign}
                contentSubmissions={contentSubmissions}
                onShowUploadForm={handleShowUploadForm}
              />
            </TabsContent>

            <TabsContent value="content-review">
              <ContentReviewTab
                contentSubmissions={contentSubmissions}
                onApprove={(submissionId) => approveSubmissionMutation.mutate(submissionId)}
                onRequestRevision={(submissionId, feedback) => 
                  requestSubmissionRevisionMutation.mutate({ submissionId, feedback })
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showUploadForm && selectedInfluencer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white rounded-lg mx-4">
            <ContentUploadForm
              influencer={selectedInfluencer}
              campaignId={campaignId!}
              contentType={selectedContentType}
              onSubmit={handleUploadSubmit}
              onCancel={() => {
                setShowUploadForm(false);
                setSelectedInfluencer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentPlanning;
