
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
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
}

const CampaignBasicInfoStep: React.FC<CampaignBasicInfoStepProps> = ({
  formData,
  setFormData,
  brands,
  filteredProducts,
  handleBudgetChange,
  handleBrandChange,
  handleProductChange
}) => {
  // 디버깅을 위한 로그 추가
  console.log('CampaignBasicInfoStep - brands 데이터:', brands);
  console.log('CampaignBasicInfoStep - filteredProducts 데이터:', filteredProducts);
  console.log('CampaignBasicInfoStep - formData.brandId:', formData.brandId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>캠페인 기본정보</CardTitle>
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
            <Label htmlFor="brand">브랜드</Label>
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
            <Label htmlFor="product">제품</Label>
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
          <Label htmlFor="budget">예산 (한화)</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={handleBudgetChange}
            placeholder="5,000,000"
          />
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
          <Label htmlFor="adType">광고 유형</Label>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignBasicInfoStep;
