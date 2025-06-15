import { ContentPlanDetail, ContentRevision } from '@/types/content';
import { storageService } from './storage.service';

export const contentService = {
  // 통합된 localStorage 키 사용
  STORAGE_KEY: 'content_plans',

  // 디버깅을 위한 전체 스토리지 상태 확인 함수 
  debugContentPlanStorage: () => {
    console.log('=== 콘텐츠 기획안 스토리지 디버깅 시작 ===');
    
    // 모든 가능한 키들 확인
    const possibleKeys = [
      'content_plans',
      'lovable_content_plans', 
      'admin_content_plans',
      'contentPlans',
      'content-plans'
    ];
    
    console.log('🔍 모든 가능한 localStorage 키들 확인:');
    possibleKeys.forEach(key => {
      const data = localStorage.getItem(key);
      console.log(`📋 ${key}: ${data ? `데이터 있음 (${data.length}자)` : 'null'}`);
      if (data && data !== 'null') {
        try {
          const parsed = JSON.parse(data);
          console.log(`📊 ${key} 파싱된 데이터:`, parsed);
        } catch (e) {
          console.log(`❌ ${key} 파싱 실패:`, e);
        }
      }
    });
    
    // 전체 localStorage 키 목록
    console.log('🗂️ localStorage 전체 키 목록:', Object.keys(localStorage));
    
    // storageService를 통한 확인
    const storageServicePlans = storageService.getContentPlans();
    console.log('🔧 storageService를 통한 기획안:', storageServicePlans);
    
    console.log('=== 콘텐츠 기획안 스토리지 디버깅 완료 ===');
    
    return {
      allKeys: Object.keys(localStorage),
      storageServiceData: storageServicePlans
    };
  },

  // 모든 콘텐츠 기획안 조회 (관리자용)
  getAllContentPlans: async (): Promise<ContentPlanDetail[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentService.getAllContentPlans 시작 ===');
        
        let contentPlans: ContentPlanDetail[] = [];
        
        // 1. 기본 키로 시도
        try {
          const data = localStorage.getItem(contentService.STORAGE_KEY);
          if (data && data !== 'null') {
            contentPlans = JSON.parse(data);
            console.log('✅ 기본 키로 로딩 성공:', contentPlans.length, '개');
          }
        } catch (error) {
          console.error('❌ 기본 키 로딩 실패:', error);
        }
        
        // 2. 결과가 없으면 다른 가능한 키들로 시도
        if (!contentPlans || contentPlans.length === 0) {
          const alternativeKeys = [
            'lovable_content_plans',
            'admin_content_plans', 
            'contentPlans',
            'content-plans'
          ];
          
          for (const key of alternativeKeys) {
            try {
              const data = localStorage.getItem(key);
              if (data && data !== 'null') {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  contentPlans = parsed;
                  console.log(`✅ 대체 키 '${key}'로 로딩 성공:`, parsed.length, '개');
                  // 기본 키로 복사
                  localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(parsed));
                  console.log('📋 기본 키로 데이터 복사 완료');
                  break;
                }
              }
            } catch (error) {
              console.log(`⚠️ 키 '${key}' 시도 실패:`, error);
            }
          }
        }
        
        // 3. storageService로도 시도
        if (!contentPlans || contentPlans.length === 0) {
          try {
            const storageData = storageService.getContentPlans();
            if (storageData && storageData.length > 0) {
              contentPlans = storageData;
              console.log('✅ storageService로 로딩 성공:', storageData.length, '개');
              // 기본 키로 저장
              localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(storageData));
            }
          } catch (error) {
            console.error('❌ storageService 로딩 실패:', error);
          }
        }
        
        console.log('📊 전체 기획안:', contentPlans.length);
        console.log('=== contentService.getAllContentPlans 완료 ===');
        
        resolve(contentPlans);
      }, 300);
    }),

  // 콘텐츠 기획안 목록 조회 (통합된 로딩 방식)
  getContentPlans: async (campaignId: string): Promise<ContentPlanDetail[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== contentService.getContentPlans 시작 ===');
        console.log('🎯 요청된 캠페인 ID:', campaignId);
        
        let contentPlans: ContentPlanDetail[] = [];
        
        // 1. 기본 키로 시도
        try {
          const data = localStorage.getItem(contentService.STORAGE_KEY);
          if (data && data !== 'null') {
            contentPlans = JSON.parse(data);
            console.log('✅ 기본 키로 로딩 성공:', contentPlans.length, '개');
          }
        } catch (error) {
          console.error('❌ 기본 키 로딩 실패:', error);
        }
        
        // 2. 결과가 없으면 다른 가능한 키들로 시도
        if (!contentPlans || contentPlans.length === 0) {
          const alternativeKeys = [
            'lovable_content_plans',
            'admin_content_plans', 
            'contentPlans',
            'content-plans'
          ];
          
          for (const key of alternativeKeys) {
            try {
              const data = localStorage.getItem(key);
              if (data && data !== 'null') {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  contentPlans = parsed;
                  console.log(`✅ 대체 키 '${key}'로 로딩 성공:`, parsed.length, '개');
                  // 기본 키로 복사
                  localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(parsed));
                  console.log('📋 기본 키로 데이터 복사 완료');
                  break;
                }
              }
            } catch (error) {
              console.log(`⚠️ 키 '${key}' 시도 실패:`, error);
            }
          }
        }
        
        // 3. storageService로도 시도
        if (!contentPlans || contentPlans.length === 0) {
          try {
            const storageData = storageService.getContentPlans();
            if (storageData && storageData.length > 0) {
              contentPlans = storageData;
              console.log('✅ storageService로 로딩 성공:', storageData.length, '개');
              // 기본 키로 저장
              localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(storageData));
            }
          } catch (error) {
            console.error('❌ storageService 로딩 실패:', error);
          }
        }
        
        // 캠페인별 필터링
        const filtered = contentPlans.filter(plan => {
          const matches = plan.campaignId === campaignId;
          console.log(`🔍 기획안 ${plan.id} (${plan.influencerName}): campaignId=${plan.campaignId}, 매치=${matches}`);
          return matches;
        });
        
        console.log('📊 전체 기획안:', contentPlans.length);
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
          // 현재 저장된 기획안들 가져오기 (통합된 방식)
          let contentPlans: ContentPlanDetail[] = [];
          
          try {
            const data = localStorage.getItem(contentService.STORAGE_KEY);
            if (data && data !== 'null') {
              contentPlans = JSON.parse(data);
            }
          } catch (error) {
            console.log('⚠️ 기존 데이터 로딩 실패, 빈 배열로 시작');
            contentPlans = [];
          }
          
          console.log('📋 현재 저장된 기획안 수:', contentPlans.length);
          
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
          
          // 통합된 키로 저장
          localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(contentPlans));
          console.log('💾 localStorage 저장 완료 - 키:', contentService.STORAGE_KEY);
          
          // storageService에도 저장
          const storageSuccess = storageService.setContentPlans(contentPlans);
          console.log('💾 storageService 저장 결과:', storageSuccess);
          
          // 저장 후 즉시 검증
          const verification = localStorage.getItem(contentService.STORAGE_KEY);
          console.log('🔍 저장 검증:', verification ? JSON.parse(verification).length : 0, '개');
          
          console.log('=== contentService.createContentPlan 완료 ===');
          resolve(newPlan);
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
          // 통합된 방식으로 데이터 로딩
          let contentPlans: ContentPlanDetail[] = [];
          const data = localStorage.getItem(contentService.STORAGE_KEY);
          if (data && data !== 'null') {
            contentPlans = JSON.parse(data);
          }
          
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
            
            // 통합된 키로 저장
            localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(contentPlans));
            storageService.setContentPlans(contentPlans);
            
            console.log('=== contentService.updateContentPlan 완료 ===');
            resolve(contentPlans[index]);
          } else {
            throw new Error('기획안을 찾을 수 없음');
          }
        } catch (error) {
          console.error('=== contentService.updateContentPlan 실패 ===', error);
          reject(error);
        }
      }, 300);
    }),

  deleteContentPlan: async (planId: string): Promise<void> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== contentService.deleteContentPlan 시작 ===');
        console.log('기획안 ID:', planId);
        
        try {
          let contentPlans: ContentPlanDetail[] = [];
          const data = localStorage.getItem(contentService.STORAGE_KEY);
          if (data && data !== 'null') {
            contentPlans = JSON.parse(data);
          }
          
          const index = contentPlans.findIndex(p => p.id === planId);
          
          if (index !== -1) {
            const deletedPlan = contentPlans[index];
            contentPlans.splice(index, 1);
            
            // 통합된 키로 저장
            localStorage.setItem(contentService.STORAGE_KEY, JSON.stringify(contentPlans));
            storageService.setContentPlans(contentPlans);
            
            console.log('삭제된 기획안:', deletedPlan.influencerName);
            console.log('=== contentService.deleteContentPlan 완료 ===');
            resolve();
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
