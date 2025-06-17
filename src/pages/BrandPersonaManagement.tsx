
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandSidebar from '@/components/BrandSidebar';
import PersonaOverview from '@/components/persona/PersonaOverview';
import MarketResearchCrawler from '@/components/persona/MarketResearchCrawler';
import PersonaGenerator from '@/components/persona/PersonaGenerator';
import PersonaInfluencerMatcher from '@/components/persona/PersonaInfluencerMatcher';

const BrandPersonaManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('product1');
  const [activePersona, setActivePersona] = useState<string | null>(null);

  // 모의 제품 데이터
  const products = [
    { id: 'product1', name: '스킨케어 세럼', category: '뷰티' },
    { id: 'product2', name: '프리미엄 차', category: '식품' },
    { id: 'product3', name: '스마트 워치', category: '전자기기' }
  ];

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">AI 페르소나 관리</h1>
          <p className="text-gray-600">중국 시장 데이터 기반으로 소비자 페르소나를 생성하고 최적의 인플루언서를 매칭하세요</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">페르소나 현황</TabsTrigger>
            <TabsTrigger value="research">시장조사</TabsTrigger>
            <TabsTrigger value="generate">AI 페르소나 생성</TabsTrigger>
            <TabsTrigger value="matching">인플루언서 매칭</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <PersonaOverview 
              products={products}
              selectedProduct={selectedProduct}
              onProductChange={setSelectedProduct}
              onPersonaSelect={setActivePersona}
            />
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            <MarketResearchCrawler 
              selectedProduct={selectedProduct}
              products={products}
              onProductChange={setSelectedProduct}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <PersonaGenerator 
              selectedProduct={selectedProduct}
              products={products}
              onProductChange={setSelectedProduct}
            />
          </TabsContent>

          <TabsContent value="matching" className="mt-6">
            <PersonaInfluencerMatcher 
              activePersona={activePersona}
              selectedProduct={selectedProduct}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrandPersonaManagement;
