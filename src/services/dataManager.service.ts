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
  scenario: string;
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

  // 향상된 테스트 데이터셋 목록 (시나리오별)
  getTestDataSets: (): TestDataSet[] => {
    return [
      {
        name: "빈 데이터셋",
        description: "모든 데이터가 비어있는 상태 - 처음부터 시작",
        scenario: "empty",
        data: {
          campaigns: [],
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      },
      {
        name: "캠페인 생성 완료",
        description: "브랜드가 캠페인을 생성하고 제출한 상태",
        scenario: "submitted",
        data: {
          campaigns: [
            {
              id: "test-submitted",
              title: "테스트 캠페인 - 제출됨",
              brandId: "b1",
              brandName: "테스트 브랜드",
              productId: "p1",
              productName: "테스트 제품",
              budget: 3000000,
              proposalDeadline: "2024-07-30",
              campaignStartDate: "2024-08-01",
              campaignEndDate: "2024-08-31",
              adType: "branding",
              status: "submitted",
              currentStage: 1,
              targetContent: {
                influencerCategories: ["뷰티", "라이프스타일"],
                targetAge: "20-35",
                uspImportance: 7,
                influencerImpact: "마이크로 인플루언서",
                additionalDescription: "자연스러운 일상 콘텐츠",
                secondaryContentUsage: true
              },
              influencers: [],
              contentPlans: [],
              createdAt: "2024-06-16",
              updatedAt: "2024-06-16"
            }
          ],
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      },
      {
        name: "섭외 진행 중",
        description: "시스템 관리자가 인플루언서 섭외를 진행하는 상태",
        scenario: "recruiting",
        data: {
          campaigns: [
            {
              id: "test-recruiting",
              title: "테스트 캠페인 - 섭외중",
              brandId: "b1",
              brandName: "테스트 브랜드",
              productId: "p1",
              productName: "테스트 제품",
              budget: 3000000,
              proposalDeadline: "2024-07-30",
              campaignStartDate: "2024-08-01",
              campaignEndDate: "2024-08-31",
              adType: "branding",
              status: "recruiting",
              currentStage: 2,
              targetContent: {
                influencerCategories: ["뷰티", "라이프스타일"],
                targetAge: "20-35",
                uspImportance: 7,
                influencerImpact: "마이크로 인플루언서",
                additionalDescription: "자연스러운 일상 콘텐츠",
                secondaryContentUsage: true
              },
              influencers: [
                {
                  id: "test-inf1",
                  name: "테스트 인플루언서 A",
                  category: "뷰티",
                  followers: 150000,
                  avgViews: 80000,
                  avgLikes: 3200,
                  avgComments: 160,
                  engagementRate: 4.2,
                  profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
                  instagramUrl: "@test_influencer_a",
                  proposedFee: 500000,
                  deliverables: ["인스타그램 포스트", "스토리"],
                  status: "pending"
                },
                {
                  id: "test-inf2",
                  name: "테스트 인플루언서 B",
                  category: "라이프스타일",
                  followers: 200000,
                  avgViews: 120000,
                  avgLikes: 4800,
                  avgComments: 240,
                  engagementRate: 4.0,
                  profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
                  instagramUrl: "@test_influencer_b",
                  proposedFee: 700000,
                  deliverables: ["인스타그램 포스트", "스토리"],
                  status: "pending"
                }
              ],
              contentPlans: [],
              createdAt: "2024-06-16",
              updatedAt: "2024-06-16"
            }
          ],
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      },
      {
        name: "제안 완료",
        description: "인플루언서 섭외가 완료되어 브랜드에 제안한 상태",
        scenario: "proposing",
        data: {
          campaigns: [
            {
              id: "test-proposing",
              title: "테스트 캠페인 - 제안중",
              brandId: "b1",
              brandName: "테스트 브랜드",
              productId: "p1",
              productName: "테스트 제품",
              budget: 3000000,
              proposalDeadline: "2024-07-30",
              campaignStartDate: "2024-08-01",
              campaignEndDate: "2024-08-31",
              adType: "branding",
              status: "proposing",
              currentStage: 2,
              targetContent: {
                influencerCategories: ["뷰티", "라이프스타일"],
                targetAge: "20-35",
                uspImportance: 7,
                influencerImpact: "마이크로 인플루언서",
                additionalDescription: "자연스러운 일상 콘텐츠",
                secondaryContentUsage: true
              },
              influencers: [
                {
                  id: "test-inf1",
                  name: "테스트 인플루언서 A",
                  category: "뷰티",
                  followers: 150000,
                  avgViews: 80000,
                  avgLikes: 3200,
                  avgComments: 160,
                  engagementRate: 4.2,
                  profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
                  instagramUrl: "@test_influencer_a",
                  proposedFee: 500000,
                  adFee: 500000,
                  deliverables: ["인스타그램 포스트", "스토리"],
                  status: "accepted"
                },
                {
                  id: "test-inf2",
                  name: "테스트 인플루언서 B",
                  category: "라이프스타일",
                  followers: 200000,
                  avgViews: 120000,
                  avgLikes: 4800,
                  avgComments: 240,
                  engagementRate: 4.0,
                  profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
                  instagramUrl: "@test_influencer_b",
                  proposedFee: 700000,
                  adFee: 700000,
                  deliverables: ["인스타그램 포스트", "스토리"],
                  status: "accepted"
                }
              ],
              contentPlans: [],
              quote: {
                subtotal: 1200000,
                agencyFee: 180000,
                vat: 138000,
                total: 1518000
              },
              createdAt: "2024-06-16",
              updatedAt: "2024-06-16"
            }
          ],
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      },
      {
        name: "기본 데모 데이터 (원본)",
        description: "개발 시 사용하던 원본 데모 데이터",
        scenario: "demo",
        data: {
          campaigns: mockCampaigns,
          exportDate: new Date().toISOString(),
          version: "1.0"
        },
        createdAt: new Date().toISOString()
      }
    ];
  },

  // 데이터 완전 초기화
  clearAllData: (): boolean => {
    console.log('=== 모든 데이터 완전 초기화 시작 ===');
    
    try {
      // 백업 생성
      const backup = dataManagerService.exportCurrentData();
      sessionStorage.setItem('cleared_data_backup', JSON.stringify(backup));
      
      // 빈 데이터로 초기화
      const emptyDataSet = dataManagerService.getTestDataSets().find(ds => ds.scenario === 'empty');
      if (emptyDataSet) {
        return dataManagerService.applyImportedData(emptyDataSet.data);
      }
      
      return false;
    } catch (error) {
      console.error('데이터 초기화 실패:', error);
      return false;
    }
  },

  // 시나리오별 테스트 데이터 적용
  applyScenarioData: (scenario: string): boolean => {
    console.log('=== 시나리오 데이터 적용 ===', scenario);
    
    const dataSet = dataManagerService.getTestDataSets().find(ds => ds.scenario === scenario);
    if (dataSet) {
      return dataManagerService.applyTestDataSet(dataSet);
    }
    
    console.error('해당 시나리오 데이터를 찾을 수 없습니다:', scenario);
    return false;
  },

  // 테스트 데이터셋 적용
  applyTestDataSet: (dataSet: TestDataSet): boolean => {
    console.log('=== 테스트 데이터셋 적용 ===', dataSet.name);
    return dataManagerService.applyImportedData(dataSet.data);
  }
};
