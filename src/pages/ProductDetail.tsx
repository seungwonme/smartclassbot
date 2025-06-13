
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // 임시 제품 데이터
  const productData = {
    id: '1',
    brandId: '1',
    brandName: '샘플 브랜드 A',
    purchaseUrl: 'https://example.com/product1',
    name: '프리미엄 립스틱',
    unit: '3.5g',
    price: '25000',
    description: '촉촉한 발색의 프리미엄 립스틱',
    ingredients: '비즈왁스, 호호바오일, 비타민E',
    usage: '입술에 직접 발라주세요',
    effects: '8시간 지속, 촉촉함 유지',
    usp: '특허 성분으로 24시간 색상 지속',
    targetGender: '여성',
    targetAge: '20-40대',
    activeCampaigns: 1
  };

  const form = useForm<ProductFormData>({
    defaultValues: {
      brandId: productData.brandId,
      purchaseUrl: productData.purchaseUrl,
      name: productData.name,
      unit: productData.unit,
      price: productData.price,
      description: productData.description,
      ingredients: productData.ingredients,
      usage: productData.usage,
      effects: productData.effects,
      usp: productData.usp,
      targetGender: productData.targetGender,
      targetAge: productData.targetAge
    }
  });

  // 임시 브랜드 데이터
  const brands = [
    { id: '1', name: '샘플 브랜드 A' },
    { id: '2', name: '샘플 브랜드 B' }
  ];

  const onSubmit = (data: ProductFormData) => {
    console.log('제품 수정:', data);
    alert('제품 정보가 성공적으로 수정되었습니다!');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (productData.activeCampaigns > 0) {
      alert('진행 중인 캠페인이 있어 삭제할 수 없습니다.');
      return;
    }
    
    if (confirm('정말로 이 제품을 삭제하시겠습니까?')) {
      console.log('제품 삭제:', id);
      alert('제품이 성공적으로 삭제되었습니다!');
      navigate('/brand/products/manage');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link to="/brand/products/manage">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로가기
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">제품 상세</h1>
                <p className="text-gray-600 mt-2">{productData.brandName} - {productData.name}</p>
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  disabled={productData.activeCampaigns > 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            )}
          </div>

          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>{isEditing ? '제품 정보 수정' : '제품 정보'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* 브랜드 및 구매링크 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>브랜드</FormLabel>
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
                                  {brand.name}
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
                          <FormLabel>구매 링크 URL</FormLabel>
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
                  </div>

                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>제품명</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="제품명을 입력하세요" 
                              {...field} 
                              disabled={true} // 제품명은 항상 비활성화
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
                          <FormLabel>용량/사이즈 등 판매단위</FormLabel>
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
                          <FormLabel>정상판매가</FormLabel>
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
                          <FormLabel>타겟 성별</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="targetAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>타겟 연령</FormLabel>
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

                  {/* 상세 정보 */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제품 기본정보</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="제품 설명을 입력하세요"
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
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>성분 및 재질</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="주요 성분을 입력하세요"
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
                    name="usage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사용법</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="제품 사용법을 입력하세요"
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
                    name="effects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>효과</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="제품 효과를 입력하세요"
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
                    name="usp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제품 USP (차별점)</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="특허성분, 디자인 등 경쟁 제품과의 차별점을 입력하세요"
                            {...field}
                            disabled={!isEditing}
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
                      <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                        저장하기
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

export default ProductDetail;
