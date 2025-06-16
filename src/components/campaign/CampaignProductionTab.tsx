
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';
import BrandContentProductionTab from '@/components/content/BrandContentProductionTab';
import { Campaign, CampaignInfluencer } from '@/types/campaign';

interface CampaignProductionTabProps {
  campaign: Campaign;
  confirmedInfluencers: CampaignInfluencer[];
}

const CampaignProductionTab: React.FC<CampaignProductionTabProps> = ({
  campaign,
  confirmedInfluencers
}) => {
  const isProducing = ['producing', 'content-review'].includes(campaign.status);
  
  if (isProducing || campaign.currentStage >= 3) {
    return (
      <BrandContentProductionTab
        campaignId={campaign.id}
        confirmedInfluencers={confirmedInfluencers}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="w-5 h-5 mr-2" />
          콘텐츠 제작
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-gray-500">
          콘텐츠 제작 단계가 아직 시작되지 않았습니다.
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProductionTab;
