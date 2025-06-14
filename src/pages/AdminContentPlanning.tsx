import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaign.service';
import { contentService } from '@/services/content.service';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, FileText, Upload, ImageIcon, VideoIcon } from 'lucide-react';
import ContentPlanList from '@/components/content/ContentPlanList';
import BrandContentPlanReview from '@/components/content/BrandContentPlanReview';
import BrandContentReview from '@/components/content/BrandContentReview';
import ContentUploadForm from '@/components/content/ContentUploadForm';
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

  const getStageInfo = () => {
    if (!campaign) return { stage: 0, title: '', description: '' };

    console.log('=== getStageInfo 호출 ===');
    console.log('캠페인 상태:', campaign.status);

    switch (campaign.status) {
      case 'producing':
        return {
          stage: 3,
          title: '콘텐츠 제작중',
          description: '인플루언서들이 콘텐츠를 제작하고 있습니다.'
        };
      case 'content-review':
        return {
          stage: 4,
          title: '콘텐츠 검수',
          description: '제작된 콘텐츠를 검토하고 승인합니다.'
        };
      case 'content-revision':
        return {
          stage: 4,
          title: '콘텐츠 수정중',
          description: '콘텐츠 수정 요청이 진행중입니다.'
        };
      case 'content-approved':
        return {
          stage: 5,
          title: '콘텐츠 승인완료',
          description: '모든 콘텐츠가 승인되어 라이브 준비중입니다.'
        };
      default:
        return {
          stage: 3,
          title: '콘텐츠 제작',
          description: '콘텐츠 제작 단계입니다.'
        };
    }
  };

  // 캠페인 ID가 없는 경우
  if (!campaignId) {
    console.log('=== 캠페인 ID 없음 ===');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">캠페인 ID를 찾을 수 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">URL: {window.location.pathname}</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            이전 페이지로
          </Button>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (campaignLoading) {
    console.log('=== 캠페인 로딩중 ===');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>캠페인 정보를 불러오는 중...</p>
          <p className="text-sm text-gray-500 mt-2">캠페인 ID: {campaignId}</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (campaignError) {
    console.error('캠페인 로딩 에러:', campaignError);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">캠페인 정보를 불러오는데 실패했습니다.</p>
          <p className="text-sm text-gray-500 mt-2">캠페인 ID: {campaignId}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    console.log('=== 캠페인 데이터 없음 ===');
    return (
      <div className="text-center py-12">
        <p>캠페인을 찾을 수 없습니다.</p>
        <p className="text-sm text-gray-500 mt-2">캠페인 ID: {campaignId}</p>
      </div>
    );
  }

  const stageInfo = getStageInfo();
  console.log('=== 최종 렌더링 정보 ===');
  console.log('스테이지 정보:', stageInfo);
  console.log('캠페인 제목:', campaign.title);
  console.log('인플루언서 수:', campaign.influencers?.length || 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
          <p className="text-gray-600">콘텐츠 제작 및 검수 관리</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {stageInfo.title}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            현재 진행 단계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                {stageInfo.stage}
              </div>
              <div>
                <h3 className="font-semibold">{stageInfo.title}</h3>
                <p className="text-sm text-gray-600">{stageInfo.description}</p>
              </div>
            </div>
            
            {/* 디버그 정보 추가 */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
              <p><strong>디버그 정보:</strong></p>
              <p>캠페인 ID: {campaign.id}</p>
              <p>캠페인 상태: {campaign.status}</p>
              <p>콘텐츠 기획안: {contentPlans.length}개</p>
              <p>콘텐츠 제출물: {contentSubmissions.length}개</p>
              <p>인플루언서: {campaign.influencers?.length || 0}명</p>
              <p>URL 캠페인 ID: {campaignId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content-plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content-plans">콘텐츠 기획</TabsTrigger>
          <TabsTrigger value="content-upload">콘텐츠 업로드</TabsTrigger>
          <TabsTrigger value="content-review">콘텐츠 검수</TabsTrigger>
        </TabsList>

        <TabsContent value="content-plans">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 기획안 관리</CardTitle>
            </CardHeader>
            <CardContent>
              {contentPlans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">등록된 콘텐츠 기획안이 없습니다.</p>
                  <p className="text-sm text-gray-400">인플루언서가 콘텐츠 기획안을 제출하면 여기에 표시됩니다.</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
                    <p><strong>참고:</strong> 캠페인이 '기획' 단계에 있을 때 인플루언서들이 기획안을 작성할 수 있습니다.</p>
                  </div>
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

        <TabsContent value="content-upload">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  콘텐츠 업로드
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!campaign.influencers || campaign.influencers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">확정된 인플루언서가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {campaign.influencers?.map((influencer) => (
                      <Card key={influencer.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {influencer.name}
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

                            {contentSubmissions.filter(s => s.influencerId === influencer.id).length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium mb-2">제출된 콘텐츠:</p>
                                <div className="space-y-1">
                                  {contentSubmissions
                                    .filter(s => s.influencerId === influencer.id)
                                    .map(submission => (
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

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
        </TabsContent>

        <TabsContent value="content-review">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 검수</CardTitle>
            </CardHeader>
            <CardContent>
              {contentSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">제출된 콘텐츠가 없습니다.</p>
                  <p className="text-sm text-gray-400">인플루언서가 콘텐츠를 업로드하면 여기에 표시됩니다.</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
                    <p><strong>참고:</strong> 콘텐츠 업로드 탭에서 인플루언서별로 콘텐츠를 업로드할 수 있습니다.</p>
                  </div>
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
  );
};

export default AdminContentPlanning;
