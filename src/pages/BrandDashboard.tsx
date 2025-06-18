
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BrandSidebar from '@/components/BrandSidebar';
import BrandDashboardOverview from '@/components/dashboard/BrandDashboardOverview';
import ErrorBoundary from '@/components/ErrorBoundary';
import { dashboardService } from '@/services/dashboard.service';
import { performanceTrackerService } from '@/services/performanceTracker.service';

const BrandDashboard = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Safely start performance tracking on component mount
  useEffect(() => {
    try {
      console.log('🚀 브랜드 대시보드 마운트 - 성과 추적 시작');
      performanceTrackerService.startTracking();
      setIsTracking(true);
      setServiceError(null);
    } catch (error) {
      console.error('❌ 성과 추적 서비스 시작 실패:', error);
      setServiceError('성과 추적 서비스를 시작할 수 없습니다.');
      setIsTracking(false);
    }
    
    return () => {
      try {
        console.log('⏹️ 브랜드 대시보드 언마운트 - 성과 추적 정지');
        performanceTrackerService.stopTracking();
        setIsTracking(false);
      } catch (error) {
        console.error('❌ 성과 추적 서비스 정지 실패:', error);
      }
    };
  }, []);

  // Fetch dashboard data with enhanced error handling
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['brandDashboard'],
    queryFn: async () => {
      try {
        return await dashboardService.getBrandDashboardData();
      } catch (error) {
        console.error('❌ 대시보드 데이터 로드 실패:', error);
        // Return fallback data instead of throwing
        return dashboardService.getFallbackBrandData?.() || getBasicFallbackData();
      }
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: (failureCount, error) => {
      console.log(`🔄 재시도 시도 ${failureCount}/3:`, error);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Safe auto-refresh with error handling
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(() => {
      try {
        refetch();
      } catch (error) {
        console.error('❌ 자동 새로고침 실패:', error);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isTracking, refetch]);

  // Basic fallback data function
  const getBasicFallbackData = () => ({
    stats: {
      totalCampaigns: 0,
      activeCampaigns: 0,
      completedCampaigns: 0,
      totalBrands: 0,
      totalProducts: 0,
      totalInfluencers: 0,
      totalRevenue: 0,
      monthlyGrowth: 0
    },
    campaignsByStage: {
      creation: 0,
      content: 0,
      live: 0
    },
    recentCampaigns: [],
    performanceSummary: {
      xiaohongshu: {
        totalExposure: 0,
        totalLikes: 0,
        count: 0
      },
      douyin: {
        totalViews: 0,
        totalLikes: 0,
        count: 0
      }
    },
    topInfluencers: [],
    contentStatus: {
      planningInProgress: 0,
      productionInProgress: 0,
      reviewPending: 0
    }
  });

  // Safe data with guaranteed structure
  const safeData = dashboardData || getBasicFallbackData();

  if (error && !dashboardData) {
    console.error('브랜드 대시보드 데이터 로드 실패:', error);
  }

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
                {isTracking && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">실시간 모니터링 중</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Error Warning */}
            {serviceError && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  ⚠️ {serviceError} 기본 데이터로 표시됩니다.
                </p>
              </div>
            )}

            {/* Dashboard Overview with Error Protection */}
            <ErrorBoundary fallback={
              <div className="p-8 text-center">
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

            {/* Data Loading Error Warning */}
            {(error || !dashboardData) && (
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
