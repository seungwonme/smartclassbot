
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
    return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
  },

  // 초기화 플래그 설정
  setInitialized: (): void => {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // 캠페인 데이터 관리
  getCampaigns: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return data ? JSON.parse(data) : [];
  },

  setCampaigns: (campaigns: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  },

  // 브랜드 데이터 관리
  getBrands: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
    return data ? JSON.parse(data) : [];
  },

  setBrands: (brands: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
  },

  // 제품 데이터 관리
  getProducts: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  setProducts: (products: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
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
