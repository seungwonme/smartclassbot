
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandSidebar from '@/components/BrandSidebar';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';
import ChineseCommentAnalyzer from '@/components/analytics/ChineseCommentAnalyzer';
import PerformanceReportGenerator from '@/components/analytics/PerformanceReportGenerator';
import NotificationSystem from '@/components/analytics/NotificationSystem';
import MobileAnalyticsDashboard from '@/components/analytics/MobileAnalyticsDashboard';
import BrandMonitoringView from '@/components/analytics/BrandMonitoringView';
import BrandCampaignSelector from '@/components/analytics/BrandCampaignSelector';
import CompactRealTimeStatus from '@/components/analytics/CompactRealTimeStatus';
import CampaignOverviewPanel from '@/components/analytics/CampaignOverviewPanel';
import InfluencerPerformanceOverview from '@/components/analytics/InfluencerPerformanceOverview';
import { performanceTrackerService } from '@/services/performanceTracker.service';

const BrandAnalytics = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('brand1');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('campaign1');
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('inf1');
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // 모의 캠페인 데이터
  const campaigns = [
    { id: 'campaign1', title: '봄 신제품 런칭 캠페인' },
    { id: 'campaign2', title: '여름 휴가 프로모션' },
    { id: 'campaign3', title: '가을 시즌 브랜딩' }
  ];

  // 모의 인플루언서 데이터
  const mockInfluencers = [
    { id: 'inf1', name: '샤오리', platform: 'xiaohongshu' },
    { id: 'inf2', name: '리밍', platform: 'douyin' },
    { id: 'inf3', name: '왕위안', platform: 'xiaohongshu' }
  ];

  // 모의 모니터링 URL 데이터
  const mockMonitoringUrls = [
    {
      id: 'url1',
      url: 'https://xiaohongshu.com/sample1',
      platform: 'xiaohongshu' as const,
      influencerId: 'inf1',
      influencerName: '샤오리',
      campaignId: 'campaign1',
      addedAt: new Date().toISOString(),
      contentTitle: '봄 신제품 소개'
    },
    {
      id: 'url2', 
      url: 'https://douyin.com/sample2',
      platform: 'douyin' as const,
      influencerId: 'inf2',
      influencerName: '리밍',
      campaignId: 'campaign1',
      addedAt: new Date().toISOString(),
      contentTitle: '제품 언박싱 영상'
    }
  ];

  const handleStartTracking = () => {
    performanceTrackerService.startTracking();
    setIsTracking(true);
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
  };

  const handleStopTracking = () => {
    performanceTrackerService.stopTracking();
    setIsTracking(false);
  };

  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);
  const selectedInfluencerData = mockInfluencers.find(inf => inf.id === selectedInfluencer);

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">브랜드 성과 분석</h1>
          <p className="text-gray-600">중국 플랫폼에서의 캠페인 성과를 실시간으로 모니터링하고 분석하세요</p>
        </div>

        {/* 모바일 최적화 대시보드 */}
        <MobileAnalyticsDashboard />

        {/* 데스크톱/태블릿 레이아웃 */}
        <div className="hidden lg:block">
          {/* 상단 선택 및 상태 영역 */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            <div className="xl:col-span-3">
              <BrandCampaignSelector
                selectedBrand={selectedBrand}
                selectedCampaign={selectedCampaign}
                selectedInfluencer={selectedInfluencer}
                campaigns={campaigns}
                influencers={mockInfluencers}
                onBrandChange={setSelectedBrand}
                onCampaignChange={setSelectedCampaign}
                onInfluencerChange={setSelectedInfluencer}
              />
            </div>
            
            <div className="xl:col-span-1 space-y-4">
              <CompactRealTimeStatus
                isTracking={isTracking}
                lastUpdate={lastUpdate}
                onStartTracking={handleStartTracking}
                onStopTracking={handleStopTracking}
              />
              <NotificationSystem />
            </div>
          </div>

          {/* 캠페인 종합 성과 (선택된 캠페인이 전체가 아닐 때만 표시) */}
          {selectedCampaign !== 'all' && selectedCampaignData && (
            <div className="mb-6">
              <CampaignOverviewPanel
                campaignId={selectedCampaign}
                campaignTitle={selectedCampaignData.title}
              />
            </div>
          )}

          {/* 메인 분석 탭 */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                {selectedInfluencer === 'all' ? '전체 성과' : '인플루언서 분석'}
              </TabsTrigger>
              <TabsTrigger value="monitoring">모니터링</TabsTrigger>
              <TabsTrigger value="comments">댓글 분석</TabsTrigger>
              <TabsTrigger value="reports">리포트</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {selectedInfluencer === 'all' ? (
                <PerformanceDashboard isRealTime={true} campaignId={selectedCampaign === 'all' ? undefined : selectedCampaign} />
              ) : (
                selectedInfluencerData && (
                  <InfluencerPerformanceOverview
                    influencerId={selectedInfluencer}
                    influencerName={selectedInfluencerData.name}
                    campaignId={selectedCampaign}
                  />
                )
              )}
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <BrandMonitoringView 
                campaignId={selectedCampaign === 'all' ? 'campaign1' : selectedCampaign}
                confirmedInfluencers={mockInfluencers}
                monitoringUrls={mockMonitoringUrls}
              />
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <ChineseCommentAnalyzer />
            </TabsContent>

            <TabsContent value="reports" className="mt-6 space-y-6">
              <PerformanceReportGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BrandAnalytics;
