
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, DollarSign } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';

const BrandCampaigns = () => {
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

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'approved': return '승인됨';
      case 'rejected': return '거절됨';
      case 'completed': return '완료됨';
      default: return status;
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <Badge className={getStatusColor(campaign.status)}>
                    {getStatusText(campaign.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    예산: {campaign.budget.toLocaleString()}원
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    {campaign.campaignStartDate} ~ {campaign.campaignEndDate}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    인플루언서: {campaign.influencers.length}명
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {campaign.targetContent.influencerCategories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">생성된 캠페인이 없습니다.</div>
            <Link to="/brand/campaigns/create">
              <Button className="bg-green-600 hover:bg-green-700">
                첫 번째 캠페인 생성하기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandCampaigns;
