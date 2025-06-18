
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Megaphone, 
  DollarSign, 
  Eye,
  Clock,
  Edit,
  PlayCircle
} from 'lucide-react';
import { BrandDashboardData } from '@/services/dashboard.service';

interface BrandDashboardOverviewProps {
  data: BrandDashboardData;
  isLoading?: boolean;
}

const BrandDashboardOverview: React.FC<BrandDashboardOverviewProps> = ({ data, isLoading }) => {
  console.log('📊 대시보드 오버뷰 렌더링 시작');

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

  // 안전한 데이터 접근
  const safeStats = {
    activeCampaigns: data?.stats?.activeCampaigns || 0,
    monthlyGrowth: data?.stats?.monthlyGrowth || 0,
    totalInfluencers: data?.stats?.totalInfluencers || 0,
    totalRevenue: data?.stats?.totalRevenue || 0,
    completedCampaigns: data?.stats?.completedCampaigns || 0
  };

  const safeCampaignStages = {
    creation: data?.campaignsByStage?.creation || 0,
    content: data?.campaignsByStage?.content || 0,
    live: data?.campaignsByStage?.live || 0
  };

  const safeRecentCampaigns = Array.isArray(data?.recentCampaigns) ? data.recentCampaigns : [];
  const safeTopInfluencers = Array.isArray(data?.topInfluencers) ? data.topInfluencers : [];

  const totalCampaigns = Math.max(safeStats.activeCampaigns + safeStats.completedCampaigns, 1);

  // 안전한 조회수 계산
  const getTotalViews = () => {
    try {
      const xiaohongshuviews = data?.performanceSummary?.xiaohongshu?.totalExposure || 0;
      const douyinViews = data?.performanceSummary?.douyin?.totalViews || 0;
      return (xiaohongshuviews + douyinViews) / 1000000;
    } catch (error) {
      return 0;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'live': 'bg-green-100 text-green-800',
      'producing': 'bg-blue-100 text-blue-800',
      'planning': 'bg-purple-100 text-purple-800',
      'recruiting': 'bg-orange-100 text-orange-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
      'live': '라이브',
      'producing': '제작중',
      'planning': '기획중',
      'recruiting': '섭외중',
      'confirmed': '확정됨'
    };
    return textMap[status] || status || '알 수 없음';
  };

  console.log('✅ 대시보드 오버뷰 렌더링 완료');

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
            <div className="text-2xl font-bold text-gray-900">{safeStats.activeCampaigns}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              지난 달 대비 +{safeStats.monthlyGrowth}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">협업 인플루언서</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{safeStats.totalInfluencers}</div>
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
              {getTotalViews().toFixed(1)}M
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
              ₩{(safeStats.totalRevenue / 1000000).toFixed(0)}M
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
            <div className="text-3xl font-bold text-blue-600 mb-2">{safeCampaignStages.creation}</div>
            <Progress value={(safeCampaignStages.creation / totalCampaigns) * 100} className="h-2" />
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
            <div className="text-3xl font-bold text-purple-600 mb-2">{safeCampaignStages.content}</div>
            <Progress value={(safeCampaignStages.content / totalCampaigns) * 100} className="h-2" />
            <div className="mt-2 text-sm text-gray-600">
              수정요청 대기: {data?.contentStatus?.reviewPending || 0}건
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
            <div className="text-3xl font-bold text-green-600 mb-2">{safeCampaignStages.live}</div>
            <Progress value={(safeCampaignStages.live / totalCampaigns) * 100} className="h-2" />
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
              {safeRecentCampaigns.slice(0, 5).map((campaign, index) => (
                <div key={campaign?.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{campaign?.title || '제목 없음'}</p>
                    <p className="text-sm text-gray-600">
                      {campaign?.brandName || '브랜드 없음'} • {campaign?.influencerCount || 0}명의 인플루언서
                    </p>
                    <div className="mt-2">
                      <Progress value={campaign?.progress || 0} className="h-1" />
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign?.status || '')}>
                    {getStatusText(campaign?.status || '')}
                  </Badge>
                </div>
              ))}
              {safeRecentCampaigns.length === 0 && (
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
              {safeTopInfluencers.slice(0, 5).map((influencer, index) => (
                <div key={influencer?.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{influencer?.name || '이름 없음'}</p>
                      <p className="text-sm text-gray-600">
                        팔로워 {((influencer?.followers || 0) / 1000).toFixed(0)}K • {influencer?.category || '카테고리 없음'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{((influencer?.engagementRate || 0) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">참여율</p>
                  </div>
                </div>
              ))}
              {safeTopInfluencers.length === 0 && (
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
