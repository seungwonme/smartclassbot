
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Users, TrendingUp, Target } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
}

interface PersonaOverviewProps {
  products: Product[];
  selectedProduct: string;
  onProductChange: (productId: string) => void;
  onPersonaSelect: (personaId: string) => void;
}

const PersonaOverview: React.FC<PersonaOverviewProps> = ({
  products,
  selectedProduct,
  onProductChange,
  onPersonaSelect
}) => {
  // 모의 페르소나 데이터
  const mockPersonas = [
    {
      id: 'persona1',
      name: '젊은 뷰티 관심족',
      age: '22-28세',
      platform: '샤오홍슈',
      confidence: 92,
      status: 'active',
      description: '뷰티 트렌드에 민감한 젊은 여성층'
    },
    {
      id: 'persona2', 
      name: '프리미엄 추구층',
      age: '30-35세',
      platform: '도우인',
      confidence: 87,
      status: 'active',
      description: '품질과 브랜드를 중시하는 중산층'
    },
    {
      id: 'persona3',
      name: '가성비 중시층',
      age: '25-32세',
      platform: '티몰',
      confidence: 78,
      status: 'pending',
      description: '합리적 소비를 추구하는 실용주의자'
    }
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      {/* 제품 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            제품 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProduct} onValueChange={onProductChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="분석할 제품을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 페르소나 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPersonas.map((persona) => (
          <Card key={persona.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{persona.name}</CardTitle>
                <Badge variant={persona.status === 'active' ? 'default' : 'secondary'}>
                  {persona.status === 'active' ? '활성' : '대기'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {persona.age}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Brain className="w-4 h-4" />
                주 플랫폼: {persona.platform}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                신뢰도: {persona.confidence}%
              </div>

              <p className="text-sm text-gray-700">{persona.description}</p>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onPersonaSelect(persona.id)}
                >
                  상세보기
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onPersonaSelect(persona.id)}
                >
                  매칭하기
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페르소나 생성 유도 */}
      {mockPersonas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">페르소나가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              {selectedProductData?.name}에 대한 소비자 페르소나를 생성해보세요
            </p>
            <Button>
              AI 페르소나 생성 시작하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaOverview;
