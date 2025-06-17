
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import ReportConfigurationForm from './ReportConfigurationForm';
import ReportMetadata from './ReportMetadata';

interface PerformanceReportGeneratorProps {
  campaignId?: string;
  selectedInfluencer?: {
    id: string;
    name: string;
    platform: string;
  };
  isAdmin?: boolean;
}

const PerformanceReportGenerator: React.FC<PerformanceReportGeneratorProps> = ({ 
  campaignId, 
  selectedInfluencer,
  isAdmin = false 
}) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  
  const { generateReport, isGenerating } = useReportGeneration();

  const handleGenerateReport = async () => {
    try {
      await generateReport({
        reportType,
        dateRange,
        campaignId,
        selectedInfluencer
      });
    } catch (error) {
      console.error('리포트 생성 실패:', error);
    }
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
        <ReportConfigurationForm
          reportType={reportType}
          dateRange={dateRange}
          onReportTypeChange={setReportType}
          onDateRangeChange={setDateRange}
        />

        <ReportMetadata
          reportType={reportType}
          dateRange={dateRange}
          selectedInfluencer={selectedInfluencer}
        />

        <Button 
          onClick={handleGenerateReport} 
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
