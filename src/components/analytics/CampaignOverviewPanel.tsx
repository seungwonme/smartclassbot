
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

interface CampaignOverviewPanelProps {
  campaignId: string;
  campaignTitle: string;
}

const CampaignOverviewPanel: React.FC<CampaignOverviewPanelProps> = ({
  campaignId,
  campaignTitle
}) => {
  // 모의 캠페인 전체 데이터
  const campaignSummary = {
    totalInfluencers: 3,
    totalContent: 12,
    totalViews: 1250000,
    totalEngagement: 98500,
    averageEngagementRate: 8.9,
    topPerformer: '샤오리'
  };

  const influencerRankingData = [
    { name: '샤오리', views: 500000, engagement: 45000, platform: 'xiaohongshu' },
    { name: '리밍', views: 420000, engagement: 32000, platform: 'douyin' },
    { name: '왕위안', views: 330000, engagement: 21500, platform: 'xiaohongshu' }
  ];

  return (
    <div className="space-y-6">
      {/* 캠페인 헤더 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            {campaignTitle} - 종합 성과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{campaignSummary.totalInfluencers}</div>
              <div className="text-sm text-gray-600">참여 인플루언서</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{campaignSummary.totalContent}</div>
              <div className="text-sm text-gray-600">총 콘텐츠</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(campaignSummary.totalViews / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">총 조회수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{campaignSummary.averageEngagementRate}%</div>
              <div className="text-sm text-gray-600">평균 참여율</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 인플루언서 성과 순위 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              인플루언서 성과 순위
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {influencerRankingData.map((influencer, index) => (
                <div key={influencer.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{influencer.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {influencer.platform === 'xiaohongshu' ? '📕 샤오홍슈' : '🎵 도우인'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{(influencer.views / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">조회수</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              플랫폼별 성과 비교
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={influencerRankingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value.toLocaleString(), '조회수']} />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignOverviewPanel;
