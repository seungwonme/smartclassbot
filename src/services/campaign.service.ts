
import { Campaign, CampaignInfluencer, Persona } from "@/types/campaign";
import { mockCampaigns, mockInfluencers, mockPersonas } from "@/mocks/campaign.mock";

export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> =>
    new Promise((resolve) => setTimeout(() => resolve(mockCampaigns), 300)),

  getCampaignById: async (id: string): Promise<Campaign | null> =>
    new Promise((resolve) => 
      setTimeout(() => {
        const campaign = mockCampaigns.find(c => c.id === id);
        resolve(campaign || null);
      }, 300)
    ),

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...campaign,
          id: `c${Date.now()}`,
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
