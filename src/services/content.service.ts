
import { ContentPlanDetail } from '@/types/content';
import { storageService } from './storage.service';

export const contentService = {
  getContentPlans: async (campaignId: string): Promise<ContentPlanDetail[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentService.getContentPlans 시작 ===');
        console.log('캠페인 ID:', campaignId);
        
        const campaigns = storageService.getCampaigns();
        const campaign = campaigns.find(c => c.id === campaignId);
        
        const plans = campaign?.contentPlans || [];
        console.log('콘텐츠 기획:', plans.length, '개');
        console.log('=== contentService.getContentPlans 완료 ===');
        
        resolve(plans);
      }, 300);
    }),

  updateContentPlan: async (campaignId: string, planId: string, updates: any): Promise<ContentPlanDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentService.updateContentPlan 시작 ===');
        
        try {
          const campaigns = storageService.getCampaigns();
          const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
          
          if (campaignIndex === -1) {
            throw new Error('캠페인을 찾을 수 없음');
          }
          
          const campaign = campaigns[campaignIndex];
          if (!campaign.contentPlans) {
            campaign.contentPlans = [];
          }
          
          const planIndex = campaign.contentPlans.findIndex(p => p.id === planId);
          if (planIndex === -1) {
            throw new Error('콘텐츠 기획을 찾을 수 없음');
          }
          
          campaign.contentPlans[planIndex] = {
            ...campaign.contentPlans[planIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            console.log('콘텐츠 기획 업데이트 완료');
            console.log('=== contentService.updateContentPlan 완료 ===');
            resolve(campaign.contentPlans[planIndex]);
          } else {
            throw new Error('콘텐츠 기획 업데이트 저장 실패');
          }
        } catch (error) {
          console.error('=== contentService.updateContentPlan 실패 ===', error);
          reject(error);
        }
      }, 300);
    })
};
