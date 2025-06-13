
import { Brand, Product } from '@/types/brand';

export const mockBrands: Brand[] = [
  {
    id: 'b1',
    name: '테스트 브랜드',
    description: '테스트용 브랜드입니다',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b2',
    name: '뷰티브랜드 A',
    description: '뷰티 전문 브랜드',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'b3',
    name: '패션브랜드 B',
    description: '패션 전문 브랜드',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '테스트 제품',
    description: '테스트용 제품입니다',
    brandId: 'b1',
    brandName: '테스트 브랜드',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'p2',
    name: '립스틱 프리미엄',
    description: '고급 립스틱',
    brandId: 'b2',
    brandName: '뷰티브랜드 A',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'p3',
    name: '파운데이션 올인원',
    description: '올인원 파운데이션',
    brandId: 'b2',
    brandName: '뷰티브랜드 A',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'p4',
    name: '원피스 컬렉션',
    description: '봄 원피스 컬렉션',
    brandId: 'b3',
    brandName: '패션브랜드 B',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  }
];
