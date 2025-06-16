import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import CampaignDashboard from '@/components/campaign/CampaignDashboard';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { storageService } from '@/services/storage.service';
import { useToast } from '@/hooks/use-toast';

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCampaigns = async () => {
    console.log('=== BrandCampaigns 캠페인 로딩 시작 ===');
    
    // 로컬스토리지 직접 확인
    const localStorageCampaigns = storageService.getCampaigns();
    console.log('로컬스토리지 직접 확인:', localStorageCampaigns);
    console.log('로컬스토리지 캠페인 개수:', localStorageCampaigns.length);
    
    try {
      const data = await campaignService.getCampaigns();
      console.log('브랜드 페이지 - 로드된 캠페인 데이터:', data);
      console.log('캠페인 개수:', data.length);
      
      if (data.length === 0) {
        console.warn('⚠️ 캠페인 데이터가 비어있습니다!');
        console.log('로컬스토리지 상태 재확인:', storageService.getCampaigns());
      }
      
      data.forEach((campaign, index) => {
        console.log(`캠페인 ${index + 1}: "${campaign.title}" - 상태: ${campaign.status} - 단계: ${campaign.currentStage} - ID: ${campaign.id}`);
      });
      setCampaigns(data);
    } catch (error) {
      console.error('캠페인 로딩 실패:', error);
      // 에러 발생 시 로컬스토리지에서 직접 가져오기 시도
      console.log('에러 발생, 로컬스토리지에서 직접 가져오기 시도');
      const fallbackCampaigns = storageService.getCampaigns();
      console.log('Fallback 캠페인 데이터:', fallbackCampaigns);
      setCampaigns(fallbackCampaigns);
    } finally {
      setIsLoading(false);
      console.log('=== BrandCampaigns 캠페인 로딩 완료 ===');
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleForceReinitialize = async () => {
    console.log('=== 데이터 강제 재초기화 시작 ===');
    setIsLoading(true);
    
    try {
      campaignService.forceReinitialize();
      await loadCampaigns();
      
      toast({
        title: "데이터 초기화 완료",
        description: "최신 mock 데이터로 업데이트되었습니다."
      });
    } catch (error) {
      console.error('데이터 초기화 실패:', error);
      toast({
        title: "초기화 실패",
        description: "데이터 초기화에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignClick = (campaignId: string) => {
    console.log('브랜드 - 캠페인 클릭:', campaignId);
    navigate(`/brand/campaigns/${campaignId}`);
  };

  const handleEditClick = (campaignId: string) => {
    console.log('브랜드 - 캠페인 편집 클릭:', campaignId);
    navigate(`/brand/campaigns/edit/${campaignId}`);
  };

  const handleExportData = async () => {
    try {
      const { dataManagerService } = await import('@/services/dataManager.service');
      const data = dataManagerService.exportCurrentData();
      dataManagerService.downloadDataAsFile(data, 'brand-campaigns-backup.json');
      
      toast({
        title: "데이터 백업 완료",
        description: "현재 캠페인 데이터가 다운로드되었습니다."
      });
    } catch (error) {
      toast({
        title: "백업 실패",
        description: "데이터 백업 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <div className="text-lg mb-4">캠페인 데이터 로딩 중...</div>
            <div className="text-sm text-gray-600">로컬스토리지에서 데이터를 가져오고 있습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  console.log('=== BrandCampaigns 렌더링 ===');
  console.log('현재 캠페인 상태:', campaigns);
  console.log('캠페인 개수:', campaigns.length);

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">캠페인 관리</h1>
            <p className="text-sm text-gray-600 mt-2">
              총 {campaigns.length}개의 캠페인이 저장되어 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              데이터 백업
            </Button>
            <Button
              onClick={handleForceReinitialize}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              데이터 초기화
            </Button>
            <Button
              onClick={() => {
                console.log('=== 로컬스토리지 데이터 확인 버튼 클릭 ===');
                const storedCampaigns = storageService.getCampaigns();
                console.log('저장된 캠페인:', storedCampaigns);
                console.table(storedCampaigns);
                toast({
                  title: "로컬스토리지 확인",
                  description: `${storedCampaigns.length}개의 캠페인이 저장되어 있습니다. 콘솔을 확인하세요.`
                });
              }}
              variant="outline"
            >
              로컬스토리지 확인
            </Button>
            <Link to="/brand/campaigns/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                캠페인 생성
              </Button>
            </Link>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">생성된 캠페인이 없습니다.</div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  console.log('=== 데이터 재로딩 시도 ===');
                  window.location.reload();
                }}
                variant="outline"
              >
                데이터 다시 로드
              </Button>
              <Link to="/brand/campaigns/create">
                <Button className="bg-green-600 hover:bg-green-700">
                  첫 번째 캠페인 생성하기
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              총 {campaigns.length}개의 캠페인이 있습니다.
            </div>
            <CampaignDashboard
              campaigns={campaigns}
              userType="brand"
              onCampaignClick={handleCampaignClick}
              onCampaignEdit={handleEditClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BrandCampaigns;
