
import { ChinesePerformanceMetrics, PlatformUrlData } from '@/types/analytics';
import { analyticsService } from './analytics.service';

class PerformanceTrackerService {
  private storageKey = 'performance_metrics';
  private trackingInterval: NodeJS.Timeout | null = null;

  // 성과 데이터 자동 업데이트 시작
  startTracking(): void {
    if (this.trackingInterval) return;
    
    console.log('🚀 성과 데이터 자동 추적 시작');
    
    this.trackingInterval = setInterval(() => {
      this.updateAllPerformanceData();
    }, 10 * 60 * 1000); // 10분마다 업데이트
    
    // 즉시 한 번 실행
    this.updateAllPerformanceData();
  }

  // 성과 데이터 자동 업데이트 중지
  stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      console.log('⏹️ 성과 데이터 자동 추적 중지');
    }
  }

  // 모든 URL의 성과 데이터 업데이트
  private updateAllPerformanceData(): void {
    try {
      const allUrls = JSON.parse(localStorage.getItem('campaign_monitoring_urls') || '[]');
      const updatedUrls = allUrls.map((url: PlatformUrlData) => ({
        ...url,
        analytics: this.generateUpdatedMetrics(url.platform, url.analytics)
      }));
      
      localStorage.setItem('campaign_monitoring_urls', JSON.stringify(updatedUrls));
      
      console.log('📊 성과 데이터 업데이트 완료:', updatedUrls.length, '개 URL');
      
      // 성과 지표도 업데이트
      this.updatePerformanceMetrics(updatedUrls);
      
    } catch (error) {
      console.error('성과 데이터 업데이트 실패:', error);
    }
  }

  // 플랫폼별 성과 지표 생성
  private generateUpdatedMetrics(platform: string, currentMetrics?: any) {
    const baseGrowth = Math.random() * 0.1 + 0.95; // 95-105% 성장률
    
    if (platform === 'xiaohongshu') {
      return {
        views: Math.floor((currentMetrics?.views || 10000) * baseGrowth + Math.random() * 500),
        likes: Math.floor((currentMetrics?.likes || 800) * baseGrowth + Math.random() * 50),
        comments: Math.floor((currentMetrics?.comments || 100) * baseGrowth + Math.random() * 10),
        shares: Math.floor((currentMetrics?.shares || 50) * baseGrowth + Math.random() * 5),
      };
    } else {
      return {
        views: Math.floor((currentMetrics?.views || 20000) * baseGrowth + Math.random() * 1000),
        likes: Math.floor((currentMetrics?.likes || 1500) * baseGrowth + Math.random() * 100),
        comments: Math.floor((currentMetrics?.comments || 200) * baseGrowth + Math.random() * 20),
        shares: Math.floor((currentMetrics?.shares || 100) * baseGrowth + Math.random() * 10),
      };
    }
  }

  // 상세 성과 지표 업데이트
  private updatePerformanceMetrics(urls: PlatformUrlData[]): void {
    const performanceMetrics: ChinesePerformanceMetrics[] = urls.map(url => ({
      id: `metrics_${url.id}`,
      urlId: url.id,
      campaignId: url.campaignId || '',
      influencerId: url.influencerId,
      platform: url.platform,
      xiaohongshuMetrics: url.platform === 'xiaohongshu' ? {
        exposure: url.analytics?.views || 0,
        likes: url.analytics?.likes || 0,
        collections: Math.floor((url.analytics?.likes || 0) * 0.3),
        comments: url.analytics?.comments || 0,
        shares: url.analytics?.shares || 0,
      } : undefined,
      douyinMetrics: url.platform === 'douyin' ? {
        views: url.analytics?.views || 0,
        likes: url.analytics?.likes || 0,
        comments: url.analytics?.comments || 0,
        shares: url.analytics?.shares || 0,
        follows: Math.floor((url.analytics?.likes || 0) * 0.1),
      } : undefined,
      chineseCommentAnalysis: this.generateCommentAnalysis(url.analytics?.comments || 0),
      lastUpdated: new Date().toISOString(),
    }));

    localStorage.setItem(this.storageKey, JSON.stringify(performanceMetrics));
  }

  // 중국어 댓글 분석 모의 데이터 생성
  private generateCommentAnalysis(totalComments: number) {
    const positive = Math.floor(totalComments * (0.6 + Math.random() * 0.2)); // 60-80%
    const negative = Math.floor(totalComments * (0.05 + Math.random() * 0.1)); // 5-15%
    const neutral = totalComments - positive - negative;

    return {
      totalComments,
      sentiment: { positive, negative, neutral },
      keywords: ['좋아요', '예뻐요', '추천', '구매', '만족'],
      emotions: {
        joy: Math.floor(positive * 0.7),
        anger: Math.floor(negative * 0.8),
        surprise: Math.floor(totalComments * 0.1),
      },
    };
  }

  // 성과 지표 조회
  getPerformanceMetrics(campaignId?: string): ChinesePerformanceMetrics[] {
    try {
      const allMetrics = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return campaignId 
        ? allMetrics.filter((m: ChinesePerformanceMetrics) => m.campaignId === campaignId)
        : allMetrics;
    } catch (error) {
      console.error('성과 지표 조회 실패:', error);
      return [];
    }
  }

  // 실시간 성과 요약 계산
  getPerformanceSummary(campaignId?: string) {
    const metrics = this.getPerformanceMetrics(campaignId);
    
    const xiaohongshuMetrics = metrics.filter(m => m.platform === 'xiaohongshu');
    const douyinMetrics = metrics.filter(m => m.platform === 'douyin');

    return {
      totalContent: metrics.length,
      xiaohongshu: {
        count: xiaohongshuMetrics.length,
        totalExposure: xiaohongshuMetrics.reduce((sum, m) => sum + (m.xiaohongshuMetrics?.exposure || 0), 0),
        totalLikes: xiaohongshuMetrics.reduce((sum, m) => sum + (m.xiaohongshuMetrics?.likes || 0), 0),
        totalCollections: xiaohongshuMetrics.reduce((sum, m) => sum + (m.xiaohongshuMetrics?.collections || 0), 0),
      },
      douyin: {
        count: douyinMetrics.length,
        totalViews: douyinMetrics.reduce((sum, m) => sum + (m.douyinMetrics?.views || 0), 0),
        totalLikes: douyinMetrics.reduce((sum, m) => sum + (m.douyinMetrics?.likes || 0), 0),
        totalFollows: douyinMetrics.reduce((sum, m) => sum + (m.douyinMetrics?.follows || 0), 0),
      },
      sentimentAnalysis: {
        totalComments: metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.totalComments || 0), 0),
        totalPositive: metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.sentiment.positive || 0), 0),
        totalNegative: metrics.reduce((sum, m) => sum + (m.chineseCommentAnalysis?.sentiment.negative || 0), 0),
      }
    };
  }
}

export const performanceTrackerService = new PerformanceTrackerService();
