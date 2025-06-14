
import React from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Megaphone, DollarSign } from 'lucide-react';

const BrandDashboard = () => {
  console.log('=== BrandDashboard 컴포넌트 시작 ===');
  console.log('현재 경로:', window.location.pathname);

  const stats = [
    {
      title: '진행 중인 캠페인',
      value: '12',
      description: '지난 달 대비 +20%',
      icon: Megaphone,
      trend: 'up'
    },
    {
      title: '협업 인플루언서',
      value: '85',
      description: '활성 인플루언서 수',
      icon: Users,
      trend: 'up'
    },
    {
      title: '총 조회수',
      value: '2.4M',
      description: '이번 달 누적',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: '예상 매출',
      value: '₩45M',
      description: '현재 캠페인 기준',
      icon: DollarSign,
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <BrandSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">브랜드 마케팅 현황을 한눈에 확인하세요</p>
        </div>

        {/* 상태 확인 알림 */}
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 font-semibold">✅ 브랜드 대시보드가 정상적으로 로드되었습니다!</p>
          <p className="text-sm text-green-700">시간: {new Date().toLocaleString()}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <Card key={index} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>최근 캠페인</CardTitle>
              <CardDescription>진행 중인 마케팅 캠페인 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">신제품 런칭 캠페인 #{item}</p>
                      <p className="text-sm text-gray-600">샤오홍슈 • 5명의 인플루언서</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      진행중
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>인플루언서 성과</CardTitle>
              <CardDescription>이번 주 상위 성과 인플루언서</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">@influencer_{item}</p>
                        <p className="text-sm text-gray-600">팔로워 450K</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">85K</p>
                      <p className="text-sm text-gray-600">조회수</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 화면 표시 확인을 위한 테스트 섹션 */}
        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🔍 화면 표시 테스트</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>✅ 이 텍스트가 보인다면 페이지가 정상적으로 렌더링되고 있습니다!</strong></p>
            <p><strong>현재 시간:</strong> {new Date().toLocaleTimeString()}</p>
            <p><strong>경로:</strong> {window.location.pathname}</p>
            <p><strong>화면 크기:</strong> {window.innerWidth} x {window.innerHeight}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandDashboard;
