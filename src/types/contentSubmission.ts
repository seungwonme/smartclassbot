
export interface ContentSubmission {
  id: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  contentType: 'image' | 'video';
  status: 'draft' | 'revision' | 'approved';
  contentFiles: ContentFile[];
  revisions: ContentSubmissionRevision[];
  currentRevisionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFile {
  id: string;
  name: string;
  url: string;
  type: string; // 'image/jpeg', 'video/mp4' etc
  size: number;
  uploadedAt: string;
}

export interface ContentSubmissionRevision {
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
