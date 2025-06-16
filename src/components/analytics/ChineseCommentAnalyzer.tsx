
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageCircle, TrendingUp, Smile, Frown, Meh } from 'lucide-react';
import { performanceTrackerService } from '@/services/performanceTracker.service';

interface ChineseCommentAnalyzerProps {
  campaignId?: string;
}

const ChineseCommentAnalyzer: React.FC<ChineseCommentAnalyzerProps> = ({ campaignId }) => {
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    const loadAnalysisData = () => {
      const metrics = performanceTrackerService.getPerformanceMetrics(campaignId);
      
      // 댓글 분석 데이터 집계
      const totalComments = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.totalComments || 0), 0);
      const totalPositive = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.sentiment.positive || 0), 0);
      const totalNegative = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.sentiment.negative || 0), 0);
      const totalNeutral = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.sentiment.neutral || 0), 0);
      
      const totalJoy = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.emotions.joy || 0), 0);
      const totalAnger = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.emotions.anger || 0), 0);
      const totalSurprise = metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.emotions.surprise || 0), 0);

      // 키워드 집계 (중국어 키워드 모의)
      const chineseKeywords = [
        { word: '很棒', count: Math.floor(Math.random() * 50) + 20, sentiment: 'positive' },
        { word: '喜欢', count: Math.floor(Math.random() * 40) + 15, sentiment: 'positive' },
        { word: '推荐', count: Math.floor(Math.random() * 35) + 10, sentiment: 'positive' },
        { word: '不错', count: Math.floor(Math.random() * 30) + 8, sentiment: 'positive' },
        { word: '一般', count: Math.floor(Math.random() * 20) + 5, sentiment: 'neutral' },
        { word: '失望', count: Math.floor(Math.random() * 15) + 3, sentiment: 'negative' },
      ];

      setAnalysisData({
        totalComments,
        sentiment: { positive: totalPositive, negative: totalNegative, neutral: totalNeutral },
        emotions: { joy: totalJoy, anger: totalAnger, surprise: totalSurprise },
        keywords: chineseKeywords,
        platforms: {
          xiaohongshu: metrics.filter(m => m.platform === 'xiaohongshu').length,
          douyin: metrics.filter(m => m.platform === 'douyin').length,
        }
      });
    };

    loadAnalysisData();
  }, [campaignId]);

  if (!analysisData || analysisData.totalComments === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            중국어 댓글 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            분석할 댓글 데이터가 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  const sentimentData = [
    { name: '긍정 (积极)', value: analysisData.sentiment.positive, color: '#10B981', icon: '😊' },
    { name: '중립 (中性)', value: analysisData.sentiment.neutral, color: '#6B7280', icon: '😐' },
    { name: '부정 (消极)', value: analysisData.sentiment.negative, color: '#EF4444', icon: '😞' },
  ];

  const emotionData = [
    { name: '기쁨 (喜悦)', value: analysisData.emotions.joy, color: '#F59E0B' },
    { name: '분노 (愤怒)', value: analysisData.emotions.anger, color: '#DC2626' },
    { name: '놀람 (惊讶)', value: analysisData.emotions.surprise, color: '#7C3AED' },
  ];

  const positiveRate = ((analysisData.sentiment.positive / analysisData.totalComments) * 100).toFixed(1);
  const negativeRate = ((analysisData.sentiment.negative / analysisData.totalComments) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 전체 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 댓글 수</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.totalComments.toLocaleString()}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                📕 샤오홍슈 {analysisData.platforms.xiaohongshu}개
              </Badge>
              <Badge variant="outline" className="text-xs">
                🎵 도우인 {analysisData.platforms.douyin}개
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">긍정 비율</CardTitle>
            <Smile className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{positiveRate}%</div>
            <Progress value={parseFloat(positiveRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">부정 비율</CardTitle>
            <Frown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{negativeRate}%</div>
            <Progress value={parseFloat(negativeRate)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>감정 분석 (情感分析)</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>감정 표현 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 키워드 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            주요 중국어 키워드 (关键词)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisData.keywords.map((keyword: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{keyword.word}</span>
                  <Badge 
                    variant={keyword.sentiment === 'positive' ? 'default' : 
                           keyword.sentiment === 'negative' ? 'destructive' : 'secondary'}
                  >
                    {keyword.count}회
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {keyword.sentiment === 'positive' ? '긍정' : 
                   keyword.sentiment === 'negative' ? '부정' : '중립'} 키워드
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChineseCommentAnalyzer;
