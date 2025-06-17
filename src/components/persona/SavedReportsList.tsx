
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedReportsListProps {
  savedReports: any[];
  onDeleteReport: (reportId: string) => void;
  isRecentReport: (reportDate: string) => boolean;
}

const SavedReportsList: React.FC<SavedReportsListProps> = ({
  savedReports,
  onDeleteReport,
  isRecentReport
}) => {
  const { toast } = useToast();

  const handleDeleteReport = (reportId: string, reportName: string) => {
    if (window.confirm(`"${reportName}" 리포트를 삭제하시겠습니까?`)) {
      onDeleteReport(reportId);
      toast({
        title: "리포트 삭제 완료",
        description: `${reportName} 리포트가 삭제되었습니다.`,
      });
    }
  };

  if (savedReports.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          저장된 시장조사 리포트
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{report.name}</span>
                  {isRecentReport(report.createdAt) && (
                    <Badge variant="default" className="text-xs">최신</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.createdAt).toLocaleDateString('ko-KR')}</span>
                  {report.summary && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {report.summary.totalContent || 0}개 콘텐츠 분석
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteReport(report.id, report.name)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedReportsList;
