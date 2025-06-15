
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignDashboardProps {
  campaigns: Campaign[];
  userType: 'brand' | 'admin';
  onCampaignClick: (campaignId: string) => void;
  onCampaignDelete?: (campaignId: string, campaignTitle: string) => void;
  onCampaignReceive?: (campaignId: string) => void;
  onCampaignManage?: (campaign: Campaign) => void;
  getStatusText?: (status: Campaign['status'], campaign?: Campaign) => string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaigns,
  userType,
  onCampaignClick,
  onCampaignDelete,
  onCampaignReceive,
  onCampaignManage,
  getStatusText
}) => {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'revising': return 'bg-red-100 text-red-800';
      case 'revision-feedback': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const defaultGetStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'submitted': return '제출됨';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'revising': return '제안수정요청';
      case 'revision-feedback': return '제안수정피드백';
      case 'confirmed': return '확정됨';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  // 활성 상태의 인플루언서만 카운트 (거절된 인플루언서 제외)
  const getActiveInfluencersCount = (influencers: Campaign['influencers']) => {
    return influencers.filter(inf => 
      inf.status !== 'brand-rejected' && 
      inf.status !== 'admin-rejected' && 
      inf.status !== 'rejected'
    ).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusText ? getStatusText(campaign.status, campaign) : defaultGetStatusText(campaign.status)}
                </Badge>
              </div>
              <div className="flex gap-2">
                {userType === 'admin' && (
                  <>
                    {campaign.status === 'submitted' && onCampaignReceive && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCampaignReceive(campaign.id);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        수령
                      </Button>
                    )}
                    {(campaign.status === 'recruiting' || campaign.status === 'proposing' || campaign.status === 'revising') && onCampaignManage && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCampaignManage(campaign);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        관리
                      </Button>
                    )}
                    {onCampaignDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCampaignDelete(campaign.id, campaign.title);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}
                {userType === 'brand' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCampaignClick(campaign.id);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    보기
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent
            onClick={() => onCampaignClick(campaign.id)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">브랜드</span>
                <span className="text-sm font-medium">{campaign.brandName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">제품</span>
                <span className="text-sm font-medium">{campaign.productName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                  <span className="text-sm text-muted-foreground">예산</span>
                </div>
                <span className="text-sm font-medium">{campaign.budget.toLocaleString()}원</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-blue-600" />
                  <span className="text-sm text-muted-foreground">인플루언서</span>
                </div>
                <span className="text-sm font-medium">{getActiveInfluencersCount(campaign.influencers)}명</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-purple-600" />
                  <span className="text-sm text-muted-foreground">마감일</span>
                </div>
                <span className="text-sm font-medium">{campaign.proposalDeadline}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CampaignDashboard;
