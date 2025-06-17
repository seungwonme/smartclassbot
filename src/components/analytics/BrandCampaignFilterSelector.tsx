
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Target } from 'lucide-react';
import { Brand } from '@/types/brand';

interface Campaign {
  id: string;
  title: string;
}

interface BrandCampaignFilterSelectorProps {
  selectedBrand: string;
  selectedCampaign: string;
  campaigns: Campaign[];
  brands?: Brand[];
  onBrandChange: (brandId: string) => void;
  onCampaignChange: (campaignId: string) => void;
}

const BrandCampaignFilterSelector: React.FC<BrandCampaignFilterSelectorProps> = ({
  selectedBrand,
  selectedCampaign,
  campaigns,
  brands = [],
  onBrandChange,
  onCampaignChange
}) => {
  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* 선택된 정보 표시 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </div>

        {/* 데이터 요약 정보 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>분석 가능한 캠페인: {campaigns.length}개</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCampaignFilterSelector;
