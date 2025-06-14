import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Send, Calendar, Users, DollarSign, CheckCircle, FileText, Video } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import CampaignWorkflowSteps from '@/components/CampaignWorkflowSteps';
import InfluencerManagementTab from '@/components/campaign/InfluencerManagementTab';
import CampaignConfirmationSummary from '@/components/campaign/CampaignConfirmationSummary';
import BrandContentPlanReview from '@/components/content/BrandContentPlanReview';
import { Campaign } from '@/types/campaign';
import { ContentPlanDetail } from '@/types/content';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { campaignService } from '@/services/campaign.service';

const CampaignDetail = () => {
  const {
    campaign,
    setCampaign,
    isLoading,
    activeTab,
    setActiveTab,
    handleEdit,
    handleDelete,
    handleInfluencerApproval,
    handleFinalConfirmation,
    updateCampaignInfluencers,
    toast
  } = useCampaignDetail();

  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);

  // Load content plans when campaign is loaded
  React.useEffect(() => {
    if (campaign?.contentPlans) {
      console.log('Processing content plans:', campaign.contentPlans);
      
      const plans: ContentPlanDetail[] = campaign.contentPlans.map(plan => {
        console.log('Processing plan:', plan);
        
        let planData;
        try {
          // planDocument가 이미 객체인 경우와 문자열인 경우 모두 처리
          if (typeof plan.planDocument === 'string') {
            planData = JSON.parse(plan.planDocument);
          } else if (plan.planDocument && typeof plan.planDocument === 'object') {
            planData = plan.planDocument;
          } else {
            // 기본값 설정
            planData = plan.contentType === 'image' ? {
              postTitle: '',
              thumbnailTitle: '',
              referenceImages: [],
              script: '',
              hashtags: []
            } : {
              postTitle: '',
              scenario: '',
              scenarioFiles: [],
              script: '',
              hashtags: []
            };
          }
        } catch (error) {
          console.error('Error parsing plan document:', error, plan.planDocument);
          // 파싱 실패시 기본값 사용
          planData = plan.contentType === 'image' ? {
            postTitle: '',
            thumbnailTitle: '',
            referenceImages: [],
            script: '',
            hashtags: []
          } : {
            postTitle: '',
            scenario: '',
            scenarioFiles: [],
            script: '',
            hashtags: []
          };
        }
        
        console.log('Processed plan data:', planData);
        
        // status를 올바른 타입으로 매핑
        let status: 'draft' | 'revision' | 'approved' = 'draft';
        if (plan.status === 'revision' || plan.status === 'approved') {
          status = plan.status;
        }
        
        return {
          id: plan.id,
          campaignId: plan.campaignId,
          influencerId: plan.influencerId,
          influencerName: plan.influencerName,
          contentType: plan.contentType,
          status: status,
          planData: planData,
          revisions: plan.revisions || [],
          currentRevisionNumber: plan.revisions?.length || 0,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt
        };
      });
      
      console.log('Final processed plans:', plans);
      setContentPlans(plans);
    }
  }, [campaign]);

  const handleContentPlanApprove = async (planId: string) => {
    if (!campaign) return;

    try {
      const updatedContentPlans = campaign.contentPlans?.map(plan => 
        plan.id === planId ? { ...plan, status: 'approved' as const } : plan
      ) || [];

      await campaignService.updateCampaign(campaign.id, {
        contentPlans: updatedContentPlans
      });

      setCampaign(prev => prev ? {
        ...prev,
        contentPlans: updatedContentPlans
      } : null);

      // Update local state
      setContentPlans(prev => prev.map(plan =>
        plan.id === planId ? { ...plan, status: 'approved' } : plan
      ));

    } catch (error) {
      console.error('콘텐츠 기획 승인 실패:', error);
      toast({
        title: "승인 실패",
        variant: "destructive"
      });
    }
  };

  const handleContentPlanRevision = async (planId: string, feedback: string) => {
    if (!campaign) return;

    try {
      const targetPlan = contentPlans.find(p => p.id === planId);
      
      // 기존 pending 상태의 revision이 있는지 확인
      const existingPendingRevision = targetPlan?.revisions.find(r => r.status === 'pending');
      
      let updatedContentPlans;
      
      if (existingPendingRevision) {
        // 기존 pending revision 업데이트 (재수정 요청)
        updatedContentPlans = campaign.contentPlans?.map(plan => {
          if (plan.id === planId) {
            const updatedRevisions = plan.revisions?.map(revision => 
              revision.id === existingPendingRevision.id 
                ? { ...revision, feedback, requestedAt: new Date().toISOString() }
                : revision
            ) || [];
            
            return {
              ...plan,
              status: 'revision' as const,
              revisions: updatedRevisions
            };
          }
          return plan;
        }) || [];
      } else {
        // 새로운 revision 생성
        const currentRevisionNumber = (targetPlan?.revisions.filter(r => r.status === 'completed').length || 0) + 1;
        
        const newRevision = {
          id: `revision_${Date.now()}`,
          revisionNumber: currentRevisionNumber,
          feedback,
          requestedBy: 'brand' as const,
          requestedByName: '브랜드 관리자',
          requestedAt: new Date().toISOString(),
          status: 'pending' as const
        };

        updatedContentPlans = campaign.contentPlans?.map(plan => {
          if (plan.id === planId) {
            return {
              ...plan,
              status: 'revision' as const,
              revisions: [...(plan.revisions || []), newRevision]
            };
          }
          return plan;
        }) || [];
      }

      await campaignService.updateCampaign(campaign.id, {
        contentPlans: updatedContentPlans
      });

      setCampaign(prev => prev ? {
        ...prev,
        contentPlans: updatedContentPlans
      } : null);

      // Update local state
      setContentPlans(prev => prev.map(plan => {
        if (plan.id === planId) {
          const updatedPlan = updatedContentPlans.find(p => p.id === planId);
          if (updatedPlan) {
            return {
              ...plan,
              status: 'revision',
              revisions: updatedPlan.revisions || [],
              currentRevisionNumber: updatedPlan.revisions?.filter(r => r.status === 'completed').length || 0
            };
          }
        }
        return plan;
      }));

    } catch (error) {
      console.error('콘텐츠 기획 수정 요청 실패:', error);
      toast({
        title: "수정 요청 실패",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!campaign) return;
    
    try {
      console.log('캠페인 제출 시작 - 현재 상태:', campaign.status);
      
      // 캠페인을 제출됨 상태로 변경 - 올바른 방식으로 호출
      const updatedInfluencers = campaign.influencers.map(inf => ({ ...inf }));
      await updateCampaignInfluencers(updatedInfluencers);
      
      // 상태 업데이트를 위한 별도 호출
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { status: 'submitted' });
      
      console.log('캠페인 상태를 submitted로 변경 완료');
      
      toast({
        title: "캠페인 제출 완료",
        description: "캠페인이 성공적으로 제출되었습니다. 시스템 관리자가 검토 후 섭외를 진행합니다."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('캠페인 제출 실패:', error);
      toast({
        title: "제출 실패",
        description: "캠페인 제출에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 캠페인 진행 동의 처리
  const handleCampaignConfirmation = async () => {
    if (!campaign) return;
    
    try {
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { 
        status: 'planning',
        currentStage: 2
      });
      
      toast({
        title: "캠페인 진행 동의 완료",
        description: "캠페인이 콘텐츠 기획 단계로 진행됩니다. 정산 관리에서 납부 정보를 확인하세요."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('캠페인 진행 동의 실패:', error);
      toast({
        title: "처리 실패",
        description: "캠페인 진행 동의 처리에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'revising': return 'bg-red-100 text-red-800';
      case 'revision-feedback': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'plan-review': return 'bg-indigo-100 text-indigo-800';
      case 'plan-approved': return 'bg-lime-100 text-lime-800';
      case 'producing': return 'bg-teal-100 text-teal-800';
      case 'content-review': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'live': return 'bg-rose-100 text-rose-800';
      case 'monitoring': return 'bg-cyan-100 text-cyan-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'submitted': return '제출됨';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'revising': return '제안수정요청';
      case 'revision-feedback': return '제안수정피드백';
      case 'confirmed': return '확정됨';
      case 'planning': return '콘텐츠 기획중';
      case 'plan-review': return '기획검토';
      case 'plan-approved': return '기획승인';
      case 'producing': return '제작중';
      case 'content-review': return '콘텐츠검토';
      case 'live': return '라이브';
      case 'monitoring': return '모니터링';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const getNextAction = () => {
    if (!campaign) return null;
    
    const stage = campaign.currentStage;
    const status = campaign.status;
    
    switch (stage) {
      case 1:
        if (status === 'creating') return '캠페인 제출 필요';
        if (status === 'recruiting') return '인플루언서 섭외 진행중';
        if (status === 'proposing') return '제안 검토 필요';
        if (status === 'confirmed') return '콘텐츠 기획 단계로 진행 가능';
        break;
      case 2:
        return '콘텐츠 기획안 작성/검토';
      case 3:
        return '콘텐츠 제작/검수';
      case 4:
        return '성과 모니터링';
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">캠페인을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const isCreating = campaign.status === 'creating';
  const isConfirmed = campaign.status === 'confirmed';
  const isPlanning = ['planning', 'plan-review'].includes(campaign.status);

  // confirmed 상태일 때는 확정 요약 페이지만 표시
  if (isConfirmed) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/brand/campaigns">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  캠페인 목록으로
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{campaign.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    확정됨
                  </Badge>
                  <Badge variant="outline" className="text-blue-600">
                    캠페인 진행 동의 필요
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <CampaignWorkflowSteps campaign={campaign} />

          <div className="mt-6">
            <CampaignConfirmationSummary 
              campaign={campaign}
              onConfirmCampaign={handleCampaignConfirmation}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/brand/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                캠페인 목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusText(campaign.status)}
                </Badge>
                {getNextAction() && (
                  <Badge variant="outline" className="text-blue-600">
                    {getNextAction()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isCreating && (
              <>
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  제출
                </Button>
              </>
            )}
            {isConfirmed && (
              <Button onClick={handleFinalConfirmation} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                최종 확정
              </Button>
            )}
          </div>
        </div>

        <CampaignWorkflowSteps campaign={campaign} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">📋 기본정보</TabsTrigger>
            <TabsTrigger value="influencers">👥 인플루언서 관리</TabsTrigger>
            <TabsTrigger value="planning" disabled={campaign.currentStage < 2 && !isPlanning}>💡 콘텐츠 기획</TabsTrigger>
            <TabsTrigger value="content" disabled={campaign.currentStage < 3}>🔍 콘텐츠 검수</TabsTrigger>
            <TabsTrigger value="performance" disabled={campaign.currentStage < 4}>📈 성과 분석</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">브랜드</label>
                    <p className="text-lg">{campaign.brandName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">제품</label>
                    <p className="text-lg">{campaign.productName}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">예산</label>
                      <p className="text-lg">{campaign.budget.toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">캠페인 기간</label>
                      <p className="text-lg">{campaign.campaignStartDate} ~ {campaign.campaignEndDate}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">제안 마감일</label>
                    <p className="text-lg">{campaign.proposalDeadline}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">광고 유형</label>
                    <p className="text-lg">{campaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>타겟 콘텐츠 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">인플루언서 카테고리</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.targetContent.influencerCategories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">타겟 연령층</label>
                    <p className="text-lg">{campaign.targetContent.targetAge}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">USP 중요도</label>
                    <p className="text-lg">{campaign.targetContent.uspImportance}/10</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">인플루언서 영향력</label>
                    <p className="text-lg">{campaign.targetContent.influencerImpact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">추가 설명</label>
                    <p className="text-lg">{campaign.targetContent.additionalDescription || '없음'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">2차 콘텐츠 활용</label>
                    <p className="text-lg">{campaign.targetContent.secondaryContentUsage ? '예' : '아니오'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="influencers" className="mt-6">
            <InfluencerManagementTab
              campaign={campaign}
              onInfluencerApproval={handleInfluencerApproval}
              onUpdateInfluencers={updateCampaignInfluencers}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="planning" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  콘텐츠 기획 검토
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BrandContentPlanReview
                  plans={contentPlans}
                  onApprove={handleContentPlanApprove}
                  onRequestRevision={handleContentPlanRevision}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  콘텐츠 검수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 검수 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  성과 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  성과 분석 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDetail;
