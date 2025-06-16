
import { PlatformUrlData } from '@/types/analytics';

class AnalyticsService {
  private storageKey = 'campaign_monitoring_urls';

  // URL 목록 조회
  getMonitoringUrls(campaignId: string): PlatformUrlData[] {
    try {
      const allUrls = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return allUrls.filter((url: PlatformUrlData) => 
        url.campaignId === campaignId
      );
    } catch (error) {
      console.error('URL 목록 조회 실패:', error);
      return [];
    }
  }

  // URL 추가
  addMonitoringUrl(campaignId: string, urlData: Omit<PlatformUrlData, 'id' | 'addedAt' | 'campaignId'>): PlatformUrlData {
    try {
      const allUrls = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      
      const newUrl: PlatformUrlData = {
        ...urlData,
        id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
        campaignId,
        analytics: {
          views: Math.floor(Math.random() * 50000),
          likes: Math.floor(Math.random() * 5000),
          comments: Math.floor(Math.random() * 500),
          shares: Math.floor(Math.random() * 250)
        }
      };

      allUrls.push(newUrl);
      localStorage.setItem(this.storageKey, JSON.stringify(allUrls));
      
      console.log('=== URL 등록 완료 ===');
      console.log('캠페인 ID:', campaignId);
      console.log('플랫폼:', urlData.platform);
      console.log('인플루언서:', urlData.influencerName);
      console.log('URL:', urlData.url);
      
      return newUrl;
    } catch (error) {
      console.error('URL 추가 실패:', error);
      throw new Error('URL 추가에 실패했습니다.');
    }
  }

  // URL 삭제
  removeMonitoringUrl(campaignId: string, urlId: string): void {
    try {
      const allUrls = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filteredUrls = allUrls.filter((url: PlatformUrlData) => 
        !(url.campaignId === campaignId && url.id === urlId)
      );
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredUrls));
      
      console.log('=== URL 삭제 완료 ===');
      console.log('캠페인 ID:', campaignId);
      console.log('삭제된 URL ID:', urlId);
    } catch (error) {
      console.error('URL 삭제 실패:', error);
      throw new Error('URL 삭제에 실패했습니다.');
    }
  }

  // 디버깅용 - 전체 데이터 조회
  debugAnalyticsStorage(): void {
    try {
      const allUrls = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      console.log('=== 분석 URL 저장소 디버깅 ===');
      console.log('전체 URL 개수:', allUrls.length);
      allUrls.forEach((url: any, index: number) => {
        console.log(`${index + 1}. ${url.platform} - ${url.influencerName}: ${url.url}`);
      });
    } catch (error) {
      console.error('디버깅 실패:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
