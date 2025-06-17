
import { useState } from 'react';
import { format } from 'date-fns';
import { performanceTrackerService } from '@/services/performanceTracker.service';
import { downloadFile } from '@/utils/fileUtils';

export interface ReportGenerationOptions {
  reportType: 'summary' | 'detailed' | 'comparison';
  dateRange: { from?: Date; to?: Date };
  campaignId?: string;
  selectedInfluencer?: {
    id: string;
    name: string;
    platform: string;
  };
}

export const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (options: ReportGenerationOptions) => {
    setIsGenerating(true);
    
    try {
      const { reportType, dateRange, campaignId, selectedInfluencer } = options;
      
      // 성과 데이터 수집
      const summary = performanceTrackerService.getPerformanceSummary(campaignId);
      const metrics = performanceTrackerService.getPerformanceMetrics(campaignId);
      
      // 선택된 인플루언서나 플랫폼에 따른 필터링
      let filteredMetrics = metrics;
      if (selectedInfluencer && selectedInfluencer.id !== 'all') {
        filteredMetrics = metrics.filter(m => m.influencerId === selectedInfluencer.id);
      } else if (selectedInfluencer?.platform && selectedInfluencer.platform !== 'all') {
        filteredMetrics = metrics.filter(m => m.platform === selectedInfluencer.platform);
      }
      
      // 리포트 데이터 구성
      const reportData = {
        reportType,
        generatedAt: new Date().toISOString(),
        dateRange,
        targetPlatform: selectedInfluencer?.platform || 'all',
        selectedInfluencer: selectedInfluencer?.id !== 'all' ? selectedInfluencer : null,
        summary,
        metrics: filteredMetrics,
        insights: {
          topPerformingContent: filteredMetrics.sort((a, b) => 
            (b.xiaohongshuMetrics?.exposure || b.douyinMetrics?.views || 0) - 
            (a.xiaohongshuMetrics?.exposure || a.douyinMetrics?.views || 0)
          ).slice(0, 5),
          engagementTrends: generateEngagementTrends(filteredMetrics),
          platformComparison: generatePlatformComparison(summary)
        }
      };

      // 리포트 파일 생성 (JSON 형식)
      const reportJson = JSON.stringify(reportData, null, 2);
      const reportBase64 = btoa(unescape(encodeURIComponent(reportJson)));
      
      // 파일명 생성
      const influencerSuffix = selectedInfluencer && selectedInfluencer.id !== 'all' 
        ? `_${selectedInfluencer.name}` 
        : '';
      const fileName = `성과리포트${influencerSuffix}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`;
      
      // 다운로드 실행
      downloadFile(`data:application/json;base64,${reportBase64}`, fileName);
      
      console.log('=== 성과 리포트 생성 완료 ===');
      console.log('리포트 타입:', reportType);
      console.log('대상 플랫폼:', selectedInfluencer?.platform || 'all');
      console.log('선택된 인플루언서:', selectedInfluencer?.name || '전체');
      console.log('데이터 범위:', dateRange);
      
    } catch (error) {
      console.error('리포트 생성 실패:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateReport,
    isGenerating
  };
};

const generateEngagementTrends = (metrics: any[]) => {
  return metrics.map(m => ({
    date: m.lastUpdated,
    platform: m.platform,
    engagement: calculateEngagementRate(m)
  }));
};

const generatePlatformComparison = (summary: any) => {
  return {
    xiaohongshu: {
      content: summary.xiaohongshu.count,
      totalReach: summary.xiaohongshu.totalExposure,
      avgEngagement: summary.xiaohongshu.totalLikes / summary.xiaohongshu.totalExposure * 100
    },
    douyin: {
      content: summary.douyin.count,
      totalReach: summary.douyin.totalViews,
      avgEngagement: summary.douyin.totalLikes / summary.douyin.totalViews * 100
    }
  };
};

const calculateEngagementRate = (metric: any) => {
  if (metric.platform === 'xiaohongshu' && metric.xiaohongshuMetrics) {
    const { exposure, likes, comments, shares } = metric.xiaohongshuMetrics;
    return ((likes + comments + shares) / exposure) * 100;
  } else if (metric.platform === 'douyin' && metric.douyinMetrics) {
    const { views, likes, comments, shares } = metric.douyinMetrics;
    return ((likes + comments + shares) / views) * 100;
  }
  return 0;
};
