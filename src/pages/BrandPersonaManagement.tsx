import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import BrandSidebar from '@/components/BrandSidebar';
import PersonaOverview from '@/components/persona/PersonaOverview';
import MarketResearchCrawler from '@/components/persona/MarketResearchCrawler';
import PersonaGenerator from '@/components/persona/PersonaGenerator';
import PersonaInfluencerMatcher from '@/components/persona/PersonaInfluencerMatcher';
import { brandService } from '@/services/brand.service';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storage.service';

const BrandPersonaManagement = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [marketResearchCompleted, setMarketResearchCompleted] = useState(false);
  const [personaGenerationCompleted, setPersonaGenerationCompleted] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [savedPersonas, setSavedPersonas] = useState<any[]>([]);
  
  // 실제 데이터 상태
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // 저장된 데이터 로드 함수
  const loadStoredData = () => {
    try {
      const reports = storageService.getMarketReports();
      const personas = storageService.getPersonas();
      console.log('📊 로드된 리포트:', reports.length, '개');
      console.log('👥 로드된 페르소나:', personas.length, '개');
      setSavedReports(reports);
      setSavedPersonas(personas);
      
      // 전체 리포트가 있으면 시장조사 완료로 간주 (초기 활성화)
      if (reports.length > 0) {
        console.log('✅ 시장조사 리포트 존재로 인해 초기 탭 활성화');
      }
      
      // 전체 페르소나가 있으면 페르소나 생성 완료로 간주 (초기 활성화)
      if (personas.length > 0) {
        console.log('✅ 페르소나 존재로 인해 초기 인플루언서 매칭 탭 활성화');
      }
    } catch (error) {
      console.error('저장된 데이터 로드 실패:', error);
    }
  };

  // 브랜드/제품 선택에 따른 리포트 필터링
  const filterReportsBySelection = () => {
    console.log('🔍 리포트 필터링 시작:', {
      savedReportsCount: savedReports.length,
      selectedBrand,
      selectedProduct
    });

    if (!selectedBrand || !selectedProduct) {
      console.log('🔍 브랜드 또는 제품이 선택되지 않음 - 전체 리포트 표시');
      setFilteredReports(savedReports);
      return;
    }

    const filtered = savedReports.filter(report => {
      const idMatch = report.brandId === selectedBrand && report.productId === selectedProduct;
      const nameMatch = report.brandName && report.productName && 
        brands.find(b => b.id === selectedBrand)?.name === report.brandName &&
        products.find(p => p.id === selectedProduct)?.name === report.productName;
      
      console.log('🔍 리포트 매칭 확인:', {
        reportId: report.id,
        reportName: report.name,
        reportBrandId: report.brandId,
        reportProductId: report.productId,
        idMatch,
        nameMatch,
        finalMatch: idMatch || nameMatch
      });
      
      return idMatch || nameMatch;
    });
    
    console.log('🔍 선택된 브랜드/제품에 대한 리포트 필터링 완료:', {
      selectedBrand,
      selectedProduct,
      totalReports: savedReports.length,
      filteredReports: filtered.length,
      filteredReportNames: filtered.map(r => r.name)
    });
    
    setFilteredReports(filtered);
  };

  // 필터링 함수 자동 실행을 위한 useEffect
  useEffect(() => {
    console.log('🔄 필터링 함수 자동 실행 트리거:', {
      savedReportsLength: savedReports.length,
      selectedBrand,
      selectedProduct,
      brandsLength: brands.length,
      productsLength: products.length
    });
    
    // 브랜드와 제품 데이터가 로딩된 후에만 필터링 실행
    if (brands.length > 0 && products.length > 0) {
      filterReportsBySelection();
    }
  }, [savedReports, selectedBrand, selectedProduct, brands, products]);

  // 브랜드/제품 조합에 따른 탭 활성화 상태 업데이트
  const updateTabStates = () => {
    console.log('🔄 탭 상태 업데이트 시작:', {
      selectedBrand,
      selectedProduct,
      totalReports: savedReports.length,
      totalPersonas: savedPersonas.length,
      filteredReports: filteredReports.length
    });

    // 브랜드/제품이 선택되지 않은 경우에도 전체 리포트/페르소나 존재 여부로 탭 활성화
    let hasAnyReports = savedReports.length > 0;
    let hasAnyPersonas = savedPersonas.length > 0;
    
    // 브랜드와 제품이 모두 선택된 경우, 해당 조합에 대한 리포트/페르소나 확인
    if (selectedBrand && selectedProduct) {
      const hasReportsForSelection = filteredReports.length > 0;

      const hasPersonasForSelection = savedPersonas.some(persona => 
        persona.brandId === selectedBrand && persona.productId === selectedProduct
      );

      console.log('🎯 선택된 브랜드/제품에 대한 데이터:', {
        hasReportsForSelection,
        hasPersonasForSelection
      });

      // 선택된 조합에 대한 데이터가 있으면 우선적으로 사용
      if (hasReportsForSelection) hasAnyReports = true;
      if (hasPersonasForSelection) hasAnyPersonas = true;

      if (hasReportsForSelection && !hasPersonasForSelection) {
        toast({
          title: "AI 페르소나 생성 가능",
          description: "저장된 시장조사 리포트를 기반으로 페르소나를 생성할 수 있습니다.",
        });
      }

      if (hasPersonasForSelection) {
        toast({
          title: "인플루언서 매칭 가능",
          description: "생성된 페르소나를 기반으로 인플루언서 매칭을 진행할 수 있습니다.",
        });
      }
    }

    console.log('📋 최종 탭 활성화 상태:', {
      marketResearchCompleted: hasAnyReports,
      personaGenerationCompleted: hasAnyPersonas
    });

    setMarketResearchCompleted(hasAnyReports);
    setPersonaGenerationCompleted(hasAnyPersonas);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('브랜드 페르소나 관리: 데이터 로딩 시작');
        
        const [brandsData, productsData] = await Promise.all([
          brandService.getBrands(),
          brandService.getProducts()
        ]);
        
        console.log('로드된 브랜드 데이터:', brandsData);
        console.log('로드된 제품 데이터:', productsData);
        
        setBrands(brandsData);
        setProducts(productsData);
        
        // 첫 번째 브랜드를 기본 선택 (있는 경우)
        if (brandsData.length > 0 && !selectedBrand) {
          const firstBrand = brandsData[0];
          setSelectedBrand(firstBrand.id);
          
          // 선택된 브랜드의 첫 번째 제품도 자동 선택
          const brandProducts = productsData.filter(product => product.brandId === firstBrand.id);
          if (brandProducts.length > 0) {
            setSelectedProduct(brandProducts[0].id);
            console.log('🎯 첫 번째 브랜드와 제품 자동 선택:', firstBrand.name, brandProducts[0].name);
          }
        }
        
        // 저장된 데이터 로드
        loadStoredData();
        
      } catch (err) {
        console.error('데이터 로딩 오류:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        toast({
          title: "데이터 로딩 실패",
          description: "브랜드 및 제품 데이터를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 저장된 데이터 변경 시 탭 상태 업데이트 (filteredReports 의존성 제거)
  useEffect(() => {
    updateTabStates();
  }, [savedReports, savedPersonas, selectedBrand, selectedProduct]);

  // 선택된 브랜드의 제품들만 필터링
  const filteredProducts = selectedBrand 
    ? products.filter(product => product.brandId === selectedBrand)
    : [];

  // 브랜드 변경 시 제품 선택 초기화 및 첫 번째 제품 자동 선택
  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    
    // 선택된 브랜드의 첫 번째 제품 자동 선택
    const brandProducts = products.filter(product => product.brandId === brandId);
    if (brandProducts.length > 0) {
      setSelectedProduct(brandProducts[0].id);
      console.log('🔄 브랜드 변경 시 첫 번째 제품 자동 선택:', brandProducts[0].name);
    } else {
      setSelectedProduct(''); // 제품이 없으면 선택 해제
    }
  };

  const handleMarketResearchComplete = (reportData: any) => {
    console.log('✅ 시장조사 완료 이벤트 수신:', reportData);
    setMarketResearchCompleted(true);
    
    // 저장된 데이터 다시 로드하여 실시간 업데이트
    loadStoredData();
    
    toast({
      title: "시장조사 완료",
      description: `${reportData.name} 리포트가 저장되었습니다.`,
    });
  };

  const handlePersonaGenerated = (personaData: any) => {
    console.log('✅ 페르소나 생성 완료 이벤트 수신:', personaData);
    setPersonaGenerationCompleted(true);
    
    // 저장된 데이터 다시 로드하여 실시간 업데이트
    loadStoredData();
    
    toast({
      title: "페르소나 생성 완료",
      description: `${personaData.name} 페르소나가 저장되었습니다.`,
    });
  };

  const handleReportDeleted = (reportId: string, reportName: string) => {
    console.log('🗑️ 리포트 삭제 이벤트 수신:', reportId);
    
    // 저장된 데이터 다시 로드하여 실시간 업데이트
    loadStoredData();
    
    toast({
      title: "리포트 삭제 완료",
      description: `${reportName} 리포트가 삭제되었습니다.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-4 lg:p-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">AI 페르소나 관리</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">AI 페르소나 관리</h1>
          <p className="text-gray-600">중국 시장 데이터 기반으로 소비자 페르소나를 생성하고 최적의 인플루언서를 매칭하세요</p>
        </div>

        <Tabs defaultValue="research" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="research">시장조사</TabsTrigger>
            <TabsTrigger 
              value="generate" 
              disabled={!marketResearchCompleted}
              className={!marketResearchCompleted ? 'opacity-50' : ''}
              title={!marketResearchCompleted ? '시장조사 리포트가 필요합니다' : ''}
            >
              AI 페르소나 생성
            </TabsTrigger>
            <TabsTrigger 
              value="matching" 
              disabled={!personaGenerationCompleted}
              className={!personaGenerationCompleted ? 'opacity-50' : ''}
              title={!personaGenerationCompleted ? '페르소나 생성이 필요합니다' : ''}
            >
              인플루언서 매칭
            </TabsTrigger>
            <TabsTrigger value="overview">페르소나 현황</TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="mt-6">
            <MarketResearchCrawler 
              selectedBrand={selectedBrand}
              selectedProduct={selectedProduct}
              brands={brands}
              products={filteredProducts}
              onBrandChange={handleBrandChange}
              onProductChange={setSelectedProduct}
              onResearchComplete={handleMarketResearchComplete}
              savedReports={filteredReports}
              onReportDeleted={handleReportDeleted}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <PersonaGenerator 
              selectedBrand={selectedBrand}
              selectedProduct={selectedProduct}
              brands={brands}
              products={filteredProducts}
              savedReports={filteredReports}
              onPersonaGenerated={handlePersonaGenerated}
              savedPersonas={savedPersonas}
              onBrandChange={handleBrandChange}
              onProductChange={setSelectedProduct}
            />
          </TabsContent>

          <TabsContent value="matching" className="mt-6">
            <PersonaInfluencerMatcher 
              activePersona={activePersona}
              selectedProduct={selectedProduct}
              savedPersonas={savedPersonas}
              onPersonaSelect={setActivePersona}
            />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <PersonaOverview 
              brands={brands}
              products={products}
              selectedBrand={selectedBrand}
              selectedProduct={selectedProduct}
              onBrandChange={handleBrandChange}
              onProductChange={setSelectedProduct}
              onPersonaSelect={setActivePersona}
              savedPersonas={savedPersonas}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrandPersonaManagement;
