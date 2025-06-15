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
  targetContent: TargetContent;
  influencers: Influencer[];
  contentPlans?: ContentPlan[];
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
   প্রস্তাবAmount: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'brand-rejected' | 'admin-rejected';
  createdAt: string;
  updatedAt: string;
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
