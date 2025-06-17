
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';

interface ReportPreviewProps {
  selectedReportData: any;
  isRecentReport: (reportDate: string) => boolean;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  selectedReportData,
  isRecentReport
}) => {
  if (!selectedReportData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          선택된 보고서 미리보기
          {isRecentReport(selectedReportData.createdAt) && (
            <Badge variant="default">최신</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{selectedReportData.summary?.totalContent || 1250}</div>
            <div className="text-sm text-gray-600">콘텐츠 수집</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{selectedReportData.summary?.totalComments?.toLocaleString() || '8,420'}</div>
            <div className="text-sm text-gray-600">댓글 분석</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{selectedReportData.summary?.keywords || 156}</div>
            <div className="text-sm text-gray-600">키워드 추출</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              {selectedReportData.summary?.sentiment === 'positive' ? '긍정적' : '중립적'}
            </div>
            <div className="text-sm text-gray-600">전체 감성</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>보고서 생성일: {new Date(selectedReportData.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
