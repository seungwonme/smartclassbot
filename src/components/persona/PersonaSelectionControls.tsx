
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText } from 'lucide-react';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';

interface PersonaSelectionControlsProps {
  selectedBrand: string;
  selectedProduct: string;
  selectedReport: string;
  brands: BrandType[];
  products: ProductType[];
  filteredReports: any[];
  onReportChange: (reportId: string) => void;
  onBrandChange?: (brandId: string) => void;
  onProductChange?: (productId: string) => void;
  isRecentReport: (reportDate: string) => boolean;
}

const PersonaSelectionControls: React.FC<PersonaSelectionControlsProps> = ({
  selectedBrand,
  selectedProduct,
  selectedReport,
  brands,
  products,
  filteredReports,
  onReportChange,
  onBrandChange,
  onProductChange,
  isRecentReport
}) => {
  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI 페르소나 생성 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">브랜드 선택</label>
            <Select value={selectedBrand} onValueChange={onBrandChange} disabled={!onBrandChange}>
              <SelectTrigger>
                <SelectValue placeholder="브랜드를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name} ({brand.category || '카테고리 없음'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">제품 선택</label>
            <Select value={selectedProduct} onValueChange={onProductChange} disabled={!onProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="제품을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">시장조사 보고서 선택</label>
            <Select 
              value={selectedReport} 
              onValueChange={onReportChange}
              disabled={!selectedBrand || !selectedProduct || filteredReports.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="보고서를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {filteredReports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{report.name}</span>
                      {isRecentReport(report.createdAt) && (
                        <Badge variant="default" className="text-xs">최신</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedBrand && selectedProduct && filteredReports.length === 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm text-yellow-700">
              <strong>알림:</strong> 선택된 브랜드와 제품에 대한 시장조사 보고서가 없습니다.
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              먼저 시장조사를 완료하여 보고서를 생성해주세요.
            </div>
          </div>
        )}

        {selectedBrand && selectedProduct && selectedReport && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-700">
              <strong>페르소나 생성 대상:</strong> {selectedBrandData?.name} - {selectedProductData?.name}
            </div>
            <div className="text-sm text-purple-700 mt-1">
              <strong>사용할 보고서:</strong> {filteredReports.find(r => r.id === selectedReport)?.name}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              선택된 시장조사 보고서 데이터를 기반으로 최적화된 소비자 페르소나를 생성합니다
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonaSelectionControls;
