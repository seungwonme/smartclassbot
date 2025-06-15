
import { ContentPlanDetail, ContentRevision } from '@/types/content';
import { storageService } from './storage.service';

export const contentService = {
  // 콘텐츠 기획안 목록 조회 (강화된 디버깅 및 데이터 동기화)
  getContentPlans: async (campaignId: string): Promise<ContentPlanDetail[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentService.getContentPlans 시작 ===');
        console.log('🎯 요청된 캠페인 ID:', campaignId);
        
        // 전체 스토리지 상태 확인
        storageService.debugAllStorage();
        
        // 강제로 localStorage에서 직접 읽기
        const rawContentPlans = localStorage.getItem('content_plans');
        console.log('🔍 localStorage 직접 읽기:', rawContentPlans);
        
        // storageService를 통한 데이터 가져오기
        let contentPlans = storageService.getContentPlans();
        console.log('📋 storageService를 통한 기획안:', contentPlans);
        
        // 만약 데이터가 없다면 localStorage에서 직접 파싱 시도
        if (!contentPlans || contentPlans.length === 0) {
          if (rawContentPlans && rawContentPlans !== 'null') {
            try {
              const parsedPlans = JSON.parse(rawContentPlans);
              console.log('🔧 직접 파싱한 기획안:', parsedPlans);
              contentPlans = Array.isArray(parsedPlans) ? parsedPlans : [];
            } catch (error) {
              console.error('❌ localStorage 파싱 실패:', error);
              contentPlans = [];
            }
          } else {
            console.log('📋 localStorage에 content_plans 데이터가 없거나 null입니다');
            contentPlans = [];
          }
        }
        
        const filtered = contentPlans.filter(plan => {
          const matches = plan.campaignId === campaignId;
          console.log(`🔍 기획안 ${plan.id} (${plan.influencerName}): campaignId=${plan.campaignId}, 매치=${matches}`);
          return matches;
        });
        
        console.log('🎯 전체 기획안:', contentPlans.length);
        console.log('✅ 해당 캠페인 기획안:', filtered.length);
        console.log('📝 필터링된 결과:', filtered);
        console.log('=== contentService.getContentPlans 완료 ===');
        
        resolve(filtered);
      }, 300);
    }),

  // 개별 콘텐츠 기획안 조회
  getContentPlan: async (campaignId: string, planId: string): Promise<ContentPlanDetail | null> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentService.getContentPlan 시작 ===');
        console.log('캠페인 ID:', campaignId, '기획안 ID:', planId);
        
        const contentPlans = storageService.getContentPlans();
        const plan = contentPlans.find(p => p.id === planId && p.campaignId === campaignId);
        
        console.log('찾은 기획안:', plan ? plan.influencerName : 'null');
        console.log('=== contentService.getContentPlan 완료 ===');
        
        resolve(plan || null);
      }, 300);
    }),

  createContentPlan: async (campaignId: string, planData: Omit<ContentPlanDetail, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentPlanDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentService.createContentPlan 시작 ===');
        console.log('🎯 캠페인 ID:', campaignId);
        console.log('📝 기획안 데이터:', planData);
        
        try {
          // 현재 저장된 기획안들 가져오기
          let contentPlans = storageService.getContentPlans();
          console.log('📋 현재 저장된 기획안 수:', contentPlans.length);
          
          // 만약 배열이 아니라면 빈 배열로 초기화
          if (!Array.isArray(contentPlans)) {
            console.log('⚠️ contentPlans가 배열이 아님, 빈 배열로 초기화');
            contentPlans = [];
          }
          
          const newPlan: ContentPlanDetail = {
            ...planData,
            id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            campaignId,
            revisions: planData.revisions || [],
            currentRevisionNumber: planData.currentRevisionNumber || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          console.log('🆕 생성될 새 기획안:', newPlan);
          
          // 동일한 인플루언서의 기존 기획안이 있는지 확인
          const existingIndex = contentPlans.findIndex(
            plan => plan.campaignId === campaignId && plan.influencerId === planData.influencerId
          );
          
          if (existingIndex !== -1) {
            console.log('🔄 기존 기획안 업데이트:', contentPlans[existingIndex].id);
            contentPlans[existingIndex] = newPlan;
          } else {
            console.log('🆕 새 기획안 추가');
            contentPlans.push(newPlan);
          }
          
          console.log('📝 업데이트된 기획안 리스트:', contentPlans);
          
          // localStorage에 직접 저장도 시도
          try {
            localStorage.setItem('content_plans', JSON.stringify(contentPlans));
            console.log('💾 localStorage 직접 저장 성공');
          } catch (localStorageError) {
            console.error('❌ localStorage 직접 저장 실패:', localStorageError);
          }
          
          const success = storageService.setContentPlans(contentPlans);
          
          if (success) {
            console.log('💾 기획안 저장 완료 - 전체 기획안:', contentPlans.length);
            
            // 저장 후 즉시 검증
            const verification = storageService.getContentPlans();
            const directVerification = localStorage.getItem('content_plans');
            console.log('🔍 storageService 저장 검증:', verification.length, '개');
            console.log('🔍 localStorage 직접 검증:', directVerification ? JSON.parse(directVerification).length : 0, '개');
            
            console.log('=== contentService.createContentPlan 완료 ===');
            resolve(newPlan);
          } else {
            throw new Error('기획안 저장 실패');
          }
        } catch (error) {
          console.error('=== contentService.createContentPlan 실패 ===', error);
          reject(error);
        }
      }, 500);
    }),

  updateContentPlan: async (campaignId: string, planId: string, updates: Partial<ContentPlanDetail>): Promise<ContentPlanDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentService.updateContentPlan 시작 ===');
        console.log('캠페인 ID:', campaignId, '기획안 ID:', planId);
        console.log('업데이트 데이터:', updates);
        
        try {
          const contentPlans = storageService.getContentPlans();
          const index = contentPlans.findIndex(p => p.id === planId && p.campaignId === campaignId);
          
          if (index !== -1) {
            const originalPlan = contentPlans[index];
            console.log('원본 기획안:', originalPlan.influencerName);
            
            contentPlans[index] = {
              ...contentPlans[index],
              ...updates,
              updatedAt: new Date().toISOString()
            };
            
            console.log('업데이트된 기획안:', contentPlans[index].influencerName);
            
            // localStorage에도 직접 저장
            localStorage.setItem('content_plans', JSON.stringify(contentPlans));
            
            const success = storageService.setContentPlans(contentPlans);
            
            if (success) {
              console.log('=== contentService.updateContentPlan 완료 ===');
              resolve(contentPlans[index]);
            } else {
              throw new Error('기획안 업데이트 저장 실패');
            }
          } else {
            throw new Error('기획안을 찾을 수 없음');
          }
        } catch (error) {
          console.error('=== contentService.updateContentPlan 실패 ===', error);
          reject(error);
        }
      }, 300);
    }),

  deleteContentPlan: async (campaignId: string, planId: string): Promise<void> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentService.deleteContentPlan 시작 ===');
        console.log('캠페인 ID:', campaignId, '기획안 ID:', planId);
        
        try {
          const contentPlans = storageService.getContentPlans();
          const index = contentPlans.findIndex(p => p.id === planId && p.campaignId === campaignId);
          
          if (index !== -1) {
            const deletedPlan = contentPlans[index];
            contentPlans.splice(index, 1);
            
            // localStorage에도 직접 저장
            localStorage.setItem('content_plans', JSON.stringify(contentPlans));
            
            const success = storageService.setContentPlans(contentPlans);
            
            if (success) {
              console.log('삭제된 기획안:', deletedPlan.influencerName);
              console.log('=== contentService.deleteContentPlan 완료 ===');
              resolve();
            } else {
              throw new Error('기획안 삭제 저장 실패');
            }
          } else {
            throw new Error('삭제할 기획안을 찾을 수 없음');
          }
        } catch (error) {
          console.error('=== contentService.deleteContentPlan 실패 ===', error);
          reject(error);
        }
      }, 300);
    })
};
