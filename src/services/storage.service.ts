
// localStorage 기반 데이터 저장소 서비스 (개선된 버전)
const STORAGE_KEYS = {
  CAMPAIGNS: 'lovable_campaigns',
  BRANDS: 'lovable_brands',
  PRODUCTS: 'lovable_products',
  INITIALIZED: 'lovable_data_initialized'
};

// 데이터 검증 함수들
const validateCampaignData = (data: any): boolean => {
  if (!Array.isArray(data)) return false;
  return data.every(campaign => 
    campaign && 
    typeof campaign.id === 'string' && 
    typeof campaign.title === 'string' &&
    typeof campaign.status === 'string'
  );
};

const validateBrandData = (data: any): boolean => {
  if (!Array.isArray(data)) return false;
  return data.every(brand => 
    brand && 
    typeof brand.id === 'string' && 
    typeof brand.name === 'string'
  );
};

const validateProductData = (data: any): boolean => {
  if (!Array.isArray(data)) return false;
  return data.every(product => 
    product && 
    typeof product.id === 'string' && 
    typeof product.name === 'string'
  );
};

// 안전한 로컬스토리지 접근 함수들
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`로컬스토리지 읽기 실패 (${key}):`, error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    console.log(`로컬스토리지 저장 성공 (${key})`);
    return true;
  } catch (error) {
    console.error(`로컬스토리지 저장 실패 (${key}):`, error);
    return false;
  }
};

const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    console.log(`로컬스토리지 삭제 성공 (${key})`);
    return true;
  } catch (error) {
    console.error(`로컬스토리지 삭제 실패 (${key}):`, error);
    return false;
  }
};

