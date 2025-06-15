
import { ContentSubmission, ContentFile } from '@/types/campaign';
import { storageService } from './storage.service';

export const contentSubmissionService = {
  getContentSubmissions: async (campaignId: string): Promise<ContentSubmission[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentSubmissionService.getContentSubmissions 시작 ===');
        console.log('캠페인 ID:', campaignId);
        
        const campaigns = storageService.getCampaigns();
        const campaign = campaigns.find(c => c.id === campaignId);
        
        const submissions = campaign?.contentSubmissions || [];
        console.log('콘텐츠 제출물:', submissions.length, '개');
        console.log('=== contentSubmissionService.getContentSubmissions 완료 ===');
        
        resolve(submissions);
      }, 300);
    }),

  createContentSubmission: async (campaignId: string, submissionData: Partial<ContentSubmission>): Promise<ContentSubmission> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentSubmissionService.createContentSubmission 시작 ===');
        console.log('캠페인 ID:', campaignId);
        console.log('제출 데이터:', submissionData);
        
        try {
          const campaigns = storageService.getCampaigns();
          const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
          
          if (campaignIndex === -1) {
            throw new Error('캠페인을 찾을 수 없음');
          }
          
          const campaign = campaigns[campaignIndex];
          
          const newSubmission: ContentSubmission = {
            id: `submission_${Date.now()}`,
            campaignId,
            influencerId: submissionData.influencerId!,
            influencerName: submissionData.influencerName!,
            contentType: submissionData.contentType!,
            status: 'draft',
            contentFiles: submissionData.contentFiles || [],
            revisions: [],
            currentRevisionNumber: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          if (!campaign.contentSubmissions) {
            campaign.contentSubmissions = [];
          }
          
          campaign.contentSubmissions.push(newSubmission);
          
          // 첫 번째 콘텐츠 제출 시 캠페인 상태를 content-review로 변경
          if (campaign.status === 'producing') {
            campaign.status = 'content-review';
            campaign.updatedAt = new Date().toISOString();
            console.log('캠페인 상태 변경: producing → content-review');
          }
          
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            console.log('콘텐츠 제출 저장 완료');
            console.log('=== contentSubmissionService.createContentSubmission 완료 ===');
            resolve(newSubmission);
          } else {
            throw new Error('콘텐츠 제출 저장 실패');
          }
        } catch (error) {
          console.error('=== contentSubmissionService.createContentSubmission 실패 ===', error);
          reject(error);
        }
      }, 500);
    }),

  updateContentSubmission: async (campaignId: string, submissionId: string, updates: Partial<ContentSubmission>): Promise<ContentSubmission> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentSubmissionService.updateContentSubmission 시작 ===');
        
        try {
          const campaigns = storageService.getCampaigns();
          const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
          
          if (campaignIndex === -1) {
            throw new Error('캠페인을 찾을 수 없음');
          }
          
          const campaign = campaigns[campaignIndex];
          if (!campaign.contentSubmissions) {
            campaign.contentSubmissions = [];
          }
          
          const submissionIndex = campaign.contentSubmissions.findIndex(s => s.id === submissionId);
          if (submissionIndex === -1) {
            throw new Error('콘텐츠 제출물을 찾을 수 없음');
          }
          
          campaign.contentSubmissions[submissionIndex] = {
            ...campaign.contentSubmissions[submissionIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            console.log('콘텐츠 제출물 업데이트 완료');
            console.log('=== contentSubmissionService.updateContentSubmission 완료 ===');
            resolve(campaign.contentSubmissions[submissionIndex]);
          } else {
            throw new Error('콘텐츠 제출물 업데이트 저장 실패');
          }
        } catch (error) {
          console.error('=== contentSubmissionService.updateContentSubmission 실패 ===', error);
          reject(error);
        }
      }, 300);
    })
};
