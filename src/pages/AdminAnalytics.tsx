import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Building2, Target } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Campaign } from '@/types/campaign';
import { Brand } from '@/types/brand';
import { PlatformUrlData } from '@/types/analytics';
import { campaignService } from '@/services/campaign.service';
import { brandService } from '@/services/brand.service';
import { analyticsService } from '@/services/analytics.service';
import ChinesePlatformStats from '@/components/analytics/ChinesePlatformStats';
import MobileAnalyticsDashboard from '@/components/analytics/MobileAnalyticsDashboard';
import RealTimeMonitor from '@/components/analytics/RealTimeMonitor';
import HorizontalNotificationSystem from '@/components/analytics/HorizontalNotificationSystem';
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters';
import PerformanceReportGenerator from '@/components/analytics/PerformanceReportGenerator';
import ChineseCommentAnalyzer from '@/components/analytics/ChineseCommentAnalyzer';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';

const AdminAnalytics = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [monitoringData, setMonitoringData] = useState<PlatformUrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 모든 브랜드와 캠페인 로딩
        const allBrands = await brandService.getBrands();
        const allCampaigns = await campaignService.getCampaigns(); // getAllCampaigns -> getCampaigns로 수정
        
        setBrands(allBrands);
        setCampaigns(allCampaigns.filter(c => 
          ['planning', 'producing', 'content-review', 'completed', 'monitoring'].includes(c.status)
        ));
        
        // 모든 캠페인의 모니터링 데이터 로딩
        let allMonitoringData: PlatformUrlData[] = [];
        for (const campaign of allCampaigns) {
          const urls = analyticsService.getMonitoringUrls(campaign.id);
          allMonitoringData = [...allMonitoringData, ...urls.map(url => ({
            ...url,
            brandId: campaign.brandId,
            brandName: allBrands.find(b => b.id === campaign.brandId)?.name || '알 수 없음',
            campaignId: campaign.id,
            analytics: {
              views: Math.floor(Math.random() * 100000),
              likes: Math.floor(Math.random() * 10000),
              comments: Math.floor(Math.random() * 1000),
              shares: Math.floor(Math.random() * 500)
            }
          }))];
        }
        setMonitoringData(allMonitoringData);
        
      } catch (error) {
        console.error('관리자 성과분석 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
    console.log('관리자 필터 변경:', filters);
  };

  // 선택된 브랜드와 캠페인에 따른 데이터 필터링
  const filteredData = monitoringData.filter(data => {
    const brandMatch = selectedBrand === 'all' || data.brandId === selectedBrand;
    const campaignMatch = selectedCampaign === 'all' || data.campaignId === selectedCampaign;
    return brandMatch && campaignMatch;
  });

  const filteredCampaigns = selectedBrand === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.brandId === selectedBrand);

  // 통계 계산
  const totalBrands = selectedBrand === 'all' ? new Set(filteredData.map(d => d.brandId)).size : 1;
  const totalCampaigns = selectedCampaign === 'all' ? new Set(filteredData.map(d => d.campaignId)).size : 1;
  const totalInfluencers = new Set(filteredData.map(d => d.influencerId)).size;
  const totalContent = filteredData.length;
  const totalViews = filteredData.reduce((sum, data) => sum + (data.analytics?.views || 0), 0);
  const totalLikes = filteredData.reduce((sum, data) => sum + (data.analytics?.likes || 0), 0);
  const totalComments = filteredData.reduce((sum, data) => sum + (data.analytics?.comments || 0), 0);

  // 브랜드별 성과 데이터
  const brandData = Array.from(new Set(filteredData.map(d => d.brandId)))
    .map(brandId => {
      const brandContent = filteredData.filter(d => d.brandId === brandId);
      const brandName = brandContent[0]?.brandName || '알 수 없음';
      return {
        name: brandName,
        campaigns: new Set(brandContent.map(d => d.campaignId)).size,
        content: brandContent.length,
        views: brandContent.reduce((sum, d) => sum + (d.analytics?.views || 0), 0),
        likes: brandContent.reduce((sum, d) => sum + (d.analytics?.likes || 0), 0),
      };
    })
    .sort((a, b) => b.views - a.views);

  // 캠페인별 성과 데이터
  const campaignData = Array.from(new Set(filteredData.map(d => d.campaignId)))
    .map(campaignId => {
      const campaignContent = filteredData.filter(d => d.campaignId === campaignId);
      const campaign = campaigns.find(c => c.id === campaignId);
      return {
        name: campaign?.title || '알 수 없음',
        brandName: campaign ? brands.find(b => b.id === campaign.brandId)?.name : '알 수 없음',
        content: campaignContent.length,
        views: campaignContent.reduce((sum, d) => sum + (d.analytics?.views || 0), 0),
        likes: campaignContent.reduce((sum, d) => sum + (d.analytics?.likes || 0), 0),
        influencers: new Set(campaignContent.map(d => d.influencerId)).size,
      };
    })
    .sort((a, b) => b.views - a.views);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">성과 분석 관리</h1>
          <p className="text-gray-600">전체 브랜드와 캠페인의 성과를 관리하고 분석하세요</p>
        </div>

        {/* 모바일 최적화 대시보드 */}
        <MobileAnalyticsDashboard isAdmin={true} />

        {/* 데스크톱/태블릿 레이아웃 */}
        <div className="hidden lg:block">
          {/* 가로형 실시간 알림 */}
          <div className="mb-6">
            <HorizontalNotificationSystem />
          </div>

          {/* 실시간 모니터링 */}
          <div className="mb-6">
            <RealTimeMonitor />
          </div>

          {/* 필터 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  브랜드 선택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="브랜드를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 브랜드</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  캠페인 선택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="캠페인을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 캠페인</SelectItem>
                    {filteredCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* 주요 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">활성 브랜드</CardTitle>
                <Building2 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBrands}</div>
                <p className="text-xs text-muted-foreground">총 {brands.length}개 브랜드</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">진행 캠페인</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCampaigns}</div>
                <p className="text-xs text-muted-foreground">총 {campaigns.length}개 캠페인</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">참여 인플루언서</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInfluencers}</div>
                <p className="text-xs text-muted-foreground">총 {totalContent}개 콘텐츠</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  평균 {totalContent > 0 ? Math.round(totalViews / totalContent).toLocaleString() : 0}회
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  참여율 {totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 플랫폼별 통계 */}
          <ChinesePlatformStats urls={filteredData} />

          <Tabs defaultValue="overview" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">성과 개요</TabsTrigger>
              <TabsTrigger value="brand">브랜드별</TabsTrigger>
              <TabsTrigger value="campaign">캠페인별</TabsTrigger>
              <TabsTrigger value="platform">플랫폼별</TabsTrigger>
              <TabsTrigger value="reports">리포트</TabsTrigger>
              <TabsTrigger value="settings">설정</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <PerformanceDashboard isRealTime={true} isAdmin={true} />
            </TabsContent>

            <TabsContent value="brand" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>브랜드별 성과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brandData.map((brand, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-lg">{brand.name}</h4>
                            <div className="flex gap-4 text-sm text-gray-600 mt-1">
                              <span>캠페인 {brand.campaigns}개</span>
                              <span>콘텐츠 {brand.content}개</span>
                              <span>조회수 {brand.views.toLocaleString()}</span>
                              <span>좋아요 {brand.likes.toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant={brand.views > 100000 ? "default" : "secondary"}>
                            {brand.views > 100000 ? '고성과' : '일반'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaign" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>캠페인별 성과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaignData.map((campaign, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{campaign.name}</h4>
                            <p className="text-sm text-gray-500">{campaign.brandName}</p>
                            <div className="flex gap-4 text-sm text-gray-600 mt-1">
                              <span>인플루언서 {campaign.influencers}명</span>
                              <span>콘텐츠 {campaign.content}개</span>
                              <span>조회수 {campaign.views.toLocaleString()}</span>
                              <span>좋아요 {campaign.likes.toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant={campaign.views > 50000 ? "default" : "secondary"}>
                            {campaign.views > 50000 ? '고성과' : '일반'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platform" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>플랫폼별 콘텐츠 분포</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: '샤오홍슈', value: filteredData.filter(d => d.platform === 'xiaohongshu').length },
                            { name: '도우인', value: filteredData.filter(d => d.platform === 'douyin').length }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          <Cell fill="#ff6b6b" />
                          <Cell fill="#4ecdc4" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>플랫폼별 조회수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        {
                          platform: '샤오홍슈',
                          views: filteredData.filter(d => d.platform === 'xiaohongshu').reduce((sum, d) => sum + (d.analytics?.views || 0), 0)
                        },
                        {
                          platform: '도우인',
                          views: filteredData.filter(d => d.platform === 'douyin').reduce((sum, d) => sum + (d.analytics?.views || 0), 0)
                        }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="platform" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PerformanceReportGenerator isAdmin={true} />
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>시스템 통계</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{totalBrands}</div>
                          <div className="text-xs text-gray-500">활성 브랜드</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{totalCampaigns}</div>
                          <div className="text-xs text-gray-500">진행 캠페인</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{totalInfluencers}</div>
                          <div className="text-xs text-gray-500">참여 인플루언서</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{totalContent}</div>
                          <div className="text-xs text-gray-500">총 콘텐츠</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>중국어 댓글 분석</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChineseCommentAnalyzer />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsFilters
                  onFiltersChange={handleFiltersChange}
                  availableBrands={brands.map(b => b.name)}
                  availableCampaigns={campaigns.map(c => c.title)}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>관리자 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">시스템 모니터링</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">실시간 추적</span>
                          <Badge variant="default">활성</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">자동 리포트</span>
                          <Badge variant="outline">일간</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">알림 시스템</span>
                          <Badge variant="default">활성</Badge>
                        </div>
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

export default AdminAnalytics;
