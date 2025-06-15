
import { Campaign } from '@/types/campaign';
import { Brand, Product } from '@/types/brand';
import { ContentPlanDetail } from '@/types/content';

const STORAGE_KEYS = {
  CAMPAIGNS: 'lovable_campaigns',
  BRANDS: 'lovable_brands',
  PRODUCTS: 'lovable_products',
  CONTENT_PLANS: 'lovable_content_plans',
  INITIALIZED: 'lovable_initialized',
  BACKUP: 'lovable_data_backup'
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
      // 백업 생성
      storageService.createBackup();
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
      console.log('캠페인 데이터 저장 완료:', campaigns.length, '개');
      return true;
    } catch (error) {
      console.error('캠페인 데이터 저장 실패:', error);
      // 실패 시 백업에서 복원
      storageService.restoreFromBackup();
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
      storageService.createBackup();
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      console.log('브랜드 데이터 저장 완료:', brands.length, '개');
      return true;
    } catch (error) {
      console.error('브랜드 데이터 저장 실패:', error);
      storageService.restoreFromBackup();
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
      storageService.createBackup();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      console.log('제품 데이터 저장 완료:', products.length, '개');
      return true;
    } catch (error) {
      console.error('제품 데이터 저장 실패:', error);
      storageService.restoreFromBackup();
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
      
      storageService.createBackup();
      localStorage.setItem(STORAGE_KEYS.CONTENT_PLANS, JSON.stringify(plans));
      
      // 저장 후 즉시 검증
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT_PLANS);
      const parsed = saved ? JSON.parse(saved) : [];
      console.log('✅ 저장 검증 완료:', parsed.length, '개');
      
      return true;
    } catch (error) {
      console.error('❌ 콘텐츠 기획안 저장 실패:', error);
      storageService.restoreFromBackup();
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

  // 데이터 백업 및 복원 기능 (신규)
  createBackup: (): boolean => {
    try {
      const currentTime = new Date().toISOString();
      const backupData = {
        timestamp: currentTime,
        campaigns: storageService.getCampaigns(),
        brands: storageService.getBrands(),
        products: storageService.getProducts(),
        contentPlans: storageService.getContentPlans(),
        initialized: storageService.isInitialized()
      };
      
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backupData));
      console.log('🔄 데이터 백업 생성 완료:', currentTime);
      console.log('🔄 백업된 데이터:', {
        campaigns: backupData.campaigns.length,
        brands: backupData.brands.length,
        products: backupData.products.length,
        contentPlans: backupData.contentPlans.length
      });
      
      return true;
    } catch (error) {
      console.error('❌ 백업 생성 실패:', error);
      return false;
    }
  },

  restoreFromBackup: (): boolean => {
    try {
      const backupData = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backupData) {
        console.warn('⚠️ 백업 데이터가 존재하지 않습니다');
        return false;
      }

      const backup = JSON.parse(backupData);
      console.log('🔄 백업에서 데이터 복원 시작:', backup.timestamp);

      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(backup.campaigns));
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(backup.brands));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(backup.products));
      localStorage.setItem(STORAGE_KEYS.CONTENT_PLANS, JSON.stringify(backup.contentPlans));
      
      if (backup.initialized) {
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      }

      console.log('✅ 백업에서 데이터 복원 완료');
      return true;
    } catch (error) {
      console.error('❌ 백업 복원 실패:', error);
      return false;
    }
  },

  // 데이터 검증 (강화)
  validateAllData: (): boolean => {
    try {
      const campaigns = storageService.getCampaigns();
      const brands = storageService.getBrands();
      const products = storageService.getProducts();
      const contentPlans = storageService.getContentPlans();
      
      console.log('🔍 데이터 무결성 검사 결과:', {
        campaigns: campaigns?.length || 0,
        brands: brands?.length || 0,
        products: products?.length || 0,
        contentPlans: contentPlans?.length || 0
      });
      
      const isValid = Array.isArray(campaigns) && Array.isArray(brands) && 
                     Array.isArray(products) && Array.isArray(contentPlans);
      
      if (!isValid) {
        console.error('❌ 데이터 무결성 검사 실패 - 백업에서 복원 시도');
        return storageService.restoreFromBackup();
      }
      
      return true;
    } catch (error) {
      console.error('❌ 데이터 검증 실패:', error);
      return storageService.restoreFromBackup();
    }
  },

  // 전체 데이터 삭제
  clearAllData: (): void => {
    console.log('⚠️ 전체 데이터 삭제 시작 - 백업 생성');
    storageService.createBackup();
    
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.BACKUP) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ 전체 데이터 삭제 완료 (백업 유지)');
  },

  // 디버그용 로컬스토리지 전체 조회
  debugAllStorage: (): void => {
    console.log('🔍 === 로컬스토리지 전체 디버그 ===');
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const data = localStorage.getItem(storageKey);
      console.log(`${key}:`, data ? JSON.parse(data) : null);
    });
    console.log('🔍 === 로컬스토리지 디버그 완료 ===');
  },

  // 데이터 안전성 체크
  performSafetyCheck: (): boolean => {
    console.log('🛡️ === 데이터 안전성 체크 시작 ===');
    
    // 1. 백업 생성
    const backupSuccess = storageService.createBackup();
    if (!backupSuccess) {
      console.error('❌ 백업 생성 실패');
      return false;
    }
    
    // 2. 데이터 검증
    const validationSuccess = storageService.validateAllData();
    if (!validationSuccess) {
      console.error('❌ 데이터 검증 실패');
      return false;
    }
    
    console.log('✅ 데이터 안전성 체크 완료 - 모든 데이터가 안전합니다');
    return true;
  }
};
