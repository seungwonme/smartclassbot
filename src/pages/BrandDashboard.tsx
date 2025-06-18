
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BrandSidebar from '@/components/BrandSidebar';
import BrandDashboardOverview from '@/components/dashboard/BrandDashboardOverview';
import ErrorBoundary from '@/components/ErrorBoundary';
import { dashboardService } from '@/services/dashboard.service';
import { performanceTrackerService } from '@/services/performanceTracker.service';

const BrandDashboard = () => {
  const [isTracking, setIsTracking] = useState(false);

  // Start performance tracking on component mount
  useEffect(() => {
    console.log('🚀 브랜드 대시보드 마운트 - 성과 추적 시작');
    performanceTrackerService.startTracking();
    setIsTracking(true);
    
    return () => {
      console.log('⏹️ 브랜드 대시보드 언마운트 - 성과 추적 정지');
      performanceTrackerService.stopTracking();
      setIsTracking(false);
    };
  }, []);

  // Fetch dashboard data with real-time updates
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['brandDashboard'],
    queryFn: () => dashboardService.getBrandDashboardData(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Auto-refresh on tracking status change
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        refetch();
      }, 60000); // Refresh every minute when tracking is active
      
      return () => clearInterval(interval);
    }
  }, [isTracking, refetch]);

  if (error) {
    console.error('브랜드 대시보드 데이터 로드 실패:', error);
  }

  // Create safe default data that exactly matches BrandDashboardData interface
  const defaultDashboardData = {
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
  };

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

            {/* Dashboard Overview */}
            <BrandDashboardOverview 
              data={dashboardData || defaultDashboardData}
              isLoading={isLoading}
            />

            {error && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  ⚠️ 일부 데이터를 불러오는 중 문제가 발생했습니다. 기본 데이터로 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BrandDashboard;
