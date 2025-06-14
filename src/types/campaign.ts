
export interface Campaign {
  id: string;
  title: string;
  brandName: string;
  productName: string;
  budget: number;
  campaignStartDate: string;
  campaignEndDate: string;
  proposalDeadline: string;
  adType: 'branding' | 'livecommerce';
  status: 'creating' | 'submitted' | 'recruiting' | 'proposing' | 'revising' | 'revision-feedback' | 'confirmed' | 'planning' | 'plan-review' | 'plan-revision' | 'plan-approved' | 'producing' | 'content-review' | 'live' | 'monitoring' | 'completed';
  targetContent: TargetContent;
  influencers: CampaignInfluencer[];
  contentPlans?: ContentPlan[];
  currentStage: number;
  createdAt: string;
  updatedAt: string;
}

export interface TargetContent {
  influencerCategories: string[];
  targetAge: string;
  uspImportance: number;
  influencerImpact: string;
  additionalDescription?: string;
  secondaryContentUsage: boolean;
}

export interface CampaignInfluencer {
  id: string;
  name: string;
  category: string;
  followers: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  profileImageUrl: string;
  instagramUrl: string;
  youtubeUrl?: string;
  xiaohongshuUrl?: string;
  tiktokUrl?: string;
  proposedFee: number;
  deliverables: string[];
  additionalTerms?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  proposalSubmittedAt?: string;
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

export interface ContentRevision {
  id: string;
  revisionNumber: number;
  feedback: string;
  requestedBy: 'brand' | 'admin';
  requestedByName: string;
  requestedAt: string;
  status: 'pending' | 'in-progress' | 'completed';
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
}
