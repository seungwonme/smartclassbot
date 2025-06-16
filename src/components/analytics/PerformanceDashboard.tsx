
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Users, Activity } from 'lucide-react';
import { performanceTrackerService } from '@/services/performanceTracker.service';

interface PerformanceDashboardProps {
  campaignId?: string;
  isRealTime?: boolean;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  campaignId, 
  isRealTime = false 
}) => {
  const [summary, setSummary] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const loadSummary = () => {
      const data = performanceTrackerService.getPerformanceSummary(campaignId);
      setSummary(data);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
    };

    loadSummary();

    if (isRealTime) {
      const interval = setInterval(loadSummary, 30000); // 30초마다 업데이트
      return () => clearInterval(interval);
    }
  }, [campaignId, isRealTime]);

  if (!summary) {
    return <div className="text-center py-8">성과 데이터를 불러오는 중...</div>;
  }

  const platformData = [
    {
      name: '샤오홍슈',
      content: summary.xiaohongshu.count,
      views: summary.xiaohongshu.totalExposure,
      likes: summary.xiaohongshu.totalLikes,
      color: '#FF4D6D'
    },
    {
      name: '도우인',
      content: summary.douyin.count,
      views: summary.douyin.totalViews,
      likes: summary.douyin.totalLikes,
      color: '#4ECDC4'
    }
  ];

  const sentimentData = [
    { name: '긍정', value: summary.sentimentAnalysis.totalPositive, color: '#10B981' },
    { name: '부정', value: summary.sentimentAnalysis.totalNegative, color: '#EF4444' },
    { 
      name: '중립', 
      value: summary.sentimentAnalysis.totalComments - summary.sentimentAnalysis.totalPositive - summary.sentimentAnalysis.totalNegative,
      color: '#6B7280' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* 실시간 상태 표시 */}
      {isRealTime && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-sm font-medium text-green-800">실시간 모니터링 중</span>
              </div>
              <span className="text-xs text-green-600">마지막 업데이트: {lastUpdated}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 콘텐츠</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalContent}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                📕 {summary.xiaohongshu.count}개
              </Badge>
              <Badge variant="outline" className="text-xs">
                🎵 {summary.douyin.count}개
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 노출/조회</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(summary.xiaohongshu.totalExposure + summary.douyin.totalViews).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              샤오홍슈 {summary.xiaohongshu.totalExposure.toLocaleString()} + 
              도우인 {summary.douyin.totalViews.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(summary.xiaohongshu.totalLikes + summary.douyin.totalLikes).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              평균 참여율{' '}
              {(((summary.xiaohongshu.totalLikes + summary.douyin.totalLikes) / 
                 (summary.xiaohongshu.totalExposure + summary.douyin.totalViews)) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">댓글 감정</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.sentimentAnalysis.totalComments}</div>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs text-green-600">
                긍정 {((summary.sentimentAnalysis.totalPositive / summary.sentimentAnalysis.totalComments) * 100).toFixed(0)}%
              </Badge>
              <Badge variant="outline" className="text-xs text-red-600">
                부정 {((summary.sentimentAnalysis.totalNegative / summary.sentimentAnalysis.totalComments) * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              플랫폼별 성과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value.toLocaleString(), name === 'views' ? '조회/노출' : '좋아요']}
                />
                <Bar dataKey="views" fill="#8884d8" name="조회/노출" />
                <Bar dataKey="likes" fill="#82ca9d" name="좋아요" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>댓글 감정 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, '댓글 수']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
