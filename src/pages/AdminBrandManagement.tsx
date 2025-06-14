
import React, { useState } from 'react';
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

interface BrandManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

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
  managerId: string;
  manager: BrandManager;
  createdAt: string;
  status: 'active' | 'pending' | 'suspended';
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
  createdAt: string;
  status: 'active' | 'pending' | 'suspended';
}

const AdminBrandManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

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

  // 샘플 브랜드 데이터
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
      activeCampaigns: 2,
      managerId: '1',
      manager: brandManagers[0],
      createdAt: '2024-03-01',
      status: 'active'
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
      activeCampaigns: 0,
      managerId: '2',
      manager: brandManagers[1],
      createdAt: '2024-03-15',
      status: 'active'
    }
  ]);

  // 샘플 제품 데이터
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
      activeCampaigns: 1,
      createdAt: '2024-03-10',
      status: 'active'
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
      activeCampaigns: 0,
      createdAt: '2024-03-20',
      status: 'active'
    }
  ]);

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

  const handleDeleteBrand = (brandId: string) => {
    if (confirm('정말로 이 브랜드를 삭제하시겠습니까?')) {
      console.log('브랜드 삭제:', brandId);
      // 실제 삭제 로직 구현
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('정말로 이 제품을 삭제하시겠습니까?')) {
      console.log('제품 삭제:', productId);
      // 실제 삭제 로직 구현
    }
  };

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
                          <TableCell>{brand.createdAt}</TableCell>
                          <TableCell>
                            {brand.activeCampaigns > 0 ? (
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
                          <TableCell>{product.price.toLocaleString()}원</TableCell>
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
                          <TableCell>{product.createdAt}</TableCell>
                          <TableCell>
                            {product.activeCampaigns > 0 ? (
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
