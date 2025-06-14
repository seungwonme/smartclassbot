import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaign.service';
import { contentService } from '@/services/content.service';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, FileText, Upload, ImageIcon, VideoIcon, CheckCircle } from 'lucide-react';
import ContentPlanList from '@/components/content/ContentPlanList';
import BrandContentPlanReview from '@/components/content/BrandContentPlanReview';
import BrandContentReview from '@/components/content/BrandContentReview';
import ContentUploadForm from '@/components/content/ContentUploadForm';
import AdminSidebar from '@/components/AdminSidebar';
import { ContentSubmission } from '@/types/contentSubmission';
import { ContentPlanDetail } from '@/types/content';

const AdminContentPlanning: React.FC = () => {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [selectedContentType, setSelectedContentType] = useState<'image' | 'video'>('image');

  // URL에서 캠페인 ID 추출 - 여러 패턴 지원
  const campaignId = params.id || params.campaignId || window.location.pathname.split('/')[3];

  console.log('=== AdminContentPlanning 렌더링 시작 ===');
  console.log('URL params:', params);
  console.log('추출된 캠페인 ID:', campaignId);
  console.log('현재 URL:', window.location.pathname);

  // 캠페인 데이터 로드
  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignService.getCampaignById(campaignId!),
    enabled: !!campaignId,
    retry: 3,
    retryDelay: 1000
  });
  
  const { data: contentPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['contentPlans', campaignId],
    queryFn: () => contentService.getContentPlans(campaignId!),
    enabled: !!campaignId
  });

  const { data: contentSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['contentSubmissions', campaignId],
    queryFn: () => contentSubmissionService.getContentSubmissions(campaignId!),
    enabled: !!campaignId
  });

  console.log('=== AdminContentPlanning 데이터 상태 ===');
  console.log('캠페인 로딩중:', campaignLoading);
  console.log('캠페인 데이터:', campaign);
  console.log('콘텐츠 기획안 개수:', contentPlans.length);
  console.log('콘텐츠 제출물 개수:', contentSubmissions.length);
  console.log('캠페인 에러:', campaignError);

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
    },
    onError: (error) => {
      console.error('콘텐츠 업로드 실패:', error);
      toast({
        title: "업로드 실패",
        description: "콘텐츠 업로드에 실패했습니다.",
        variant: "destructive"
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

  const handleUploadSubmit = (submissionData: Partial<ContentSubmission>) => {
    createSubmissionMutation.mutate(submissionData);
  };

  const handleShowUploadForm = (influencer: any, contentType: 'image' | 'video') => {
    setSelectedInfluencer(influencer);
    setSelectedContentType(contentType);
    setShowUploadForm(true);
  };

  const getWorkflowStage = () => {
    if (!campaign) return { stage: 1, title: '', description: '', progress: 0 };

    console.log('=== getWorkflowStage 호출 ===');
    console.log('캠페인 상태:', campaign.status);

    switch (campaign.status) {
      case 'creating':
      case 'submitted':
      case 'recruiting':
      case 'proposing':
      case 'confirmed':
        return {
          stage: 1,
          title: '캠페인 생성 완료',
          description: '인플루언서 모집 및 확정이 완료되었습니다.',
          progress: 20
        };
      case 'planning':
      case 'plan-review':
      case 'plan-revision':
        return {
          stage: 2,
          title: '콘텐츠 기획',
          description: '인플루언서들이 콘텐츠 기획안을 작성하고 검토중입니다.',
          progress: 40
        };
      case 'plan-approved':
      case 'producing':
        return {
          stage: 3,
          title: '콘텐츠 제작',
          description: '인플루언서들이 콘텐츠를 제작하고 업로드하고 있습니다.',
          progress: 60
        };
      case 'content-review':
      case 'content-revision':
        return {
          stage: 4,
          title: '콘텐츠 검수',
          description: '제작된 콘텐츠를 검토하고 승인하고 있습니다.',
          progress: 80
        };
      case 'content-approved':
      case 'live':
      case 'monitoring':
      case 'completed':
        return {
          stage: 5,
          title: '성과 모니터링',
          description: '콘텐츠가 라이브되어 성과를 모니터링하고 있습니다.',
          progress: 100
        };
      default:
        return {
          stage: 1,
          title: '캠페인 진행중',
          description: '캠페인이 진행중입니다.',
          progress: 20
        };
    }
  };

  const getWorkflowSteps = () => {
    const currentStage = getWorkflowStage().stage;
    
    return [
      { id: 1, title: '캠페인 생성', completed: currentStage > 1, current: currentStage === 1 },
      { id: 2, title: '콘텐츠 기획', completed: currentStage > 2, current: currentStage === 2 },
      { id: 3, title: '콘텐츠 제작', completed: currentStage > 3, current: currentStage === 3 },
      { id: 4, title: '콘텐츠 검수', completed: currentStage > 4, current: currentStage === 4 },
      { id: 5, title: '성과 모니터링', completed: currentStage > 5, current: currentStage === 5 }
    ];
  };

  const isTabEnabled = (tabName: string) => {
    const currentStage = getWorkflowStage().stage;
    
    switch (tabName) {
      case 'content-plans':
        return currentStage >= 2; // 기획 단계부터 가능
      case 'content-production':
        return currentStage >= 3; // 제작 단계부터 가능
      case 'content-review':
        return currentStage >= 4; // 검수 단계부터 가능
      default:
        return true;
    }
  };

  const getDefaultTab = () => {
    const currentStage = getWorkflowStage().stage;
    
    if (currentStage === 2) return 'content-plans';
    if (currentStage === 3) return 'content-production';
    if (currentStage >= 4) return 'content-review';
    
    return 'content-plans';
  };

  // 캠페인 ID가 없는 경우
  if (!campaignId) {
    console.log('=== 캠페인 ID 없음 ===');
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">캠페인 ID를 찾을 수 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">URL: {window.location.pathname}</p>
            <Button onClick={() => window.history.back()} className="mt-4">
              이전 페이지로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (campaignLoading) {
    console.log('=== 캠페인 로딩중 ===');
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>캠페인 정보를 불러오는 중...</p>
            <p className="text-sm text-gray-500 mt-2">캠페인 ID: {campaignId}</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (campaignError) {
    console.error('캠페인 로딩 에러:', campaignError);
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">캠페인 정보를 불러오는데 실패했습니다.</p>
            <p className="text-sm text-gray-500 mt-2">캠페인 ID: {campaignId}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    console.log('=== 캠페인 데이터 없음 ===');
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <p>캠페인을 찾을 수 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">캠페인 ID: {campaignId}</p>
          </div>
        </div>
      </div>
    );
  }

  const workflowInfo = getWorkflowStage();
  const workflowSteps = getWorkflowSteps();
  
  console.log('=== 최종 렌더링 정보 ===');
  console.log('워크플로우 정보:', workflowInfo);
  console.log('캠페인 제목:', campaign.title);
  console.log('인플루언서 수:', campaign.influencers?.length || 0);

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
              {workflowInfo.title}
            </Badge>
          </div>

          {/* 5단계 워크플로우 프로그레스 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                캠페인 진행 단계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 진행률 바 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>전체 진행률</span>
                    <span>{workflowInfo.progress}%</span>
                  </div>
                  <Progress value={workflowInfo.progress} className="h-2" />
                </div>

                {/* 5단계 워크플로우 */}
                <div className="flex items-center justify-between">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          step.completed 
                            ? 'bg-green-600 text-white' 
                            : step.current 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <span className={`text-xs mt-2 text-center font-medium ${
                          step.current ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </span>
                        {step.current && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            진행중
                          </Badge>
                        )}
                      </div>
                      
                      {index < workflowSteps.length - 1 && (
                        <div className={`w-16 h-1 mx-4 transition-colors ${
                          step.completed ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* 현재 단계 설명 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">{workflowInfo.title}</h3>
                  <p className="text-sm text-blue-700 mt-1">{workflowInfo.description}</p>
                </div>
                
                {/* 디버그 정보 */}
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                  <p><strong>디버그 정보:</strong></p>
                  <p>캠페인 ID: {campaign.id}</p>
                  <p>캠페인 상태: {campaign.status}</p>
                  <p>콘텐츠 기획안: {contentPlans.length}개</p>
                  <p>콘텐츠 제출물: {contentSubmissions.length}개</p>
                  <p>인플루언서: {campaign.influencers?.length || 0}명</p>
                  <p>현재 단계: {workflowInfo.stage}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
              <Card>
                <CardHeader>
                  <CardTitle>콘텐츠 기획안 검토</CardTitle>
                </CardHeader>
                <CardContent>
                  {contentPlans.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">등록된 콘텐츠 기획안이 없습니다.</p>
                      <p className="text-sm text-gray-400">인플루언서가 콘텐츠 기획안을 제출하면 여기에 표시됩니다.</p>
                    </div>
                  ) : (
                    <BrandContentPlanReview
                      plans={contentPlans}
                      onApprove={(planId) => approvePlanMutation.mutate(planId)}
                      onRequestRevision={(planId, feedback) => 
                        requestRevisionMutation.mutate({ planId, feedback })
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content-production">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    콘텐츠 제작 및 업로드
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!campaign.influencers || campaign.influencers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">확정된 인플루언서가 없습니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 제작 가이드 */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">📋 제작 가이드</h3>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 승인된 기획안을 바탕으로 콘텐츠를 제작해주세요</li>
                          <li>• 이미지는 JPEG, PNG, GIF, WebP 형식을 지원합니다</li>
                          <li>• 영상은 MP4, AVI, MOV, WMV 형식을 지원합니다</li>
                          <li>• 업로드 완료 후 자동으로 검수 단계로 넘어갑니다</li>
                        </ul>
                      </div>

                      {/* 인플루언서별 콘텐츠 업로드 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {campaign.influencers?.map((influencer) => {
                          const influencerSubmissions = contentSubmissions.filter(s => s.influencerId === influencer.id);
                          const hasSubmissions = influencerSubmissions.length > 0;
                          
                          return (
                            <Card key={influencer.id} className={hasSubmissions ? 'border-green-200 bg-green-50' : ''}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Users className="w-5 h-5" />
                                  {influencer.name}
                                  {hasSubmissions && (
                                    <Badge variant="outline" className="bg-green-100 text-green-700">
                                      제작완료
                                    </Badge>
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <p className="text-sm text-gray-600">
                                    카테고리: {influencer.category}
                                  </p>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleShowUploadForm(influencer, 'image')}
                                      className="flex items-center gap-2"
                                    >
                                      <ImageIcon className="w-4 h-4" />
                                      이미지 업로드
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleShowUploadForm(influencer, 'video')}
                                      className="flex items-center gap-2"
                                    >
                                      <VideoIcon className="w-4 h-4" />
                                      영상 업로드
                                    </Button>
                                  </div>

                                  {hasSubmissions && (
                                    <div className="mt-4">
                                      <p className="text-sm font-medium mb-2">제작된 콘텐츠:</p>
                                      <div className="space-y-1">
                                        {influencerSubmissions.map(submission => (
                                          <div key={submission.id} className="text-xs text-gray-600 flex items-center gap-2">
                                            {submission.contentType === 'image' ? (
                                              <ImageIcon className="w-3 h-3" />
                                            ) : (
                                              <VideoIcon className="w-3 h-3" />
                                            )}
                                            {submission.contentType === 'image' ? '이미지' : '영상'} - {submission.contentFiles.length}개 파일
                                            <Badge variant="outline" className="text-xs">
                                              {submission.status === 'draft' ? '검수대기' : 
                                               submission.status === 'revision' ? '수정중' : '승인완료'}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content-review">
              <Card>
                <CardHeader>
                  <CardTitle>콘텐츠 검수 및 승인</CardTitle>
                </CardHeader>
                <CardContent>
                  {contentSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">제출된 콘텐츠가 없습니다.</p>
                      <p className="text-sm text-gray-400">콘텐츠 제작 탭에서 콘텐츠를 업로드하면 여기에 표시됩니다.</p>
                    </div>
                  ) : (
                    <BrandContentReview
                      submissions={contentSubmissions}
                      onApprove={(submissionId) => approveSubmissionMutation.mutate(submissionId)}
                      onRequestRevision={(submissionId, feedback) => 
                        requestSubmissionRevisionMutation.mutate({ submissionId, feedback })
                      }
                    />
                  )}
                </CardContent>
              </Card>
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
