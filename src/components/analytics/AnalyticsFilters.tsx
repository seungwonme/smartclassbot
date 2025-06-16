
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Filter, X, Search, TrendingUp } from 'lucide-react';

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  availableBrands?: string[];
  availableCampaigns?: string[];
  availableInfluencers?: string[];
}

export interface FilterOptions {
  brands: string[];
  campaigns: string[];
  influencers: string[];
  platforms: string[];
  dateRange: { from?: Date; to?: Date };
  metrics: {
    minViews: number;
    minLikes: number;
    minComments: number;
    minEngagementRate: number;
  };
  contentTypes: string[];
  sortBy: 'views' | 'likes' | 'engagement' | 'date';
  sortOrder: 'asc' | 'desc';
  realTimeOnly: boolean;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ 
  onFiltersChange,
  availableBrands = [],
  availableCampaigns = [],
  availableInfluencers = []
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    brands: [],
    campaigns: [],
    influencers: [],
    platforms: [],
    dateRange: {},
    metrics: {
      minViews: 0,
      minLikes: 0,
      minComments: 0,
      minEngagementRate: 0
    },
    contentTypes: [],
    sortBy: 'views',
    sortOrder: 'desc',
    realTimeOnly: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addToArrayFilter = (key: 'brands' | 'campaigns' | 'influencers' | 'platforms' | 'contentTypes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(item => item !== value) : [...prev[key], value]
    }));
  };

  const removeFilter = (key: 'brands' | 'campaigns' | 'influencers' | 'platforms' | 'contentTypes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      campaigns: [],
      influencers: [],
      platforms: [],
      dateRange: {},
      metrics: {
        minViews: 0,
        minLikes: 0,
        minComments: 0,
        minEngagementRate: 0
      },
      contentTypes: [],
      sortBy: 'views',
      sortOrder: 'desc',
      realTimeOnly: false
    });
    setSearchTerm('');
  };

  const activeFiltersCount = [
    ...filters.brands,
    ...filters.campaigns,
    ...filters.influencers,
    ...filters.platforms,
    ...filters.contentTypes
  ].length + (filters.realTimeOnly ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            고급 필터
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '접기' : '펼치기'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                초기화
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="인플루언서, 캠페인, 브랜드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 빠른 필터 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.platforms.includes('xiaohongshu') ? 'default' : 'outline'}
            size="sm"
            onClick={() => addToArrayFilter('platforms', 'xiaohongshu')}
          >
            📕 샤오홍슈
          </Button>
          <Button
            variant={filters.platforms.includes('douyin') ? 'default' : 'outline'}
            size="sm"
            onClick={() => addToArrayFilter('platforms', 'douyin')}
          >
            🎵 도우인
          </Button>
          <div className="flex items-center gap-2">
            <Switch
              checked={filters.realTimeOnly}
              onCheckedChange={(checked) => updateFilter('realTimeOnly', checked)}
            />
            <span className="text-sm">실시간만</span>
          </div>
        </div>

        {/* 활성 필터 표시 */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.brands.map(brand => (
              <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                브랜드: {brand}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('brands', brand)}
                />
              </Badge>
            ))}
            {filters.campaigns.map(campaign => (
              <Badge key={campaign} variant="secondary" className="flex items-center gap-1">
                캠페인: {campaign}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('campaigns', campaign)}
                />
              </Badge>
            ))}
            {filters.platforms.map(platform => (
              <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                {platform === 'xiaohongshu' ? '📕 샤오홍슈' : '🎵 도우인'}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('platforms', platform)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* 확장 필터 */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">브랜드 선택</label>
                <Select onValueChange={(value) => addToArrayFilter('brands', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="브랜드 선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">정렬 기준</label>
                <div className="flex gap-2">
                  <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="views">조회수</SelectItem>
                      <SelectItem value="likes">좋아요</SelectItem>
                      <SelectItem value="engagement">참여율</SelectItem>
                      <SelectItem value="date">날짜</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    <TrendingUp className={`w-4 h-4 ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* 성과 지표 필터 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">최소 성과 지표</h4>
              
              <div>
                <label className="text-xs text-gray-500">최소 조회수: {filters.metrics.minViews.toLocaleString()}</label>
                <Slider
                  value={[filters.metrics.minViews]}
                  onValueChange={([value]) => updateFilter('metrics', { ...filters.metrics, minViews: value })}
                  max={100000}
                  step={1000}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">최소 좋아요: {filters.metrics.minLikes.toLocaleString()}</label>
                <Slider
                  value={[filters.metrics.minLikes]}
                  onValueChange={([value]) => updateFilter('metrics', { ...filters.metrics, minLikes: value })}
                  max={10000}
                  step={100}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">최소 참여율: {filters.metrics.minEngagementRate}%</label>
                <Slider
                  value={[filters.metrics.minEngagementRate]}
                  onValueChange={([value]) => updateFilter('metrics', { ...filters.metrics, minEngagementRate: value })}
                  max={10}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilters;
