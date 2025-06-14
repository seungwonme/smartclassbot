
import { Brand, Product } from '@/types/brand';
import { mockBrands, mockProducts } from '@/mocks/brand.mock';
import { storageService } from './storage.service';

// 초기 데이터 시드 함수
const initializeBrandData = () => {
  if (!storageService.isInitialized()) {
    storageService.setBrands(mockBrands);
    storageService.setProducts(mockProducts);
  }
};

// 앱 시작 시 초기화
initializeBrandData();

export const brandService = {
  getBrands: async (): Promise<Brand[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const brands = storageService.getBrands();
        resolve(brands);
      }, 200);
    }),

  getProducts: async (): Promise<Product[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const products = storageService.getProducts();
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
