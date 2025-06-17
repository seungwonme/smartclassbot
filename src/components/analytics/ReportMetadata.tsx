
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ReportMetadataProps {
  reportType: 'summary' | 'detailed' | 'comparison';
  dateRange: { from?: Date; to?: Date };
  selectedInfluencer?: {
    id: string;
    name: string;
    platform: string;
  };
}

const ReportMetadata: React.FC<ReportMetadataProps> = ({
  reportType,
  dateRange,
  selectedInfluencer
}) => {
  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'summary': return '요약';
      case 'detailed': return '상세';
      case 'comparison': return '비교';
      default: return type;
    }
  };

  const getPlatformLabel = (platform: string) => {
    return platform === 'xiaohongshu' ? '샤오홍슈' : '도우인';
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">
        유형: {getReportTypeLabel(reportType)}
      </Badge>
      {selectedInfluencer && selectedInfluencer.id !== 'all' && (
        <Badge variant="outline">
          인플루언서: {selectedInfluencer.name} ({getPlatformLabel(selectedInfluencer.platform)})
        </Badge>
      )}
      {dateRange.from && (
        <Badge variant="outline">
          {format(dateRange.from, 'MM/dd', { locale: ko })} ~ {
            dateRange.to 
              ? format(dateRange.to, 'MM/dd', { locale: ko }) 
              : '현재'
          }
        </Badge>
      )}
    </div>
  );
};

export default ReportMetadata;
