import { Campaign, CampaignInfluencer, Persona } from "@/types/campaign";
import { mockCampaigns, mockInfluencers, mockPersonas } from "@/mocks/campaign.mock";
import { storageService } from "./storage.service";

// 초기 데이터 시드 함수 (개선된 버전)
const initializeCampaignData = () => {
  console.log('=== 캠페인 데이터 초기화 시작 ===');
  
  if (!storageService.isInitialized()) {
    console.log('초기 데이터 설정 중...');
    const success = storageService.setCampaigns(mockCampaigns);
    
    if (success) {
      storageService.setInitialized();
      console.log('초기 데이터 설정 완료');
    } else {
      console.error('초기 데이터 설정 실패');
    }
  } else {
    console.log('이미 초기화됨 - 데이터 무결성 검사');
    const isValid = storageService.validateAllData();
    
    if (!isValid) {
      console.log('데이터 무결성 검사 실패 - 재초기화');
      storageService.clearAllData();
      storageService.setCampaigns(mockCampaigns);
      storageService.setInitialized();
    }
  }
  
  console.log('=== 캠페인 데이터 초기화 완료 ===');
};

// 앱 시작 시 초기화
initializeCampaignData();

export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== campaignService.getCampaigns 시작 ===');
        
        const campaigns = storageService.getCampaigns();
        
        // 필수 필드 보장
        const normalizedCampaigns = campaigns.map(campaign => ({
          ...campaign,
          currentStage: campaign.currentStage || 1,
          contentPlans: campaign.contentPlans || []
        }));
        
        console.log('정규화된 캠페인 데이터:', normalizedCampaigns.length, '개');
        console.log('=== campaignService.getCampaigns 완료 ===');
        
        resolve(normalizedCampaigns);
      }, 300);
    }),

  getCampaignById: async (id: string): Promise<Campaign | null> =>
    new Promise((resolve) => 
      setTimeout(() => {
        console.log('=== campaignService.getCampaignById 시작 ===');
        console.log('요청된 캠페인 ID:', id);
        
        const campaigns = storageService.getCampaigns();
        const campaign = campaigns.find(c => c.id === id);
        
        if (campaign) {
          // 기존 캠페인에 새 필드 기본값 추가
          const updatedCampaign = {
            ...campaign,
            currentStage: campaign.currentStage || 1,
            contentPlans: campaign.contentPlans || []
          };
          
          console.log('찾은 캠페인:', updatedCampaign.title);
          console.log('=== campaignService.getCampaignById 완료 ===');
          resolve(updatedCampaign);
        } else {
          console.log('캠페인을 찾을 수 없음');
          console.log('=== campaignService.getCampaignById 완료 ===');
          resolve(null);
        }
      }, 300)
    ),

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== campaignService.createCampaign 시작 ===');
        console.log('📨 받은 캠페인 데이터:', campaign);
        
        try {
          const campaigns = storageService.getCampaigns();
          const newCampaign: Campaign = {
            ...campaign,
            id: `c${Date.now()}`,
            currentStage: 1,
            contentPlans: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          console.log('🏗️ 생성될 새 캠페인:', newCampaign);
          
          campaigns.push(newCampaign);
          const success = storageService.setCampaigns(campaigns);
          
          if (success) {
            console.log('💾 저장 완료 - 전체 캠페인 목록:', campaigns.length);
            console.log('=== campaignService.createCampaign 완료 ===');
            resolve(newCampaign);
          } else {
            throw new Error('캠페인 저장 실패');
          }
        } catch (error) {
          console.error('=== campaignService.createCampaign 실패 ===', error);
          reject(error);
        }
      }, 500);
    }),

  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== campaignService.updateCampaign 시작 ===');
        console.log('업데이트할 캠페인 ID:', id);
        console.log('업데이트 데이터:', updates);
        
        try {
          const campaigns = storageService.getCampaigns();
          const index = campaigns.findIndex(c => c.id === id);
          
          if (index !== -1) {
            const originalCampaign = campaigns[index];
            console.log('원본 캠페인:', originalCampaign.title);
            
            campaigns[index] = { 
              ...campaigns[index], 
              ...updates, 
              updatedAt: new Date().toISOString() 
            };
            
            console.log('업데이트된 캠페인:', campaigns[index].title);
            
            const success = storageService.setCampaigns(campaigns);
            
            if (success) {
              console.log('=== campaignService.updateCampaign 완료 ===');
              resolve(campaigns[index]);
            } else {
              throw new Error('캠페인 업데이트 저장 실패');
            }
          } else {
            throw new Error('캠페인을 찾을 수 없음');
          }
        } catch (error) {
          console.error('=== campaignService.updateCampaign 실패 ===', error);
          reject(error);
        }
      }, 300);
    }),

  deleteCampaign: async (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('=== campaignService.deleteCampaign 시작 ===');
        console.log('삭제할 캠페인 ID:', id);
        
        try {
          const campaigns = storageService.getCampaigns();
          const index = campaigns.findIndex(c => c.id === id);
          
          if (index !== -1) {
            const deletedCampaign = campaigns[index];
            campaigns.splice(index, 1);
            
            const success = storageService.setCampaigns(campaigns);
            
            if (success) {
              console.log('삭제된 캠페인:', deletedCampaign.title);
              console.log('=== campaignService.deleteCampaign 완료 ===');
              resolve();
            } else {
              throw new Error('캠페인 삭제 저장 실패');
            }
          } else {
            throw new Error('삭제할 캠페인을 찾을 수 없음');
          }
        } catch (error) {
          console.error('=== campaignService.deleteCampaign 실패 ===', error);
          reject(error);
        }
      }, 300);
    }),

  getInfluencerRecommendations: async (budget: number, categories: string[]): Promise<CampaignInfluencer[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('AI 추천 요청 - 예산:', budget, '카테고리:', categories);
        
        let filtered = mockInfluencers;
        
        if (categories && categories.length > 0) {
          filtered = mockInfluencers.filter(inf => 
            categories.some(selectedCategory => 
              inf.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
              selectedCategory.toLowerCase().includes(inf.category.toLowerCase())
            )
          );
        }
        
        if (budget > 0) {
          const budgetTier = budget >= 50000000 ? 10 : budget >= 10000000 ? 8 : budget >= 5000000 ? 6 : 4;
          filtered = filtered.slice(0, budgetTier);
        } else {
          filtered = filtered.slice(0, 5);
        }
        
        console.log('AI 추천 결과:', filtered.length, '명의 인플루언서');
        resolve(filtered);
      }, 800);
    }),

  getPersonaRecommendations: async (productId: string): Promise<Persona[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const personas = mockPersonas.filter(p => p.productId === productId);
        resolve(personas);
      }, 500);
    }),

  getPersonaBasedInfluencers: async (personaId: string, budget: number): Promise<CampaignInfluencer[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const recommendedCount = budget >= 50000000 ? 8 : budget >= 10000000 ? 6 : 4;
        resolve(mockInfluencers.slice(0, recommendedCount));
      }, 800);
    })
};
