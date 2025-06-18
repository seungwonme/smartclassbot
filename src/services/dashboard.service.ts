
import { campaignService } from './campaign.service';
import { brandService } from './brand.service';
import { performanceTrackerService } from './performanceTracker.service';
import { analyticsService } from './analytics.service';
import { settingsService } from './settings.service';

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalBrands: number;
  totalProducts: number;
  totalInfluencers: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface BrandDashboardData {
  stats: DashboardStats;
  campaignsByStage: {
    creation: number;
    content: number;
    live: number;
  };
  recentCampaigns: any[];
  performanceSummary: any;
  topInfluencers: any[];
  contentStatus: {
    planningInProgress: number;
    productionInProgress: number;
    reviewPending: number;
  };
}

export interface AdminDashboardData {
  stats: DashboardStats;
  brandOverview: any[];
  platformStats: any;
  systemHealth: {
    activeUsers: number;
    systemUptime: number;
    dataCollectionStatus: string;
  };
  revenueByBrand: any[];
  campaignDistribution: any;
}

class DashboardService {
  // Brand Admin Dashboard Data
  async getBrandDashboardData(): Promise<BrandDashboardData> {
    try {
      const [campaigns, brands, products] = await Promise.all([
        campaignService.getCampaigns(),
        brandService.getBrands(),
        brandService.getProducts()
      ]);

      // Ensure campaigns is always an array
      const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
      const safeBrands = Array.isArray(brands) ? brands : [];
      const safeProducts = Array.isArray(products) ? products : [];

      const performanceSummary = performanceTrackerService.getPerformanceSummary() || {
        xiaohongshu: { count: 0, totalExposure: 0, totalLikes: 0 },
        douyin: { count: 0, totalViews: 0, totalLikes: 0 }
      };
      
      // Calculate campaign stages with safe array access
      const campaignsByStage = {
        creation: safeCampaigns.filter(c => 
          c?.status && ['creating', 'submitted', 'recruiting', 'proposing', 'revising', 'revision-feedback', 'confirmed'].includes(c.status)
        ).length,
        content: safeCampaigns.filter(c => 
          c?.status && ['planning', 'plan-review', 'plan-revision', 'plan-approved', 'producing', 'content-review', 'content-approved'].includes(c.status)
        ).length,
        live: safeCampaigns.filter(c => 
          c?.status && ['live', 'monitoring', 'completed'].includes(c.status)
        ).length
      };

      // Content status analysis with safe access
      const contentStatus = {
        planningInProgress: safeCampaigns.filter(c => 
          c?.status && ['planning', 'plan-review', 'plan-revision'].includes(c.status)
        ).length,
        productionInProgress: safeCampaigns.filter(c => 
          c?.status && ['producing', 'content-review'].includes(c.status)
        ).length,
        reviewPending: safeCampaigns.filter(c => 
          c?.contentPlans && Array.isArray(c.contentPlans) && c.contentPlans.some(plan => plan?.status === 'revision-request')
        ).length
      };

      // Get recent campaigns (last 5) with safe sorting
      const recentCampaigns = safeCampaigns
        .filter(campaign => campaign && campaign.updatedAt)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .map(campaign => ({
          id: campaign.id || '',
          title: campaign.title || 'Untitled Campaign',
          status: campaign.status || 'unknown',
          brandName: campaign.brandName || 'Unknown Brand',
          influencerCount: Array.isArray(campaign.influencers) ? 
            campaign.influencers.filter(inf => inf?.status === 'confirmed').length : 0,
          progress: this.calculateCampaignProgress(campaign.status || '')
        }));

      // Top influencers by performance with safe access
      const allInfluencers = safeCampaigns
        .filter(c => c && Array.isArray(c.influencers))
        .flatMap(c => c.influencers.filter(inf => inf?.status === 'confirmed'))
        .filter(inf => inf && typeof inf.engagementRate === 'number');

      const topInfluencers = allInfluencers
        .sort((a, b) => (b.engagementRate || 0) - (a.engagementRate || 0))
        .slice(0, 5)
        .map(inf => ({
          id: inf.id || '',
          name: inf.name || 'Unknown Influencer',
          followers: inf.followers || 0,
          engagementRate: inf.engagementRate || 0,
          category: inf.category || 'General'
        }));

      const stats: DashboardStats = {
        totalCampaigns: safeCampaigns.length,
        activeCampaigns: safeCampaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
        completedCampaigns: safeCampaigns.filter(c => c?.status === 'completed').length,
        totalBrands: safeBrands.length,
        totalProducts: safeProducts.length,
        totalInfluencers: safeCampaigns.reduce((sum, c) => {
          const confirmedInfluencers = Array.isArray(c?.influencers) ? 
            c.influencers.filter(inf => inf?.status === 'confirmed').length : 0;
          return sum + confirmedInfluencers;
        }, 0),
        totalRevenue: safeCampaigns.reduce((sum, c) => sum + (c?.budget || 0), 0),
        monthlyGrowth: 15.5 // Mock growth rate
      };

      return {
        stats,
        campaignsByStage,
        recentCampaigns,
        performanceSummary,
        topInfluencers,
        contentStatus
      };
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      return this.getFallbackBrandData();
    }
  }

