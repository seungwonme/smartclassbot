
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import CampaignDashboard from '@/components/campaign/CampaignDashboard';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      console.log('=== BrandCampaigns 캠페인 로딩 시작 ===');
      try {
        const data = await campaignService.getCampaigns();
        console.log('브랜드 페이지 - 로드된 캠페인 데이터:', data);
        console.log('캠페인 개수:', data.length);
        data.forEach((campaign, index) => {
          console.log(`캠페인 ${index + 1}: "${campaign.title}" - 상태: ${campaign.status} - ID: ${campaign.id}`);
        });
        setCampaigns(data);
      } catch (error) {
        console.error('캠페인 로딩 실패:', error);
      } finally {
        setIsLoading(false);
        console.log('=== BrandCampaigns 캠페인 로딩 완료 ===');
      }
    };

    loadCampaigns();
  }, []);

  const handleCampaignClick = (campaignId: string) => {
    console.log('브랜드 - 캠페인 클릭:', campaignId);
    navigate(`/brand/campaigns/${campaignId}`);
  };

  const handleEditClick = (campaignId: string) => {
    console.log('브랜드 - 캠페인 편집 클릭:', campaignId);
    navigate(`/brand/campaigns/edit/${campaignId}`);
  };

  console.log('=== BrandCampaigns 렌더링 시작 ===');
  console.log('현재 캠페인 상태:', campaigns);
  console.log('캠페인 개수:', campaigns.length);
  console.log('로딩 상태:', isLoading);

  if (isLoading) {
    console.log('로딩 중 화면 표시');
    return (
      <div className="flex min-h-screen w-full bg-gray-50">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center py-12">
            <div className="text-lg font-semibold">캠페인 데이터를 불러오는 중...</div>
            <div className="mt-2 text-gray-600">잠시만 기다려주세요.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <BrandSidebar />
      <div className="flex-1 p-8 overflow-auto">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">캠페인 관리</h1>
            <p className="text-gray-600 mt-2">브랜드 캠페인을 생성하고 관리하세요</p>
          </div>
          <Link to="/brand/campaigns/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              캠페인 생성
            </Button>
          </Link>
        </div>

        {/* 디버그 정보 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 현재 상태</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p><strong>✅ 캠페인 페이지가 정상적으로 렌더링되었습니다!</strong></p>
            <p><strong>로딩 완료:</strong> {isLoading ? 'No' : 'Yes'}</p>
            <p><strong>캠페인 개수:</strong> {campaigns.length}개</p>
            <p><strong>현재 시간:</strong> {new Date().toLocaleTimeString()}</p>
            {campaigns.length > 0 && (
              <div className="mt-2">
                <p><strong>캠페인 목록:</strong></p>
                {campaigns.map((campaign, index) => (
                  <p key={campaign.id} className="ml-4">
                    {index + 1}. {campaign.title} (상태: {campaign.status})
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 캠페인 콘텐츠 */}
        {campaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-500 mb-4 text-lg">생성된 캠페인이 없습니다.</div>
            <p className="text-gray-400 mb-6">첫 번째 캠페인을 생성하여 시작하세요!</p>
            <Link to="/brand/campaigns/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                첫 번째 캠페인 생성하기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-4">
                총 <span className="font-semibold text-gray-900">{campaigns.length}</span>개의 캠페인이 있습니다.
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <CampaignDashboard
                campaigns={campaigns}
                userType="brand"
                onCampaignClick={handleCampaignClick}
                onCampaignEdit={handleEditClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandCampaigns;
