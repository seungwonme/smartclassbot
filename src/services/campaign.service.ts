
import { Campaign, CampaignInfluencer, Persona } from "@/types/campaign";
import { mockCampaigns, mockInfluencers, mockPersonas } from "@/mocks/campaign.mock";

export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> =>
    new Promise((resolve) => setTimeout(() => resolve(mockCampaigns), 300)),

  getCampaignById: async (id: string): Promise<Campaign | null> =>
    new Promise((resolve) => 
      setTimeout(() => {
        const campaign = mockCampaigns.find(c => c.id === id);
        if (campaign) {
          // 기존 캠페인에 새 필드 기본값 추가
          const updatedCampaign = {
            ...campaign,
            currentStage: campaign.currentStage || 1,
            contentPlans: campaign.contentPlans || [],
            contentProductions: campaign.contentProductions || []
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
        const newCampaign: Campaign = {
          ...campaign,
          id: `c${Date.now()}`,
          currentStage: 1,
          contentPlans: [],
          contentProductions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockCampaigns.push(newCampaign);
        resolve(newCampaign);
      }, 500);
    }),

  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCampaigns.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCampaigns[index] = { 
            ...mockCampaigns[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          resolve(mockCampaigns[index]);
        }
      }, 300);
    }),

  deleteCampaign: async (id: string): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCampaigns.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCampaigns.splice(index, 1);
        }
        resolve();
      }, 300);
    }),

  getInfluencerRecommendations: async (budget: number, categories: string[]): Promise<CampaignInfluencer[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockInfluencers.filter(inf => 
          categories.includes(inf.category)
        );
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
        // 페르소나 기반 인플루언서 추천 로직
        resolve(mockInfluencers.slice(0, 3));
      }, 800);
    })
};
