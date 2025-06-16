
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, MessageCircle, Share2, TrendingUp, Users, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MobileAnalyticsDashboardProps {
  campaignId?: string;
  isAdmin?: boolean;
}

const MobileAnalyticsDashboard: React.FC<MobileAnalyticsDashboardProps> = ({ 
  campaignId, 
  isAdmin = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // 모바일 최적화된 요약 데이터
  const summaryData = {
    totalViews: 1250000,
    totalLikes: 98500,
    totalComments: 8900,
    totalShares: 4200,
    engagement: 8.9,
    platforms: {
      xiaohongshu: { views: 750000, likes: 60000 },
      douyin: { views: 500000, likes: 38500 }
    }
  };

  const trendData = [
    { name: '월', xiaohongshu: 120000, douyin: 80000 },
    { name: '화', xiaohongshu: 180000, douyin: 95000 },
    { name: '수', xiaohongshu: 200000, douyin: 110000 },
    { name: '목', xiaohongshu: 250000, douyin: 130000 },
    { name: '금', xiaohongshu: 180000, douyin: 85000 },
    { name: '토', xiaohongshu: 220000, douyin: 120000 },
    { name: '일', xiaohongshu: 280000, douyin: 160000 }
  ];

  const platformData = [
    { name: '샤오홍슈', value: 60, color: '#FF6B6B' },
    { name: '도우인', value: 40, color: '#4ECDC4' }
  ];

  return (
    <div className="lg:hidden"> {/* 모바일에서만 표시 */}
      <div className="space-y-4">
        {/* 모바일 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold">성과 분석</h2>
          <p className="text-sm opacity-90">실시간 중국 플랫폼 성과</p>
        </div>

        {/* 핵심 지표 카드 (2x2 그리드) */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="text-center">
              <Eye className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{(summaryData.totalViews / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-500">총 조회수</div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{(summaryData.totalLikes / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500">좋아요</div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{(summaryData.totalComments / 1000).toFixed(1)}K</div>
              <div className="text-xs text-gray-500">댓글</div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{summaryData.engagement}%</div>
              <div className="text-xs text-gray-500">참여율</div>
            </div>
          </Card>
        </div>

        {/* 모바일 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-xs">
            <TabsTrigger value="overview" className="text-xs">개요</TabsTrigger>
            <TabsTrigger value="platforms" className="text-xs">플랫폼</TabsTrigger>
            <TabsTrigger value="trends" className="text-xs">트렌드</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* 플랫폼 비교 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">플랫폼별 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📕</span>
                      <span className="text-sm font-medium">샤오홍슈</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{(summaryData.platforms.xiaohongshu.views / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500">조회수</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-teal-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <span className="text-sm font-medium">도우인</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{(summaryData.platforms.douyin.views / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500">조회수</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 실시간 상태 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                  실시간 모니터링
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>마지막 업데이트</span>
                    <span className="text-green-600">방금 전</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>활성 캠페인</span>
                    <span>3개</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>모니터링 URL</span>
                    <span>12개</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            {/* 플랫폼 분포 차트 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">플랫폼 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                      labelStyle={{ fontSize: '10px' }}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 플랫폼별 세부 지표 */}
            <div className="space-y-3">
              <Card className="border-red-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📕</span>
                      <span className="font-medium">샤오홍슈</span>
                    </div>
                    <Badge variant="outline" className="text-xs">60%</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-bold">750K</div>
                      <div className="text-xs text-gray-500">노출량</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">60K</div>
                      <div className="text-xs text-gray-500">좋아요</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">8.0%</div>
                      <div className="text-xs text-gray-500">참여율</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <span className="font-medium">도우인</span>
                    </div>
                    <Badge variant="outline" className="text-xs">40%</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-bold">500K</div>
                      <div className="text-xs text-gray-500">재생량</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">38.5K</div>
                      <div className="text-xs text-gray-500">좋아요</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">7.7%</div>
                      <div className="text-xs text-gray-500">참여율</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* 일주일 트렌드 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">주간 트렌드</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="xiaohongshu" stroke="#FF6B6B" strokeWidth={2} />
                    <Line type="monotone" dataKey="douyin" stroke="#4ECDC4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">샤오홍슈</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-teal-500 rounded"></div>
                    <span className="text-xs">도우인</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 성장률 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">성장률 (전일 대비)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">조회수</span>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      +12.3%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">좋아요</span>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      +8.7%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">댓글</span>
                    <Badge variant="outline" className="text-xs">
                      +2.1%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">공유</span>
                    <Badge variant="default" className="text-xs bg-red-100 text-red-800">
                      -1.5%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 모바일 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="text-xs">
            상세 보기
          </Button>
          <Button size="sm" className="text-xs">
            리포트 생성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileAnalyticsDashboard;
