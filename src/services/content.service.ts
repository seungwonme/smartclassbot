
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';

const CONTENT_PLANS_KEY = 'content_plans';

class ContentService {
  getContentPlans = async (campaignId: string): Promise<ContentPlanDetail[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem(CONTENT_PLANS_KEY);
          const allPlans: ContentPlanDetail[] = stored ? JSON.parse(stored) : [];
          const campaignPlans = allPlans.filter(plan => plan.campaignId === campaignId);
          resolve(campaignPlans);
        } catch (error) {
          console.error('콘텐츠 기획안 로딩 실패:', error);
          resolve([]);
        }
      }, 200);
    });
  };

  createContentPlan = async (campaignId: string, planData: Omit<ContentPlanDetail, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentPlanDetail> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem(CONTENT_PLANS_KEY);
          const allPlans: ContentPlanDetail[] = stored ? JSON.parse(stored) : [];
          
          const newPlan: ContentPlanDetail = {
            ...planData,
            id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const existingIndex = allPlans.findIndex(plan => 
            plan.campaignId === campaignId && plan.influencerId === planData.influencerId
          );
          
          if (existingIndex !== -1) {
            allPlans[existingIndex] = { ...allPlans[existingIndex], ...newPlan, id: allPlans[existingIndex].id };
            resolve(allPlans[existingIndex]);
          } else {
            allPlans.push(newPlan);
            resolve(newPlan);
          }
          
          localStorage.setItem(CONTENT_PLANS_KEY, JSON.stringify(allPlans));
        } catch (error) {
          console.error('콘텐츠 기획안 저장 실패:', error);
          reject(error);
        }
      }, 300);
    });
  };

  updateContentPlan = async (campaignId: string, planId: string, updates: Partial<ContentPlanDetail>): Promise<ContentPlanDetail> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem(CONTENT_PLANS_KEY);
          const allPlans: ContentPlanDetail[] = stored ? JSON.parse(stored) : [];
          
          const planIndex = allPlans.findIndex(plan => plan.id === planId);
          
          if (planIndex === -1) {
            throw new Error('기획안을 찾을 수 없습니다');
          }
          
          allPlans[planIndex] = {
            ...allPlans[planIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem(CONTENT_PLANS_KEY, JSON.stringify(allPlans));
          resolve(allPlans[planIndex]);
        } catch (error) {
          console.error('콘텐츠 기획안 업데이트 실패:', error);
          reject(error);
        }
      }, 300);
    });
  };

  debugContentPlanStorage = async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(CONTENT_PLANS_KEY);
        const allPlans = stored ? JSON.parse(stored) : [];
        
        console.log('=== Content Plan Storage Debug ===');
        console.log('Total plans:', allPlans.length);
        console.table(allPlans);
        
        resolve({
          totalPlans: allPlans.length,
          plans: allPlans,
          rawData: stored
        });
      }, 100);
    });
  };
}

export const contentService = new ContentService();
