
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';

interface PersonaGeneratorProps {
  selectedBrand: string;
  selectedProduct: string;
  brands: BrandType[];
  products: ProductType[];
  savedReports: any[];
  onPersonaGenerated: (personaData: any) => void;
  savedPersonas: any[];
}

const PersonaGenerator: React.FC<PersonaGeneratorProps> = ({
  selectedBrand,
  selectedProduct,
  brands,
  products,
  savedReports,
  onPersonaGenerated,
  savedPersonas
}) => {
  const { toast } = useToast();
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<any>(null);

  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  const handleGeneratePersona = async () => {
    if (!selectedBrand || !selectedProduct) {
      toast({
        title: "브랜드와 제품을 선택해주세요",
        description: "페르소나 생성을 위해 브랜드와 제품을 모두 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (savedReports.length === 0) {
      toast({
        title: "시장조사 데이터가 필요합니다",
        description: "먼저 시장조사를 완료해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);
    setGenerationCompleted(false);

    // 시뮬레이션: AI 페르소나 생성 과정
    const steps = [
      "시장조사 데이터 분석 중...",
      "소비자 행동 패턴 파악 중...",
      "페르소나 프로필 생성 중...",
      "매칭 플랫폼 분석 중...",
      "최종 페르소나 완성 중..."
    ];

    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerateProgress(i);
    }

    const personaData = {
      id: `persona_${Date.now()}`,
      name: "리우 샤오메이",
      brandId: selectedBrand,
      productId: selectedProduct,
      brandName: selectedBrandData?.name,
      productName: selectedProductData?.name,
      demographics: {
        age: "25-30세",
        gender: "여성",
        location: "상하이, 베이징",
        income: "중상위층"
      },
      platforms: ["샤오홍슈", "도우인"],
      interests: ["뷰티", "라이프스타일", "건강"],
      description: "중국 시장 데이터 기반으로 생성된 타겟 페르소나",
      confidence: 92,
      completedAt: new Date().toISOString()
    };

    setCurrentPersona(personaData);
    setGenerationCompleted(true);
    setIsGenerating(false);
    
    toast({
      title: "AI 페르소나 생성 완료",
      description: "중국 시장 데이터 기반 소비자 페르소나가 생성되었습니다.",
    });
  };

  return (
    <div className="space-y-6">
      {/* 브랜드 및 제품 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI 페르소나 생성 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">브랜드 선택</label>
              <Select value={selectedBrand} onValueChange={() => {}}>
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
              <Select value={selectedProduct} onValueChange={() => {}}>
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
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700">
                <strong>페르소나 생성 대상:</strong> {selectedBrandData?.name} - {selectedProductData?.name}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                시장조사 데이터를 기반으로 최적화된 소비자 페르소나를 생성합니다
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 페르소나 생성 실행 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI 페르소나 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI 페르소나 생성 진행률</span>
                <span>{generateProgress}%</span>
              </div>
              <Progress value={generateProgress} />
              <div className="text-sm text-gray-600 text-center">
                중국 시장 데이터를 분석하여 최적의 페르소나를 생성하고 있습니다...
              </div>
            </div>
          )}

          <Button 
            onClick={handleGeneratePersona}
            disabled={isGenerating || !selectedBrand || !selectedProduct || savedReports.length === 0}
            className="w-full"
          >
            {isGenerating ? 'AI 페르소나 생성 중...' : '페르소나 생성하기'}
          </Button>
        </CardContent>
      </Card>

      {/* 생성된 페르소나 미리보기 */}
      {generationCompleted && currentPersona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>생성된 페르소나</span>
              <Badge variant="outline" className="ml-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">{currentPersona.name}</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>연령:</strong> {currentPersona.demographics.age}</div>
                  <div><strong>성별:</strong> {currentPersona.demographics.gender}</div>
                  <div><strong>지역:</strong> {currentPersona.demographics.location}</div>
                  <div><strong>소득:</strong> {currentPersona.demographics.income}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <strong className="text-sm">주요 플랫폼:</strong>
                  <div className="flex gap-2 mt-1">
                    {currentPersona.platforms.map((platform: string, index: number) => (
                      <Badge key={index} variant="secondary">{platform}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="text-sm">관심사:</strong>
                  <div className="flex gap-2 mt-1">
                    {currentPersona.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm">
                  <strong>신뢰도:</strong> {currentPersona.confidence}%
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  onPersonaGenerated(currentPersona);
                  toast({
                    title: "페르소나 저장 완료",
                    description: "인플루언서 매칭을 진행할 수 있습니다.",
                  });
                }}
              >
                페르소나 저장하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 저장된 페르소나 목록 */}
      {savedPersonas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>저장된 페르소나</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedPersonas.map((persona, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{persona.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(persona.completedAt).toLocaleDateString('ko-KR')} - 신뢰도: {persona.confidence}%
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaGenerator;
