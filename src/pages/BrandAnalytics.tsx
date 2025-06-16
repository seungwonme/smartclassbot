
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Eye, Target } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';
import RealTimeMonitor from '@/components/analytics/RealTimeMonitor';
import ChineseCommentAnalyzer from '@/components/analytics/ChineseCommentAnalyzer';
import PerformanceReportGenerator from '@/components/analytics/PerformanceReportGenerator';
import AnalyticsFilters, { FilterOptions } from '@/components/analytics/AnalyticsFilters';
import NotificationSystem from '@/components/analytics/NotificationSystem';
import MobileAnalyticsDashboard from '@/components/analytics/MobileAnalyticsDashboard';
import ChinesePlatformStats from '@/components/analytics/ChinesePlatformStats';
import BrandMonitoringView from '@/components/analytics/BrandMonitoringView';

const BrandAnalytics = () => {
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  const handleFiltersChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
    console.log('필터 변경:', filters);
  };

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
      campaignId: 'campaign1',
      addedAt: new Date().toISOString(),
      contentTitle: '봄 신제품 소개'
    },
    {
      id: 'url2', 
      url: 'https://douyin.com/sample2',
      platform: 'douyin' as const,
      influencerId: 'inf2',
      campaignId: 'campaign1',
      addedAt: new Date().toISOString(),
      contentTitle: '제품 언박싱 영상'
    }
  ];

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
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            {/* 실시간 모니터링 (전체 너비) */}
            <div className="xl:col-span-3">
              <RealTimeMonitor />
            </div>
            
            {/* 알림 시스템 */}
            <div className="xl:col-span-1">
              <NotificationSystem />
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">성과 개요</TabsTrigger>
              <TabsTrigger value="monitoring">모니터링</TabsTrigger>
              <TabsTrigger value="comments">댓글 분석</TabsTrigger>
              <TabsTrigger value="reports">리포트</TabsTrigger>
              <TabsTrigger value="settings">설정</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <PerformanceDashboard isRealTime={true} />
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PerformanceReportGenerator />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        빠른 통계
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">3</div>
                          <div className="text-xs text-gray-500">활성 캠페인</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">12</div>
                          <div className="text-xs text-gray-500">모니터링 URL</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">1.2M</div>
                          <div className="text-xs text-gray-500">총 조회수</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">8.9%</div>
                          <div className="text-xs text-gray-500">평균 참여율</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">최근 성과</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>어제</span>
                            <Badge variant="outline">+12.3%</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>지난 주</span>
                            <Badge variant="outline">+8.7%</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>지난 달</span>
                            <Badge variant="outline">+15.2%</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsFilters
                  onFiltersChange={handleFiltersChange}
                  availableBrands={['내 브랜드']}
                  availableCampaigns={campaigns.map(c => c.title)}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>분석 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">데이터 업데이트 주기</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">실시간 모니터링</span>
                          <Badge variant="default">10분</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">성과 분석</span>
                          <Badge variant="outline">1시간</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">댓글 분석</span>
                          <Badge variant="outline">30분</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">내보내기 형식</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge variant="outline">JSON</Badge>
                        <Badge variant="outline">CSV</Badge>
                        <Badge variant="outline">Excel</Badge>
                        <Badge variant="outline">PDF</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BrandAnalytics;
