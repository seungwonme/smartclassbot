
export interface Campaign {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  productId: string;
  productName: string;
  budget: number;
  proposalDeadline: string;
  campaignStartDate: string;
  campaignEndDate: string;
  adType: 'branding' | 'live-commerce';
  status: 'creating' | 'recruiting' | 'proposing' | 'approved' | 'rejected' | 'completed';
  targetContent: {
    influencerCategories: string[];
    targetAge: string;
    uspImportance: number;
    influencerImpact: string;
    additionalDescription: string;
    secondaryContentUsage: boolean;
  };
  influencers: CampaignInfluencer[];
  quote?: {
    subtotal: number;
    agencyFee: number;
    vat: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInfluencer {
  id: string;
  name: string;
  category: string;
  followers: number;
  engagementRate: number;
  profileImage: string;
  socialChannels: string[];
  isSelected: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'replaced' | 'approved';
  adFee?: number;
  platform?: 'douyin' | 'xiaohongshu';
  region?: string;
}

export interface Persona {
  id: string;
  name: string;
  productId: string;
  age: string;
  interests: string[];
  characteristics: string[];
}
