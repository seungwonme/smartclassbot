
import { Brand, Product } from '@/types/brand';
import { mockBrands, mockProducts } from '@/mocks/brand.mock';

export const brandService = {
  getBrands: async (): Promise<Brand[]> =>
    new Promise((resolve) => setTimeout(() => resolve(mockBrands), 200)),

  getProducts: async (): Promise<Product[]> =>
    new Promise((resolve) => setTimeout(() => resolve(mockProducts), 200)),

  getProductsByBrand: async (brandId: string): Promise<Product[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = mockProducts.filter(p => p.brandId === brandId);
        resolve(filteredProducts);
      }, 200);
    })
};
