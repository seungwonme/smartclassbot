
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/types/campaign';
import { Users, Eye, Heart, MessageCircle, TrendingUp, DollarSign } from 'lucide-react';

interface CampaignConfirmationSummaryProps {
  campaign: Campaign;
  onConfirmCampaign: () => void;
  isLoading?: boolean;
}

const CampaignConfirmationSummary: React.FC<CampaignConfirmationSummaryProps> = ({
  campaign,
  onConfirmCampaign,
  isLoading = false
}) => {
  // 승인된 인플루언서만 필터링
  const confirmedInfluencers = campaign.influencers.filter(inf => inf.status === 'confirmed');

  // 예상 효과 계산
  const calculateExpectedMetrics = () => {
    const totalFollowers = confirmedInfluencers.reduce((sum, inf) => sum + inf.followers, 0);
    const avgEngagementRate = confirmedInfluencers.reduce((sum, inf) => sum + inf.engagementRate, 0) / confirmedInfluencers.length;
    
    // 도달률 계산 (팔로워 수 기준, 일반적으로 10-30% 도달)
    const reachRate = Math.min(25, Math.max(10, avgEngagementRate * 2)); // 10-25% 범위
    const expectedReach = Math.round(totalFollowers * (reachRate / 100));
    
    // 예상 조회수 (도달률의 70-90%)
    const expectedViews = Math.round(expectedReach * 0.8);
    
    // 예상 참여 수 (조회수 * 평균 참여율)
    const expectedEngagements = Math.round(expectedViews * (avgEngagementRate / 100));

    return {
      totalFollowers,
      avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      reachRate: Math.round(reachRate * 100) / 100,
      expectedReach,
      expectedViews,
      expectedEngagements
    };
  };

  const metrics = calculateExpectedMetrics();
  const totalAdFee = confirmedInfluencers.reduce((sum, inf) => sum + (inf.adFee || inf.proposedFee || 0), 0);

  return (
    <div className="space-y-6">
      {/* 캠페인 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            캠페인 확정 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">기본 정보</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">캠페인명:</span> {campaign.title}</div>
                <div><span className="text-gray-500">브랜드:</span> {campaign.brandName}</div>
                <div><span className="text-gray-500">제품:</span> {campaign.productName}</div>
                <div><span className="text-gray-500">캠페인 기간:</span> {campaign.campaignStartDate} ~ {campaign.campaignEndDate}</div>
                <div><span className="text-gray-500">광고 유형:</span> {campaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">비용 정보</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">예산:</span> {campaign.budget.toLocaleString()}원</div>
                <div><span className="text-gray-500">총 광고비:</span> {totalAdFee.toLocaleString()}원</div>
                <div><span className="text-gray-500">잔여 예산:</span> {(campaign.budget - totalAdFee).toLocaleString()}원</div>
                <div className="pt-2">
                  <Badge variant={campaign.budget >= totalAdFee ? "default" : "destructive"}>
                    {campaign.budget >= totalAdFee ? "예산 내" : "예산 초과"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 승인된 인플루언서 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            승인된 인플루언서 ({confirmedInfluencers.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmedInfluencers.map((influencer) => (
              <div key={influencer.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <img 
                    src={influencer.profileImageUrl || influencer.profileImage} 
                    alt={influencer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-medium">{influencer.name}</h5>
                    <p className="text-sm text-gray-500">{influencer.category}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div>팔로워: {influencer.followers.toLocaleString()}명</div>
                  <div>참여율: {influencer.engagementRate}%</div>
                  <div>광고비: {(influencer.adFee || influencer.proposedFee || 0).toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 예상 효과 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            예상 캠페인 효과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{metrics.totalFollowers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">총 팔로워</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{metrics.reachRate}%</div>
              <div className="text-sm text-gray-600">도달률 (KPI)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{metrics.expectedViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">예상 조회수</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Heart className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{metrics.expectedEngagements.toLocaleString()}</div>
              <div className="text-sm text-gray-600">예상 참여수</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            * 예상 효과는 인플루언서의 과거 성과 데이터를 기반으로 계산된 추정치입니다.
          </div>
        </CardContent>
      </Card>

      {/* 캠페인 진행 동의 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            캠페인 진행 동의
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ 진행 전 확인사항</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 승인된 인플루언서와의 계약 및 콘텐츠 제작이 진행됩니다.</li>
                <li>• 총 광고비 {totalAdFee.toLocaleString()}원이 정산 관리로 이동됩니다.</li>
                <li>• 캠페인 동의 후에는 인플루언서 변경이 제한됩니다.</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={onConfirmCampaign}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                size="lg"
              >
                {isLoading ? "처리 중..." : "캠페인 진행에 동의합니다"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignConfirmationSummary;
