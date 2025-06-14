
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
      try {
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error('캠페인 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/brand/campaigns/${campaignId}`);
  };

  const handleEditClick = (campaignId: string) => {
    navigate(`/brand/campaigns/edit/${campaignId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">캠페인 관리</h1>
          <Link to="/brand/campaigns/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              캠페인 생성
            </Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">생성된 캠페인이 없습니다.</div>
            <Link to="/brand/campaigns/create">
              <Button className="bg-green-600 hover:bg-green-700">
                첫 번째 캠페인 생성하기
              </Button>
            </Link>
          </div>
        ) : (
          <CampaignDashboard
            campaigns={campaigns}
            userType="brand"
            onCampaignClick={handleCampaignClick}
            onCampaignEdit={handleEditClick}
          />
        )}
      </div>
    </div>
  );
};

export default BrandCampaigns;
