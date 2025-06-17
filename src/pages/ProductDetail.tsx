
import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { brandService } from '@/services/brand.service';
import { Brand, Product } from '@/types/brand';

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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
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

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        toast({
          title: "잘못된 접근",
          description: "제품 ID가 없습니다.",
          variant: "destructive"
        });
        navigate('/brand/products');
        return;
      }

      setLoading(true);
      try {
        const [productData, brandsData] = await Promise.all([
          brandService.getProductById(id),
          brandService.getBrands()
        ]);

        if (!productData) {
          toast({
            title: "제품을 찾을 수 없습니다",
            description: "요청한 제품이 존재하지 않습니다.",
            variant: "destructive"
          });
          navigate('/brand/products');
          return;
        }

        setProduct(productData);
        setBrands(brandsData);

        // 폼에 데이터 설정
        form.reset({
          brandId: productData.brandId,
          purchaseUrl: productData.purchaseUrl || '',
          name: productData.name,
          unit: productData.unit || '',
          price: productData.price?.toString() || '',
          description: productData.description,
          ingredients: productData.ingredients || '',
          usage: productData.usage || '',
          effects: productData.effects || '',
          usp: productData.usp || '',
          targetGender: productData.targetGender || '',
          targetAge: productData.targetAge || ''
        });

      } catch (error) {
        console.error('데이터 로드 실패:', error);
        toast({
          title: "데이터 로드 실패",
          description: "제품 정보를 불러오는데 실패했습니다.",
          variant: "destructive"
        });
        navigate('/brand/products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, toast, navigate, form]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;

    setIsUpdating(true);
    try {
      // 선택된 브랜드 정보 찾기
      const selectedBrand = brands.find(brand => brand.id === data.brandId);
      if (!selectedBrand) {
        throw new Error('선택된 브랜드를 찾을 수 없습니다.');
      }

      // 업데이트할 데이터 준비
      const updateData = {
        brandId: data.brandId,
        brandName: selectedBrand.name,
        purchaseUrl: data.purchaseUrl.trim() || undefined,
        unit: data.unit.trim() || undefined,
        price: data.price.trim() ? Number(data.price.trim()) : undefined,
        description: data.description.trim() || product.description,
        ingredients: data.ingredients.trim() || undefined,
        usage: data.usage.trim() || undefined,
        effects: data.effects.trim() || undefined,
        usp: data.usp.trim() || undefined,
        targetGender: data.targetGender || undefined,
        targetAge: data.targetAge.trim() || undefined,
      };

      console.log('제품 업데이트 데이터:', updateData);
      
      const updatedProduct = await brandService.updateProduct(product.id, updateData);
      setProduct(updatedProduct);
      
      toast({
        title: "제품 정보가 성공적으로 수정되었습니다!",
        description: `${updatedProduct.name}의 정보가 업데이트되었습니다.`
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('제품 수정 실패:', error);
      toast({
        title: "수정 실패",
        description: "제품 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (product.activeCampaigns && product.activeCampaigns > 0) {
      toast({
        title: "삭제할 수 없습니다",
        description: "진행 중인 캠페인이 있어 삭제할 수 없습니다.",
        variant: "destructive"
      });
      return;
    }
    
    if (!confirm('정말로 이 제품을 삭제하시겠습니까?')) {
      return;
    }

    setIsUpdating(true);
    try {
      await brandService.deleteProduct(product.id);
      
      toast({
        title: "제품이 성공적으로 삭제되었습니다!",
        description: `${product.name}이(가) 삭제되었습니다.`
      });
      
      navigate('/brand/products');
    } catch (error) {
      console.error('제품 삭제 실패:', error);
      toast({
        title: "삭제 실패",
        description: "제품 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <BrandSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">제품 정보 로딩 중...</div>
            <div className="text-gray-600">제품 상세 정보를 불러오고 있습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen bg-gray-50">
        <BrandSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">제품을 찾을 수 없습니다</div>
            <div className="text-gray-600 mb-4">요청한 제품이 존재하지 않습니다.</div>
            <Link to="/brand/products">
              <Button>제품 목록으로 돌아가기</Button>
            </Link>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link to="/brand/products">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로가기
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">제품 상세</h1>
                <p className="text-gray-600 mt-2">{product.brandName} - {product.name}</p>
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isUpdating}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  disabled={(product.activeCampaigns || 0) > 0 || isUpdating}
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
                        disabled={isUpdating}
                      >
                        취소
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={isUpdating}
                      >
                        {isUpdating ? '저장 중...' : '저장하기'}
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
