
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Trash2, Eye, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MarketResearchReportModal from './MarketResearchReportModal';

interface SavedReportsListProps {
  savedReports: any[];
  onDeleteReport: (reportId: string) => void;
  isRecentReport: (reportDate: string) => boolean;
  selectedBrand?: string;
  selectedProduct?: string;
  brands?: any[];
  products?: any[];
}

const SavedReportsList: React.FC<SavedReportsListProps> = ({
  savedReports,
  onDeleteReport,
  isRecentReport,
  selectedBrand,
  selectedProduct,
  brands = [],
  products = []
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

  // 선택된 브랜드/제품 정보 가져오기
  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  if (savedReports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            저장된 시장조사 리포트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {selectedBrand && selectedProduct ? (
              <div className="space-y-2">
                <Filter className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm">
                  <strong>{selectedBrandData?.name} - {selectedProductData?.name}</strong>에 대한 
                  시장조사 리포트가 없습니다.
                </p>
                <p className="text-xs text-gray-400">
                  시장조사를 실행하여 리포트를 생성해보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileText className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm">저장된 시장조사 리포트가 없습니다.</p>
                <p className="text-xs text-gray-400">
                  브랜드와 제품을 선택한 후 시장조사를 실행해보세요.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          저장된 시장조사 리포트
          {selectedBrand && selectedProduct && (
            <Badge variant="outline" className="ml-2">
              {selectedBrandData?.name} - {selectedProductData?.name}
            </Badge>
          )}
        </CardTitle>
        {savedReports.length > 0 && (
          <p className="text-sm text-gray-600">
            총 {savedReports.length}개의 리포트가 있습니다.
          </p>
        )}
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
              <div className="flex items-center gap-2">
                <MarketResearchReportModal
                  reportData={report}
                  selectedBrand={report.brandId}
                  selectedProduct={report.productId}
                  onSaveReport={() => {}} // 이미 저장된 리포트이므로 빈 함수
                  trigger={
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteReport(report.id, report.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedReportsList;
