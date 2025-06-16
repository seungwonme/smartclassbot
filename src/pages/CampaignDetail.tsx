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
import BrandContentReviewTab from '@/components/content/BrandContentReviewTab';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { useContentPlans } from '@/hooks/useContentPlans';
import { useMonitoringUrls } from '@/hooks/useMonitoringUrls';
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

  const {
    contentPlans,
    isContentLoading,
    handleContentPlanApprove,
    handleContentPlanRevision
  } = useContentPlans(campaign?.id, activeTab, toast);

  const { monitoringUrls } = useMonitoringUrls(campaign?.id, toast);

  const handleSubmit = async () => {
    if (!campaign) return;
    
    try {
      console.log('캠페인 제출 시작 - 현재 상태:', campaign.status);
      
      const updatedInfluencers = campaign.influencers.map(inf => ({ ...inf }));
      await updateCampaignInfluencers(updatedInfluencers);
      
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { status: 'submitted' });
      
      console.log('캠페인 상태를 submitted로 변경 완료');
      
      toast({
        title: "캠페인 제출 완료",
        description: "캠페인이 성공적으로 제출되었습니다. 시스템 관리자가 검토 후 섭외를 진행합니다."
      });
      
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
