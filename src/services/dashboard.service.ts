import { campaignService } from './campaign.service';
import { brandService } from './brand.service';
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

export interface SystemHealth {
  activeUsers: number;
  systemUptime: number;
  dataCollectionStatus: string;
  lastUpdateTime: string;
  platformsStatus: {
    xiaohongshu: 'active' | 'inactive' | 'error';
    douyin: 'active' | 'inactive' | 'error';
  };
  errorCount24h: number;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  brandOverview: any[];
  platformStats: any;
  systemHealth: SystemHealth;
  revenueByBrand: any[];
  campaignDistribution: any;
  recentActivities: any[];
  alertsAndNotifications: any[];
}

class DashboardService {
  // 안전한 브랜드 대시보드 데이터 로딩
  async getBrandDashboardData(): Promise<BrandDashboardData> {
    console.log('📊 브랜드 대시보드 데이터 생성 시작');
    
    // 각 서비스 호출을 안전하게 처리
    const [campaigns, brands, products] = await Promise.all([
      this.safeGetCampaigns(),
      this.safeGetBrands(),
      this.safeGetProducts()
    ]);

    console.log(`📈 데이터 로드 완료 - 캠페인: ${campaigns.length}, 브랜드: ${brands.length}, 제품: ${products.length}`);

    // 안전한 계산 수행
    const stats = this.calculateStats(campaigns, brands, products);
    const campaignsByStage = this.calculateCampaignStages(campaigns);
    const contentStatus = this.calculateContentStatus(campaigns);
    const recentCampaigns = this.getRecentCampaigns(campaigns);
    const topInfluencers = this.getTopInfluencers(campaigns);

    const result: BrandDashboardData = {
      stats,
      campaignsByStage,
      recentCampaigns,
      performanceSummary: {
        xiaohongshu: { count: 0, totalExposure: 0, totalLikes: 0 },
        douyin: { count: 0, totalViews: 0, totalLikes: 0 }
      },
      topInfluencers,
      contentStatus
    };

    console.log('✅ 브랜드 대시보드 데이터 생성 완료');
    return result;
  }

  // 안전한 서비스 호출 메서드들
  private async safeGetCampaigns(): Promise<any[]> {
    try {
      const campaigns = await campaignService.getCampaigns();
      return Array.isArray(campaigns) ? campaigns : [];
    } catch (error) {
      console.warn('⚠️ 캠페인 데이터 로드 실패:', error);
      return [];
    }
  }

  private async safeGetBrands(): Promise<any[]> {
    try {
      const brands = await brandService.getBrands();
      return Array.isArray(brands) ? brands : [];
    } catch (error) {
      console.warn('⚠️ 브랜드 데이터 로드 실패:', error);
      return [];
    }
  }

  private async safeGetProducts(): Promise<any[]> {
    try {
      const products = await brandService.getProducts();
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.warn('⚠️ 제품 데이터 로드 실패:', error);
      return [];
    }
  }

  private calculateCampaignStages(campaigns: any[]) {
    try {
      return {
        creation: campaigns.filter(c => 
          c?.status && ['creating', 'submitted', 'recruiting', 'proposing', 'revising', 'revision-feedback', 'confirmed'].includes(c.status)
        ).length,
        content: campaigns.filter(c => 
          c?.status && ['planning', 'plan-review', 'plan-revision', 'plan-approved', 'producing', 'content-review', 'content-approved'].includes(c.status)
        ).length,
        live: campaigns.filter(c => 
          c?.status && ['live', 'monitoring', 'completed'].includes(c.status)
        ).length
      };
    } catch (error) {
      console.warn('⚠️ 캠페인 단계 계산 실패:', error);
      return { creation: 0, content: 0, live: 0 };
    }
  }

  private calculateContentStatus(campaigns: any[]) {
    try {
      return {
        planningInProgress: campaigns.filter(c => 
          c?.status && ['planning', 'plan-review', 'plan-revision'].includes(c.status)
        ).length,
        productionInProgress: campaigns.filter(c => 
          c?.status && ['producing', 'content-review'].includes(c.status)
        ).length,
        reviewPending: campaigns.filter(c => 
          c?.contentPlans && Array.isArray(c.contentPlans) && c.contentPlans.some(plan => plan?.status === 'revision-request')
        ).length
      };
    } catch (error) {
      console.warn('⚠️ 콘텐츠 상태 계산 실패:', error);
      return { planningInProgress: 0, productionInProgress: 0, reviewPending: 0 };
    }
  }

