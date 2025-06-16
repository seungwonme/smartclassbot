
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { performanceTrackerService } from '@/services/performanceTracker.service';
import { downloadFile } from '@/utils/fileUtils';

interface PerformanceReportGeneratorProps {
  campaignId?: string;
  isAdmin?: boolean;
}

const PerformanceReportGenerator: React.FC<PerformanceReportGeneratorProps> = ({ 
  campaignId, 
  isAdmin = false 
}) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [platform, setPlatform] = useState<'all' | 'xiaohongshu' | 'douyin'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // 성과 데이터 수집
      const summary = performanceTrackerService.getPerformanceSummary(campaignId);
      const metrics = performanceTrackerService.getPerformanceMetrics(campaignId);
      
      // 리포트 데이터 구성
      const reportData = {
        reportType,
        generatedAt: new Date().toISOString(),
        dateRange,
        platform,
        summary,
        metrics: platform === 'all' ? metrics : metrics.filter(m => m.platform === platform),
        insights: {
          topPerformingContent: metrics.sort((a, b) => 
            (b.xiaohongshuMetrics?.exposure || b.douyinMetrics?.views || 0) - 
            (a.xiaohongshuMetrics?.exposure || a.douyinMetrics?.views || 0)
          ).slice(0, 5),
          engagementTrends: generateEngagementTrends(metrics),
          platformComparison: generatePlatformComparison(summary)
        }
      };

      // 리포트 파일 생성 (JSON 형식)
      const reportJson = JSON.stringify(reportData, null, 2);
      const reportBase64 = btoa(unescape(encodeURIComponent(reportJson)));
      
      // 파일명 생성
      const fileName = `성과리포트_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`;
      
      // 다운로드 실행
      downloadFile(`data:application/json;base64,${reportBase64}`, fileName);
      
      console.log('=== 성과 리포트 생성 완료 ===');
      console.log('리포트 타입:', reportType);
      console.log('플랫폼:', platform);
      console.log('데이터 범위:', dateRange);
      
    } catch (error) {
      console.error('리포트 생성 실패:', error);
    } finally {
      setIsGenerating(false);
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          성과 리포트 생성
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">리포트 유형</label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">요약 리포트</SelectItem>
                <SelectItem value="detailed">상세 리포트</SelectItem>
                <SelectItem value="comparison">비교 분석</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">플랫폼</label>
            <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 플랫폼</SelectItem>
                <SelectItem value="xiaohongshu">샤오홍슈</SelectItem>
                <SelectItem value="douyin">도우인</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">기간 선택</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, 'PPP', { locale: ko }) : '시작일'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, 'PPP', { locale: ko }) : '종료일'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            유형: {reportType === 'summary' ? '요약' : reportType === 'detailed' ? '상세' : '비교'}
          </Badge>
          <Badge variant="outline">
            플랫폼: {platform === 'all' ? '전체' : platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'}
          </Badge>
          {dateRange.from && (
            <Badge variant="outline">
              {format(dateRange.from, 'MM/dd', { locale: ko })} ~ {dateRange.to ? format(dateRange.to, 'MM/dd', { locale: ko }) : '현재'}
            </Badge>
          )}
        </div>

        <Button 
          onClick={generateReport} 
          disabled={isGenerating}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? '리포트 생성 중...' : '리포트 다운로드'}
        </Button>

        <div className="text-xs text-muted-foreground">
          리포트는 JSON 형식으로 다운로드되며, 엑셀이나 다른 분석 도구에서 활용할 수 있습니다.
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceReportGenerator;
