import { Campaign, CampaignInfluencer, Persona } from "@/types/campaign";
import { mockCampaigns, mockInfluencers, mockPersonas } from "@/mocks/campaign.mock";
import { storageService } from "./storage.service";

// 초기 데이터 시드 함수
const initializeCampaignData = () => {
  if (!storageService.isInitialized()) {
    storageService.setCampaigns(mockCampaigns);
    storageService.setInitialized();
  }
};

// 앱 시작 시 초기화
initializeCampaignData();

export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const campaigns = storageService.getCampaigns();
        resolve(campaigns);
      }, 300);
    }),

  getCampaignById: async (id: string): Promise<Campaign | null> =>
    new Promise((resolve) => 
      setTimeout(() => {
        const campaigns = storageService.getCampaigns();
        const campaign = campaigns.find(c => c.id === id);
        if (campaign) {
          // 기존 캠페인에 새 필드 기본값 추가
          const updatedCampaign = {
            ...campaign,
            currentStage: campaign.currentStage || 1,
            contentPlans: campaign.contentPlans || []
          };
          resolve(updatedCampaign);
        } else {
          resolve(null);
        }
      }, 300)
    ),

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== campaignService.createCampaign 시작 ===');
        console.log('📨 받은 캠페인 데이터:', campaign);
        console.log('📨 받은 캠페인 상태:', campaign.status);
        
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
        console.log('🏗️ 캠페인 상태:', newCampaign.status);
        console.log('🏗️ 캠페인 ID:', newCampaign.id);
        
        campaigns.push(newCampaign);
        storageService.setCampaigns(campaigns);
        
        console.log('💾 저장 완료 - 전체 캠페인 목록:', campaigns.length);
        console.log('💾 저장된 캠페인들의 상태:', campaigns.map(c => ({ id: c.id, title: c.title, status: c.status })));
        console.log('=== campaignService.createCampaign 완료 ===');
        
        resolve(newCampaign);
      }, 500);
    }),

  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== campaignService.updateCampaign 시작 ===');
        console.log('업데이트할 캠페인 ID:', id);
        console.log('업데이트 데이터:', updates);
        
        if (updates.influencers) {
          console.log('=== 인플루언서 광고비 정보 업데이트 ===');
          updates.influencers.forEach(inf => {
            console.log(`- ${inf.name}: 상태=${inf.status}, 광고비=${inf.adFee}원 (타입: ${typeof inf.adFee})`);
          });
        }
        
        const campaigns = storageService.getCampaigns();
        const index = campaigns.findIndex(c => c.id === id);
        if (index !== -1) {
          const originalCampaign = campaigns[index];
          console.log('원본 캠페인:', originalCampaign);
          
          if (updates.influencers && originalCampaign.influencers) {
            console.log('=== 광고비 보존 확인 ===');
            updates.influencers.forEach(updatedInf => {
              const originalInf = originalCampaign.influencers.find(orig => orig.id === updatedInf.id);
              if (originalInf) {
                console.log(`인플루언서 ${updatedInf.name}:`);
                console.log(`  - 원본 광고비: ${originalInf.adFee}원`);
                console.log(`  - 업데이트된 광고비: ${updatedInf.adFee}원`);
                console.log(`  - 광고비 보존됨: ${originalInf.adFee === updatedInf.adFee}`);
              }
            });
          }
          
          campaigns[index] = { 
            ...campaigns[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          
          console.log('업데이트된 캠페인:', campaigns[index]);
          console.log('업데이트된 캠페인 상태:', campaigns[index].status);
          
          if (campaigns[index].influencers) {
            console.log('=== 최종 저장된 인플루언서 광고비 ===');
            campaigns[index].influencers.forEach(inf => {
              console.log(`- ${inf.name}: ${inf.adFee}원 (상태: ${inf.status})`);
            });
          }
          
          storageService.setCampaigns(campaigns);
          console.log('=== campaignService.updateCampaign 완료 ===');
          resolve(campaigns[index]);
        }
      }, 300);
    }),

  deleteCampaign: async (id: string): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const campaigns = storageService.getCampaigns();
        const index = campaigns.findIndex(c => c.id === id);
        if (index !== -1) {
          campaigns.splice(index, 1);
          storageService.setCampaigns(campaigns);
        }
        resolve();
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
