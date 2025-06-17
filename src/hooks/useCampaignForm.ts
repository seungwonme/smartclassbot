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

  // Step 1: Load brand and product data first with improved state management
  useEffect(() => {
    const loadBrandProductData = async () => {
      console.log('🔄 브랜드/제품 데이터 로딩 시작');
      setDataLoading(true);
      setBrandsLoaded(false);
      setProductsLoaded(false);
      
      try {
        console.log('📊 브랜드 데이터 요청 중...');
        const brandsData = await brandService.getBrands();
        console.log('✅ 브랜드 데이터 로드 완료:', brandsData.length, '개');
        setBrands(brandsData);
        setBrandsLoaded(true);
        
        console.log('📊 제품 데이터 요청 중...');
        const productsData = await brandService.getProducts();
        console.log('✅ 제품 데이터 로드 완료:', productsData.length, '개');
        setProducts(productsData);
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
        console.log('🏁 브랜드/제품 데이터 로딩 완료');
      }
    };

    loadBrandProductData();
  }, [toast]);

  // Step 2: Handle persona-based auto-fill only after data is loaded
  useEffect(() => {
    const checkPersonaBasedData = () => {
      console.log('🎭 페르소나 기반 데이터 확인 시작:', {
        brandsLoaded,
        productsLoaded,
        brandsCount: brands.length,
        productsCount: products.length
      });

      if (!brandsLoaded || !productsLoaded || brands.length === 0 || products.length === 0) {
        console.log('⏳ 브랜드/제품 데이터 로딩 대기 중...');
        return;
      }

      try {
        const isPersonaFromUrl = searchParams.get('persona') === 'true';
        
        if (isPersonaFromUrl) {
          const sessionData = sessionStorage.getItem('personaBasedCampaignData');
          const localData = localStorage.getItem('campaignInfluencerData');
          
          const campaignData = sessionData ? JSON.parse(sessionData) : 
                              localData ? JSON.parse(localData) : null;

          if (campaignData && campaignData.autoFillData) {
            console.log('🎭 페르소나 기반 캠페인 데이터 감지:', campaignData);
            
            // Validate brand and product exist in loaded data
            const brandExists = brands.find(b => b.id === campaignData.autoFillData.brandId);
            const productExists = products.find(p => p.id === campaignData.autoFillData.productId);
            
            console.log('🔍 데이터 유효성 검사:', {
              brandId: campaignData.autoFillData.brandId,
              brandExists: !!brandExists,
              brandName: brandExists?.name,
              productId: campaignData.autoFillData.productId,
              productExists: !!productExists,
              productName: productExists?.name
            });

            if (!brandExists || !productExists) {
              console.warn('⚠️ 페르소나 데이터의 브랜드/제품이 현재 데이터에 존재하지 않음');
              toast({
                title: "데이터 불일치",
                description: "페르소나 기반 브랜드/제품 정보가 현재 데이터와 일치하지 않습니다.",
                variant: "destructive"
              });
              return;
            }
            
            setIsPersonaBased(true);
            setPersonaData(campaignData);
            
            // Auto-fill form data with validated information
            setFormData(prev => ({
              ...prev,
              title: `${campaignData.persona?.name || ''} 페르소나 기반 캠페인`,
              brandId: campaignData.autoFillData.brandId,
              brandName: brandExists.name,
              productId: campaignData.autoFillData.productId,
              productName: productExists.name,
              budget: campaignData.autoFillData.budget,
              adType: campaignData.autoFillData.adType,
              targetContent: {
                ...campaignData.autoFillData.targetContent
              },
              selectedInfluencers: campaignData.autoFillData.selectedInfluencers
            }));

            // Set recommended influencers
            if (campaignData.selectedInfluencers) {
              const influencersForCampaign = campaignData.selectedInfluencers.map((inf: any) => ({
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
            }

            toast({
              title: "페르소나 기반 캠페인 생성",
              description: `${campaignData.persona?.name} 페르소나의 정보로 캠페인 양식이 자동 입력되었습니다.`,
            });

            // Clean up the session data
            sessionStorage.removeItem('personaBasedCampaignData');
            console.log('✅ 페르소나 기반 자동 입력 완료');
          }
        }
      } catch (error) {
        console.error('❌ 페르소나 데이터 로드 실패:', error);
        toast({
          title: "페르소나 데이터 오류",
          description: "페르소나 기반 정보를 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      }
    };

    if (!isEditMode) {
      checkPersonaBasedData();
    }
  }, [searchParams, isEditMode, toast, brandsLoaded, productsLoaded, brands, products]);

  useEffect(() => {
    if (campaignId && isEditMode) {
      const loadCampaignData = async () => {
        setIsLoading(true);
        try {
          const campaign = await campaignService.getCampaignById(campaignId);
          if (campaign) {
            console.log('로드된 캠페인 데이터:', campaign);
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

  // Step 3: Update filtered products logic with better dependency management
  useEffect(() => {
    console.log('🔄 필터링된 제품 업데이트:', {
      brandId: formData.brandId,
      productsLoaded,
      totalProducts: products.length
    });

    if (formData.brandId && productsLoaded) {
      const brandProducts = products.filter(p => p.brandId === formData.brandId);
      console.log('📊 브랜드별 제품 필터링 결과:', {
        brandId: formData.brandId,
        filteredCount: brandProducts.length,
        productNames: brandProducts.map(p => p.name)
      });
      setFilteredProducts(brandProducts);
      
      if (formData.productId && !brandProducts.find(p => p.id === formData.productId)) {
        console.log('⚠️ 현재 선택된 제품이 브랜드와 일치하지 않아 초기화');
        setFormData(prev => ({ ...prev, productId: '', productName: '' }));
      }
    } else {
      setFilteredProducts([]);
    }
  }, [formData.brandId, products, productsLoaded, formData.productId]);

  const formatBudget = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBudget(e.target.value);
    setFormData(prev => ({ ...prev, budget: formatted }));
  };

  const handleBrandChange = (brandId: string) => {
    console.log('🏢 브랜드 변경:', brandId);
    const selectedBrand = brands.find(b => b.id === brandId);
    console.log('🔍 선택된 브랜드:', selectedBrand);
    
    setFormData(prev => ({
      ...prev,
      brandId,
      brandName: selectedBrand?.name || '',
      productId: '',
      productName: ''
    }));
  };

  const handleProductChange = (productId: string) => {
    console.log('📦 제품 변경:', productId);
    const selectedProduct = filteredProducts.find(p => p.id === productId);
    console.log('🔍 선택된 제품:', selectedProduct);
    
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
    console.log('캠페인 ID:', campaignId);
    console.log('편집 모드:', isEditMode);
    
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

      console.log('생성할 캠페인 데이터:', campaignData);

      if (isEditMode && campaignId) {
        console.log('캠페인 수정 모드 - ID:', campaignId);
        await campaignService.updateCampaign(campaignId, campaignData);
        toast({
          title: "캠페인 수정 완료",
          description: "캠페인이 성공적으로 수정되었습니다."
        });
        navigate('/brand/campaigns');
      } else {
        console.log('🆕 새 캠페인 생성 모드');
        const createdCampaign = await campaignService.createCampaign(campaignData);
        console.log('생성된 캠페인:', createdCampaign);
        
        const newCampaignId = createdCampaign.id || createdCampaign;
        console.log('추출된 캠페인 ID:', newCampaignId);
        
        toast({
          title: "캠페인 생성 완료",
          description: isPersonaBased 
            ? "페르소나 기반 캠페인이 성공적으로 생성되었습니다." 
            : "캠페인이 성공적으로 생성되었습니다. 검토 후 제출해주세요."
        });
        
        navigate(`/brand/campaigns/${newCampaignId}`);
        return;
      }
      
    } catch (error) {
      console.error('=== 캠페인 처리 실패 ===', error);
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
    handleSubmit
  };
};
