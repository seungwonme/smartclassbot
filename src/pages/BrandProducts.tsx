
import React, { useState, useEffect } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building2, Plus, Globe, Package, ShoppingBag, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brandService } from '@/services/brand.service';
import { Brand, Product } from '@/types/brand';
import { useToast } from '@/hooks/use-toast';

const BrandProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [brandsData, productsData] = await Promise.all([
          brandService.getBrands(),
          brandService.getProducts()
        ]);

        setBrands(brandsData);
        setProducts(productsData);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        toast({
          title: "데이터 로드 실패",
          description: "브랜드 및 제품 데이터를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <BrandSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">데이터 로딩 중...</div>
            <div className="text-gray-600">브랜드 및 제품 정보를 불러오고 있습니다.</div>
          </div>
        </div>
      </div>
    );
  }

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

          <Tabs defaultValue="brands" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-fit grid-cols-2 mb-6">
              <TabsTrigger value="brands" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>브랜드 ({brands.length})</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>제품 ({products.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-4">
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
            </div>

            {/* Brand Tab Content */}
            <TabsContent value="brands" className="space-y-6">
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
                            {(brand.activeCampaigns || 0) > 0 && (
                              <Badge className="bg-blue-100 text-blue-700">
                                {brand.activeCampaigns}개 진행중
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center space-x-1">
                            <Globe className="h-4 w-4" />
                            <span className="truncate">{brand.website || 'N/A'}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.story || brand.description}</p>
                          
                          <div className="space-y-3">
                            {brand.channels && brand.channels.length > 0 && (
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
                            )}
                            
                            {brand.socialChannels && brand.socialChannels.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">소셜 채널</p>
                                <div className="flex flex-wrap gap-1">
                                  {brand.socialChannels.slice(0, 3).map((channel, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {channel}
                                    </Badge>
                                  ))}
                                  {brand.socialChannels.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{brand.socialChannels.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Product Tab Content */}
            <TabsContent value="products" className="space-y-6">
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
                    <Link key={product.id} to={`/brand/products/product/${product.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2">
                              <Package className="h-5 w-5 text-green-600" />
                              <span className="text-lg">{product.name}</span>
                            </CardTitle>
                            {(product.activeCampaigns || 0) > 0 && (
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
                            {product.price && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">판매가</span>
                                <span className="font-semibold text-lg">{product.price.toLocaleString()}원</span>
                              </div>
                            )}
                            
                            {product.unit && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">용량/사이즈</span>
                                <span className="text-sm">{product.unit}</span>
                              </div>
                            )}

                            {(product.targetGender || product.targetAge) && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">타겟</p>
                                <div className="flex gap-1">
                                  {product.targetGender && (
                                    <Badge variant="outline" className="text-xs">
                                      {product.targetGender}
                                    </Badge>
                                  )}
                                  {product.targetAge && (
                                    <Badge variant="outline" className="text-xs">
                                      {product.targetAge}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;
