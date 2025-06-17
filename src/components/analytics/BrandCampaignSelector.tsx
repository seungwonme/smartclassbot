
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, Users } from 'lucide-react';
import { Brand } from '@/types/brand';

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
  brands?: Brand[];
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
  brands = [],
  onBrandChange,
  onCampaignChange,
  onInfluencerChange
}) => {
  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);
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
                {brands.length > 1 && (
                  <SelectItem value="all">전체 브랜드</SelectItem>
                )}
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* 선택된 브랜드 정보 */}
          {selectedBrandData && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">{selectedBrandData.name}</span>
              </div>
              {selectedBrandData.category && (
                <div className="text-xs text-purple-600 mt-1">{selectedBrandData.category}</div>
              )}
            </div>
          )}

          {/* 선택된 캠페인 정보 */}
          {selectedCampaignData && selectedCampaign !== 'all' && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">{selectedCampaignData.title}</span>
              </div>
              <div className="text-xs text-blue-600 mt-1">분석 대상 캠페인</div>
            </div>
          )}

          {/* 선택된 인플루언서 정보 */}
          {selectedInfluencerData && selectedInfluencer !== 'all' && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {selectedInfluencerData.platform === 'xiaohongshu' ? '📕' : '🎵'}
                </span>
                <span className="font-medium text-green-800">{selectedInfluencerData.name}</span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                {selectedInfluencerData.platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'} 인플루언서
              </div>
            </div>
          )}
        </div>

        {/* 데이터 요약 정보 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>분석 가능한 캠페인: {campaigns.length}개</span>
            <span>참여 인플루언서: {influencers.length}명</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCampaignSelector;
