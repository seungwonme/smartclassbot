
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Package, Search, Edit, Trash2, User, Globe, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brandService } from '@/services/brand.service';
import { Brand, Product } from '@/types/brand';
import { useToast } from '@/hooks/use-toast';

interface BrandManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

interface ExtendedBrand extends Brand {
  managerId: string;
  manager: BrandManager;
  status: 'active' | 'pending' | 'suspended';
}

interface ExtendedProduct extends Product {
  status: 'active' | 'pending' | 'suspended';
}

const AdminBrandManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brands, setBrands] = useState<ExtendedBrand[]>([]);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 샘플 브랜드 관리자 데이터
  const [brandManagers] = useState<BrandManager[]>([
    {
      id: '1',
      name: '김브랜드',
      email: 'brand1@example.com',
      phone: '010-1234-5678',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: '이제품',
      email: 'brand2@example.com',
      phone: '010-2345-6789',
      joinDate: '2024-02-20'
    }
  ]);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [brandsData, productsData] = await Promise.all([
          brandService.getBrands(),
          brandService.getProducts()
        ]);

        // 브랜드에 관리자 정보와 상태 추가
        const extendedBrands: ExtendedBrand[] = brandsData.map((brand, index) => ({
          ...brand,
          managerId: brandManagers[index % brandManagers.length]?.id || '1',
          manager: brandManagers[index % brandManagers.length] || brandManagers[0],
          status: 'active' as const
        }));

        // 제품에 상태 추가
        const extendedProducts: ExtendedProduct[] = productsData.map(product => ({
          ...product,
          status: 'active' as const
        }));

        setBrands(extendedBrands);
        setProducts(extendedProducts);
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
  }, [toast, brandManagers]);

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBrandProducts = selectedBrand 
    ? products.filter(product => product.brandId === selectedBrand)
    : products;

  const filteredProducts = selectedBrandProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteBrand = async (brandId: string) => {
    if (confirm('정말로 이 브랜드를 삭제하시겠습니까?')) {
      try {
        // 실제 삭제 로직은 brandService에 구현 필요
        console.log('브랜드 삭제:', brandId);
        toast({
          title: "브랜드 삭제 완료",
          description: "브랜드가 성공적으로 삭제되었습니다.",
        });
      } catch (error) {
        toast({
          title: "삭제 실패",
          description: "브랜드 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('정말로 이 제품을 삭제하시겠습니까?')) {
      try {
        // 실제 삭제 로직은 brandService에 구현 필요
        console.log('제품 삭제:', productId);
        toast({
          title: "제품 삭제 완료",
          description: "제품이 성공적으로 삭제되었습니다.",
        });
      } catch (error) {
        toast({
          title: "삭제 실패",
          description: "제품 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
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
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">브랜드 및 제품 관리</h1>
            <p className="text-gray-600 mt-2">전체 브랜드와 제품을 관리하고 새로운 항목을 추가하세요</p>
          </div>

          <Tabs defaultValue="brands" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-fit grid-cols-2 mb-6">
              <TabsTrigger value="brands" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>브랜드 관리 ({brands.length})</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>제품 관리 ({products.length})</span>
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
                <Link to="/admin/brands/create">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    브랜드 생성
                  </Button>
                </Link>
                <Link to="/admin/products/create">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    제품 생성
                  </Button>
                </Link>
              </div>
            </div>

            {/* Brand Management Tab */}
            <TabsContent value="brands" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>브랜드 목록</CardTitle>
                  <CardDescription>등록된 모든 브랜드와 브랜드 관리자 정보</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>브랜드명</TableHead>
                        <TableHead>브랜드 관리자</TableHead>
                        <TableHead>연락처</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead>캠페인</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBrands.map((brand) => (
                        <TableRow key={brand.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">{brand.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {brand.website}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-medium">{brand.manager.name}</div>
                                <div className="text-sm text-gray-500">{brand.manager.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{brand.manager.phone}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                brand.status === 'active' ? 'bg-green-100 text-green-700' :
                                brand.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }
                            >
                              {brand.status === 'active' ? '활성' : 
                               brand.status === 'pending' ? '대기' : '중단'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(brand.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                          <TableCell>
                            {(brand.activeCampaigns || 0) > 0 ? (
                              <Badge className="bg-blue-100 text-blue-700">
                                {brand.activeCampaigns}개 진행중
                              </Badge>
                            ) : (
                              <span className="text-gray-500">없음</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link to={`/admin/brands/${brand.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                상세
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Management Tab */}
            <TabsContent value="products" className="space-y-6">
              {/* Brand Filter with Dropdown */}
              <Card>
                <CardHeader>
                  <CardTitle>브랜드 선택</CardTitle>
                  <CardDescription>제품을 관리할 브랜드를 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md">
                    <Select value={selectedBrand || "all"} onValueChange={(value) => setSelectedBrand(value === "all" ? null : value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="브랜드를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>전체 제품</span>
                          </div>
                        </SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4" />
                              <span>{brand.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Product List */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    제품 목록 
                    {selectedBrand && (
                      <span className="text-green-600 ml-2">
                        - {brands.find(b => b.id === selectedBrand)?.name}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>등록된 제품 정보</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제품명</TableHead>
                        <TableHead>브랜드</TableHead>
                        <TableHead>가격</TableHead>
                        <TableHead>타겟</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead>캠페인</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.unit}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{product.brandName}</span>
                          </TableCell>
                          <TableCell>{product.price?.toLocaleString()}원</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {product.targetGender}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {product.targetAge}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                product.status === 'active' ? 'bg-green-100 text-green-700' :
                                product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }
                            >
                              {product.status === 'active' ? '활성' : 
                               product.status === 'pending' ? '대기' : '중단'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(product.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                          <TableCell>
                            {(product.activeCampaigns || 0) > 0 ? (
                              <Badge className="bg-blue-100 text-blue-700">
                                {product.activeCampaigns}개 진행중
                              </Badge>
                            ) : (
                              <span className="text-gray-500">없음</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link to={`/admin/products/${product.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                상세
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminBrandManagement;
