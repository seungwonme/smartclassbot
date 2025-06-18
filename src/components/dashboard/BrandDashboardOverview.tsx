
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Megaphone, 
  DollarSign, 
  Calendar,
  Eye,
  MessageSquare,
  PlayCircle,
  Clock,
  Edit
} from 'lucide-react';
import { BrandDashboardData } from '@/services/dashboard.service';

interface BrandDashboardOverviewProps {
  data: BrandDashboardData;
  isLoading?: boolean;
}

const BrandDashboardOverview: React.FC<BrandDashboardOverviewProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Safe data access with defaults
  const stats = data?.stats || {
    activeCampaigns: 0,
    monthlyGrowth: 0,
    totalInfluencers: 0,
    totalRevenue: 0
  };

  const campaignsByStage = data?.campaignsByStage || {
    creation: 0,
    content: 0,
    live: 0
  };

  const contentStatus = data?.contentStatus || {
    reviewPending: 0
  };

  const performanceSummary = data?.performanceSummary || {
    xiaohongshu: { totalExposure: 0 },
    douyin: { totalViews: 0 }
  };

  const recentCampaigns = Array.isArray(data?.recentCampaigns) ? data.recentCampaigns : [];
  const topInfluencers = Array.isArray(data?.topInfluencers) ? data.topInfluencers : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'producing': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'recruiting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return '라이브';
      case 'producing': return '제작중';
      case 'planning': return '기획중';
      case 'recruiting': return '섭외중';
      case 'confirmed': return '확정됨';
      default: return status;
    }
  };

  // Safe calculation for total campaigns
  const completedCampaigns = (stats as any).completedCampaigns || 0;
  const totalCampaigns = Math.max(stats.activeCampaigns + completedCampaigns, 1);

  return (
    <div className="space-y-6">
      {/* 주요 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">진행 중인 캠페인</CardTitle>
            <Megaphone className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              지난 달 대비 +{stats.monthlyGrowth}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">협업 인플루언서</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalInfluencers}</div>
            <p className="text-xs text-gray-600">활성 인플루언서 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 조회수</CardTitle>
            <Eye className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(((performanceSummary?.xiaohongshu?.totalExposure || 0) + 
                (performanceSummary?.douyin?.totalViews || 0)) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-600">이번 달 누적</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 예산</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₩{(stats.totalRevenue / 1000000).toFixed(0)}M
            </div>
            <p className="text-xs text-gray-600">현재 캠페인 기준</p>
          </CardContent>
        </Card>
      </div>

      {/* 캠페인 단계별 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              생성~확정 단계
            </CardTitle>
            <CardDescription>캠페인 준비 및 인플루언서 확정</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">{campaignsByStage.creation}</div>
            <Progress value={(campaignsByStage.creation / totalCampaigns) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-purple-600" />
              콘텐츠 단계
            </CardTitle>
            <CardDescription>기획, 제작, 검수 진행</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">{campaignsByStage.content}</div>
            <Progress value={(campaignsByStage.content / totalCampaigns) * 100} className="h-2" />
            <div className="mt-2 text-sm text-gray-600">
              수정요청 대기: {contentStatus.reviewPending}건
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-green-600" />
              라이브 단계
            </CardTitle>
            <CardDescription>라이브 및 성과 모니터링</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">{campaignsByStage.live}</div>
            <Progress value={(campaignsByStage.live / totalCampaigns) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* 최근 캠페인 및 상위 인플루언서 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 캠페인</CardTitle>
            <CardDescription>진행 중인 주요 캠페인 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{campaign.title}</p>
                    <p className="text-sm text-gray-600">{campaign.brandName} • {campaign.influencerCount}명의 인플루언서</p>
                    <div className="mt-2">
                      <Progress value={campaign.progress} className="h-1" />
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {getStatusText(campaign.status)}
                  </Badge>
                </div>
              ))}
              {recentCampaigns.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  진행 중인 캠페인이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상위 성과 인플루언서</CardTitle>
            <CardDescription>참여율 기준 상위 인플루언서</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topInfluencers.slice(0, 5).map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{influencer.name}</p>
                      <p className="text-sm text-gray-600">팔로워 {(influencer.followers / 1000).toFixed(0)}K • {influencer.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(influencer.engagementRate * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">참여율</p>
                  </div>
                </div>
              ))}
              {topInfluencers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  인플루언서 데이터가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandDashboardOverview;
