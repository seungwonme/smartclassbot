
import { Campaign } from "@/types/campaign";
import { storageService } from "./storage.service";
import { mockCampaigns } from "@/mocks/campaign.mock";

export interface DataExport {
  campaigns: Campaign[];
  exportDate: string;
  version: string;
}

export interface TestDataSet {
  name: string;
  description: string;
  data: DataExport;
  createdAt: string;
}

export const dataManagerService = {
  // 현재 데이터를 JSON으로 내보내기
  exportCurrentData: (): DataExport => {
    console.log('=== 현재 데이터 내보내기 시작 ===');
    
    const campaigns = storageService.getCampaigns();
    const exportData: DataExport = {
      campaigns,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    console.log('내보낸 데이터:', exportData);
    return exportData;
  },

  // JSON 데이터를 파일로 다운로드
  downloadDataAsFile: (data: DataExport, filename?: string) => {
    const fileName = filename || `campaign-data-${new Date().toISOString().split('T')[0]}.json`;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('데이터 파일 다운로드 완료:', fileName);
  },

  // JSON 파일에서 데이터 가져오기
  importDataFromFile: (file: File): Promise<DataExport> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const data = JSON.parse(result) as DataExport;
          
          // 데이터 유효성 검사
          if (!data.campaigns || !Array.isArray(data.campaigns)) {
            throw new Error('유효하지 않은 데이터 형식입니다.');
          }
          
          console.log('가져온 데이터:', data);
          resolve(data);
        } catch (error) {
          console.error('데이터 가져오기 실패:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일 읽기 실패'));
      };
      
      reader.readAsText(file);
    });
  },

  // 가져온 데이터를 현재 저장소에 적용
  applyImportedData: (data: DataExport): boolean => {
    console.log('=== 데이터 적용 시작 ===');
    
    try {
      // 기존 데이터 백업
      const backup = dataManagerService.exportCurrentData();
      sessionStorage.setItem('data_backup', JSON.stringify(backup));
      
      // 새 데이터 적용
      const success = storageService.setCampaigns(data.campaigns);
      
      if (success) {
        console.log('데이터 적용 완료');
        return true;
      } else {
        throw new Error('데이터 저장 실패');
      }
    } catch (error) {
      console.error('데이터 적용 실패:', error);
      return false;
    }
  },

  // 백업 데이터 복원
  restoreFromBackup: (): boolean => {
    console.log('=== 백업 데이터 복원 시작 ===');
    
    try {
      const backupStr = sessionStorage.getItem('data_backup');
      if (!backupStr) {
        console.log('백업 데이터가 없습니다.');
        return false;
      }
      
      const backup = JSON.parse(backupStr) as DataExport;
      return dataManagerService.applyImportedData(backup);
    } catch (error) {
      console.error('백업 복원 실패:', error);
      return false;
    }
  },

  // 기본 테스트 데이터셋 목록
  getTestDataSets: (): TestDataSet[] => {
    return [
      {
        name: "기본 데모 데이터",
        description: "신제품 런칭 캠페인 데모 데이터",
        data: {
          campaigns: mockCampaigns,
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      },
      {
        name: "빈 데이터셋",
        description: "모든 데이터가 비어있는 상태",
        data: {
          campaigns: [],
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      }
    ];
  },

  // 테스트 데이터셋 적용
  applyTestDataSet: (dataSet: TestDataSet): boolean => {
    console.log('=== 테스트 데이터셋 적용 ===', dataSet.name);
    return dataManagerService.applyImportedData(dataSet.data);
  }
};
