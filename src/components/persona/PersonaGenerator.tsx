import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Eye, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MarketInsightComparison from './MarketInsightComparison';
import PersonaValidation from './PersonaValidation';

interface Brand {
  id: string;
  name: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  brandId: string;
}

interface PersonaGeneratorProps {
  selectedBrand: string;
  selectedProduct: string;
  brands: Brand[];
  products: Product[];
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
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPersonas, setGeneratedPersonas] = useState<any[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);

  // 선택된 브랜드와 제품에 해당하는 리포트 필터링
  const filteredReports = savedReports.filter(report => 
    report.brandId === selectedBrand && report.productId === selectedProduct
  );

  // 모의 AI 생성 페르소나 데이터
  const mockGeneratedPersonas = [
    {
      id: 'ai-persona-1',
      name: '젊은 뷰티 얼리어답터',
      confidence: 94,
      demographics: {
        age: '22-28세',
        gender: '여성',
        location: '1-2선 도시',
        income: '월 8,000-15,000위안'
      },
      psychographics: {
        interests: ['뷰티', '트렌드', '소셜미디어', 'K-뷰티'],
        personality: '새로운 것을 시도하기 좋아함, 브랜드 충성도 높음',
        values: '개성 표현, 품질 추구'
      },
      platforms: ['샤오홍슈', '도우인'],
      insights: [
        '한국 뷰티 제품에 대한 관심도가 매우 높음',
        '성분과 효과에 대해 꼼꼼히 조사함',
        '인플루언서의 리뷰를 신뢰함'
      ],
      marketData: {
        searchVolume: 45000,
        engagement: '8.2%',
        conversionRate: '3.1%'
      }
    },
    {
      id: 'ai-persona-2',
      name: '실용적 중산층 소비자',
      confidence: 89,
      demographics: {
        age: '30-38세',
        gender: '여성',
        location: '2-3선 도시',
        income: '월 12,000-25,000위안'
      },
      psychographics: {
        interests: ['가족', '실용성', '가성비', '건강'],
        personality: '신중한 구매 결정, 리뷰 중시',
        values: '가족 우선, 합리적 소비'
      },
      platforms: ['티몰', '타오바오', '바이두'],
      insights: [
        '가격 대비 효과를 중요하게 생각함',
        '다른 사용자들의 후기를 많이 참고함',
        '할인 프로모션에 민감함'
      ],
      marketData: {
        searchVolume: 32000,
        engagement: '6.8%',
        conversionRate: '4.2%'
      }
    },
    {
      id: 'ai-persona-3',
      name: '프리미엄 추구 고소득층',
      confidence: 91,
      demographics: {
        age: '28-35세',
        gender: '여성',
        location: '1선 도시',
        income: '월 20,000위안 이상'
      },
      psychographics: {
        interests: ['럭셔리', '프리미엄 뷰티', '라이프스타일', '여행'],
        personality: '브랜드 지향적, 품질 추구',
        values: '자기 투자, 삶의 질'
      },
      platforms: ['샤오홍슈', '위챗'],
      insights: [
        '브랜드 스토리와 가치를 중시함',
        '프리미엄 포장과 디자인을 선호함',
        '개인 맞춤형 서비스를 기대함'
      ],
      marketData: {
        searchVolume: 18000,
        engagement: '12.4%',
        conversionRate: '5.8%'
      }
    }
  ];

  const handleGeneratePersonas = async () => {
    if (!selectedReport) {
      toast({
        title: "시장조사 리포트를 선택해주세요",
        description: "페르소나 생성을 위해 먼저 시장조사 리포트를 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // AI 생성 시뮬레이션
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(i);
    }

    setGeneratedPersonas(mockGeneratedPersonas);
    setIsGenerating(false);
    
    toast({
      title: "AI 페르소나 생성 완료",
      description: `${mockGeneratedPersonas.length}개의 페르소나 후보가 생성되었습니다.`,
    });
  };

  const handleSavePersona = (persona: any) => {
    const savedPersona = {
      ...persona,
      id: Date.now().toString(),
      brandId: selectedBrand,
      productId: selectedProduct,
      createdAt: new Date().toISOString(),
    };

    onPersonaGenerated(savedPersona);
    
    toast({
      title: "페르소나 저장 완료",
      description: `${persona.name} 페르소나가 저장되었습니다.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* 시장조사 리포트 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            시장조사 리포트 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">저장된 시장조사 리포트</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="시장조사 리포트를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {filteredReports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredReports.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                선택된 브랜드와 제품에 대한 시장조사 리포트가 없습니다. 먼저 시장조사를 진행해주세요.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI 페르소나 생성 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI 페르소나 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI 분석 진행률</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} />
              <div className="text-sm text-gray-600 text-center">
                시장조사 데이터를 분석하여 페르소나를 생성하고 있습니다...
              </div>
            </div>
          )}

          <Button 
            onClick={handleGeneratePersonas}
            disabled={isGenerating || !selectedReport}
            className="w-full"
          >
            {isGenerating ? 'AI 분석 중...' : 'AI 페르소나 생성 시작'}
          </Button>
        </CardContent>
      </Card>

      {/* 생성된 페르소나 목록 */}
      {generatedPersonas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">생성된 페르소나 후보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedPersonas.map((persona) => (
              <Card 
                key={persona.id}
                className={`cursor-pointer transition-all ${
                  selectedPersona?.id === persona.id ? 'ring-2 ring-green-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPersona(persona)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{persona.name}</CardTitle>
                    <Badge variant="outline">
                      신뢰도 {persona.confidence}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {persona.demographics.age} • {persona.demographics.location}
                  </div>
                  <div className="text-sm">
                    주 플랫폼: {persona.platforms.join(', ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    월 검색량: {persona.marketData.searchVolume.toLocaleString()}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePersona(persona);
                    }}
                    className="w-full mt-2"
                  >
                    페르소나 저장
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 페르소나 상세 분석 */}
      {selectedPersona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              페르소나 상세 분석 및 조정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">상세 정보</TabsTrigger>
                <TabsTrigger value="comparison">시장 비교</TabsTrigger>
                <TabsTrigger value="validation">검증 및 조정</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">인구통계학적 특성</h4>
                    <div className="space-y-2 text-sm">
                      <div>연령: {selectedPersona.demographics.age}</div>
                      <div>성별: {selectedPersona.demographics.gender}</div>
                      <div>지역: {selectedPersona.demographics.location}</div>
                      <div>소득: {selectedPersona.demographics.income}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">심리통계학적 특성</h4>
                    <div className="space-y-2 text-sm">
                      <div>관심사: {selectedPersona.psychographics.interests.join(', ')}</div>
                      <div>성격: {selectedPersona.psychographics.personality}</div>
                      <div>가치관: {selectedPersona.psychographics.values}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">주요 인사이트</h4>
                  <ul className="space-y-2">
                    {selectedPersona.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="comparison">
                <MarketInsightComparison persona={selectedPersona} />
              </TabsContent>

              <TabsContent value="validation">
                <PersonaValidation 
                  persona={selectedPersona}
                  onPersonaUpdate={setSelectedPersona}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaGenerator;
