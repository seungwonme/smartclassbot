
export interface Brand {
  id: string;
  name: string;
  description: string;
  website?: string;
  story?: string;
  channels?: string[];
  marketing?: string;
  socialChannels?: string[];
  activeCampaigns?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  purchaseUrl?: string;
  unit?: string;
  price?: number;
  ingredients?: string;
  usage?: string;
  effects?: string;
  usp?: string;
  targetGender?: string;
  targetAge?: string;
  activeCampaigns?: number;
  createdAt: string;
  updatedAt: string;
}
