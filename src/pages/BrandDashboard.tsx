
import React from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Megaphone, DollarSign } from 'lucide-react';

const BrandDashboard = () => {
  console.log('=== BrandDashboard 컴포넌트 시작 ===');
  console.log('현재 경로:', window.location.pathname);
  console.log('React 버전:', React.version);

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

  console.log('Stats 데이터:', stats);

  try {
    console.log('BrandDashboard 렌더링 시작...');
    
    return (
      <div className="flex h-screen bg-gray-50">
        <BrandSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
              <p className="text-gray-600 mt-2">브랜드 마케팅 현황을 한눈에 확인하세요</p>
            </div>

            {/* 렌더링 상태 확인을 위한 간단한 테스트 */}
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-yellow-800 font-semibold">✅ 브랜드 대시보드가 성공적으로 로드되었습니다!</p>
              <p className="text-sm text-yellow-700">시간: {new Date().toLocaleString()}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                console.log(`스탯 카드 ${index + 1} 렌더링:`, stat.title);
                const IconComponent = stat.icon;
                
                return (
                  <Card key={index} className="border-2 border-blue-200">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-green-200">
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

              <Card className="border-2 border-purple-200">
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

            {/* Enhanced Debug info */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">🔍 디버그 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700"><strong>상태:</strong> 브랜드 대시보드 정상 렌더링</p>
                  <p className="text-blue-700"><strong>현재 시간:</strong> {new Date().toLocaleTimeString()}</p>
                  <p className="text-blue-700"><strong>경로:</strong> {window.location.pathname}</p>
                </div>
                <div>
                  <p className="text-blue-700"><strong>컴포넌트:</strong> BrandDashboard</p>
                  <p className="text-blue-700"><strong>스탯 카드 수:</strong> {stats.length}개</p>
                  <p className="text-blue-700"><strong>브라우저:</strong> {navigator.userAgent.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BrandDashboard 렌더링 오류:', error);
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">렌더링 오류 발생</h2>
          <p className="text-red-700 mb-4">브랜드 대시보드를 로드하는 중 오류가 발생했습니다.</p>
          <pre className="text-xs bg-red-100 p-3 rounded text-left overflow-auto">
            {error?.toString()}
          </pre>
        </div>
      </div>
    );
  }
};

export default BrandDashboard;
