
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
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Database,
  Bell,
  Zap
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 시스템 알림 및 상태 */}
      {data.alertsAndNotifications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Bell className="w-5 h-5 mr-2" />
                시스템 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.alertsAndNotifications.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-white rounded">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Zap className="w-5 h-5 mr-2" />
                실시간 모니터링
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">시스템 가동률</span>
                  <span className="font-bold text-green-600">{data.systemHealth.systemUptime}%</span>
                </div>
                <Progress value={data.systemHealth.systemUptime} className="h-2" />
                <div className="flex justify-between items-center text-sm">
                  <span>활성 사용자</span>
                  <span className="font-medium">{data.systemHealth.activeUsers}명</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>24시간 에러</span>
                  <span className="font-medium text-red-600">{data.systemHealth.errorCount24h}건</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* 플랫폼 통계 및 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-red-600" />
              샤오홍슈 플랫폼
            </CardTitle>
            <CardDescription className="flex items-center">
              {getStatusIcon(data.systemHealth.platformsStatus.xiaohongshu)}
              <span className="ml-2">
                {data.platformStats?.xiaohongshu?.enabled ? '활성화됨' : '비활성화됨'}
              </span>
            </CardDescription>
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
                <span className="text-sm text-gray-600">크롤링 간격</span>
                <span className="font-medium">{data.platformStats?.xiaohongshu?.crawlingInterval || 10}분</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-600" />
              더우인 플랫폼
            </CardTitle>
            <CardDescription className="flex items-center">
              {getStatusIcon(data.systemHealth.platformsStatus.douyin)}
              <span className="ml-2">
                {data.platformStats?.douyin?.enabled ? '활성화됨' : '비활성화됨'}
              </span>
            </CardDescription>
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
                <span className="text-sm text-gray-600">크롤링 간격</span>
                <span className="font-medium">{data.platformStats?.douyin?.crawlingInterval || 10}분</span>
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
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{brand.name}</p>
                        <Badge variant={brand.status === 'active' ? 'default' : 'secondary'}>
                          {brand.status === 'active' ? '활성' : '비활성'}
                        </Badge>
                      </div>
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

      {/* 최근 활동 및 수익 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              최근 활동
            </CardTitle>
            <CardDescription>시스템 내 최근 활동 로그</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 border-l-2 border-blue-200 bg-blue-50 rounded">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {data.recentActivities.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  최근 활동이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>브랜드별 수익 현황</CardTitle>
            <CardDescription>상위 수익 브랜드 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenueByBrand.slice(0, 5).map((brand, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{brand.brandName}</p>
                      <p className="text-sm text-gray-600">{brand.campaigns}개 캠페인</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₩{(brand.revenue / 1000000).toFixed(0)}M</p>
                    <p className={`text-sm ${brand.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {brand.growth > 0 ? '+' : ''}{brand.growth.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              {data.revenueByBrand.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  수익 데이터가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
