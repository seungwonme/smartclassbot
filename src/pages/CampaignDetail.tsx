import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, FileText, Video } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import CampaignWorkflowSteps from '@/components/CampaignWorkflowSteps';
import InfluencerManagementTab from '@/components/campaign/InfluencerManagementTab';
import CampaignConfirmationSummary from '@/components/campaign/CampaignConfirmationSummary';
import CampaignDetailHeader from '@/components/campaign/CampaignDetailHeader';
import CampaignOverview from '@/components/campaign/CampaignOverview';
import CampaignPlanningTab from '@/components/campaign/CampaignPlanningTab';
import CampaignProductionTab from '@/components/campaign/CampaignProductionTab';
import BrandMonitoringView from '@/components/analytics/BrandMonitoringView';
import { Campaign } from '@/types/campaign';
import { ContentPlanDetail } from '@/types/content';
import { PlatformUrlData } from '@/types/analytics';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { campaignService } from '@/services/campaign.service';
import { contentService } from '@/services/content.service';
import { analyticsService } from '@/services/analytics.service';
import BrandContentReviewTab from '@/components/content/BrandContentReviewTab';

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
  const [monitoringUrls, setMonitoringUrls] = useState<PlatformUrlData[]>([]);

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
          
          // 스토리지 전체 상태 및 디버깅 정보 확인
          const debugResult = await contentService.debugContentPlanStorage();
          console.log('🔍 디버깅 결과:', debugResult);
          
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
            // 디버깅: 전체 localStorage 상태 한번 더 확인
            console.log('🔍 localStorage 전체 상태 재확인:');
            Object.keys(localStorage).forEach(key => {
              if (key.includes('content') || key.includes('plan')) {
                console.log(`📝 ${key}:`, localStorage.getItem(key));
              }
            });
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

  // 탭이 콘텐츠 기획으로 변경될 때 데이터 다시 로딩 (강화된 재로딩 및 디버깅)
  React.useEffect(() => {
    if (activeTab === 'planning' && campaign?.id) {
      const reloadContentPlans = async () => {
        try {
          setIsContentLoading(true);
          console.log('🔄 콘텐츠 기획 탭 활성화 - 강제 데이터 재로딩 시작');
          
          // 즉시 디버깅 정보 출력
          console.log('🔄 탭 활성화 시점 스토리지 디버깅:');
          const debugResult = await contentService.debugContentPlanStorage();
          console.log('🔄 디버깅 결과:', debugResult);
          
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
          } else {
            // 기획안이 없을 때 추가 디버깅
            console.log('🔄 기획안이 없음 - 추가 디버깅 시작');
            const allPlans = JSON.parse(localStorage.getItem('content_plans') || '[]');
            console.log('🔄 전체 기획안 목록:', allPlans);
            console.log('🔄 현재 캠페인 ID로 필터링 시도:', campaign.id);
            const matchingPlans = allPlans.filter((plan: any) => plan.campaignId === campaign.id);
            console.log('🔄 매칭되는 기획안:', matchingPlans);
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
        status: 'revision-request' as const,
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

  // 콘텐츠 검수 단계로 전환하는 함수 추가
  const handleContentReviewReady = async () => {
    if (!campaign) return;
    
    try {
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { 
        status: 'content-review',
        currentStage: 4
      });
      
      toast({
        title: "콘텐츠 검수 단계로 전환",
        description: "모든 콘텐츠가 제출되어 검수 단계로 진행됩니다."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('콘텐츠 검수 단계 전환 실패:', error);
      toast({
        title: "전환 실패",
        description: "콘텐츠 검수 단계로 전환에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDebugStorage = () => {
    console.log('🔍 수동 디버깅 버튼 클릭');
    contentService.debugContentPlanStorage();
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
  const isProducing = ['producing', 'content-review'].includes(campaign.status);

  // confirmed 상태일 때는 확정 요약 페이지만 표시
  if (isConfirmed) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <CampaignDetailHeader
            campaign={campaign}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            onFinalConfirmation={handleFinalConfirmation}
          />

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

  // 모니터링 URL 로딩
  React.useEffect(() => {
    const loadMonitoringUrls = () => {
      if (!campaign?.id) return;
      
      try {
        console.log('=== 브랜드 관리자 - 모니터링 URL 로딩 시작 ===');
        console.log('캠페인 ID:', campaign.id);
        
        const urls = analyticsService.getMonitoringUrls(campaign.id);
        setMonitoringUrls(urls);
        
        console.log('=== 로딩된 모니터링 URL ===');
        console.log('URL 개수:', urls.length);
        urls.forEach(url => {
          console.log(`- ${url.platform}: ${url.influencerName} - ${url.url}`);
        });
      } catch (error) {
        console.error('모니터링 URL 로딩 실패:', error);
        toast({
          title: "URL 로딩 실패",
          description: "모니터링 URL을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      }
    };

    loadMonitoringUrls();
  }, [campaign?.id, toast]);

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <CampaignDetailHeader
          campaign={campaign}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          onFinalConfirmation={handleFinalConfirmation}
        />

        <CampaignWorkflowSteps campaign={campaign} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">📋 기본정보</TabsTrigger>
            <TabsTrigger value="influencers">👥 인플루언서 관리</TabsTrigger>
            <TabsTrigger value="planning" disabled={campaign.currentStage < 2 && !isPlanning}>💡 콘텐츠 기획</TabsTrigger>
            <TabsTrigger value="production" disabled={campaign.currentStage < 3}>🎬 콘텐츠 제작</TabsTrigger>
            <TabsTrigger value="content" disabled={campaign.currentStage < 4}>🔍 콘텐츠 검수</TabsTrigger>
            <TabsTrigger value="monitoring" disabled={campaign.currentStage < 5}>📊 성과 모니터링</TabsTrigger>
          </TabsList>

          
          <TabsContent value="basic" className="mt-6">
            <CampaignOverview campaign={campaign} />
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
            <CampaignPlanningTab
              contentPlans={contentPlans}
              confirmedInfluencers={confirmedInfluencers}
              isContentLoading={isContentLoading}
              onApprove={handleContentPlanApprove}
              onRequestRevision={handleContentPlanRevision}
              onDebugStorage={handleDebugStorage}
            />
          </TabsContent>

          <TabsContent value="production" className="mt-6">
            <CampaignProductionTab
              campaign={campaign}
              confirmedInfluencers={confirmedInfluencers}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <BrandContentReviewTab
              campaignId={campaign.id}
              confirmedInfluencers={confirmedInfluencers}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            {/* 브랜드 관리자용 읽기 전용 모니터링 뷰 */}
            <BrandMonitoringView
              campaignId={campaign.id}
              confirmedInfluencers={confirmedInfluencers.map(inf => ({
                id: inf.id,
                name: inf.name,
                platform: inf.platform || '기타'
              }))}
              monitoringUrls={monitoringUrls}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDetail;
