import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignDashboardProps {
  campaigns: Campaign[];
  userType: 'admin' | 'brand';
  onCampaignClick?: (campaignId: string) => void;
  onCampaignEdit?: (campaignId: string) => void;
  onCampaignDelete?: (campaignId: string, campaignTitle: string) => void;
  onCampaignReceive?: (campaignId: string) => void;
  onCampaignManage?: (campaign: Campaign) => void;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaigns,
  userType,
  onCampaignClick,
  onCampaignEdit,
  onCampaignDelete,
  onCampaignReceive,
  onCampaignManage
}) => {
  const [expandedSections, setExpandedSections] = useState({
    creation: true,
    content: true,
    live: true
  });

  // 캠페인 단계별 분류 - producing 상태 추가
  const creationStageCampaigns = campaigns.filter(c => 
    ['creating', 'submitted', 'recruiting', 'proposing', 'revising', 'revision-feedback', 'confirmed'].includes(c.status)
  );
  
  const contentStageCampaigns = campaigns.filter(c => 
    ['planning', 'plan-review', 'plan-revision', 'plan-approved', 'producing', 'content-review', 'content-approved'].includes(c.status)
  );
  
  const liveStageCampaigns = campaigns.filter(c => 
    ['live', 'monitoring', 'completed'].includes(c.status)
  );

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'revising': return 'bg-red-100 text-red-800';
      case 'revision-feedback': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'plan-review': return 'bg-indigo-100 text-indigo-800';
      case 'plan-revision': return 'bg-orange-100 text-orange-800';
      case 'plan-approved': return 'bg-lime-100 text-lime-800';
      case 'producing': return 'bg-violet-100 text-violet-800';
      case 'content-review': return 'bg-purple-100 text-purple-800';
      case 'content-approved': return 'bg-emerald-100 text-emerald-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'submitted': return '제출됨';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'revising': return '제안수정요청';
      case 'revision-feedback': return '제안수정피드백';
      case 'confirmed': return '확정됨';
      case 'planning': return '콘텐츠 기획중';
      case 'plan-review': return '기획검토';
      case 'plan-revision': return '기획수정';
      case 'plan-approved': return '기획승인';
      case 'producing': return '콘텐츠 제작중';
      case 'content-review': return '콘텐츠검수';
      case 'content-approved': return '콘텐츠 승인완료';
      case 'live': return '라이브';
      case 'monitoring': return '모니터링';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const getActiveInfluencersCount = (influencers: Campaign['influencers']) => {
    return influencers.filter(inf => 
      inf.status !== 'brand-rejected' && 
      inf.status !== 'admin-rejected' && 
      inf.status !== 'rejected'
    ).length;
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCampaignCardClick = (campaignId: string, event: React.MouseEvent) => {
    console.log('Campaign card clicked:', campaignId);
    console.log('onCampaignClick function:', onCampaignClick);
    
    // Stop event propagation to prevent any parent handlers
    event.stopPropagation();
    
    if (onCampaignClick) {
      onCampaignClick(campaignId);
    } else {
      console.warn('onCampaignClick handler not provided');
    }
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const shouldShowReceiveButton = userType === 'admin' && campaign.status === 'submitted';
    const shouldShowManageButton = userType === 'admin' && 
      ['recruiting', 'proposing', 'revising', 'revision-feedback'].includes(campaign.status);
    const shouldShowEditButton = userType === 'brand' && campaign.status === 'creating';

    return (
      <Card 
        key={campaign.id} 
        className="hover:shadow-lg transition-shadow cursor-pointer relative"
        onClick={(e) => handleCampaignCardClick(campaign.id, e)}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusText(campaign.status)}
              </Badge>
              {userType === 'admin' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCampaignDelete?.(campaign.id, campaign.title);
                  }}
                  className="p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              {shouldShowEditButton && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCampaignEdit?.(campaign.id);
                  }}
                  className="p-1 h-6 w-6"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
            </div>
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
              인플루언서: {getActiveInfluencersCount(campaign.influencers)}명
            </div>
            <div className="flex justify-between mt-4">
              {shouldShowReceiveButton && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCampaignReceive?.(campaign.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  캠페인 수령
                </Button>
              )}
              {shouldShowManageButton && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCampaignManage?.(campaign);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {campaign.status === 'revising' ? '재제안' : '섭외 관리'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    campaigns: Campaign[],
    sectionKey: keyof typeof expandedSections,
    description: string
  ) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="mb-8">
        <div 
          className="flex items-center justify-between cursor-pointer mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <Badge variant="outline" className="ml-2">
              {campaigns.length}
            </Badge>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(renderCampaignCard)}
            {campaigns.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                이 단계의 캠페인이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 상단 통계 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">생성~확정 단계</p>
              <p className="text-2xl font-bold">{creationStageCampaigns.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Edit className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">콘텐츠 단계</p>
              <p className="text-2xl font-bold">{contentStageCampaigns.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <PlayCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">라이브~완료</p>
              <p className="text-2xl font-bold">{liveStageCampaigns.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 캠페인</p>
              <p className="text-2xl font-bold">{campaigns.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 단계별 섹션 */}
      {renderSection(
        "캠페인 생성 ~ 확정 단계",
        <Clock className="w-6 h-6 text-blue-600" />,
        creationStageCampaigns,
        'creation',
        userType === 'admin' 
          ? "캠페인 수령, 인플루언서 섭외, 제안 작성 단계"
          : "캠페인 생성, 인플루언서 승인, 최종 확정 단계"
      )}

      {renderSection(
        "콘텐츠 기획/제작/검수 단계", 
        <Edit className="w-6 h-6 text-purple-600" />,
        contentStageCampaigns,
        'content',
        userType === 'admin'
          ? "콘텐츠 기획 관리, 제작 관리, 검수 관리 단계"
          : "콘텐츠 기획 확인, 제작물 검토, 피드백 단계"
      )}

      {renderSection(
        "라이브 ~ 성과모니터링 단계",
        <PlayCircle className="w-6 h-6 text-green-600" />,
        liveStageCampaigns,
        'live',
        userType === 'admin'
          ? "라이브 모니터링, 플랫폼 관리, 성과 분석 단계"
          : "라이브 모니터링, 브랜드 성과 확인, ROI 분석 단계"
      )}
    </div>
  );
};

export default CampaignDashboard;
