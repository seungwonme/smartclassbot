
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MarketResearchReportModal from './MarketResearchReportModal';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';

interface MarketResearchCrawlerProps {
  selectedBrand: string;
  selectedProduct: string;
  brands: BrandType[];
  products: ProductType[];
  onBrandChange: (brandId: string) => void;
  onProductChange: (productId: string) => void;
  onResearchComplete: (reportData: any) => void;
  savedReports: any[];
}

const MarketResearchCrawler: React.FC<MarketResearchCrawlerProps> = ({
  selectedBrand,
  selectedProduct,
  brands,
  products,
  onBrandChange,
  onProductChange,
  onResearchComplete,
  savedReports
}) => {
  const { toast } = useToast();
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);
  const [researchCompleted, setResearchCompleted] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);

  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  const handleStartResearch = async () => {
    if (!selectedBrand || !selectedProduct) {
      toast({
        title: "브랜드와 제품을 선택해주세요",
        description: "시장조사를 진행하기 위해 브랜드와 제품을 모두 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsCrawling(true);
    setCrawlProgress(0);
    setResearchCompleted(false);

    // 시뮬레이션: 실제로는 자동화된 채널 선택 및 크롤링
    const steps = [
      "최적 채널 자동 선택 중...",
      "시장 데이터 수집 중...",
      "소비자 반응 분석 중...",
      "경쟁사 동향 파악 중...",
      "종합 리포트 생성 중..."
    ];

    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCrawlProgress(i);
    }

    const reportData = {
      brandId: selectedBrand,
      productId: selectedProduct,
      brandName: selectedBrandData?.name,
      productName: selectedProductData?.name,
      completedAt: new Date().toISOString(),
      summary: {
        totalContent: 1250,
        totalComments: 8420,
        keywords: 156,
        sentiment: 'positive'
      }
    };

    setCurrentReport(reportData);
    setResearchCompleted(true);
    setIsCrawling(false);
    
    toast({
      title: "시장조사 완료",
      description: "중국 시장 데이터 수집 및 분석이 완료되었습니다.",
    });
  };

  return (
    <div className="space-y-6">
      {/* 브랜드 및 제품 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            시장조사 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">브랜드 선택</label>
              <Select value={selectedBrand} onValueChange={onBrandChange}>
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
              <Select 
                value={selectedProduct} 
                onValueChange={onProductChange}
                disabled={!selectedBrand}
              >
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
          </div>

          {selectedBrand && selectedProduct && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>선택된 분석 대상:</strong> {selectedBrandData?.name} - {selectedProductData?.name}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                시스템이 자동으로 최적 채널을 선택하여 시장조사를 진행합니다
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 시장조사 실행 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI 기반 시장조사 실행
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCrawling && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI 시장조사 진행률</span>
                <span>{crawlProgress}%</span>
              </div>
              <Progress value={crawlProgress} />
              <div className="text-sm text-gray-600 text-center">
                중국 주요 플랫폼에서 데이터를 수집하고 분석하고 있습니다...
              </div>
            </div>
          )}

          <Button 
            onClick={handleStartResearch}
            disabled={isCrawling || !selectedBrand || !selectedProduct}
            className="w-full"
          >
            {isCrawling ? 'AI 시장조사 진행 중...' : '시장조사 시작하기'}
          </Button>
        </CardContent>
      </Card>

      {/* 수집 결과 미리보기 */}
      {researchCompleted && currentReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>수집 결과 미리보기</span>
              <Badge variant="outline" className="ml-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentReport.summary.totalContent}</div>
                <div className="text-sm text-gray-600">콘텐츠 수집</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentReport.summary.totalComments.toLocaleString()}</div>
                <div className="text-sm text-gray-600">댓글 분석</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{currentReport.summary.keywords}</div>
                <div className="text-sm text-gray-600">키워드 추출</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">긍정적</div>
                <div className="text-sm text-gray-600">전체 감성</div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <MarketResearchReportModal
                reportData={currentReport}
                selectedBrand={selectedBrandData?.name || ''}
                selectedProduct={selectedProductData?.name || ''}
                onSaveReport={(reportData) => {
                  onResearchComplete(reportData);
                  toast({
                    title: "리포트 저장 완료",
                    description: "다음 단계인 AI 페르소나 생성을 진행할 수 있습니다.",
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 저장된 리포트 목록 */}
      {savedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>저장된 시장조사 리포트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <MarketResearchReportModal
                    reportData={report}
                    selectedBrand={report.brandName}
                    selectedProduct={report.productName}
                    onSaveReport={() => {}}
                    trigger={
                      <Button variant="outline" size="sm">
                        보기
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketResearchCrawler;
