
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

      const performanceSummary = performanceTrackerService.getPerformanceSummary();
      
      // Calculate campaign stages
      const campaignsByStage = {
        creation: campaigns.filter(c => 
          ['creating', 'submitted', 'recruiting', 'proposing', 'revising', 'revision-feedback', 'confirmed'].includes(c.status)
        ).length,
        content: campaigns.filter(c => 
          ['planning', 'plan-review', 'plan-revision', 'plan-approved', 'producing', 'content-review', 'content-approved'].includes(c.status)
        ).length,
        live: campaigns.filter(c => 
          ['live', 'monitoring', 'completed'].includes(c.status)
        ).length
      };

      // Content status analysis
      const contentStatus = {
        planningInProgress: campaigns.filter(c => 
          ['planning', 'plan-review', 'plan-revision'].includes(c.status)
        ).length,
        productionInProgress: campaigns.filter(c => 
          ['producing', 'content-review'].includes(c.status)
        ).length,
        reviewPending: campaigns.filter(c => 
          c.contentPlans?.some(plan => plan.status === 'revision-request') || false
        ).length
      };

      // Get recent campaigns (last 5)
      const recentCampaigns = campaigns
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          status: campaign.status,
          brandName: campaign.brandName,
          influencerCount: campaign.influencers.filter(inf => inf.status === 'confirmed').length,
          progress: this.calculateCampaignProgress(campaign.status)
        }));

      // Top influencers by performance
      const topInfluencers = campaigns
        .flatMap(c => c.influencers.filter(inf => inf.status === 'confirmed'))
        .sort((a, b) => b.engagementRate - a.engagementRate)
        .slice(0, 5)
        .map(inf => ({
          id: inf.id,
          name: inf.name,
          followers: inf.followers,
          engagementRate: inf.engagementRate,
          category: inf.category
        }));

      const stats: DashboardStats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => !['completed'].includes(c.status)).length,
        completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
        totalBrands: brands.length,
        totalProducts: products.length,
        totalInfluencers: campaigns.reduce((sum, c) => sum + c.influencers.filter(inf => inf.status === 'confirmed').length, 0),
        totalRevenue: campaigns.reduce((sum, c) => sum + c.budget, 0),
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

      const performanceSummary = performanceTrackerService.getPerformanceSummary();

      // Brand overview with campaign statistics
      const brandOverview = brands.map(brand => {
        const brandCampaigns = campaigns.filter(c => c.brandId === brand.id);
        const brandProducts = products.filter(p => p.brandId === brand.id);
        
        return {
          id: brand.id,
          name: brand.name,
          campaignCount: brandCampaigns.length,
          productCount: brandProducts.length,
          totalBudget: brandCampaigns.reduce((sum, c) => sum + c.budget, 0),
          activeCampaigns: brandCampaigns.filter(c => !['completed'].includes(c.status)).length,
          lastActivity: brandCampaigns.length > 0 ? 
            Math.max(...brandCampaigns.map(c => new Date(c.updatedAt).getTime())) : 0
        };
      });

      // Platform statistics
      const platformStats = {
        xiaohongshu: {
          totalContent: performanceSummary.xiaohongshu.count,
          totalExposure: performanceSummary.xiaohongshu.totalExposure,
          avgEngagement: performanceSummary.xiaohongshu.totalLikes / Math.max(performanceSummary.xiaohongshu.count, 1)
        },
        douyin: {
          totalContent: performanceSummary.douyin.count,
          totalViews: performanceSummary.douyin.totalViews,
          avgEngagement: performanceSummary.douyin.totalLikes / Math.max(performanceSummary.douyin.count, 1)
        }
      };

      // Revenue by brand
      const revenueByBrand = brandOverview
        .sort((a, b) => b.totalBudget - a.totalBudget)
        .slice(0, 10)
        .map(brand => ({
          brandName: brand.name,
          revenue: brand.totalBudget,
          campaigns: brand.campaignCount
        }));

      // Campaign distribution by status
      const campaignDistribution = {
        active: campaigns.filter(c => !['completed'].includes(c.status)).length,
        completed: campaigns.filter(c => c.status === 'completed').length,
        planning: campaigns.filter(c => ['planning', 'plan-review', 'plan-revision', 'plan-approved'].includes(c.status)).length,
        live: campaigns.filter(c => ['live', 'monitoring'].includes(c.status)).length
      };

      const stats: DashboardStats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => !['completed'].includes(c.status)).length,
        completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
        totalBrands: brands.length,
        totalProducts: products.length,
        totalInfluencers: campaigns.reduce((sum, c) => sum + c.influencers.filter(inf => inf.status === 'confirmed').length, 0),
        totalRevenue: campaigns.reduce((sum, c) => sum + c.budget, 0),
        monthlyGrowth: 18.2 // Mock growth rate
      };

      return {
        stats,
        brandOverview,
        platformStats,
        systemHealth: {
          activeUsers: brands.length + 15, // Mock active users
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