  // Admin Dashboard Data
  async getAdminDashboardData(): Promise<AdminDashboardData> {
    try {
      const [campaigns, brands, products] = await Promise.all([
        campaignService.getCampaigns(),
        brandService.getBrands(),
        brandService.getProducts()
      ]);

      // Ensure all data is arrays
      const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
      const safeBrands = Array.isArray(brands) ? brands : [];
      const safeProducts = Array.isArray(products) ? products : [];

      const performanceSummary = performanceTrackerService.getPerformanceSummary() || {
        xiaohongshu: { count: 0, totalExposure: 0, totalLikes: 0 },
        douyin: { count: 0, totalViews: 0, totalLikes: 0 }
      };

      // Brand overview with campaign statistics
      const brandOverview = safeBrands.map(brand => {
        const brandCampaigns = safeCampaigns.filter(c => c?.brandId === brand?.id);
        const brandProducts = safeProducts.filter(p => p?.brandId === brand?.id);
        
        return {
          id: brand?.id || '',
          name: brand?.name || 'Unknown Brand',
          campaignCount: brandCampaigns.length,
          productCount: brandProducts.length,
          totalBudget: brandCampaigns.reduce((sum, c) => sum + (c?.budget || 0), 0),
          activeCampaigns: brandCampaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
          lastActivity: brandCampaigns.length > 0 ? 
            Math.max(...brandCampaigns.map(c => new Date(c?.updatedAt || 0).getTime())) : 0
        };
      });

      // Platform statistics with safe access
      const platformStats = {
        xiaohongshu: {
          totalContent: performanceSummary?.xiaohongshu?.count || 0,
          totalExposure: performanceSummary?.xiaohongshu?.totalExposure || 0,
          avgEngagement: (performanceSummary?.xiaohongshu?.totalLikes || 0) / Math.max(performanceSummary?.xiaohongshu?.count || 1, 1)
        },
        douyin: {
          totalContent: performanceSummary?.douyin?.count || 0,
          totalViews: performanceSummary?.douyin?.totalViews || 0,
          avgEngagement: (performanceSummary?.douyin?.totalLikes || 0) / Math.max(performanceSummary?.douyin?.count || 1, 1)
        }
      };

      // Revenue by brand
      const revenueByBrand = brandOverview
        .sort((a, b) => (b.totalBudget || 0) - (a.totalBudget || 0))
        .slice(0, 10)
        .map(brand => ({
          brandName: brand.name,
          revenue: brand.totalBudget,
          campaigns: brand.campaignCount
        }));

      // Campaign distribution by status
      const campaignDistribution = {
        active: safeCampaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
        completed: safeCampaigns.filter(c => c?.status === 'completed').length,
        planning: safeCampaigns.filter(c => c?.status && ['planning', 'plan-review', 'plan-revision', 'plan-approved'].includes(c.status)).length,
        live: safeCampaigns.filter(c => c?.status && ['live', 'monitoring'].includes(c.status)).length
      };

      const stats: DashboardStats = {
        totalCampaigns: safeCampaigns.length,
        activeCampaigns: safeCampaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
        completedCampaigns: safeCampaigns.filter(c => c?.status === 'completed').length,
        totalBrands: safeBrands.length,
        totalProducts: safeProducts.length,
        totalInfluencers: safeCampaigns.reduce((sum, c) => {
          const confirmedInfluencers = Array.isArray(c?.influencers) ? 
            c.influencers.filter(inf => inf?.status === 'confirmed').length : 0;
          return sum + confirmedInfluencers;
        }, 0),
        totalRevenue: safeCampaigns.reduce((sum, c) => sum + (c?.budget || 0), 0),
        monthlyGrowth: 18.2 // Mock growth rate
      };

      return {
        stats,
        brandOverview,
        platformStats,
        systemHealth: {
          activeUsers: safeBrands.length + 15, // Mock active users
          systemUptime: 99.8,
          dataCollectionStatus: settingsService.isPlatformEnabled('xiaohongshu') ? 'Active' : 'Paused'
        },
        revenueByBrand,
        campaignDistribution
      };
    } catch (error) {
      console.error('Admin dashboard data fetch error:', error);
      return this.getFallbackAdminData();
    }
  }

  private calculateCampaignProgress(status: string): number {
    const progressMap: { [key: string]: number } = {
      'creating': 10,
      'submitted': 20,
      'recruiting': 30,
      'proposing': 40,
      'revising': 35,
      'revision-feedback': 38,
      'confirmed': 50,
      'planning': 60,
      'plan-review': 65,
      'plan-revision': 62,
      'plan-approved': 70,
      'producing': 80,
      'content-review': 85,
      'content-approved': 90,
      'live': 95,
      'monitoring': 98,
      'completed': 100
    };
    return progressMap[status] || 0;
  }

  private getFallbackBrandData(): BrandDashboardData {
    return {
      stats: {
        totalCampaigns: 12,
        activeCampaigns: 8,
        completedCampaigns: 4,
        totalBrands: 3,
        totalProducts: 15,
        totalInfluencers: 85,
        totalRevenue: 450000000,
        monthlyGrowth: 15.5
      },
      campaignsByStage: { creation: 4, content: 3, live: 5 },
      recentCampaigns: [],
      performanceSummary: { totalContent: 0, xiaohongshu: { count: 0 }, douyin: { count: 0 } },
      topInfluencers: [],
      contentStatus: { planningInProgress: 2, productionInProgress: 3, reviewPending: 1 }
    };
  }

  private getFallbackAdminData(): AdminDashboardData {
    return {
      stats: {
        totalCampaigns: 25,
        activeCampaigns: 18,
        completedCampaigns: 7,
        totalBrands: 8,
        totalProducts: 45,
        totalInfluencers: 150,
        totalRevenue: 1200000000,
        monthlyGrowth: 18.2
      },
      brandOverview: [],
      platformStats: { xiaohongshu: { totalContent: 0 }, douyin: { totalContent: 0 } },
      systemHealth: { activeUsers: 23, systemUptime: 99.8, dataCollectionStatus: 'Active' },
      revenueByBrand: [],
      campaignDistribution: { active: 18, completed: 7, planning: 5, live: 8 }
    };
  }
}

export const dashboardService = new DashboardService();