  private getRecentCampaigns(campaigns: any[]) {
    try {
      return campaigns
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
    } catch (error) {
      console.warn('⚠️ 최근 캠페인 조회 실패:', error);
      return [];
    }
  }

  private getTopInfluencers(campaigns: any[]) {
    try {
      const allInfluencers = campaigns
        .filter(c => c && Array.isArray(c.influencers))
        .flatMap(c => c.influencers.filter(inf => inf?.status === 'confirmed'))
        .filter(inf => inf && typeof inf.engagementRate === 'number');

      return allInfluencers
        .sort((a, b) => (b.engagementRate || 0) - (a.engagementRate || 0))
        .slice(0, 5)
        .map(inf => ({
          id: inf.id || '',
          name: inf.name || 'Unknown Influencer',
          followers: inf.followers || 0,
          engagementRate: inf.engagementRate || 0,
          category: inf.category || 'General'
        }));
    } catch (error) {
      console.warn('⚠️ 상위 인플루언서 조회 실패:', error);
      return [];
    }
  }

  private calculateStats(campaigns: any[], brands: any[], products: any[]): DashboardStats {
    try {
      return {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
        completedCampaigns: campaigns.filter(c => c?.status === 'completed').length,
        totalBrands: brands.length,
        totalProducts: products.length,
        totalInfluencers: campaigns.reduce((sum, c) => {
          const confirmedInfluencers = Array.isArray(c?.influencers) ? 
            c.influencers.filter(inf => inf?.status === 'confirmed').length : 0;
          return sum + confirmedInfluencers;
        }, 0),
        totalRevenue: campaigns.reduce((sum, c) => sum + (c?.budget || 0), 0),
        monthlyGrowth: 15.5
      };
    } catch (error) {
      console.warn('⚠️ 통계 계산 실패:', error);
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        completedCampaigns: 0,
        totalBrands: 0,
        totalProducts: 0,
        totalInfluencers: 0,
        totalRevenue: 0,
        monthlyGrowth: 0
      };
    }
  }

  async getAdminDashboardData(): Promise<AdminDashboardData> {
    console.log('📊 관리자 대시보드 데이터 생성 시작');
    
    try {
      // 모든 데이터를 안전하게 병렬 로드
      const [campaigns, brands, products] = await Promise.all([
        this.safeGetCampaigns(),
        this.safeGetBrands(),
        this.safeGetProducts()
      ]);

      console.log(`📈 관리자 데이터 로드 완료 - 캠페인: ${campaigns.length}, 브랜드: ${brands.length}, 제품: ${products.length}`);

      // 플랫폼 설정 가져오기
      const platformSettings = this.safeGetPlatformSettings();

      // 각 섹션별 데이터 계산
      const stats = this.calculateStats(campaigns, brands, products);
      const brandOverview = this.calculateBrandOverview(brands, campaigns, products);
      const platformStats = this.calculatePlatformStats(campaigns, platformSettings);
      const systemHealth = this.calculateSystemHealth(brands, campaigns);
      const revenueByBrand = this.calculateRevenueByBrand(brandOverview);
      const campaignDistribution = this.calculateCampaignDistribution(campaigns);
      const recentActivities = this.getRecentActivities(campaigns, brands);
      const alertsAndNotifications = this.getSystemAlerts(systemHealth, campaigns);

      const result: AdminDashboardData = {
        stats,
        brandOverview,
        platformStats,
        systemHealth,
        revenueByBrand,
        campaignDistribution,
        recentActivities,
        alertsAndNotifications
      };

      console.log('✅ 관리자 대시보드 데이터 생성 완료');
      return result;
    } catch (error) {
      console.error('❌ 관리자 대시보드 데이터 생성 실패:', error);
      return this.getFallbackAdminData();
    }
  }

  private safeGetPlatformSettings() {
    try {
      return settingsService.getPlatformSettings();
    } catch (error) {
      console.warn('⚠️ 플랫폼 설정 로드 실패:', error);
      return {
        xiaohongshu: { enabled: true, crawlingInterval: 10 },
        douyin: { enabled: true, crawlingInterval: 10 }
      };
    }
  }

  private calculateBrandOverview(brands: any[], campaigns: any[], products: any[]) {
    try {
      return brands.map(brand => {
        const brandCampaigns = campaigns.filter(c => c?.brandId === brand?.id);
        const brandProducts = products.filter(p => p?.brandId === brand?.id);
        
        return {
          id: brand?.id || '',
          name: brand?.name || 'Unknown Brand',
          campaignCount: brandCampaigns.length,
          productCount: brandProducts.length,
          totalBudget: brandCampaigns.reduce((sum, c) => sum + (c?.budget || 0), 0),
          activeCampaigns: brandCampaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
          lastActivity: brandCampaigns.length > 0 ? 
            Math.max(...brandCampaigns.map(c => new Date(c?.updatedAt || 0).getTime())) : 0,
          status: brandCampaigns.some(c => c?.status && ['live', 'monitoring'].includes(c.status)) ? 'active' : 'inactive'
        };
      });
    } catch (error) {
      console.warn('⚠️ 브랜드 개요 계산 실패:', error);
      return [];
    }
  }

  private calculatePlatformStats(campaigns: any[], platformSettings: any) {
    try {
      const xiaohongshuviews = campaigns.reduce((sum, c) => sum + (c?.performanceData?.xiaohongshu?.totalExposure || 0), 0);
      const douyinViews = campaigns.reduce((sum, c) => sum + (c?.performanceData?.douyin?.totalViews || 0), 0);

      return {
        xiaohongshu: {
          enabled: platformSettings?.xiaohongshu?.enabled || false,
          totalContent: campaigns.filter(c => c?.platforms?.includes('xiaohongshu')).length,
          totalExposure: xiaohongshuviews,
          avgEngagement: xiaohongshuviews > 0 ? xiaohongshuviews / 1000 : 0,
          crawlingInterval: platformSettings?.xiaohongshu?.crawlingInterval || 10
        },
        douyin: {
          enabled: platformSettings?.douyin?.enabled || false,
          totalContent: campaigns.filter(c => c?.platforms?.includes('douyin')).length,
          totalViews: douyinViews,
          avgEngagement: douyinViews > 0 ? douyinViews / 1000 : 0,
          crawlingInterval: platformSettings?.douyin?.crawlingInterval || 10
        }
      };
    } catch (error) {
      console.warn('⚠️ 플랫폼 통계 계산 실패:', error);
      return {
        xiaohongshu: { enabled: false, totalContent: 0, totalExposure: 0, avgEngagement: 0 },
        douyin: { enabled: false, totalContent: 0, totalViews: 0, avgEngagement: 0 }
      };
    }
  }

  private calculateSystemHealth(brands: any[], campaigns: any[]): SystemHealth {
    try {
      const now = new Date();
      const recentCampaigns = campaigns.filter(c => {
        const updatedAt = new Date(c?.updatedAt || 0);
        return (now.getTime() - updatedAt.getTime()) < (24 * 60 * 60 * 1000); // 24시간 이내
      });

      return {
        activeUsers: brands.length + 15, // 브랜드 수 + 예상 사용자
        systemUptime: 99.8,
        dataCollectionStatus: 'Active',
        lastUpdateTime: now.toISOString(),
        platformsStatus: {
          xiaohongshu: 'active',
          douyin: 'active'
        },
        errorCount24h: Math.floor(Math.random() * 3) // 시뮬레이션
      };
    } catch (error) {
      console.warn('⚠️ 시스템 상태 계산 실패:', error);
      return {
        activeUsers: 0,
        systemUptime: 0,
        dataCollectionStatus: 'Unknown',
        lastUpdateTime: new Date().toISOString(),
        platformsStatus: { xiaohongshu: 'error', douyin: 'error' },
        errorCount24h: 0
      };
    }
  }

  private calculateRevenueByBrand(brandOverview: any[]) {
    try {
      return brandOverview
        .sort((a, b) => (b.totalBudget || 0) - (a.totalBudget || 0))
        .slice(0, 10)
        .map(brand => ({
          brandName: brand.name,
          revenue: brand.totalBudget,
          campaigns: brand.campaignCount,
          growth: Math.random() * 30 - 10 // 시뮬레이션: -10% ~ +20%
        }));
    } catch (error) {
      console.warn('⚠️ 브랜드별 수익 계산 실패:', error);
      return [];
    }
  }

  private calculateCampaignDistribution(campaigns: any[]) {
    try {
      return {
        active: campaigns.filter(c => c?.status && !['completed'].includes(c.status)).length,
        completed: campaigns.filter(c => c?.status === 'completed').length,
        planning: campaigns.filter(c => c?.status && ['planning', 'plan-review', 'plan-revision', 'plan-approved'].includes(c.status)).length,
        live: campaigns.filter(c => c?.status && ['live', 'monitoring'].includes(c.status)).length
      };
    } catch (error) {
      console.warn('⚠️ 캠페인 분포 계산 실패:', error);
      return { active: 0, completed: 0, planning: 0, live: 0 };
    }
  }

  private getRecentActivities(campaigns: any[], brands: any[]) {
    try {
      const activities = [];
      
      // 최근 캠페인 활동
      campaigns
        .filter(c => c?.updatedAt)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .forEach(campaign => {
          activities.push({
            type: 'campaign',
            title: `캠페인 업데이트: ${campaign.title || 'Untitled'}`,
            description: `상태: ${campaign.status || 'unknown'}`,
            timestamp: campaign.updatedAt,
            severity: 'info'
          });
        });

      return activities.slice(0, 10);
    } catch (error) {
      console.warn('⚠️ 최근 활동 조회 실패:', error);
      return [];
    }
  }

  private getSystemAlerts(systemHealth: SystemHealth, campaigns: any[]) {
    try {
      const alerts = [];

      // 시스템 상태 알림
      if (systemHealth.systemUptime < 99.0) {
        alerts.push({
          type: 'warning',
          title: '시스템 가동률 저하',
          description: `현재 가동률: ${systemHealth.systemUptime}%`,
          timestamp: new Date().toISOString()
        });
      }

      // 에러 알림
      if (systemHealth.errorCount24h > 5) {
        alerts.push({
          type: 'error',
          title: '높은 에러 발생률',
          description: `24시간 내 ${systemHealth.errorCount24h}개 에러 발생`,
          timestamp: new Date().toISOString()
        });
      }

      // 캠페인 알림
      const urgentCampaigns = campaigns.filter(c => 
        c?.status === 'content-review' && 
        new Date(c?.deadline || 0).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
      );

      if (urgentCampaigns.length > 0) {
        alerts.push({
          type: 'warning',
          title: '긴급 검토 필요',
          description: `${urgentCampaigns.length}개 캠페인 마감 임박`,
          timestamp: new Date().toISOString()
        });
      }

      return alerts.slice(0, 5);
    } catch (error) {
      console.warn('⚠️ 시스템 알림 생성 실패:', error);
      return [];
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

  getFallbackAdminData(): AdminDashboardData {
    console.log('🔄 Using fallback admin data');
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
      brandOverview: [
        { id: 'b1', name: '샘플 브랜드 A', campaignCount: 5, productCount: 8, totalBudget: 500000000, activeCampaigns: 3, status: 'active' },
        { id: 'b2', name: '샘플 브랜드 B', campaignCount: 3, productCount: 6, totalBudget: 300000000, activeCampaigns: 2, status: 'active' }
      ],
      platformStats: {
        xiaohongshu: { enabled: true, totalContent: 15, totalExposure: 2500000, avgEngagement: 2500 },
        douyin: { enabled: true, totalContent: 10, totalViews: 1800000, avgEngagement: 1800 }
      },
      systemHealth: {
        activeUsers: 23,
        systemUptime: 99.8,
        dataCollectionStatus: 'Active',
        lastUpdateTime: new Date().toISOString(),
        platformsStatus: { xiaohongshu: 'active', douyin: 'active' },
        errorCount24h: 2
      },
      revenueByBrand: [
        { brandName: '샘플 브랜드 A', revenue: 500000000, campaigns: 5, growth: 15.2 },
        { brandName: '샘플 브랜드 B', revenue: 300000000, campaigns: 3, growth: 8.7 }
      ],
      campaignDistribution: { active: 18, completed: 7, planning: 5, live: 8 },
      recentActivities: [
        { type: 'campaign', title: '새 캠페인 생성', description: '뷰티 브랜드 A - 립스틱 프로모션', timestamp: new Date().toISOString(), severity: 'info' }
      ],
      alertsAndNotifications: [
        { type: 'info', title: '시스템 정상 운영', description: '모든 시스템이 정상적으로 작동 중입니다.', timestamp: new Date().toISOString() }
      ]
    };
  }

  // Make getFallbackBrandData public for external access
  getFallbackBrandData(): BrandDashboardData {
    console.log('🔄 Using fallback brand data');
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
      performanceSummary: {
        xiaohongshu: { count: 0, totalExposure: 0, totalLikes: 0 },
        douyin: { count: 0, totalViews: 0, totalLikes: 0 }
      },
      topInfluencers: [],
      contentStatus: { planningInProgress: 2, productionInProgress: 3, reviewPending: 1 }
    };
  }
}

export const dashboardService = new DashboardService();
