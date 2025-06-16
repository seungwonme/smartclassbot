
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignOverviewProps {
  campaign: Campaign;
}

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ campaign }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">브랜드</label>
            <p className="text-lg">{campaign.brandName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">제품</label>
            <p className="text-lg">{campaign.productName}</p>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            <div>
              <label className="text-sm font-medium text-gray-500">예산</label>
              <p className="text-lg">{campaign.budget.toLocaleString()}원</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            <div>
              <label className="text-sm font-medium text-gray-500">캠페인 기간</label>
              <p className="text-lg">{campaign.campaignStartDate} ~ {campaign.campaignEndDate}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">제안 마감일</label>
            <p className="text-lg">{campaign.proposalDeadline}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">광고 유형</label>
            <p className="text-lg">{campaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>타겟 콘텐츠 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">인플루언서 카테고리</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {campaign.targetContent.influencerCategories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">타겟 연령층</label>
            <p className="text-lg">{campaign.targetContent.targetAge}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">USP 중요도</label>
            <p className="text-lg">{campaign.targetContent.uspImportance}/10</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">인플루언서 영향력</label>
            <p className="text-lg">{campaign.targetContent.influencerImpact}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">추가 설명</label>
            <p className="text-lg">{campaign.targetContent.additionalDescription || '없음'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">2차 콘텐츠 활용</label>
            <p className="text-lg">{campaign.targetContent.secondaryContentUsage ? '예' : '아니오'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignOverview;
