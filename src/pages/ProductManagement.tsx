
import React, { useState } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  purchaseUrl: string;
  unit: string;
  price: number;
  description: string;
  ingredients: string;
  usage: string;
  effects: string;
  usp: string;
  targetGender: string;
  targetAge: string;
  activeCampaigns: number;
}

const ProductManagement = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      brandId: '1',
      brandName: '샘플 브랜드 A',
      name: '프리미엄 립스틱',
      purchaseUrl: 'https://example.com/product1',
      unit: '3.5g',
      price: 25000,
      description: '촉촉한 발색의 프리미엄 립스틱',
      ingredients: '비즈왁스, 호호바오일, 비타민E',
      usage: '입술에 직접 발라주세요',
      effects: '8시간 지속, 촉촉함 유지',
      usp: '특허 성분으로 24시간 색상 지속',
      targetGender: '여성',
      targetAge: '20-40대',
      activeCampaigns: 1
    },
    {
      id: '2',
      brandId: '1',
      brandName: '샘플 브랜드 A',
      name: '모이스처 파운데이션',
      purchaseUrl: 'https://example.com/product2',
      unit: '30ml',
      price: 35000,
      description: '수분 가득한 커버 파운데이션',
      ingredients: '히알루론산, 콜라겐, 나이아신아마이드',
      usage: '소량을 얼굴에 발라 펴주세요',
      effects: '12시간 무너지지 않는 커버력',
      usp: '무너지지 않는 워터프루프 기능',
      targetGender: '여성',
      targetAge: '20-50대',
      activeCampaigns: 0
    }
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">제품 관리</h1>
              <p className="text-gray-600 mt-2">브랜드별 제품을 관리하세요</p>
            </div>
            <Link to="/brand/products/create-product">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                새 제품 등록
              </Button>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <span className="text-lg">{product.name}</span>
                    </CardTitle>
                    {product.activeCampaigns > 0 && (
                      <Badge className="bg-blue-100 text-blue-700">
                        {product.activeCampaigns}개 진행중
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    <span className="text-green-600 font-medium">{product.brandName}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">판매가</span>
                      <span className="font-semibold text-lg">{product.price.toLocaleString()}원</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">용량/사이즈</span>
                      <span className="text-sm">{product.unit}</span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">타겟</p>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {product.targetGender}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {product.targetAge}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                    <div className="flex gap-2 pt-2">
                      <Link to={`/brand/products/product/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-3 w-3 mr-1" />
                          수정
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        disabled={product.activeCampaigns > 0}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 제품이 없습니다</h3>
                  <p className="text-gray-600 mb-6">첫 번째 제품을 등록해보세요</p>
                  <Link to="/brand/products/create-product">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      제품 등록하기
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
