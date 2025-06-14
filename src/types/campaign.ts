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
  status: 'creating' | 'submitted' | 'recruiting' | 'proposing' | 'revising' | 'confirmed' | 'planning' | 'plan-review' | 'plan-revision' | 'plan-approved' | 'producing' | 'content-review' | 'content-revision' | 'content-approved' | 'live' | 'monitoring' | 'completed';
  currentStage: 1 | 2 | 3 | 4; // 1: 캠페인생성, 2: 콘텐츠기획, 3: 콘텐츠검수, 4: 성과모니터링
  targetContent: {
    influencerCategories: string[];
    targetAge: string;
    uspImportance: number;
    influencerImpact: string;
    additionalDescription: string;
    secondaryContentUsage: boolean;
  };
  influencers: CampaignInfluencer[];
  contentPlans?: ContentPlan[];
  contentProductions?: ContentProduction[];
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
  status: 'pending' | 'accepted' | 'rejected' | 'replaced' | 'confirmed';
  adFee?: number;
  platform?: 'douyin' | 'xiaohongshu';
  region?: string;
}

export interface ContentPlan {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'draft' | 'submitted' | 'revision' | 'approved';
  planDocument: string;
  revisions: ContentRevision[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentProduction {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'producing' | 'submitted' | 'revision' | 'approved';
  contentFiles: string[];
  revisions: ContentRevision[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentRevision {
  id: string;
  feedback: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'completed';
}

export interface Persona {
  id: string;
  name: string;
  productId: string;
  age: string;
  interests: string[];
  characteristics: string[];
}
