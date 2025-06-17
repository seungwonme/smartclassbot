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

const BrandPersonaManagement = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [marketResearchCompleted, setMarketResearchCompleted] = useState(false);
  const [personaGenerationCompleted, setPersonaGenerationCompleted] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [savedPersonas, setSavedPersonas] = useState<any[]>([]);
  
  // 실제 데이터 상태
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // 데이터 로드
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
          setSelectedBrand(brandsData[0].id);
        }
        
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

  // 선택된 브랜드의 제품들만 필터링
  const filteredProducts = selectedBrand 
    ? products.filter(product => product.brandId === selectedBrand)
    : [];

  // 브랜드 변경 시 제품 선택 초기화
  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedProduct(''); // 브랜드 변경 시 제품 선택 초기화
  };

  const handleMarketResearchComplete = (reportData: any) => {
    setMarketResearchCompleted(true);
    setSavedReports(prev => [...prev, reportData]);
  };

  const handlePersonaGenerated = (personaData: any) => {
    setPersonaGenerationCompleted(true);
    setSavedPersonas(prev => [...prev, personaData]);
  };

  // 로딩 상태 렌더링
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

  // 에러 상태 렌더링
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
            >
              AI 페르소나 생성
            </TabsTrigger>
            <TabsTrigger 
              value="matching" 
              disabled={!personaGenerationCompleted}
              className={!personaGenerationCompleted ? 'opacity-50' : ''}
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
              savedReports={savedReports}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <PersonaGenerator 
              selectedBrand={selectedBrand}
              selectedProduct={selectedProduct}
              brands={brands}
              products={filteredProducts}
              savedReports={savedReports}
              onPersonaGenerated={handlePersonaGenerated}
              savedPersonas={savedPersonas}
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
