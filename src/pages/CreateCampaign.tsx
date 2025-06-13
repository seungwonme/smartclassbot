import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Users, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import BrandSidebar from '@/components/BrandSidebar';
import { Campaign, CampaignInfluencer, Persona } from '@/types/campaign';
import { Brand, Product } from '@/types/brand';
import { campaignService } from '@/services/campaign.service';
import { brandService } from '@/services/brand.service';
import { useToast } from '@/hooks/use-toast';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedInfluencers, setRecommendedInfluencers] = useState<CampaignInfluencer[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    brandId: '',
    brandName: '',
    productId: '',
    productName: '',
    budget: '',
    proposalDeadline: undefined as Date | undefined,
    campaignStartDate: undefined as Date | undefined,
    campaignEndDate: undefined as Date | undefined,
    adType: 'branding' as 'branding' | 'live-commerce',
    targetContent: {
      influencerCategories: [] as string[],
      targetAge: '',
      uspImportance: 5,
      influencerImpact: '',
      additionalDescription: '',
      secondaryContentUsage: false
    },
    selectedInfluencers: [] as string[]
  });

  const categories = ['뷰티', '패션', '푸드', '여행', '라이프스타일', '테크', '피트니스', '육아', '기타'];
  const influencerImpacts = ['마이크로 인플루언서 (1만-10만)', '미드 인플루언서 (10만-100만)', '매크로 인플루언서 (100만+)'];

  // 브랜드와 제품 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsData, productsData] = await Promise.all([
          brandService.getBrands(),
          brandService.getProducts()
        ]);
        setBrands(brandsData);
        setProducts(productsData);
      } catch (error) {
        toast({
          title: "데이터 로드 실패",
          description: "브랜드와 제품 데이터를 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      }
    };
    loadData();
  }, [toast]);

  // 브랜드 선택 시 해당 제품들로 필터링
  useEffect(() => {
    if (formData.brandId) {
      const brandProducts = products.filter(p => p.brandId === formData.brandId);
      setFilteredProducts(brandProducts);
      
      // 현재 선택된 제품이 새로운 브랜드에 속하지 않으면 초기화
      if (formData.productId && !brandProducts.find(p => p.id === formData.productId)) {
        setFormData(prev => ({ ...prev, productId: '', productName: '' }));
      }
    } else {
      setFilteredProducts([]);
    }
  }, [formData.brandId, products]);

  const formatBudget = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBudget(e.target.value);
    setFormData(prev => ({ ...prev, budget: formatted }));
  };

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = brands.find(b => b.id === brandId);
    setFormData(prev => ({
      ...prev,
      brandId,
      brandName: selectedBrand?.name || '',
      productId: '',
      productName: ''
    }));
  };

  const handleProductChange = (productId: string) => {
    const selectedProduct = filteredProducts.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      productId,
      productName: selectedProduct?.name || ''
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      targetContent: {
        ...prev.targetContent,
        influencerCategories: prev.targetContent.influencerCategories.includes(category)
          ? prev.targetContent.influencerCategories.filter(c => c !== category)
          : [...prev.targetContent.influencerCategories, category]
      }
    }));
  };

  const handleCustomCategoryAdd = () => {
    if (customCategory.trim() && !formData.targetContent.influencerCategories.includes(customCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        targetContent: {
          ...prev.targetContent,
          influencerCategories: [...prev.targetContent.influencerCategories, customCategory.trim()]
        }
      }));
      setCustomCategory('');
    }
  };

  const handleCustomCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomCategoryAdd();
    }
  };

  const handlePersonaRecommendation = async () => {
    setIsLoading(true);
    try {
      const personaData = await campaignService.getPersonaRecommendations(formData.productId);
      setPersonas(personaData);
      
      if (personaData.length > 0) {
        const influencers = await campaignService.getPersonaBasedInfluencers(
          personaData[0].id,
          parseInt(formData.budget.replace(/,/g, ''))
        );
        setRecommendedInfluencers(influencers);
      }
      
      toast({
        title: "페르소나 기반 추천 완료",
        description: `${personaData.length}개의 페르소나를 기반으로 인플루언서를 추천했습니다.`
      });
    } catch (error) {
      toast({
        title: "추천 실패",
        description: "페르소나 기반 추천에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIRecommendation = async () => {
    setIsLoading(true);
    try {
      const influencers = await campaignService.getInfluencerRecommendations(
        parseInt(formData.budget.replace(/,/g, '')),
        formData.targetContent.influencerCategories
      );
      setRecommendedInfluencers(influencers);
      
      toast({
        title: "AI 추천 완료",
        description: `${influencers.length}명의 인플루언서를 추천했습니다.`
      });
    } catch (error) {
      toast({
        title: "추천 실패",
        description: "AI 추천에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfluencerToggle = (influencerId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInfluencers: prev.selectedInfluencers.includes(influencerId)
        ? prev.selectedInfluencers.filter(id => id !== influencerId)
        : [...prev.selectedInfluencers, influencerId]
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const selectedInfluencerData = recommendedInfluencers.filter(inf => 
        formData.selectedInfluencers.includes(inf.id)
      );

      const campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        brandId: formData.brandId,
        brandName: formData.brandName,
        productId: formData.productId,
        productName: formData.productName,
        budget: parseInt(formData.budget.replace(/,/g, '')),
        proposalDeadline: formData.proposalDeadline ? format(formData.proposalDeadline, 'yyyy-MM-dd') : '',
        campaignStartDate: formData.campaignStartDate ? format(formData.campaignStartDate, 'yyyy-MM-dd') : '',
        campaignEndDate: formData.campaignEndDate ? format(formData.campaignEndDate, 'yyyy-MM-dd') : '',
        adType: formData.adType,
        status: 'creating',
        targetContent: formData.targetContent,
        influencers: selectedInfluencerData
      };

      await campaignService.createCampaign(campaignData);
      
      toast({
        title: "캠페인 생성 완료",
        description: "캠페인이 성공적으로 생성되었습니다."
      });
      
      navigate('/brand/campaigns');
    } catch (error) {
      toast({
        title: "생성 실패",
        description: "캠페인 생성에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>캠페인 기본정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">캠페인 제목</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="캠페인 제목을 입력하세요"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">브랜드</Label>
            <Select value={formData.brandId} onValueChange={handleBrandChange}>
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
            <Label htmlFor="product">제품</Label>
            <Select 
              value={formData.productId} 
              onValueChange={handleProductChange}
              disabled={!formData.brandId}
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

        <div>
          <Label htmlFor="budget">예산 (한화)</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={handleBudgetChange}
            placeholder="5,000,000"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>제안 마감일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.proposalDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.proposalDeadline ? (
                    format(formData.proposalDeadline, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.proposalDeadline}
                  onSelect={(date) => setFormData(prev => ({ ...prev, proposalDeadline: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>캠페인 시작일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.campaignStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.campaignStartDate ? (
                    format(formData.campaignStartDate, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.campaignStartDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, campaignStartDate: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>캠페인 종료일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.campaignEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.campaignEndDate ? (
                    format(formData.campaignEndDate, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.campaignEndDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, campaignEndDate: date }))}
                  disabled={(date) => date < new Date() || (formData.campaignStartDate && date < formData.campaignStartDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="adType">광고 유형</Label>
          <Select
            value={formData.adType}
            onValueChange={(value: 'branding' | 'live-commerce') => 
              setFormData(prev => ({ ...prev, adType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branding">브랜딩</SelectItem>
              <SelectItem value="live-commerce">라이브커머스</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>타겟 콘텐츠 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>인플루언서 카테고리 (다중선택 가능)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={formData.targetContent.influencerCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          {formData.targetContent.influencerCategories.filter(cat => !categories.includes(cat)).length > 0 && (
            <div className="mt-2">
              <Label className="text-sm text-muted-foreground">추가된 카테고리:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.targetContent.influencerCategories
                  .filter(cat => !categories.includes(cat))
                  .map((category) => (
                    <Badge
                      key={category}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
          
          {formData.targetContent.influencerCategories.includes('기타') && (
            <div className="mt-3 space-y-2">
              <Label htmlFor="customCategory">기타 카테고리 입력</Label>
              <div className="flex gap-2">
                <Input
                  id="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyPress={handleCustomCategoryKeyPress}
                  placeholder="직접 입력하세요"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleCustomCategoryAdd}
                  disabled={!customCategory.trim()}
                  variant="outline"
                >
                  추가
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="targetAge">타겟 연령층</Label>
          <Input
            id="targetAge"
            value={formData.targetContent.targetAge}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, targetAge: e.target.value }
            }))}
            placeholder="예: 20-35"
          />
        </div>

        <div>
          <Label htmlFor="uspImportance">USP 중요도 (1-10)</Label>
          <Input
            id="uspImportance"
            type="number"
            min="1"
            max="10"
            value={formData.targetContent.uspImportance}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, uspImportance: parseInt(e.target.value) }
            }))}
          />
        </div>

        <div>
          <Label htmlFor="influencerImpact">인플루언서 영향력</Label>
          <Select
            value={formData.targetContent.influencerImpact}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, influencerImpact: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="영향력 범위를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {influencerImpacts.map((impact) => (
                <SelectItem key={impact} value={impact}>{impact}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="additionalDescription">추가 설명</Label>
          <Textarea
            id="additionalDescription"
            value={formData.targetContent.additionalDescription}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, additionalDescription: e.target.value }
            }))}
            placeholder="캠페인에 대한 추가 설명을 입력하세요"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="secondaryContentUsage"
            checked={formData.targetContent.secondaryContentUsage}
            onCheckedChange={(checked) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, secondaryContentUsage: checked as boolean }
            }))}
          />
          <Label htmlFor="secondaryContentUsage">콘텐츠 2차 활용 동의</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>인플루언서 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button
            onClick={handlePersonaRecommendation}
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            <Users className="w-4 h-4 mr-2" />
            페르소나로 추천받기
          </Button>
          <Button
            onClick={handleAIRecommendation}
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 인플루언서 추천받기
          </Button>
        </div>

        {personas.length > 0 && (
          <div>
            <Label>발견된 페르소나</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {personas.map((persona) => (
                <Card key={persona.id} className="p-4">
                  <h4 className="font-medium">{persona.name}</h4>
                  <p className="text-sm text-muted-foreground">연령: {persona.age}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {persona.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {recommendedInfluencers.length > 0 && (
          <div>
            <Label>추천 인플루언서</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {recommendedInfluencers.map((influencer) => (
                <Card 
                  key={influencer.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    formData.selectedInfluencers.includes(influencer.id) 
                      ? 'border-green-500 bg-green-50' 
                      : ''
                  }`}
                  onClick={() => handleInfluencerToggle(influencer.id)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={influencer.profileImage}
                      alt={influencer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{influencer.name}</h4>
                      <p className="text-sm text-muted-foreground">{influencer.category}</p>
                      <p className="text-xs text-muted-foreground">
                        팔로워: {influencer.followers.toLocaleString()}명 | 
                        참여율: {influencer.engagementRate}%
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.selectedInfluencers.includes(influencer.id)}
                      onChange={() => {}} // onClick으로 처리
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {formData.selectedInfluencers.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              {formData.selectedInfluencers.length}명의 인플루언서가 선택되었습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/brand/campaigns')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-bold">캠페인 생성</h1>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep 
                    ? 'bg-green-600 text-white' 
                    : step < currentStep 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 단계별 폼 */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              이전
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                className="bg-green-600 hover:bg-green-700"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || formData.selectedInfluencers.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? '생성 중...' : '캠페인 생성'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
