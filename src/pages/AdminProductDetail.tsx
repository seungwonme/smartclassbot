
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Bot, ArrowLeft, Building2, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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

interface Brand {
  id: string;
  name: string;
  manager: string;
}

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProductFormData>({
    defaultValues: {
      brandId: '1',
      purchaseUrl: 'https://example.com/product1',
      name: '프리미엄 모이스처 크림',
      unit: '50ml',
      price: '45000',
      description: '깊은 수분을 공급하는 프리미엄 모이스처 크림으로 건조한 피부에 풍부한 영양을 제공합니다.',
      ingredients: '히알루론산, 세라마이드, 펩타이드, 스쿠알란',
      usage: '세안 후 적당량을 얼굴에 발라 부드럽게 마사지해주세요.',
      effects: '24시간 지속되는 수분 공급, 탄력 개선, 주름 완화',
      usp: '특허받은 3중 히알루론산 복합체로 즉각적이고 지속적인 수분 공급',
      targetGender: '여성',
      targetAge: '30-50대'
    }
  });

  const brands: Brand[] = [
    { id: '1', name: '샘플 브랜드 A', manager: '김브랜드' },
    { id: '2', name: '샘플 브랜드 B', manager: '이제품' },
    { id: '3', name: '샘플 브랜드 C', manager: '박마케팅' }
  ];

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

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "제품이 성공적으로 수정되었습니다!",
        description: "제품 정보가 업데이트되었습니다."
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "제품 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBrand = brands.find(brand => brand.id === form.watch('brandId'));

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link to="/admin/brands">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  브랜드 관리로
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? '제품 수정' : '제품 상세'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isEditing ? '제품 정보를 수정하세요' : '제품 상세 정보를 확인하세요'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  보기 모드
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  수정 모드
                </>
              )}
            </Button>
          </div>

          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>제품 정보</CardTitle>
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
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
                                      <div className="text-sm text-gray-500">관리자: {brand.manager}</div>
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
                            <Input 
                              placeholder="https://example.com/product" 
                              {...field} 
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isEditing && (
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
                    )}
                  </div>

                  {/* 선택된 브랜드 정보 표시 */}
                  {selectedBrand && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-900">선택된 브랜드: {selectedBrand.name}</div>
                          <div className="text-sm text-blue-700">브랜드 관리자: {selectedBrand.manager}</div>
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
                            <Input 
                              placeholder="제품명을 입력하세요" 
                              {...field} 
                              disabled={!isEditing}
                            />
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
                            <Input 
                              placeholder="예: 50ml, 100g" 
                              {...field} 
                              disabled={!isEditing}
                            />
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
                            <Input 
                              placeholder="예: 25000" 
                              {...field} 
                              disabled={!isEditing}
                            />
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
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
                            <Input 
                              placeholder="예: 20-30대" 
                              {...field} 
                              disabled={!isEditing}
                            />
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        취소
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? '저장 중...' : '저장하기'}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
