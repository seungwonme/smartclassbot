
import React, { useState } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Plus, Globe, Package, ShoppingBag, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Brand {
  id: string;
  name: string;
  website: string;
  story: string;
  products: string[];
  channels: string[];
  marketing: string;
  socialChannels: string[];
  activeCampaigns: number;
}

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

const BrandProducts = () => {
  const [activeTab, setActiveTab] = useState<'brands' | 'products'>('brands');
  const [searchTerm, setSearchTerm] = useState('');

  const [brands] = useState<Brand[]>([
    {
      id: '1',
      name: '샘플 브랜드 A',
      website: 'https://example-a.com',
      story: '혁신적인 뷰티 브랜드입니다.',
      products: ['립스틱', '파운데이션', '아이섀도'],
      channels: ['네이버 스마트스토어', '쿠팡', '올리브영'],
      marketing: 'SNS 마케팅 중심',
      socialChannels: ['Instagram', 'YouTube'],
      activeCampaigns: 2
    },
    {
      id: '2',
      name: '샘플 브랜드 B',
      website: 'https://example-b.com',
      story: '친환경 라이프스타일 브랜드입니다.',
      products: ['세제', '샴푸', '바디워시'],
      channels: ['자사몰', '마켓컬리'],
      marketing: '인플루언서 마케팅',
      socialChannels: ['Instagram', 'TikTok'],
      activeCampaigns: 0
    }
  ]);

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

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">브랜드 관리</h1>
            <p className="text-gray-600 mt-2">브랜드와 제품을 관리하고 새로운 항목을 추가하세요</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-6">
            <Link to="/brand/products/create">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                브랜드 생성
              </Button>
            </Link>
            <Link to="/brand/products/create-product">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                제품 생성
              </Button>
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'brands'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>브랜드 ({brands.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>제품 ({products.length})</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content */}
          {activeTab === 'brands' ? (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                등록된 브랜드를 관리하세요
              </div>

              {filteredBrands.length === 0 ? (
                <Card className="p-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">브랜드가 없습니다</h3>
                  <p className="text-gray-600 mb-6">첫 번째 브랜드를 생성해보세요</p>
                  <Link to="/brand/products/create">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      브랜드 생성하기
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrands.map((brand) => (
                    <Card key={brand.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <Link to={`/brand/products/${brand.id}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2">
                              <Building2 className="h-5 w-5 text-green-600" />
                              <span>{brand.name}</span>
                            </CardTitle>
                            {brand.activeCampaigns > 0 && (
                              <Badge className="bg-blue-100 text-blue-700">
                                {brand.activeCampaigns}개 진행중
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center space-x-1">
                            <Globe className="h-4 w-4" />
                            <span className="truncate">{brand.website}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.story}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">대표 제품</p>
                              <div className="flex flex-wrap gap-1">
                                {brand.products.slice(0, 3).map((product, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {product}
                                  </Badge>
                                ))}
                                {brand.products.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{brand.products.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">판매 채널</p>
                              <div className="flex flex-wrap gap-1">
                                {brand.channels.slice(0, 2).map((channel, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700">
                                    {channel}
                                  </Badge>
                                ))}
                                {brand.channels.length > 2 && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                    +{brand.channels.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                등록된 제품을 관리하세요
              </div>

              {filteredProducts.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;
