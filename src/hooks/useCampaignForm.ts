import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Campaign, CampaignInfluencer, Persona } from '@/types/campaign';
import { Brand, Product } from '@/types/brand';
import { campaignService } from '@/services/campaign.service';
import { brandService } from '@/services/brand.service';
import { useToast } from '@/hooks/use-toast';

export interface CampaignFormData {
  title: string;
  brandId: string;
  brandName: string;
  productId: string;
  productName: string;
  budget: string;
  proposalDeadline: Date | undefined;
  campaignStartDate: Date | undefined;
  campaignEndDate: Date | undefined;
  adType: 'branding' | 'live-commerce';
  targetContent: {
    influencerCategories: string[];
    targetAge: string;
    uspImportance: number;
    influencerImpact: string;
    additionalDescription: string;
    secondaryContentUsage: boolean;
  };
  selectedInfluencers: string[];
}

export const useCampaignForm = (campaignId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [recommendedInfluencers, setRecommendedInfluencers] = useState<CampaignInfluencer[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isEditMode, setIsEditMode] = useState(!!campaignId);
  const [isPersonaBased, setIsPersonaBased] = useState(false);
  const [personaData, setPersonaData] = useState<any>(null);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    brandId: '',
    brandName: '',
    productId: '',
    productName: '',
    budget: '',
    proposalDeadline: undefined,
    campaignStartDate: undefined,
    campaignEndDate: undefined,
    adType: 'branding',
    targetContent: {
      influencerCategories: [],
      targetAge: '',
      uspImportance: 5,
      influencerImpact: '',
      additionalDescription: '',
      secondaryContentUsage: false
    },
    selectedInfluencers: []
  });

  // Load brands and products data
  useEffect(() => {
    const loadBrandProductData = async () => {
      console.log('🔄 브랜드/제품 데이터 로딩 시작');
      setDataLoading(true);
      setBrandsLoaded(false);
      setProductsLoaded(false);
      
      try {
        const [brandsData, productsData] = await Promise.all([
          brandService.getBrands(),
          brandService.getProducts()
        ]);
        
        console.log('✅ 데이터 로드 완료:', {
          brands: brandsData.length,
          products: productsData.length
        });
        
        setBrands(brandsData);
        setProducts(productsData);
        setBrandsLoaded(true);
        setProductsLoaded(true);
        
      } catch (error) {
        console.error('❌ 브랜드/제품 데이터 로딩 실패:', error);
        toast({
          title: "데이터 로딩 실패",
          description: "브랜드와 제품 데이터를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.",
          variant: "destructive"
        });
      } finally {
        setDataLoading(false);
      }
    };

    loadBrandProductData();
  }, [toast]);

  // Check if this is persona-based campaign and set initial state
  useEffect(() => {
    if (!brandsLoaded || !productsLoaded) return;

    const isPersonaFromUrl = searchParams.get('persona') === 'true';
    
    if (isPersonaFromUrl) {
      const sessionData = sessionStorage.getItem('personaBasedCampaignData');
      const localData = localStorage.getItem('campaignInfluencerData');
      const campaignData = sessionData ? JSON.parse(sessionData) : 
                          localData ? JSON.parse(localData) : null;

      if (campaignData) {
        console.log('🎭 페르소나 기반 캠페인 감지 - 데이터:', campaignData);
        setIsPersonaBased(true);
        setPersonaData(campaignData);
      }
    }

    // Auto-select first brand/product for regular campaigns only
    if (!isPersonaFromUrl && brands.length > 0 && !formData.brandId) {
      const firstBrand = brands[0];
      const brandProducts = products.filter(p => p.brandId === firstBrand.id);
      
      if (brandProducts.length > 0) {
        setFormData(prev => ({
          ...prev,
          brandId: firstBrand.id,
          brandName: firstBrand.name,
          productId: brandProducts[0].id,
          productName: brandProducts[0].name
        }));
      }
    }
  }, [searchParams, brandsLoaded, productsLoaded, brands, products, formData.brandId]);

  // Load campaign data for edit mode
  useEffect(() => {
    if (campaignId && isEditMode) {
      const loadCampaignData = async () => {
        setIsLoading(true);
        try {
          const campaign = await campaignService.getCampaignById(campaignId);
          if (campaign) {
            setFormData({
              title: campaign.title,
              brandId: campaign.brandId,
              brandName: campaign.brandName,
              productId: campaign.productId,
              productName: campaign.productName,
              budget: campaign.budget.toLocaleString(),
              proposalDeadline: campaign.proposalDeadline ? parseISO(campaign.proposalDeadline) : undefined,
              campaignStartDate: campaign.campaignStartDate ? parseISO(campaign.campaignStartDate) : undefined,
              campaignEndDate: campaign.campaignEndDate ? parseISO(campaign.campaignEndDate) : undefined,
              adType: campaign.adType,
              targetContent: {
                ...campaign.targetContent,
                additionalDescription: campaign.targetContent.additionalDescription || ''
              },
              selectedInfluencers: campaign.influencers.map(inf => inf.id)
            });
            setRecommendedInfluencers(campaign.influencers);
          }
        } catch (error) {
          console.error('캠페인 데이터 로드 실패:', error);
          toast({
            title: "데이터 로드 실패",
            description: "캠페인 데이터를 불러오는데 실패했습니다.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadCampaignData();
    }
  }, [campaignId, isEditMode, toast]);

  // Filter products based on selected brand
  useEffect(() => {
    if (formData.brandId && productsLoaded) {
      const brandProducts = products.filter(p => p.brandId === formData.brandId);
      setFilteredProducts(brandProducts);
      
      if (formData.productId && !brandProducts.find(p => p.id === formData.productId)) {
        setFormData(prev => ({ ...prev, productId: '', productName: '' }));
      }
    } else {
      setFilteredProducts([]);
    }
  }, [formData.brandId, products, productsLoaded, formData.productId]);

  // Step-specific persona data application functions
  const applyBasicInfoPersonaData = () => {
    if (!isPersonaBased || !personaData) {
      console.log('❌ 페르소나 데이터 없음 또는 일반 캠페인');
      return;
    }

    console.log('🎯 기본정보 단계 - 페르소나 데이터 적용 시작');
    console.log('📊 적용할 데이터:', personaData.autoFillData);
    
    const { brandId, productId, brandName, productName, budget, adType: campaignAdType } = personaData.autoFillData || {};
    
    // Find brand by ID first, then by name as fallback
    let validBrand = brands.find(b => b.id === brandId);
    if (!validBrand && brandName) {
      validBrand = brands.find(b => b.name.toLowerCase().includes(brandName.toLowerCase()) || 
                                     brandName.toLowerCase().includes(b.name.toLowerCase()));
    }
    
    // Find product by ID first, then by name as fallback
    let validProduct = products.find(p => p.id === productId);
    if (!validProduct && productName) {
      validProduct = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()) || 
                                        productName.toLowerCase().includes(p.name.toLowerCase()));
    }
    
    // Ensure product belongs to the selected brand
    if (validBrand && validProduct && validProduct.brandId !== validBrand.id) {
      console.log('⚠️ 제품이 브랜드와 매치되지 않음, 브랜드 제품으로 대체');
      const brandProducts = products.filter(p => p.brandId === validBrand.id);
      if (brandProducts.length > 0) {
        validProduct = brandProducts[0];
      }
    }
    
    console.log('🔍 검증된 브랜드/제품:', {
      validBrand: validBrand ? { id: validBrand.id, name: validBrand.name } : null,
      validProduct: validProduct ? { id: validProduct.id, name: validProduct.name } : null,
      budget,
      adType: campaignAdType
    });
    
    if (validBrand && validProduct) {
      setFormData(prev => ({
        ...prev,
        title: `${personaData.persona?.name || ''} 페르소나 기반 캠페인`,
        brandId: validBrand.id,
        brandName: validBrand.name,
        productId: validProduct.id,
        productName: validProduct.name,
        budget: budget || '',
        adType: campaignAdType || 'branding'
      }));
      
      console.log('✅ 기본정보 자동 입력 완료');
      toast({
        title: "페르소나 기본정보 적용",
        description: `${personaData.persona?.name} 페르소나의 기본정보가 자동 입력되었습니다.`
      });
    } else {
      console.log('❌ 브랜드/제품 매칭 실패');
      toast({
        title: "기본정보 적용 실패",
        description: "브랜드 또는 제품 정보를 찾을 수 없습니다. 수동으로 선택해주세요.",
        variant: "destructive"
      });
    }
  };

  const applyTargetContentPersonaData = () => {
    if (!isPersonaBased || !personaData) return;

    console.log('🎯 타겟 콘텐츠 단계 - 페르소나 데이터 적용');
    
    const targetContentData = personaData.autoFillData?.targetContent || {};
    
    setFormData(prev => ({
      ...prev,
      targetContent: {
        ...prev.targetContent,
        ...targetContentData
      }
    }));
    
    toast({
      title: "페르소나 타겟 콘텐츠 적용",
      description: `${personaData.persona?.name} 페르소나의 타겟 콘텐츠 정보가 자동 입력되었습니다.`
    });
  };

  const applyInfluencerPersonaData = () => {
    if (!isPersonaBased || !personaData) return;

    console.log('🎯 인플루언서 단계 - 페르소나 데이터 적용');
    
    if (personaData.selectedInfluencers) {
      const influencersForCampaign = personaData.selectedInfluencers.map((inf: any) => ({
        id: inf.id,
        name: inf.name,
        profileImage: inf.avatar || '',
        profileImageUrl: inf.avatar || '',
        followers: inf.followers,
        engagementRate: inf.engagement,
        category: inf.platform || '뷰티',
        platform: inf.platform || '샤오홍슈',
        isSelected: true
      }));
      
      setRecommendedInfluencers(influencersForCampaign);
      setFormData(prev => ({
        ...prev,
        selectedInfluencers: personaData.autoFillData?.selectedInfluencers || influencersForCampaign.map((inf: any) => inf.id)
      }));
      
      toast({
        title: "페르소나 인플루언서 적용",
        description: `${personaData.mixStrategy?.name} 믹스 전략에 따른 인플루언서가 선택되었습니다.`
      });
    }
  };

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
      
      setFormData(prev => ({
        ...prev,
        selectedInfluencers: []
      }));
      
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
    console.log('=== 캠페인 제출 시작 ===');
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
        adType: formData.adType === 'live-commerce' ? 'live-commerce' : 'branding',
        status: 'creating',
        currentStage: 1,
        targetContent: formData.targetContent,
        influencers: selectedInfluencerData
      };

      if (isEditMode && campaignId) {
        await campaignService.updateCampaign(campaignId, campaignData);
        toast({
          title: "캠페인 수정 완료",
          description: "캠페인이 성공적으로 수정되었습니다."
        });
        navigate('/brand/campaigns');
      } else {
        const createdCampaign = await campaignService.createCampaign(campaignData);
        const newCampaignId = createdCampaign.id || createdCampaign;
        
        // Clean up persona data after successful creation
        if (isPersonaBased) {
          console.log('🎭 페르소나 기반 캠페인 생성 완료 - 세션 데이터 정리');
          sessionStorage.removeItem('personaBasedCampaignData');
          localStorage.removeItem('campaignInfluencerData');
          
          toast({
            title: "페르소나 기반 캠페인 생성 완료",
            description: "페르소나 기반 캠페인이 성공적으로 생성되었습니다. 검토 후 제출해주세요."
          });
        } else {
          toast({
            title: "캠페인 생성 완료",
            description: "캠페인이 성공적으로 생성되었습니다. 검토 후 제출해주세요."
          });
        }
        
        navigate(`/brand/campaigns/${newCampaignId}`);
      }
      
    } catch (error) {
      console.error('캠페인 처리 실패:', error);
      toast({
        title: "처리 실패",
        description: isEditMode ? "캠페인 수정에 실패했습니다." : "캠페인 생성에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    dataLoading,
    brandsLoaded,
    productsLoaded,
    formData,
    setFormData,
    brands,
    filteredProducts,
    recommendedInfluencers,
    personas,
    isEditMode,
    isPersonaBased,
    personaData,
    handleBudgetChange,
    handleBrandChange,
    handleProductChange,
    handlePersonaRecommendation,
    handleAIRecommendation,
    handleInfluencerToggle,
    handleSubmit,
    applyBasicInfoPersonaData,
    applyTargetContentPersonaData,
    applyInfluencerPersonaData
  };
};
