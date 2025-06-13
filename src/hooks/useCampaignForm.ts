import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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

export const useCampaignForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedInfluencers, setRecommendedInfluencers] = useState<CampaignInfluencer[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
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

  // Filter products by brand
  useEffect(() => {
    if (formData.brandId) {
      const brandProducts = products.filter(p => p.brandId === formData.brandId);
      setFilteredProducts(brandProducts);
      
      if (formData.productId && !brandProducts.find(p => p.id === formData.productId)) {
        setFormData(prev => ({ ...prev, productId: '', productName: '' }));
      }
    } else {
      setFilteredProducts([]);
    }
  }, [formData.brandId, products, formData.productId]);

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
      
      // Navigate to campaigns list page after successful creation
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

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    formData,
    setFormData,
    brands,
    filteredProducts,
    recommendedInfluencers,
    personas,
    handleBudgetChange,
    handleBrandChange,
    handleProductChange,
    handlePersonaRecommendation,
    handleAIRecommendation,
    handleInfluencerToggle,
    handleSubmit
  };
};
