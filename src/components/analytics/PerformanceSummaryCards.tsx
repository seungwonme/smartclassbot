
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Eye } from 'lucide-react';

interface PerformanceSummaryCardsProps {
  selectedBrand: string;
  selectedCampaign: string;
  selectedInfluencer: string;
}

const PerformanceSummaryCards: React.FC<PerformanceSummaryCardsProps> = ({
  selectedBrand,
  selectedCampaign,
  selectedInfluencer
}) => {
  // 모의 종합 성과 데이터
  const summaryData = {
    totalCampaigns: selectedCampaign === 'all' ? 3 : 1,
    totalInfluencers: selectedInfluencer === 'all' ? 3 : 1,
    totalViews: selectedInfluencer === 'all' ? 1250000 : 500000,
    avgEngagementRate: selectedInfluencer === 'all' ? 8.9 : 9.2
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          종합 성과
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-blue-600">{summaryData.totalCampaigns}</div>
            <div className="text-xs text-gray-600">캠페인</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xl font-bold text-green-600">{summaryData.totalInfluencers}</div>
            <div className="text-xs text-gray-600">인플루언서</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-600">
              {(summaryData.totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600">총 조회수</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-xl font-bold text-orange-600">{summaryData.avgEngagementRate}%</div>
            <div className="text-xs text-gray-600">평균 참여율</div>
          </div>
        </div>
        
        {/* 간단한 트렌드 표시 */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">이번 주</span>
            <span className="text-green-600 font-medium">+12.5%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSummaryCards;
