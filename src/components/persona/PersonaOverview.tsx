
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Brain, Users, TrendingUp, Target, Trash } from 'lucide-react';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';

interface PersonaOverviewProps {
  brands: BrandType[];
  products: ProductType[];
  selectedBrand: string;
  selectedProduct: string;
  onBrandChange: (brandId: string) => void;
  onProductChange: (productId: string) => void;
  onPersonaSelect: (personaId: string) => void;
  onPersonaDelete?: (personaId: string, personaName: string) => void;
  savedPersonas: any[];
}

const PersonaOverview: React.FC<PersonaOverviewProps> = ({
  brands,
  products,
  selectedBrand,
  selectedProduct,
  onBrandChange,
  onProductChange,
  onPersonaSelect,
  onPersonaDelete,
  savedPersonas
}) => {
  const [deletingPersonaId, setDeletingPersonaId] = useState<string | null>(null);

  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);
  const filteredProducts = selectedBrand 
    ? products.filter(product => product.brandId === selectedBrand)
    : [];

  const handleDeletePersona = (personaId: string, personaName: string) => {
    console.log('🗑️ 페르소나 삭제 요청:', { personaId, personaName });
    if (onPersonaDelete) {
      onPersonaDelete(personaId, personaName);
    }
    setDeletingPersonaId(null);
  };

  return (
    <div className="space-y-6">
      {/* 브랜드 및 제품 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            브랜드 및 제품 선택
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
                      {brand.name}
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
                  {filteredProducts.map((product) => (
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

      {/* 저장된 페르소나 현황 */}
      {savedPersonas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPersonas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{persona.name}</CardTitle>
                  <Badge variant="default">활성</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {persona.demographics?.age || '연령대 정보 없음'}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="w-4 h-4" />
                  주 플랫폼: {persona.platforms?.join(', ') || '플랫폼 정보 없음'}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  신뢰도: {persona.confidence || 90}%
                </div>

                <p className="text-sm text-gray-700">
                  {persona.description || '중국 시장 데이터 기반으로 생성된 페르소나'}
                </p>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onPersonaSelect(persona.id)}
                    className="flex-1"
                  >
                    상세보기
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="flex items-center gap-1"
                        onClick={() => setDeletingPersonaId(persona.id)}
                      >
                        <Trash className="w-3 h-3" />
                        삭제
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>페르소나 삭제 확인</AlertDialogTitle>
                        <AlertDialogDescription>
                          정말로 "{persona.name || '이름 없는 페르소나'}" 페르소나를 삭제하시겠습니까?
                          <br />
                          <span className="text-red-600 font-medium">이 작업은 되돌릴 수 없습니다.</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePersona(persona.id, persona.name || '이름 없는 페르소나')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          삭제하기
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">생성된 페르소나가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              {selectedBrandData && selectedProductData
                ? `${selectedBrandData.name} - ${selectedProductData.name}에 대한 소비자 페르소나를 생성해보세요`
                : '브랜드와 제품을 선택한 후 소비자 페르소나를 생성해보세요'
              }
            </p>
            <Button disabled={!selectedBrand || !selectedProduct}>
              AI 페르소나 생성 시작하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaOverview;
