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
import { contentService } from '@/services/content.service';

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
  const [isContentLoading, setIsContentLoading] = useState(false);

  // Load content plans when campaign is loaded (강화된 로딩)
  React.useEffect(() => {
    const loadContentPlans = async () => {
      if (campaign?.id) {
        try {
          setIsContentLoading(true);
          console.log('🎯 브랜드 관리자 - 콘텐츠 기획 로딩 시작');
          console.log('🎯 캠페인 정보:', {
            id: campaign.id,
            title: campaign.title,
            status: campaign.status,
            currentStage: campaign.currentStage
          });
          
          // 스토리지 전체 상태 먼저 확인
          const { storageService } = await import('@/services/storage.service');
          storageService.debugAllStorage();
          
          // localStorage에서 직접 확인
          const rawPlans = localStorage.getItem('content_plans');
          console.log('🔍 localStorage에서 직접 확인:', rawPlans);
          
          // 강제 새로고침을 위해 약간의 지연 추가
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const plans = await contentService.getContentPlans(campaign.id);
          console.log('📋 로딩된 콘텐츠 기획:', plans);
          console.log('📊 기획안 개수:', plans.length);
          
          setContentPlans(plans);
          
          if (plans.length > 0) {
            console.log('✅ 콘텐츠 기획안 로딩 성공');
            toast({
              title: "콘텐츠 기획안 로딩 완료",
              description: `${plans.length}개의 기획안을 불러왔습니다.`
            });
          } else {
            console.log('⚠️ 해당 캠페인의 콘텐츠 기획안이 없습니다');
          }
        } catch (error) {
          console.error('❌ 콘텐츠 기획 로딩 실패:', error);
          toast({
            title: "콘텐츠 기획 로딩 실패",
            description: "콘텐츠 기획안을 불러오는데 실패했습니다.",
            variant: "destructive"
          });
        } finally {
          setIsContentLoading(false);
        }
      }
    };

    loadContentPlans();
  }, [campaign?.id, toast]);

  // 탭이 콘텐츠 기획으로 변경될 때 데이터 다시 로딩 (강화된 재로딩)
  React.useEffect(() => {
    if (activeTab === 'planning' && campaign?.id) {
      const reloadContentPlans = async () => {
        try {
          setIsContentLoading(true);
          console.log('🔄 콘텐츠 기획 탭 활성화 - 강제 데이터 재로딩 시작');
          
          // localStorage 직접 확인
          const rawPlans = localStorage.getItem('content_plans');
          console.log('🔄 localStorage 직접 확인:', rawPlans);
          
          // 약간의 지연 후 데이터 로딩
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const plans = await contentService.getContentPlans(campaign.id);
          console.log('🔄 재로딩된 기획안:', plans.length, '개');
          console.log('🔄 재로딩 상세:', plans);
          
          setContentPlans(plans);
          
          if (plans.length > 0) {
            toast({
              title: "기획안 업데이트",
              description: `${plans.length}개의 기획안이 확인되었습니다.`
            });
          }
        } catch (error) {
          console.error('🔄 재로딩 실패:', error);
        } finally {
          setIsContentLoading(false);
        }
      };
      reloadContentPlans();
    }
  }, [activeTab, campaign?.id, toast]);

  const handleContentPlanApprove = async (planId: string) => {
    if (!campaign) return;

    try {
      await contentService.updateContentPlan(campaign.id, planId, { status: 'approved' });

      // Update local state
      setContentPlans(prev => prev.map(plan =>
        plan.id === planId ? { ...plan, status: 'approved' } : plan
      ));

      toast({
        title: "콘텐츠 기획 승인 완료",
        description: "콘텐츠 기획안이 승인되었습니다."
      });

    } catch (error) {
      console.error('콘텐츠 기획 승인 실패:', error);
      toast({
        title: "승인 실패",
        description: "콘텐츠 기획 승인에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleContentPlanRevision = async (planId: string, feedback: string) => {
    if (!campaign) return;

    try {
      const targetPlan = contentPlans.find(p => p.id === planId);
      
      // 새로운 revision 생성
      const revisionNumber = (targetPlan?.currentRevisionNumber || 0) + 1;
      
      const newRevision = {
        id: `revision_${Date.now()}`,
        revisionNumber,
        feedback,
        requestedBy: 'brand' as const,
        requestedByName: '브랜드 관리자',
        requestedAt: new Date().toISOString(),
        status: 'pending' as const
      };

      const updatedPlan = {
        ...targetPlan!,
        status: 'revision-requested' as const,
        revisions: [...(targetPlan?.revisions || []), newRevision],
        currentRevisionNumber: revisionNumber,
        updatedAt: new Date().toISOString()
      };

      await contentService.updateContentPlan(campaign.id, planId, updatedPlan);

      // Update local state
      setContentPlans(prev => prev.map(plan =>
        plan.id === planId ? updatedPlan : plan
      ));

      toast({
        title: "수정 요청 완료",
        description: "콘텐츠 기획 수정 요청이 전송되었습니다."
      });

    } catch (error) {
      console.error('콘텐츠 기획 수정 요청 실패:', error);
      toast({
        title: "수정 요청 실패",
        description: "콘텐츠 기획 수정 요청에 실패했습니다.",
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
      case 'plan-review': return '콘텐츠 기획중';
      case 'plan-revision': return '콘텐츠 기획중';
      case 'plan-approved': return '콘텐츠 기획중';
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

  const confirmedInfluencers = campaign.influencers.filter(inf => inf.status === 'confirmed');

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
            <TabsTrigger value="production" disabled={campaign.currentStage < 3}>🎬 콘텐츠 제작</TabsTrigger>
            <TabsTrigger value="content" disabled={campaign.currentStage < 4}>🔍 콘텐츠 검수</TabsTrigger>
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
            {isContentLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-lg">콘텐츠 기획안을 불러오는 중...</div>
                  <p className="text-sm text-gray-500 mt-2">데이터를 동기화하고 있습니다.</p>
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 현재 {contentPlans.length}개의 기획안이 로딩되었습니다. 
                    {contentPlans.length === 0 && " 시스템 관리자가 기획안을 작성하면 여기에 표시됩니다."}
                  </p>
                </div>
                <BrandContentPlanReview
                  plans={contentPlans}
                  confirmedInfluencers={confirmedInfluencers}
                  onApprove={handleContentPlanApprove}
                  onRequestRevision={handleContentPlanRevision}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="production" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  콘텐츠 제작
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 제작 기능이 곧 추가될 예정입니다.
                </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDetail;
