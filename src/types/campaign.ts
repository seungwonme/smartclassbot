export interface Campaign {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  productId: string;
  productName: string;
  budget: number;
  campaignStartDate: string;
  campaignEndDate: string;
  proposalDeadline: string;
  adType: 'branding' | 'live-commerce';
  targetContent: TargetContent;
  influencers: CampaignInfluencer[];
  contentPlans?: ContentPlan[];
  contentSubmissions?: ContentSubmission[];
  quote?: {
    subtotal: number;
    agencyFee: number;
    vat: number;
    total: number;
  };
  status: 'creating' | 'submitted' | 'recruiting' | 'proposing' | 'revising' | 'revision-feedback' | 'confirmed' | 'planning' | 'plan-review' | 'plan-revision' | 'plan-approved' | 'producing' | 'content-review' | 'content-approved' | 'live' | 'monitoring' | 'completed';
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

export interface Influencer {
  id: string;
  name: string;
  platform: string;
  followerCount: number;
  proposedAmount: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'brand-rejected' | 'admin-rejected';
  createdAt: string;
  updatedAt: string;
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
  profileImageUrl?: string;
  profileImage?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  xiaohongshuUrl?: string;
  tiktokUrl?: string;
  proposedFee: number;
  adFee?: number;
  deliverables: string[];
  additionalTerms?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'accepted' | 'admin-rejected' | 'brand-rejected';
  proposalSubmittedAt?: string;
  platform?: 'douyin' | 'xiaohongshu';
  region?: string;
  productionStartDate?: string;
  productionDeadline?: string;
  hasUploadedContent?: boolean;
}

export interface ContentPlan {
  id: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'waiting' | 'draft' | 'revision-request' | 'revision-feedback' | 'approved';
  planData: any;
  revisions?: Array<{
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
  }>;
  currentRevisionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentSubmission {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'draft' | 'submitted' | 'revision-request' | 'revision-feedback' | 'approved' | 'rejected';
  contentFiles: ContentFile[];
  revisions: ContentRevision[];
  currentRevisionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
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

export interface Persona {
  id: string;
  name: string;
  age: string;
  interests: string[];
  productId?: string;
}
