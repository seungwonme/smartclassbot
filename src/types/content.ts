
export interface ContentPlanDetail {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'draft' | 'submitted' | 'revision' | 'approved';
  planData: ImagePlanData | VideoPlanData;
  revisions: ContentRevision[];
  createdAt: string;
  updatedAt: string;
}

export interface ImagePlanData {
  postTitle: string;
  thumbnailTitle: string;
  referenceImages: string[];
  script: string;
  hashtags: string[];
}

export interface VideoPlanData {
  postTitle: string;
  scenario: string;
  script: string;
  hashtags: string[];
}

export interface ContentRevision {
  id: string;
  feedback: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'completed';
}
