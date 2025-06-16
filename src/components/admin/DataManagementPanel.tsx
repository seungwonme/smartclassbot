
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, RotateCcw, Database, FileJson, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataManagerService, DataExport, TestDataSet } from '@/services/dataManager.service';

const DataManagementPanel = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testDataSets] = useState<TestDataSet[]>(dataManagerService.getTestDataSets());

  const handleExportData = () => {
    try {
      const data = dataManagerService.exportCurrentData();
      dataManagerService.downloadDataAsFile(data);
      
      toast({
        title: "데이터 내보내기 완료",
        description: "현재 캠페인 데이터가 JSON 파일로 다운로드되었습니다."
      });
    } catch (error) {
      toast({
        title: "내보내기 실패",
        description: "데이터 내보내기 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      const data = await dataManagerService.importDataFromFile(file);
      const success = dataManagerService.applyImportedData(data);
      
      if (success) {
        toast({
          title: "데이터 가져오기 완료",
          description: `${data.campaigns.length}개의 캠페인 데이터가 적용되었습니다.`
        });
        
        // 페이지 새로고침으로 UI 업데이트
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('데이터 적용 실패');
      }
    } catch (error) {
      toast({
        title: "가져오기 실패",
        description: "데이터 가져오기 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRestoreBackup = () => {
    const success = dataManagerService.restoreFromBackup();
    
    if (success) {
      toast({
        title: "백업 복원 완료",
        description: "이전 데이터가 복원되었습니다."
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast({
        title: "복원 실패",
        description: "백업 데이터가 없거나 복원에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleApplyTestDataSet = (dataSet: TestDataSet) => {
    const success = dataManagerService.applyTestDataSet(dataSet);
    
    if (success) {
      toast({
        title: "테스트 데이터 적용 완료",
        description: `"${dataSet.name}" 데이터셋이 적용되었습니다.`
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast({
        title: "적용 실패",
        description: "테스트 데이터 적용에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">데이터 관리</h2>
        <p className="text-gray-600">개발 중 테스트 데이터를 관리하고 백업/복원할 수 있습니다.</p>
      </div>

      {/* 데이터 내보내기/가져오기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            데이터 백업 & 복원
          </CardTitle>
          <CardDescription>
            현재 캠페인 데이터를 JSON 파일로 내보내거나 가져올 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              데이터 내보내기
            </Button>
            
            <Button onClick={handleImportClick} variant="outline" disabled={isLoading}>
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? '가져오는 중...' : '데이터 가져오기'}
            </Button>
            
            <Button onClick={handleRestoreBackup} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              백업 복원
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
          
          <div className="text-sm text-gray-500">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            데이터 가져오기 시 현재 데이터는 자동으로 백업됩니다.
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 테스트 데이터셋 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            테스트 데이터셋
          </CardTitle>
          <CardDescription>
            미리 정의된 테스트 데이터셋을 빠르게 적용할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testDataSets.map((dataSet, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{dataSet.name}</h3>
                  <Badge variant="secondary">
                    {dataSet.data.campaigns.length}개 캠페인
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{dataSet.description}</p>
              </div>
              <Button
                onClick={() => handleApplyTestDataSet(dataSet)}
                variant="outline"
                size="sm"
              >
                적용
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagementPanel;
