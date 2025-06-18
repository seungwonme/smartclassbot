
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BrandSidebar from '@/components/BrandSidebar';
import BrandDashboardOverview from '@/components/dashboard/BrandDashboardOverview';
import ErrorBoundary from '@/components/ErrorBoundary';
import { dashboardService } from '@/services/dashboard.service';

const BrandDashboard = () => {
  const [performanceTracking, setPerformanceTracking] = useState(false);

  // Separate performance tracking initialization - no blocking
  useEffect(() => {
    const initializePerformanceTracking = async () => {
      try {
        // Dynamically import to avoid blocking dashboard load
        const { performanceTrackerService } = await import('@/services/performanceTracker.service');
        performanceTrackerService.startTracking();
        setPerformanceTracking(true);
        console.log('✅ 성과 추적 서비스 시작됨');
      } catch (error) {
        console.warn('⚠️ 성과 추적 서비스 초기화 실패 (대시보드는 정상 작동):', error);
        setPerformanceTracking(false);
      }
    };

    // Delay performance tracking to not block initial render
    const timeoutId = setTimeout(initializePerformanceTracking, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      try {
        import('@/services/performanceTracker.service').then(({ performanceTrackerService }) => {
          performanceTrackerService.stopTracking();
        });
      } catch (error) {
        console.warn('성과 추적 서비스 정지 중 오류:', error);
      }
    };
  }, []);

  // Dashboard data fetch with enhanced error recovery
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['brandDashboard'],
    queryFn: async () => {
      try {
        console.log('📊 대시보드 데이터 로딩 시작');
        const data = await dashboardService.getBrandDashboardData();
        console.log('✅ 대시보드 데이터 로딩 완료');
        return data;
      } catch (error) {
        console.error('❌ 대시보드 데이터 로딩 실패:', error);
        // Always return fallback data instead of throwing
        return dashboardService.getFallbackBrandData();
      }
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: false, // Disable retry to prevent endless loops
    retryOnMount: false,
  });

  // Safe data with guaranteed structure
  const safeData = dashboardData || dashboardService.getFallbackBrandData();

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        <BrandSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">브랜드 대시보드</h1>
                  <p className="text-gray-600 mt-2">캠페인 및 성과를 실시간으로 모니터링하세요</p>
                </div>
                {performanceTracking && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">실시간 모니터링 중</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard Overview with Complete Error Protection */}
            <ErrorBoundary fallback={
              <div className="p-8 text-center bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">대시보드를 불러올 수 없습니다</h2>
                <p className="text-gray-600 mb-4">일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  페이지 새로고침
                </button>
              </div>
            }>
              <BrandDashboardOverview 
                data={safeData}
                isLoading={isLoading}
              />
            </ErrorBoundary>

            {/* Error Recovery Options */}
            {error && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  ℹ️ 일부 데이터를 불러오는 중 문제가 발생했습니다. 기본 데이터로 표시됩니다.
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

export default BrandDashboard;
