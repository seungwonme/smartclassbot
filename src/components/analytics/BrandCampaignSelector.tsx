
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, Users } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
}

interface Influencer {
  id: string;
  name: string;
  platform: string;
}

interface BrandCampaignSelectorProps {
  selectedBrand: string;
  selectedCampaign: string;
  selectedInfluencer: string;
  campaigns: Campaign[];
  influencers: Influencer[];
  onBrandChange: (brandId: string) => void;
  onCampaignChange: (campaignId: string) => void;
  onInfluencerChange: (influencerId: string) => void;
}

const BrandCampaignSelector: React.FC<BrandCampaignSelectorProps> = ({
  selectedBrand,
  selectedCampaign,
  selectedInfluencer,
  campaigns,
  influencers,
  onBrandChange,
  onCampaignChange,
  onInfluencerChange
}) => {
  const selectedInfluencerData = influencers.find(inf => inf.id === selectedInfluencer);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 브랜드 선택 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building2 className="w-4 h-4" />
              브랜드
            </div>
            <Select value={selectedBrand} onValueChange={onBrandChange}>
              <SelectTrigger>
                <SelectValue placeholder="브랜드 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand1">내 브랜드</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 캠페인 선택 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Target className="w-4 h-4" />
              캠페인
            </div>
            <Select value={selectedCampaign} onValueChange={onCampaignChange}>
              <SelectTrigger>
                <SelectValue placeholder="캠페인 선택" />
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
          </div>

          {/* 인플루언서 선택 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              인플루언서
            </div>
            <Select value={selectedInfluencer} onValueChange={onInfluencerChange}>
              <SelectTrigger>
                <SelectValue placeholder="인플루언서 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 인플루언서</SelectItem>
                {influencers.map((influencer) => (
                  <SelectItem key={influencer.id} value={influencer.id}>
                    <div className="flex items-center gap-2">
                      <span>{influencer.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {influencer.platform === 'xiaohongshu' ? '📕' : '🎵'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 선택된 정보 표시 */}
        {selectedInfluencer !== 'all' && selectedInfluencerData && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {selectedInfluencerData.platform === 'xiaohongshu' ? '📕' : '🎵'}
                </span>
                <span className="font-medium">{selectedInfluencerData.name}</span>
              </div>
              <Badge variant="outline">
                {selectedInfluencerData.platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'}
              </Badge>
              <span className="text-sm text-gray-600">분석 대상</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandCampaignSelector;
