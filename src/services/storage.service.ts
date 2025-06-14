
// localStorage 기반 데이터 저장소 서비스
const STORAGE_KEYS = {
  CAMPAIGNS: 'lovable_campaigns',
  BRANDS: 'lovable_brands',
  PRODUCTS: 'lovable_products',
  INITIALIZED: 'lovable_data_initialized'
};

export const storageService = {
  // 데이터 초기화 여부 확인
  isInitialized: (): boolean => {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
    console.log('초기화 상태 확인:', initialized);
    return initialized;
  },

  // 초기화 플래그 설정
  setInitialized: (): void => {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('초기화 플래그 설정 완료');
  },

  // 캠페인 데이터 관리
  getCampaigns: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    const campaigns = data ? JSON.parse(data) : [];
    console.log('저장된 캠페인 데이터:', campaigns);
    return campaigns;
  },

  setCampaigns: (campaigns: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    console.log('캠페인 데이터 저장:', campaigns);
  },

  // 브랜드 데이터 관리
  getBrands: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
    const brands = data ? JSON.parse(data) : [];
    console.log('저장된 브랜드 데이터:', brands);
    return brands;
  },

  setBrands: (brands: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    console.log('브랜드 데이터 저장:', brands);
  },

  // 제품 데이터 관리
  getProducts: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products = data ? JSON.parse(data) : [];
    console.log('저장된 제품 데이터:', products);
    return products;
  },

  setProducts: (products: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    console.log('제품 데이터 저장:', products);
  },

  // 개발용 데이터 초기화 함수
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('모든 목업 데이터가 초기화되었습니다.');
  }
};

// 개발용 전역 함수로 등록 (콘솔에서 사용 가능)
if (typeof window !== 'undefined') {
  (window as any).clearMockData = storageService.clearAllData;
}
