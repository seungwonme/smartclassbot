
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Star } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import { Campaign } from '@/types/campaign';
import { PlatformUrlData } from '@/types/analytics';
import { campaignService } from '@/services/campaign.service';
import { analyticsService } from '@/services/analytics.service';
import ChinesePlatformStats from '@/components/analytics/ChinesePlatformStats';

const BrandAnalytics = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [monitoringData, setMonitoringData] = useState<PlatformUrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 브랜드의 모든 캠페인 로딩
        const allCampaigns = await campaignService.getCampaigns();
        const activeCampaigns = allCampaigns.filter(c => 
          ['planning', 'producing', 'content-review', 'completed', 'monitoring'].includes(c.status)
        );
        setCampaigns(activeCampaigns);
        
        // 모든 캠페인의 모니터링 데이터 로딩
        let allMonitoringData: PlatformUrlData[] = [];
        for (const campaign of activeCampaigns) {
          const urls = analyticsService.getMonitoringUrls(campaign.id);
          const urlsWithAnalytics = urls.map(url => ({
            ...url,
            campaignId: campaign.id,
            analytics: url.analytics || {
              views: Math.floor(Math.random() * 50000),
              likes: Math.floor(Math.random() * 5000),
              comments: Math.floor(Math.random() * 500),
              shares: Math.floor(Math.random() * 250)
            }
          }));
          allMonitoringData = [...allMonitoringData, ...urlsWithAnalytics];
        }
        setMonitoringData(allMonitoringData);
        
      } catch (error) {
        console.error('성과분석 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 선택된 캠페인에 따른 데이터 필터링
  const filteredData = selectedCampaign === 'all' 
    ? monitoringData 
    : monitoringData.filter(data => data.campaignId === selectedCampaign);

  const selectedCampaignInfo = campaigns.find(c => c.id === selectedCampaign);

  // 통계 계산
  const totalInfluencers = new Set(filteredData.map(d => d.influencerId)).size;
  const totalContent = filteredData.length;
  const totalViews = filteredData.reduce((sum, data) => sum + (data.analytics?.views || 0), 0);
  const totalLikes = filteredData.reduce((sum, data) => sum + (data.analytics?.likes || 0), 0);
  const totalComments = filteredData.reduce((sum, data) => sum + (data.analytics?.comments || 0), 0);
  const totalShares = filteredData.reduce((sum, data) => sum + (data.analytics?.shares || 0), 0);

  // 플랫폼별 성과 데이터
  const platformData = [
    {
      platform: '샤오홍슈',
      count: filteredData.filter(d => d.platform === 'xiaohongshu').length,
      views: filteredData.filter(d => d.platform === 'xiaohongshu').reduce((sum, d) => sum + (d.analytics?.views || 0), 0),
      likes: filteredData.filter(d => d.platform === 'xiaohongshu').reduce((sum, d) => sum + (d.analytics?.likes || 0), 0),
    },
    {
      platform: '도우인',
      count: filteredData.filter(d => d.platform === 'douyin').length,
      views: filteredData.filter(d => d.platform === 'douyin').reduce((sum, d) => sum + (d.analytics?.views || 0), 0),
      likes: filteredData.filter(d => d.platform === 'douyin').reduce((sum, d) => sum + (d.analytics?.likes || 0), 0),
    }
  ];

  // 인플루언서별 성과 데이터
  const influencerData = Array.from(new Set(filteredData.map(d => d.influencerId)))
    .map(influencerId => {
      const influencerContent = filteredData.filter(d => d.influencerId === influencerId);
      const influencerName = influencerContent[0]?.influencerName || '알 수 없음';
      return {
        name: influencerName,
        content: influencerContent.length,
        views: influencerContent.reduce((sum, d) => sum + (d.analytics?.views || 0), 0),
        likes: influencerContent.reduce((sum, d) => sum + (d.analytics?.likes || 0), 0),
        engagement: influencerContent.reduce((sum, d) => {
          const views = d.analytics?.views || 0;
          const likes = d.analytics?.likes || 0;
          const comments = d.analytics?.comments || 0;
          return sum + (views > 0 ? ((likes + comments) / views) * 100 : 0);
        }, 0) / influencerContent.length
      };
    })
    .sort((a, b) => b.views - a.views);

  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">성과 분석</h1>
          <p className="text-gray-600">캠페인별 인플루언서 마케팅 성과를 확인하세요</p>
        </div>

        {/* 캠페인 선택 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              캠페인 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="캠페인을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 캠페인</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCampaignInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">{selectedCampaignInfo.title}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  {selectedCampaignInfo.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">
                    {selectedCampaignInfo.status === 'planning' ? '기획 중' :
                     selectedCampaignInfo.status === 'producing' ? '제작 중' :
                     selectedCampaignInfo.status === 'content-review' ? '검수 중' :
                     selectedCampaignInfo.status === 'monitoring' ? '모니터링 중' : '완료'}
                  </Badge>
                  <Badge variant="outline">
                    인플루언서 {selectedCampaignInfo.influencers.filter(i => i.status === 'confirmed').length}명
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 댓글</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                평균 {totalContent > 0 ? Math.round(totalComments / totalContent) : 0}개
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 플랫폼별 통계 */}
        <ChinesePlatformStats urls={filteredData} />

        <Tabs defaultValue="platform" className="w-full mt-6">
          <TabsList>
            <TabsTrigger value="platform">플랫폼별 분석</TabsTrigger>
            <TabsTrigger value="influencer">인플루언서별 분석</TabsTrigger>
            <TabsTrigger value="content">콘텐츠 상세</TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>플랫폼별 콘텐츠 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={platformData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>플랫폼별 조회수</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={platformData}>
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

          <TabsContent value="influencer" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>인플루언서별 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {influencerData.map((influencer, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{influencer.name}</h4>
                          <div className="flex gap-4 text-sm text-gray-600 mt-1">
                            <span>콘텐츠 {influencer.content}개</span>
                            <span>조회수 {influencer.views.toLocaleString()}</span>
                            <span>좋아요 {influencer.likes.toLocaleString()}</span>
                          </div>
                        </div>
                        <Badge variant={influencer.engagement > 5 ? "default" : "secondary"}>
                          참여율 {influencer.engagement.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((content, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">
                              {content.platform === 'xiaohongshu' ? '📕' : '🎵'}
                            </span>
                            <h4 className="font-medium">{content.influencerName}</h4>
                            <Badge variant="outline">
                              {content.platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'}
                            </Badge>
                          </div>
                          {content.contentTitle && (
                            <p className="text-sm text-gray-600 mb-2">{content.contentTitle}</p>
                          )}
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {(content.analytics?.views || 0).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {(content.analytics?.likes || 0).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {(content.analytics?.comments || 0).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              {(content.analytics?.shares || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(content.addedAt).toLocaleDateString('ko-KR')}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {filteredData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 콘텐츠가 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrandAnalytics;
