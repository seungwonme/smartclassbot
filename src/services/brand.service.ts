
import { Brand, Product } from '@/types/brand';
import { mockBrands, mockProducts } from '@/mocks/brand.mock';
import { storageService } from './storage.service';

// 초기 데이터 시드 함수 - 더 강력한 초기화
const initializeBrandData = () => {
  console.log('브랜드 데이터 초기화 시작');
  
  // 기존 데이터 확인
  const existingBrands = storageService.getBrands();
  const existingProducts = storageService.getProducts();
  
  console.log('기존 브랜드 데이터:', existingBrands);
  console.log('기존 제품 데이터:', existingProducts);
  
  // 데이터가 없으면 목업 데이터로 초기화
  if (existingBrands.length === 0) {
    console.log('브랜드 목업 데이터 설정 중...');
    storageService.setBrands(mockBrands);
  }
  
  if (existingProducts.length === 0) {
    console.log('제품 목업 데이터 설정 중...');
    storageService.setProducts(mockProducts);
  }
  
  // 초기화 완료 표시
  if (!storageService.isInitialized()) {
    storageService.setInitialized();
  }
  
  console.log('브랜드 데이터 초기화 완료');
};

// 앱 시작 시 즉시 초기화
initializeBrandData();

export const brandService = {
  getBrands: async (): Promise<Brand[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        // 다시 한번 초기화 확인
        initializeBrandData();
        const brands = storageService.getBrands();
        console.log('brandService.getBrands 결과:', brands);
        resolve(brands);
      }, 200);
    }),

  getProducts: async (): Promise<Product[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        // 다시 한번 초기화 확인
        initializeBrandData();
        const products = storageService.getProducts();
        console.log('brandService.getProducts 결과:', products);
        resolve(products);
      }, 200);
    }),

  getProductsByBrand: async (brandId: string): Promise<Product[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const products = storageService.getProducts();
        const filteredProducts = products.filter(p => p.brandId === brandId);
        resolve(filteredProducts);
      }, 200);
    }),

  createBrand: async (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const brands = storageService.getBrands();
        const newBrand: Brand = {
          ...brand,
          id: `b${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        brands.push(newBrand);
        storageService.setBrands(brands);
        resolve(newBrand);
      }, 300);
    }),

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const products = storageService.getProducts();
        const newProduct: Product = {
          ...product,
          id: `p${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        products.push(newProduct);
        storageService.setProducts(products);
        resolve(newProduct);
      }, 300);
    })
};
