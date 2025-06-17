
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Users, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Brand, Product } from '@/types/brand';
import { CampaignFormData } from '@/hooks/useCampaignForm';

interface CampaignBasicInfoStepProps {
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  brands: Brand[];
  filteredProducts: Product[];
  handleBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBrandChange: (brandId: string) => void;
  handleProductChange: (productId: string) => void;
  isPersonaBased?: boolean;
  personaData?: any;
}

const CampaignBasicInfoStep: React.FC<CampaignBasicInfoStepProps> = ({
  formData,
  setFormData,
  brands,
  filteredProducts,
  handleBudgetChange,
  handleBrandChange,
  handleProductChange,
  isPersonaBased = false,
  personaData
}) => {
  console.log('CampaignBasicInfoStep - brands 데이터:', brands);
  console.log('CampaignBasicInfoStep - filteredProducts 데이터:', filteredProducts);
  console.log('CampaignBasicInfoStep - formData.brandId:', formData.brandId);
  console.log('CampaignBasicInfoStep - isPersonaBased:', isPersonaBased);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          캠페인 기본정보
          {isPersonaBased && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Users className="w-3 h-3 mr-1" />
              페르소나 기반
            </Badge>
          )}
        </CardTitle>
        {isPersonaBased && personaData && (
          <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="font-medium">페르소나 기반 자동 설정</span>
            </div>
            <p>
              <strong>{personaData.persona?.name}</strong> 페르소나의 정보를 기반으로 
              브랜드, 제품, 예산, 광고 유형이 자동으로 설정되었습니다.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">캠페인 제목</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="캠페인 제목을 입력하세요"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand" className="flex items-center gap-2">
              브랜드
              {isPersonaBased && formData.brandId && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  자동 설정됨
                </Badge>
              )}
            </Label>
            <Select value={formData.brandId} onValueChange={handleBrandChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="브랜드를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-brands" disabled>
                    브랜드 데이터를 로드 중...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="product" className="flex items-center gap-2">
              제품
              {isPersonaBased && formData.productId && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  자동 설정됨
                </Badge>
              )}
            </Label>
            <Select 
              value={formData.productId} 
              onValueChange={handleProductChange}
              disabled={!formData.brandId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="제품을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-products" disabled>
                    {!formData.brandId ? "먼저 브랜드를 선택하세요" : "제품 데이터를 로드 중..."}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="budget" className="flex items-center gap-2">
            예산 (한화)
            {isPersonaBased && formData.budget && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                믹스 전략 기반
              </Badge>
            )}
          </Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={handleBudgetChange}
            placeholder="5,000,000"
          />
          {isPersonaBased && formData.budget && (
            <p className="text-xs text-green-600 mt-1">
              선택한 인플루언서 믹스 전략에 따라 자동 설정된 예산입니다.
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>제안 마감일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.proposalDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.proposalDeadline ? (
                    format(formData.proposalDeadline, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.proposalDeadline}
                  onSelect={(date) => setFormData(prev => ({ ...prev, proposalDeadline: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>캠페인 시작일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.campaignStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.campaignStartDate ? (
                    format(formData.campaignStartDate, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.campaignStartDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, campaignStartDate: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>캠페인 종료일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.campaignEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.campaignEndDate ? (
                    format(formData.campaignEndDate, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.campaignEndDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, campaignEndDate: date }))}
                  disabled={(date) => date < new Date() || (formData.campaignStartDate && date < formData.campaignStartDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="adType" className="flex items-center gap-2">
            광고 유형
            {isPersonaBased && formData.adType && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                자동 설정됨
              </Badge>
            )}
          </Label>
          <Select
            value={formData.adType}
            onValueChange={(value: 'branding' | 'live-commerce') => 
              setFormData(prev => ({ ...prev, adType: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branding">브랜딩</SelectItem>
              <SelectItem value="live-commerce">라이브커머스</SelectItem>
            </SelectContent>
          </Select>
          {isPersonaBased && formData.adType && (
            <p className="text-xs text-green-600 mt-1">
              페르소나 매칭 시 선택한 광고 유형이 자동으로 설정되었습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignBasicInfoStep;