export const storageService = {
  // 데이터 초기화 여부 확인
  isInitialized: (): boolean => {
    const initialized = safeGetItem(STORAGE_KEYS.INITIALIZED) === 'true';
    console.log('초기화 상태 확인:', initialized);
    return initialized;
  },

  // 초기화 플래그 설정
  setInitialized: (): void => {
    const success = safeSetItem(STORAGE_KEYS.INITIALIZED, 'true');
    if (success) {
      console.log('초기화 플래그 설정 완료');
    } else {
      console.error('초기화 플래그 설정 실패');
    }
  },

  // 캠페인 데이터 관리
  getCampaigns: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.CAMPAIGNS);
    if (!data) {
      console.log('캠페인 데이터 없음 - 빈 배열 반환');
      return [];
    }

    try {
      const campaigns = JSON.parse(data);
      if (!validateCampaignData(campaigns)) {
        console.error('캠페인 데이터 검증 실패 - 빈 배열 반환');
        return [];
      }
      console.log('저장된 캠페인 데이터:', campaigns.length, '개');
      return campaigns;
    } catch (error) {
      console.error('캠페인 데이터 파싱 실패:', error);
      return [];
    }
  },

  setCampaigns: (campaigns: any[]): boolean => {
    if (!validateCampaignData(campaigns)) {
      console.error('유효하지 않은 캠페인 데이터 - 저장 거부');
      return false;
    }

    try {
      const serialized = JSON.stringify(campaigns);
      const success = safeSetItem(STORAGE_KEYS.CAMPAIGNS, serialized);
      if (success) {
        console.log('캠페인 데이터 저장 성공:', campaigns.length, '개');
      }
      return success;
    } catch (error) {
      console.error('캠페인 데이터 직렬화 실패:', error);
      return false;
    }
  },

  // 브랜드 데이터 관리
  getBrands: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.BRANDS);
    if (!data) {
      console.log('브랜드 데이터 없음 - 빈 배열 반환');
      return [];
    }

    try {
      const brands = JSON.parse(data);
      if (!validateBrandData(brands)) {
        console.error('브랜드 데이터 검증 실패 - 빈 배열 반환');
        return [];
      }
      console.log('저장된 브랜드 데이터:', brands.length, '개');
      return brands;
    } catch (error) {
      console.error('브랜드 데이터 파싱 실패:', error);
      return [];
    }
  },

  setBrands: (brands: any[]): boolean => {
    if (!validateBrandData(brands)) {
      console.error('유효하지 않은 브랜드 데이터 - 저장 거부');
      return false;
    }

    try {
      const serialized = JSON.stringify(brands);
      const success = safeSetItem(STORAGE_KEYS.BRANDS, serialized);
      if (success) {
        console.log('브랜드 데이터 저장 성공:', brands.length, '개');
      }
      return success;
    } catch (error) {
      console.error('브랜드 데이터 직렬화 실패:', error);
      return false;
    }
  },

  // 제품 데이터 관리
  getProducts: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      console.log('제품 데이터 없음 - 빈 배열 반환');
      return [];
    }

    try {
      const products = JSON.parse(data);
      if (!validateProductData(products)) {
        console.error('제품 데이터 검증 실패 - 빈 배열 반환');
        return [];
      }
      console.log('저장된 제품 데이터:', products.length, '개');
      return products;
    } catch (error) {
      console.error('제품 데이터 파싱 실패:', error);
      return [];
    }
  },

  setProducts: (products: any[]): boolean => {
    if (!validateProductData(products)) {
      console.error('유효하지 않은 제품 데이터 - 저장 거부');
      return false;
    }

    try {
      const serialized = JSON.stringify(products);
      const success = safeSetItem(STORAGE_KEYS.PRODUCTS, serialized);
      if (success) {
        console.log('제품 데이터 저장 성공:', products.length, '개');
      }
      return success;
    } catch (error) {
      console.error('제품 데이터 직렬화 실패:', error);
      return false;
    }
  },

  // 데이터 백업 및 복원
  backupData: (): string | null => {
    try {
      const backup = {
        campaigns: storageService.getCampaigns(),
        brands: storageService.getBrands(),
        products: storageService.getProducts(),
        timestamp: new Date().toISOString()
      };
      const serialized = JSON.stringify(backup);
      console.log('데이터 백업 생성 완료');
      return serialized;
    } catch (error) {
      console.error('데이터 백업 실패:', error);
      return null;
    }
  },

  restoreData: (backupData: string): boolean => {
    try {
      const backup = JSON.parse(backupData);
      if (!backup.campaigns || !backup.brands || !backup.products) {
        console.error('유효하지 않은 백업 데이터');
        return false;
      }

      const success = (
        storageService.setCampaigns(backup.campaigns) &&
        storageService.setBrands(backup.brands) &&
        storageService.setProducts(backup.products)
      );

      if (success) {
        console.log('데이터 복원 완료');
      } else {
        console.error('데이터 복원 실패');
      }
      return success;
    } catch (error) {
      console.error('데이터 복원 실패:', error);
      return false;
    }
  },

  // 개발용 데이터 초기화 함수
  clearAllData: (): void => {
    console.log('모든 데이터 초기화 시작');
    Object.values(STORAGE_KEYS).forEach(key => {
      safeRemoveItem(key);
    });
    console.log('모든 목업 데이터가 초기화되었습니다.');
  },

  // 데이터 무결성 검사
  validateAllData: (): boolean => {
    const campaigns = storageService.getCampaigns();
    const brands = storageService.getBrands();
    const products = storageService.getProducts();
    
    const isValid = (
      validateCampaignData(campaigns) &&
      validateBrandData(brands) &&
      validateProductData(products)
    );
    
    console.log('데이터 무결성 검사 결과:', isValid);
    return isValid;
  }
};

// 개발용 전역 함수로 등록 (콘솔에서 사용 가능)
if (typeof window !== 'undefined') {
  (window as any).clearMockData = storageService.clearAllData;
  (window as any).backupData = storageService.backupData;
  (window as any).validateData = storageService.validateAllData;
}
