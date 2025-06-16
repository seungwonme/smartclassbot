
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Eye, Heart, MessageCircle, Share2, RefreshCw } from 'lucide-react';
import { performanceTrackerService } from '@/services/performanceTracker.service';

interface InfluencerPerformanceOverviewProps {
  influencerId: string;
  influencerName: string;
  campaignId: string;
}

const InfluencerPerformanceOverview: React.FC<InfluencerPerformanceOverviewProps> = ({
  influencerId,
  influencerName,
  campaignId
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    loadPerformanceData();
  }, [influencerId, campaignId]);

  const loadPerformanceData = () => {
    // 특정 인플루언서의 성과 데이터 로드
    const metrics = performanceTrackerService.getPerformanceMetrics(campaignId);
    const influencerMetrics = metrics.filter(m => m.influencerId === influencerId);
    
    if (influencerMetrics.length > 0) {
      const summary = calculateInfluencerSummary(influencerMetrics);
      setPerformanceData(summary);
    } else {
      // 모의 데이터 생성
      setPerformanceData(generateMockData());
    }
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
  };

  const calculateInfluencerSummary = (metrics: any[]) => {
    return {
      totalViews: metrics.reduce((sum, m) => sum + (m.xiaohongshuMetrics?.exposure || m.douyinMetrics?.views || 0), 0),
      totalLikes: metrics.reduce((sum, m) => sum + (m.xiaohongshuMetrics?.likes || m.douyinMetrics?.likes || 0), 0),
      totalComments: metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.totalComments || 0), 0),
      totalShares: metrics.reduce((sum, m) => sum + (m.xiaohongshuMetrics?.shares || m.douyinMetrics?.shares || 0), 0),
      platform: metrics[0]?.platform || 'xiaohongshu',
      contentCount: metrics.length
    };
  };

  const generateMockData = () => {
    return {
      totalViews: 450000,
      totalLikes: 32000,
      totalComments: 2800,
      totalShares: 1200,
      platform: 'xiaohongshu',
      contentCount: 4
    };
  };

  const handleStartTracking = () => {
    performanceTrackerService.startTracking();
    setIsTracking(true);
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
  };

  const handleStopTracking = () => {
    performanceTrackerService.stopTracking();
    setIsTracking(false);
  };

  const handleManualUpdate = () => {
    loadPerformanceData();
  };

  if (!performanceData) {
    return <div className="text-center py-8">인플루언서 성과 데이터를 불러오는 중...</div>;
  }

  const engagementRate = ((performanceData.totalLikes + performanceData.totalComments) / performanceData.totalViews * 100).toFixed(2);

  const chartData = [
    { name: '조회수', value: performanceData.totalViews, color: '#8884d8' },
    { name: '좋아요', value: performanceData.totalLikes, color: '#82ca9d' },
    { name: '댓글', value: performanceData.totalComments, color: '#ffc658' },
    { name: '공유', value: performanceData.totalShares, color: '#ff7300' }
  ];

  return (
    <div className="space-y-6">
      {/* 실시간 모니터링 상태 */}
      <Card className={`${isTracking ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${isTracking ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
              {influencerName} 실시간 모니터링
            </div>
            <Badge variant={isTracking ? "default" : "secondary"}>
              {isTracking ? '모니터링 중' : '대기 중'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {performanceData.platform === 'xiaohongshu' ? '📕 샤오홍슈' : '🎵 도우인'} 성과 추적
              </p>
              <p className="text-xs text-muted-foreground">
                {isTracking 
                  ? '10분마다 자동 업데이트 중'
                  : '모니터링을 시작하여 실시간 데이터를 확인하세요'
                }
              </p>
              {lastUpdate && (
                <p className="text-xs text-muted-foreground">
                  마지막 업데이트: {lastUpdate}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={handleStartTracking} size="sm" className="bg-green-600 hover:bg-green-700">
                  모니터링 시작
                </Button>
              ) : (
                <Button onClick={handleStopTracking} size="sm" variant="outline">
                  중지
                </Button>
              )}
              <Button onClick={handleManualUpdate} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {performanceData.contentCount}개 콘텐츠
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">좋아요</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              참여율 {engagementRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">댓글</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.totalComments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              활발한 소통
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">공유</CardTitle>
            <Share2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.totalShares.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              바이럴 효과
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 성과 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>{influencerName} 성과 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[chartData[0], chartData[1]]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toLocaleString(), '수치']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerPerformanceOverview;
