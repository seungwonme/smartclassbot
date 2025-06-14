
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Building2, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  console.log('=== AdminDashboard 컴포넌트 시작 ===');
  console.log('현재 경로:', window.location.pathname);
  console.log('현재 시간:', new Date().toLocaleString());

  const stats = [
    {
      title: '총 브랜드 수',
      value: '127',
      description: '활성 브랜드',
      icon: Building2,
      trend: 'up'
    },
    {
      title: '총 인플루언서',
      value: '12,458',
      description: '검증된 인플루언서',
      icon: Users,
      trend: 'up'
    },
    {
      title: '이번 달 캠페인',
      value: '342',
      description: '진행 중인 캠페인',
      icon: Activity,
      trend: 'up'
    },
    {
      title: '플랫폼 수익',
      value: '₩1.2B',
      description: '이번 달 누적',
      icon: DollarSign,
      trend: 'up'
    }
  ];

  console.log('통계 데이터:', stats);

  try {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex">
        <AdminSidebar />
        
        <main className="flex-1 p-8 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">플랫폼 전체 현황 및 시스템 관리</p>
          </div>

          {/* 상태 확인 알림 */}
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-semibold">✅ 관리자 대시보드가 정상적으로 로드되었습니다!</p>
            <p className="text-sm text-green-700">시간: {new Date().toLocaleString()}</p>
            <p className="text-sm text-green-700">경로: {window.location.pathname}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              console.log(`통계 카드 ${index + 1} 렌더링:`, stat.title);
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
                <CardTitle>최근 가입 브랜드</CardTitle>
                <CardDescription>새로 가입한 브랜드 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">브랜드 {item}</p>
                          <p className="text-sm text-gray-600">2024-01-15 가입</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        승인대기
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>시스템 상태</CardTitle>
                <CardDescription>플랫폼 운영 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">샤오홍슈 API</p>
                      <p className="text-sm text-gray-600">데이터 수집 상태</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">정상</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">도우인 API</p>
                      <p className="text-sm text-gray-600">데이터 수집 상태</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">정상</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">서버 상태</p>
                      <p className="text-sm text-gray-600">응답시간 평균</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">142ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 화면 표시 확인을 위한 테스트 섹션 */}
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">🔍 화면 표시 테스트</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>✅ 관리자 대시보드 페이지가 정상적으로 렌더링되고 있습니다!</strong></p>
              <p><strong>현재 시간:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>경로:</strong> {window.location.pathname}</p>
              <p><strong>화면 크기:</strong> {window.innerWidth} x {window.innerHeight}</p>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('AdminDashboard 렌더링 오류:', error);
    return (
      <div className="min-h-screen w-full bg-red-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">관리자 대시보드 오류</h1>
          <p className="text-red-500 mb-4">페이지 로딩 중 오류가 발생했습니다.</p>
          <p className="text-sm text-red-400">{error?.toString()}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    );
  }
};

export default AdminDashboard;
