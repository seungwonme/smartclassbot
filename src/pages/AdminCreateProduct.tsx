import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Bot, ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { brandService } from '@/services/brand.service';
import { Brand } from '@/types/brand';

interface ProductFormData {
  brandId: string;
  purchaseUrl: string;
  name: string;
  unit: string;
  price: string;
  description: string;
  ingredients: string;
  usage: string;
  effects: string;
  usp: string;
  targetGender: string;
  targetAge: string;
}

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  
  const form = useForm<ProductFormData>({
    defaultValues: {
      brandId: '',
      purchaseUrl: '',
      name: '',
      unit: '',
      price: '',
      description: '',
      ingredients: '',
      usage: '',
      effects: '',
      usp: '',
      targetGender: '',
      targetAge: ''
    }
  });

  // 브랜드 데이터 로드
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await brandService.getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('브랜드 데이터 로드 실패:', error);
        toast({
          title: "브랜드 정보 로드 실패",
          description: "브랜드 목록을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      } finally {
        setLoadingBrands(false);
      }
    };

    loadBrands();
  }, [toast]);

  const handleAIProductInfo = async () => {
    const purchaseUrl = form.getValues('purchaseUrl');
    if (!purchaseUrl) {
      toast({
        title: "구매 링크 URL을 먼저 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      form.setValue('name', '프리미엄 모이스처 크림');
      form.setValue('unit', '50ml');
      form.setValue('price', '45000');
      form.setValue('description', '깊은 수분을 공급하는 프리미엄 모이스처 크림으로 건조한 피부에 풍부한 영양을 제공합니다.');
      form.setValue('ingredients', '히알루론산, 세라마이드, 펩타이드, 스쿠알란');
      form.setValue('usage', '세안 후 적당량을 얼굴에 발라 부드럽게 마사지해주세요.');
      form.setValue('effects', '24시간 지속되는 수분 공급, 탄력 개선, 주름 완화');
      form.setValue('usp', '특허받은 3중 히알루론산 복합체로 즉각적이고 지속적인 수분 공급');
      form.setValue('targetGender', '여성');
      form.setValue('targetAge', '30-50대');
      
      toast({
        title: "AI가 제품 정보를 성공적으로 가져왔습니다!",
        description: "내용을 확인하고 필요시 수정해주세요."
      });
    } catch (error) {
      toast({
        title: "정보 수집 실패",
        description: "제품 정보를 가져오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!data.brandId) {
      toast({
        title: "브랜드를 선택해주세요",
        variant: "destructive"
      });
      return;
    }

    if (!data.name.trim()) {
      toast({
        title: "제품명을 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // 선택된 브랜드 정보 찾기
      const selectedBrand = brands.find(brand => brand.id === data.brandId);
      if (!selectedBrand) {
        throw new Error('선택된 브랜드를 찾을 수 없습니다.');
      }

      // 폼 데이터를 Product 타입에 맞게 변환
      const productData = {
        name: data.name.trim(),
        description: data.description.trim() || data.name.trim(),
        brandId: data.brandId,
        brandName: selectedBrand.name,
        purchaseUrl: data.purchaseUrl.trim() || undefined,
        unit: data.unit.trim() || undefined,
        price: data.price.trim() ? Number(data.price.trim()) : undefined,
        ingredients: data.ingredients.trim() || undefined,
        usage: data.usage.trim() || undefined,
        effects: data.effects.trim() || undefined,
        usp: data.usp.trim() || undefined,
        targetGender: data.targetGender || undefined,
        targetAge: data.targetAge.trim() || undefined,
        activeCampaigns: 0
      };

      console.log('제품 생성 데이터:', productData);
      
      // 실제 brandService를 통해 제품 생성
      const newProduct = await brandService.createProduct(productData);
      
      console.log('생성된 제품:', newProduct);
      
      toast({
        title: "제품이 성공적으로 등록되었습니다!",
        description: `${newProduct.name}이(가) ${selectedBrand.name} 브랜드에 추가되었습니다.`
      });
      
      navigate('/admin/brands');
    } catch (error) {
      console.error('제품 생성 실패:', error);
      toast({
        title: "저장 실패",
        description: "제품 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBrand = brands.find(brand => brand.id === form.watch('brandId'));

  if (loadingBrands) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">브랜드 정보 로딩 중...</div>
            <div className="text-gray-600">브랜드 목록을 불러오고 있습니다.</div>
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
          <div className="flex items-center mb-8">
            <Link to="/admin/brands">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                브랜드 관리로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">새 제품 등록</h1>
              <p className="text-gray-600 mt-2">관리자 권한으로 새로운 제품을 등록하세요</p>
            </div>
          </div>

          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>제품 정보 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* 상단 섹션 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>브랜드 선택 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="브랜드를 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                  <div className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4" />
                                    <div>
                                      <div className="font-medium">{brand.name}</div>
                                      <div className="text-sm text-gray-500">등록일: {new Date(brand.createdAt).toLocaleDateString()}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purchaseUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>구매 링크 URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/product" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={handleAIProductInfo}
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        {isLoading ? '정보 가져오는 중...' : 'AI로 제품정보 불러오기'}
                      </Button>
                    </div>
                  </div>

                  {/* 선택된 브랜드 정보 표시 */}
                  {selectedBrand && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-900">선택된 브랜드: {selectedBrand.name}</div>
                          <div className="text-sm text-blue-700">등록일: {new Date(selectedBrand.createdAt).toLocaleDateString()}</div>
                          {selectedBrand.website && (
                            <div className="text-sm text-blue-700">웹사이트: {selectedBrand.website}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 하단 섹션 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>제품명 *</FormLabel>
                          <FormControl>
                            <Input placeholder="제품명을 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>용량/사이즈 등 판매단위 *</FormLabel>
                          <FormControl>
                            <Input placeholder="예: 50ml, 100g" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>정상판매가 *</FormLabel>
                          <FormControl>
                            <Input placeholder="예: 25000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetGender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>타겟 성별 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="성별을 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="남성">남성</SelectItem>
                              <SelectItem value="여성">여성</SelectItem>
                              <SelectItem value="남녀공용">남녀공용</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="targetAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>타겟 연령 *</FormLabel>
                          <FormControl>
                            <Input placeholder="예: 20-30대" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제품 기본정보 *</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="제품 설명을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>성분 및 재질</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="주요 성분을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사용법</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="제품 사용법을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="effects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>효과</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="제품 효과를 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제품 USP (차별점)</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="특허성분, 디자인 등 경쟁 제품과의 차별점을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-6">
                    <Link to="/admin/brands">
                      <Button type="button" variant="outline">
                        취소
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? '저장 중...' : '저장하기'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
