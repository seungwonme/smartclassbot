
export interface ContentPlanDetail {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'draft' | 'submitted' | 'revision' | 'approved';
  planData: ImagePlanData | VideoPlanData;
  revisions: ContentRevision[];
  currentRevisionNumber: number;
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
  scenarioFiles: { name: string; data: string; type: string }[];
  script: string;
  hashtags: string[];
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
