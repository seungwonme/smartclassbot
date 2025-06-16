
export interface ContentPlanDetail {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'waiting' | 'draft' | 'revision-request' | 'revision-feedback' | 'approved' | 'completed';
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

// 콘텐츠 검수를 위한 새로운 타입 추가
export interface ContentReviewDetail {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  reviewStatus: 'submitted' | 'under-review' | 'revision-requested' | 'approved';
  contentFiles: ContentFile[];
  reviewRevisions: ContentReviewRevision[];
  currentReviewRevision: number;
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

export interface ContentReviewRevision {
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
  updatedContentFiles?: ContentFile[];
}
