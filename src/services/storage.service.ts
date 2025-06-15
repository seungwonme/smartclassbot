
import { Campaign } from '@/types/campaign';
import { Brand, Product } from '@/types/brand';
import { ContentPlanDetail } from '@/types/content';

const STORAGE_KEYS = {
  CAMPAIGNS: 'lovable_campaigns',
  BRANDS: 'lovable_brands',
  PRODUCTS: 'lovable_products',
  CONTENT_PLANS: 'lovable_content_plans',
  INITIALIZED: 'lovable_initialized'
};

export const storageService = {
  // 캠페인 관련
  getCampaigns: (): Campaign[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      const campaigns = data ? JSON.parse(data) : [];
      console.log('저장된 캠페인 데이터:', campaigns.length, '개');
      return campaigns;
    } catch (error) {
      console.error('캠페인 데이터 로드 실패:', error);
      return [];
    }
  },

  setCampaigns: (campaigns: Campaign[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
      console.log('캠페인 데이터 저장 완료:', campaigns.length, '개');
      return true;
    } catch (error) {
      console.error('캠페인 데이터 저장 실패:', error);
      return false;
    }
  },

  // 브랜드 관련
  getBrands: (): Brand[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
      const brands = data ? JSON.parse(data) : [];
      console.log('저장된 브랜드 데이터:', brands.length, '개');
      return brands;
    } catch (error) {
      console.error('브랜드 데이터 로드 실패:', error);
      return [];
    }
  },

  setBrands: (brands: Brand[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      console.log('브랜드 데이터 저장 완료:', brands.length, '개');
      return true;
    } catch (error) {
      console.error('브랜드 데이터 저장 실패:', error);
      return false;
    }
  },

  // 제품 관련
  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const products = data ? JSON.parse(data) : [];
      console.log('저장된 제품 데이터:', products.length, '개');
      return products;
    } catch (error) {
      console.error('제품 데이터 로드 실패:', error);
      return [];
    }
  },

  setProducts: (products: Product[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      console.log('제품 데이터 저장 완료:', products.length, '개');
      return true;
    } catch (error) {
      console.error('제품 데이터 저장 실패:', error);
      return false;
    }
  },

  // 콘텐츠 기획안 관련 (강화된 로깅)
  getContentPlans: (): ContentPlanDetail[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTENT_PLANS);
      console.log('🔍 콘텐츠 기획안 로컬스토리지 원본 데이터:', data);
      
      const plans = data ? JSON.parse(data) : [];
      console.log('📋 파싱된 콘텐츠 기획안:', plans);
      console.log('📊 저장된 콘텐츠 기획안:', plans.length, '개');
      
      // 각 기획안의 상세 정보 로깅
      plans.forEach((plan: ContentPlanDetail, index: number) => {
        console.log(`📝 기획안 ${index + 1}:`, {
          id: plan.id,
          campaignId: plan.campaignId,
          influencerName: plan.influencerName,
          status: plan.status,
          contentType: plan.contentType
        });
      });
      
      return plans;
    } catch (error) {
      console.error('❌ 콘텐츠 기획안 로드 실패:', error);
      return [];
    }
  },

  setContentPlans: (plans: ContentPlanDetail[]): boolean => {
    try {
      console.log('💾 콘텐츠 기획안 저장 시작:', plans.length, '개');
      console.log('💾 저장할 데이터:', plans);
      
      localStorage.setItem(STORAGE_KEYS.CONTENT_PLANS, JSON.stringify(plans));
      
      // 저장 후 즉시 검증
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT_PLANS);
      const parsed = saved ? JSON.parse(saved) : [];
      console.log('✅ 저장 검증 완료:', parsed.length, '개');
      
      return true;
    } catch (error) {
      console.error('❌ 콘텐츠 기획안 저장 실패:', error);
      return false;
    }
  },

  // 초기화 관련
  isInitialized: (): boolean => {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    console.log('초기화 상태 확인:', !!initialized);
    return !!initialized;
  },

  setInitialized: (): void => {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('초기화 상태 설정 완료');
  },

  // 데이터 검증
  validateAllData: (): boolean => {
    try {
      const campaigns = storageService.getCampaigns();
      const brands = storageService.getBrands();
      const products = storageService.getProducts();
      const contentPlans = storageService.getContentPlans();
      
      console.log('데이터 무결성 검사 결과:', {
        campaigns: campaigns?.length || 0,
        brands: brands?.length || 0,
        products: products?.length || 0,
        contentPlans: contentPlans?.length || 0
      });
      
      return Array.isArray(campaigns) && Array.isArray(brands) && Array.isArray(products) && Array.isArray(contentPlans);
    } catch (error) {
      console.error('데이터 검증 실패:', error);
      return false;
    }
  },

  // 전체 데이터 삭제
  clearAllData: (): void => {
    console.log('전체 데이터 삭제 시작');
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('전체 데이터 삭제 완료');
  },

  // 디버그용 로컬스토리지 전체 조회
  debugAllStorage: (): void => {
    console.log('🔍 === 로컬스토리지 전체 디버그 ===');
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const data = localStorage.getItem(storageKey);
      console.log(`${key}:`, data ? JSON.parse(data) : null);
    });
    console.log('🔍 === 로컬스토리지 디버그 완료 ===');
  }
};
