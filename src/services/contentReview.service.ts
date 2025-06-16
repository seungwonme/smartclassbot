
import { ContentReviewDetail, ContentReviewRevision, ContentFile } from '@/types/content';
import { storageService } from './storage.service';

export const contentReviewService = {
  getContentForReview: async (campaignId: string): Promise<ContentReviewDetail[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentReviewService.getContentForReview 시작 ===');
        console.log('캠페인 ID:', campaignId);
        
        const campaigns = storageService.getCampaigns();
        const campaign = campaigns.find(c => c.id === campaignId);
        
        const contentSubmissions = campaign?.contentSubmissions || [];
        
        // ContentSubmission을 ContentReviewDetail로 변환
        const reviewContent: ContentReviewDetail[] = contentSubmissions.map(submission => ({
          id: submission.id,
          campaignId: submission.campaignId,
          influencerId: submission.influencerId,
          influencerName: submission.influencerName,
          contentType: submission.contentType,
          reviewStatus: submission.status === 'submitted' ? 'submitted' : 
                       submission.status === 'revision-request' ? 'revision-requested' :
                       submission.status === 'approved' ? 'approved' : 'under-review',
          contentFiles: submission.contentFiles,
          reviewRevisions: submission.revisions.map(rev => ({
            id: rev.id,
            revisionNumber: rev.revisionNumber,
            feedback: rev.feedback,
            requestedBy: rev.requestedBy,
            requestedByName: rev.requestedByName,
            requestedAt: rev.requestedAt,
            status: rev.status,
            response: rev.response,
            respondedAt: rev.respondedAt,
            respondedBy: rev.respondedBy
          })),
          currentReviewRevision: submission.currentRevisionNumber,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt
        }));
        
        console.log('검수용 콘텐츠:', reviewContent.length, '개');
        console.log('=== contentReviewService.getContentForReview 완료 ===');
        
        resolve(reviewContent);
      }, 300);
    }),

  requestContentReview: async (campaignId: string, contentId: string, feedback: string): Promise<ContentReviewDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentReviewService.requestContentReview 시작 ===');
        
        try {
          const campaigns = storageService.getCampaigns();
          const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
          
          if (campaignIndex === -1) {
            throw new Error('캠페인을 찾을 수 없음');
          }
          
          const campaign = campaigns[campaignIndex];
          const submissionIndex = campaign.contentSubmissions?.findIndex(s => s.id === contentId) ?? -1;
          
          if (submissionIndex === -1) {
            throw new Error('콘텐츠를 찾을 수 없음');
          }
          
          const submission = campaign.contentSubmissions![submissionIndex];
          const revisionNumber = (submission.currentRevisionNumber || 0) + 1;
          
          const newRevision = {
            id: `review_revision_${Date.now()}`,
            revisionNumber,
            feedback,
            requestedBy: 'brand' as const,
            requestedByName: '브랜드 관리자',
            requestedAt: new Date().toISOString(),
            status: 'pending' as const
          };

          campaign.contentSubmissions![submissionIndex] = {
            ...submission,
            status: 'revision-request',
            revisions: [...submission.revisions, newRevision],
            currentRevisionNumber: revisionNumber,
            updatedAt: new Date().toISOString()
          };
          
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            const updatedSubmission = campaign.contentSubmissions![submissionIndex];
            const reviewDetail: ContentReviewDetail = {
              id: updatedSubmission.id,
              campaignId: updatedSubmission.campaignId,
              influencerId: updatedSubmission.influencerId,
              influencerName: updatedSubmission.influencerName,
              contentType: updatedSubmission.contentType,
              reviewStatus: 'revision-requested',
              contentFiles: updatedSubmission.contentFiles,
              reviewRevisions: updatedSubmission.revisions.map(rev => ({
                id: rev.id,
                revisionNumber: rev.revisionNumber,
                feedback: rev.feedback,
                requestedBy: rev.requestedBy,
                requestedByName: rev.requestedByName,
                requestedAt: rev.requestedAt,
                status: rev.status,
                response: rev.response,
                respondedAt: rev.respondedAt,
                respondedBy: rev.respondedBy
              })),
              currentReviewRevision: updatedSubmission.currentRevisionNumber,
              createdAt: updatedSubmission.createdAt,
              updatedAt: updatedSubmission.updatedAt
            };
            
            console.log('콘텐츠 검수 수정요청 완료');
            resolve(reviewDetail);
          } else {
            throw new Error('저장 실패');
          }
        } catch (error) {
          console.error('=== contentReviewService.requestContentReview 실패 ===', error);
          reject(error);
        }
      }, 500);
    }),

  approveContent: async (campaignId: string, contentId: string): Promise<ContentReviewDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentReviewService.approveContent 시작 ===');
        
        try {
          const campaigns = storageService.getCampaigns();
          const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
          
          if (campaignIndex === -1) {
            throw new Error('캠페인을 찾을 수 없음');
          }
          
          const campaign = campaigns[campaignIndex];
          const submissionIndex = campaign.contentSubmissions?.findIndex(s => s.id === contentId) ?? -1;
          
          if (submissionIndex === -1) {
            throw new Error('콘텐츠를 찾을 수 없음');
          }
          
          campaign.contentSubmissions![submissionIndex] = {
            ...campaign.contentSubmissions![submissionIndex],
            status: 'approved',
            updatedAt: new Date().toISOString()
          };
          
          // 모든 콘텐츠가 승인되었는지 확인
          const allApproved = campaign.contentSubmissions!.every(s => s.status === 'approved');
          
          if (allApproved) {
            campaign.status = 'live';
            campaign.currentStage = 5;
            campaign.updatedAt = new Date().toISOString();
            console.log('모든 콘텐츠 승인 완료 - 캠페인 상태를 live로 변경');
          }
          
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            const updatedSubmission = campaign.contentSubmissions![submissionIndex];
            const reviewDetail: ContentReviewDetail = {
              id: updatedSubmission.id,
              campaignId: updatedSubmission.campaignId,
              influencerId: updatedSubmission.influencerId,
              influencerName: updatedSubmission.influencerName,
              contentType: updatedSubmission.contentType,
              reviewStatus: 'approved',
              contentFiles: updatedSubmission.contentFiles,
              reviewRevisions: updatedSubmission.revisions.map(rev => ({
                id: rev.id,
                revisionNumber: rev.revisionNumber,
                feedback: rev.feedback,
                requestedBy: rev.requestedBy,
                requestedByName: rev.requestedByName,
                requestedAt: rev.requestedAt,
                status: rev.status,
                response: rev.response,
                respondedAt: rev.respondedAt,
                respondedBy: rev.respondedBy
              })),
              currentReviewRevision: updatedSubmission.currentRevisionNumber,
              createdAt: updatedSubmission.createdAt,
              updatedAt: updatedSubmission.updatedAt
            };
            
            console.log('콘텐츠 승인 완료');
            resolve(reviewDetail);
          } else {
            throw new Error('저장 실패');
          }
        } catch (error) {
          console.error('=== contentReviewService.approveContent 실패 ===', error);
          reject(error);
        }
      }, 500);
    }),

  submitContentRevision: async (campaignId: string, contentId: string, response: string, newContentFiles?: ContentFile[]): Promise<ContentReviewDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentReviewService.submitContentRevision 시작 ===');
        
        try {
          const campaigns = storageService.getCampaigns();
          const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
          
          if (campaignIndex === -1) {
            throw new Error('캠페인을 찾을 수 없음');
          }
          
          const campaign = campaigns[campaignIndex];
          const submissionIndex = campaign.contentSubmissions?.findIndex(s => s.id === contentId) ?? -1;
          
          if (submissionIndex === -1) {
            throw new Error('콘텐츠를 찾을 수 없음');
          }
          
          const submission = campaign.contentSubmissions![submissionIndex];
          
          // 현재 pending 상태인 revision을 찾아서 완료 처리
          const updatedRevisions = submission.revisions.map(revision => {
            if (revision.status === 'pending') {
              return {
                ...revision,
                status: 'completed' as const,
                response,
                respondedAt: new Date().toISOString(),
                respondedBy: '시스템 관리자'
              };
            }
            return revision;
          });

          campaign.contentSubmissions![submissionIndex] = {
            ...submission,
            status: 'revision-feedback',
            revisions: updatedRevisions,
            contentFiles: newContentFiles || submission.contentFiles,
            updatedAt: new Date().toISOString()
          };
          
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            const updatedSubmission = campaign.contentSubmissions![submissionIndex];
            const reviewDetail: ContentReviewDetail = {
              id: updatedSubmission.id,
              campaignId: updatedSubmission.campaignId,
              influencerId: updatedSubmission.influencerId,
              influencerName: updatedSubmission.influencerName,
              contentType: updatedSubmission.contentType,
              reviewStatus: 'under-review',
              contentFiles: updatedSubmission.contentFiles,
              reviewRevisions: updatedSubmission.revisions.map(rev => ({
                id: rev.id,
                revisionNumber: rev.revisionNumber,
                feedback: rev.feedback,
                requestedBy: rev.requestedBy,
                requestedByName: rev.requestedByName,
                requestedAt: rev.requestedAt,
                status: rev.status,
                response: rev.response,
                respondedAt: rev.respondedAt,
                respondedBy: rev.respondedBy
              })),
              currentReviewRevision: updatedSubmission.currentRevisionNumber,
              createdAt: updatedSubmission.createdAt,
              updatedAt: updatedSubmission.updatedAt
            };
            
            console.log('콘텐츠 수정 피드백 완료');
            resolve(reviewDetail);
          } else {
            throw new Error('저장 실패');
          }
        } catch (error) {
          console.error('=== contentReviewService.submitContentRevision 실패 ===', error);
          reject(error);
        }
      }, 500);
    })
};
