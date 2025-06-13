
export interface Brand {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}
