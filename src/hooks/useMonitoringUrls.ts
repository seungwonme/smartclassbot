
import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analytics.service';
import { PlatformUrlData } from '@/types/analytics';

export const useMonitoringUrls = (campaignId: string | undefined, toast: any) => {
  const [monitoringUrls, setMonitoringUrls] = useState<PlatformUrlData[]>([]);

  useEffect(() => {
    const loadMonitoringUrls = () => {
      if (!campaignId) return;
      
      try {
        console.log('=== 브랜드 관리자 - 모니터링 URL 로딩 시작 ===');
        console.log('캠페인 ID:', campaignId);
        
        const urls = analyticsService.getMonitoringUrls(campaignId);
        setMonitoringUrls(urls);
        
        console.log('=== 로딩된 모니터링 URL ===');
        console.log('URL 개수:', urls.length);
        urls.forEach(url => {
          console.log(`- ${url.platform}: ${url.influencerName} - ${url.url}`);
        });
      } catch (error) {
        console.error('모니터링 URL 로딩 실패:', error);
        toast({
          title: "URL 로딩 실패",
          description: "모니터링 URL을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      }
    };

    loadMonitoringUrls();
  }, [campaignId, toast]);

  return { monitoringUrls };
};
