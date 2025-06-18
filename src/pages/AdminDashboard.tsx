
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardOverview from '@/components/dashboard/AdminDashboardOverview';
import { dashboardService } from '@/services/dashboard.service';
import { performanceTrackerService } from '@/services/performanceTracker.service';

const AdminDashboard = () => {
  const [isTracking, setIsTracking] = useState(false);

  // Start performance tracking on component mount
  useEffect(() => {
    console.log('🚀 관리자 대시보드 마운트 - 전체 시스템 모니터링 시작');
    performanceTrackerService.startTracking();
    setIsTracking(true);
    
    return () => {
      console.log('⏹️ 관리자 대시보드 언마운트 - 시스템 모니터링 정지');
      performanceTrackerService.stopTracking();
      setIsTracking(false);
    };
  }, []);

  // Fetch admin dashboard data with real-time updates
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => dashboardService.getAdminDashboardData(),
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
    console.error('관리자 대시보드 데이터 로드 실패:', error);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">시스템 관리 대시보드</h1>
                <p className="text-gray-600 mt-2">전체 브랜드와 캠페인을 통합 관리하세요</p>
              </div>
              {isTracking && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">시스템 모니터링 중</span>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Overview */}
          <AdminDashboardOverview 
            data={dashboardData || {
              stats: { totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0, totalBrands: 0, totalProducts: 0, totalInfluencers: 0, totalRevenue: 0, monthlyGrowth: 0 },
              brandOverview: [],
              platformStats: { xiaohongshu: { totalContent: 0 }, douyin: { totalContent: 0 } },
              systemHealth: { activeUsers: 0, systemUptime: 0, dataCollectionStatus: 'Unknown' },
              revenueByBrand: [],
              campaignDistribution: { active: 0, completed: 0, planning: 0, live: 0 }
            }}
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
  );
};

export default AdminDashboard;
