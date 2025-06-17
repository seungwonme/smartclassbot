import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, MessageSquare, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';
import MarketResearchReportModal from './MarketResearchReportModal';
import SavedReportsList from './SavedReportsList';
import { storageService } from '@/services/storage.service';

interface MarketResearchCrawlerProps {
  selectedBrand: string;
  selectedProduct: string;
  brands: BrandType[];
  products: ProductType[];
  onBrandChange: (brandId: string) => void;
  onProductChange: (productId: string) => void;
  onResearchComplete: (reportData: any) => void;
  savedReports: any[];
  onReportDeleted?: (reportId: string, reportName: string) => void;
}

const MarketResearchCrawler: React.FC<MarketResearchCrawlerProps> = ({
  selectedBrand,
  selectedProduct,
  brands,
  products,
  onBrandChange,
  onProductChange,
  onResearchComplete,
  savedReports: initialSavedReports,
  onReportDeleted
}) => {
  const { toast } = useToast();
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlCompleted, setCrawlCompleted] = useState(false);
  const [currentReportData, setCurrentReportData] = useState<any>(null);
  const [savedReports, setSavedReports] = useState(initialSavedReports);

  // Props로 받은 savedReports 동기화
  useEffect(() => {
    console.log('🔄 MarketResearchCrawler: savedReports props 업데이트됨:', initialSavedReports.length);
    setSavedReports(initialSavedReports);
  }, [initialSavedReports]);

  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  // Check if report is recent (within last 30 days)
  const isRecentReport = (reportDate: string) => {
    const reportTime = new Date(reportDate).getTime();
    const thirtyDaysAgo = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
    return reportTime > thirtyDaysAgo;
  };

  const handleStartCrawling = async () => {
    if (!selectedBrand || !selectedProduct) {
      toast({
        title: "브랜드와 제품을 선택해주세요",
        description: "시장조사를 위해 브랜드와 제품을 모두 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsCrawling(true);
    setCrawlProgress(0);
    setCrawlCompleted(false);

    // 시뮬레이션: 시장조사 진행률
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCrawlProgress(i);
    }

    // 가상의 플랫폼 데이터 및 요약 정보
    const mockPlatforms = ['샤오홍슈', '도우인', '티몰', '타오바오'];
    const mockSummary = {
      totalContent: 1250,
      totalComments: 8420,
      keywords: 156,
      sentiment: 'positive'
    };

    const reportData = {
      brandId: selectedBrand,
      productId: selectedProduct,
      brandName: selectedBrandData?.name,
      productName: selectedProductData?.name,
      platforms: mockPlatforms,
      summary: mockSummary,
      completedAt: new Date().toISOString()
    };

    setCurrentReportData(reportData);
    setCrawlCompleted(true);
    setIsCrawling(false);
    
    toast({
      title: "시장조사 완료",
      description: "중국 주요 플랫폼에서 데이터 수집이 완료되었습니다.",
    });
  };

  const handleSaveReport = (reportData: any) => {
    try {
      // localStorage에 저장
      const reports = storageService.getMarketReports();
      setSavedReports(reports);
      
      // 상위 컴포넌트에 알림
      onResearchComplete(reportData);
      
      console.log('리포트 저장 완료:', reportData);
    } catch (error) {
      console.error('리포트 저장 처리 실패:', error);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    try {
      const reportToDelete = savedReports.find(report => report.id === reportId);
      const reportName = reportToDelete?.name || '리포트';
      
      if (storageService.deleteMarketReport(reportId)) {
        const updatedReports = storageService.getMarketReports();
        setSavedReports(updatedReports);
        
        // 상위 컴포넌트에 삭제 알림
        if (onReportDeleted) {
          onReportDeleted(reportId, reportName);
        }
      }
    } catch (error) {
      console.error('리포트 삭제 실패:', error);
      toast({
        title: "삭제 실패",
        description: "리포트 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
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
              <Select value={selectedProduct} onValueChange={onProductChange}>
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
        </CardContent>
      </Card>

      {/* 시장조사 실행 및 결과 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            중국 시장조사
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCrawling && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>시장조사 진행률</span>
                <span>{crawlProgress}%</span>
              </div>
              <Progress value={crawlProgress} />
              <div className="text-sm text-gray-600 text-center">
                중국 주요 플랫폼에서 브랜드 및 제품 관련 데이터를 수집하고 있습니다...
              </div>
            </div>
          )}

          <Button 
            onClick={handleStartCrawling}
            disabled={isCrawling || !selectedBrand || !selectedProduct}
            className="w-full"
          >
            {isCrawling ? '시장조사 진행 중...' : '시장조사 시작하기'}
          </Button>

          {crawlCompleted && currentReportData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">
                  {selectedBrandData?.name} - {selectedProductData?.name}
                </h4>
                <Badge variant="outline">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  완료
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    총 {currentReportData.summary.totalComments.toLocaleString()}개 댓글 분석
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentReportData.platforms.length}개 플랫폼에서 데이터 수집
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentReportData.summary.keywords}개 키워드 추출
                  </span>
                </div>
              </div>
              <MarketResearchReportModal 
                reportData={currentReportData}
                selectedBrand={selectedBrand}
                selectedProduct={selectedProduct}
                onSaveReport={handleSaveReport}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 저장된 리포트 목록 */}
      <SavedReportsList
        savedReports={savedReports}
        onDeleteReport={handleDeleteReport}
        isRecentReport={isRecentReport}
      />
    </div>
  );
};

export default MarketResearchCrawler;
