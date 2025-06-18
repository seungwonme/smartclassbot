
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2,
  Users,
  Megaphone,
  DollarSign,
  Activity,
  TrendingUp,
  Eye,
  MessageSquare,
  Globe,
  Database
} from 'lucide-react';
import { AdminDashboardData } from '@/services/dashboard.service';

interface AdminDashboardOverviewProps {
  data: AdminDashboardData;
  isLoading?: boolean;
}

const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ data, isLoading }) => {
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

  return (
    <div className="space-y-6">
      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">관리 브랜드</CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalBrands}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              지난 달 대비 +{data.stats.monthlyGrowth}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">전체 캠페인</CardTitle>
            <Megaphone className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalCampaigns}</div>
            <p className="text-xs text-gray-600">활성: {data.stats.activeCampaigns}개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 인플루언서</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalInfluencers}</div>
            <p className="text-xs text-gray-600">협업 중인 인플루언서</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 수익</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₩{(data.stats.totalRevenue / 100000000).toFixed(1)}억
            </div>
            <p className="text-xs text-gray-600">누적 캠페인 예산</p>
          </CardContent>
        </Card>
      </div>

      {/* 시스템 상태 및 플랫폼 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              시스템 상태
            </CardTitle>
            <CardDescription>실시간 시스템 모니터링</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">활성 사용자</span>
                <span className="font-medium">{data.systemHealth.activeUsers}명</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">시스템 가동률</span>
                <span className="font-medium text-green-600">{data.systemHealth.systemUptime}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">데이터 수집</span>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {data.systemHealth.dataCollectionStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              샤오홍슈 통계
            </CardTitle>
            <CardDescription>샤오홍슈 플랫폼 성과</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 콘텐츠</span>
                <span className="font-medium">{data.platformStats?.xiaohongshu?.totalContent || 0}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 노출</span>
                <span className="font-medium">
                  {((data.platformStats?.xiaohongshu?.totalExposure || 0) / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 참여도</span>
                <span className="font-medium">
                  {((data.platformStats?.xiaohongshu?.avgEngagement || 0) / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              더우인 통계
            </CardTitle>
            <CardDescription>더우인 플랫폼 성과</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 콘텐츠</span>
                <span className="font-medium">{data.platformStats?.douyin?.totalContent || 0}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 조회수</span>
                <span className="font-medium">
                  {((data.platformStats?.douyin?.totalViews || 0) / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 참여도</span>
                <span className="font-medium">
                  {((data.platformStats?.douyin?.avgEngagement || 0) / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 브랜드 개요 및 수익 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>브랜드 현황</CardTitle>
            <CardDescription>브랜드별 캠페인 및 활동 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.brandOverview.slice(0, 5).map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-sm text-gray-600">
                        캠페인 {brand.campaignCount}개 • 제품 {brand.productCount}개
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₩{(brand.totalBudget / 1000000).toFixed(0)}M</p>
                    <p className="text-sm text-gray-600">총 예산</p>
                  </div>
                </div>
              ))}
              {data.brandOverview.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  브랜드 데이터가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>캠페인 분포</CardTitle>
            <CardDescription>상태별 캠페인 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">활성 캠페인</span>
                <span className="text-lg font-bold text-blue-600">{data.campaignDistribution?.active || 0}</span>
              </div>
              <Progress value={(data.campaignDistribution?.active / Math.max(data.stats.totalCampaigns, 1)) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">기획 단계</span>
                <span className="text-lg font-bold text-purple-600">{data.campaignDistribution?.planning || 0}</span>
              </div>
              <Progress value={(data.campaignDistribution?.planning / Math.max(data.stats.totalCampaigns, 1)) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">라이브 중</span>
                <span className="text-lg font-bold text-green-600">{data.campaignDistribution?.live || 0}</span>
              </div>
              <Progress value={(data.campaignDistribution?.live / Math.max(data.stats.totalCampaigns, 1)) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">완료됨</span>
                <span className="text-lg font-bold text-gray-600">{data.campaignDistribution?.completed || 0}</span>
              </div>
              <Progress value={(data.campaignDistribution?.completed / Math.max(data.stats.totalCampaigns, 1)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
