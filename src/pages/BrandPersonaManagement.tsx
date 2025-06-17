
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandSidebar from '@/components/BrandSidebar';
import PersonaOverview from '@/components/persona/PersonaOverview';
import MarketResearchCrawler from '@/components/persona/MarketResearchCrawler';
import PersonaGenerator from '@/components/persona/PersonaGenerator';
import PersonaInfluencerMatcher from '@/components/persona/PersonaInfluencerMatcher';

const BrandPersonaManagement = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [marketResearchCompleted, setMarketResearchCompleted] = useState(false);
  const [personaGenerationCompleted, setPersonaGenerationCompleted] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [savedPersonas, setSavedPersonas] = useState<any[]>([]);

  // 모의 브랜드 데이터
  const brands = [
    { id: 'brand1', name: '뷰티코리아', category: '화장품' },
    { id: 'brand2', name: '프리미엄티', category: '식품' },
    { id: 'brand3', name: '스마트텍', category: '전자기기' }
  ];

  // 모의 제품 데이터
  const products = [
    { id: 'product1', name: '스킨케어 세럼', category: '뷰티', brandId: 'brand1' },
    { id: 'product2', name: '프리미엄 차', category: '식품', brandId: 'brand2' },
    { id: 'product3', name: '스마트 워치', category: '전자기기', brandId: 'brand3' },
    { id: 'product4', name: '안티에이징 크림', category: '뷰티', brandId: 'brand1' },
  ];

  // 선택된 브랜드의 제품들만 필터링
  const filteredProducts = selectedBrand 
    ? products.filter(product => product.brandId === selectedBrand)
    : [];

  const handleMarketResearchComplete = (reportData: any) => {
    setMarketResearchCompleted(true);
    setSavedReports(prev => [...prev, reportData]);
  };

  const handlePersonaGenerated = (personaData: any) => {
    setPersonaGenerationCompleted(true);
    setSavedPersonas(prev => [...prev, personaData]);
  };

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
              onBrandChange={setSelectedBrand}
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
              onBrandChange={setSelectedBrand}
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
