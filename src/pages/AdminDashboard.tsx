
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardOverview from '@/components/dashboard/AdminDashboardOverview';
import ErrorBoundary from '@/components/ErrorBoundary';
import { dashboardService } from '@/services/dashboard.service';

const AdminDashboard = () => {
  console.log('🚀 관리자 대시보드 로딩 시작');

  // 관리자 대시보드 데이터를 안전하게 로드
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      console.log('📊 관리자 대시보드 데이터 로딩 중...');
      try {
        const data = await dashboardService.getAdminDashboardData();
        console.log('✅ 관리자 대시보드 데이터 로딩 완료');
        return data;
      } catch (error) {
        console.error('❌ 관리자 대시보드 데이터 로딩 실패:', error);
        // 에러 발생 시 폴백 데이터 반환
        return dashboardService.getFallbackAdminData();
      }
    },
    refetchInterval: 60000, // 1분마다 리프레시
    staleTime: 30000, // 30초 동안 데이터 유효
    retry: false, // 재시도 비활성화로 안정성 확보
  });

  // 안전한 데이터 보장
  const safeData = dashboardData || dashboardService.getFallbackAdminData();

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* 헤더 */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">시스템 관리 대시보드</h1>
                  <p className="text-gray-600 mt-2">전체 브랜드와 캠페인을 통합 관리하세요</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">시스템 정상</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    마지막 업데이트: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 메인 대시보드 - 에러 보호 강화 */}
            <ErrorBoundary fallback={
              <div className="p-8 text-center bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">대시보드를 불러올 수 없습니다</h2>
                <p className="text-gray-600 mb-4">일시적인 오류가 발생했습니다.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  페이지 새로고침
                </button>
              </div>
            }>
              <AdminDashboardOverview 
                data={safeData}
                isLoading={isLoading}
              />
            </ErrorBoundary>

            {/* 에러 표시 (대시보드는 계속 작동) */}
            {error && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  ℹ️ 일부 데이터를 불러오는 중 문제가 발생했지만, 기본 데이터로 표시됩니다.
                </p>
                <button 
                  onClick={() => refetch()} 
                  className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  다시 시도
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
