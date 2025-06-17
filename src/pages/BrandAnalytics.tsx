
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import BrandSidebar from '@/components/BrandSidebar';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';
import ChineseCommentAnalyzer from '@/components/analytics/ChineseCommentAnalyzer';
import PerformanceReportGenerator from '@/components/analytics/PerformanceReportGenerator';
import MobileAnalyticsDashboard from '@/components/analytics/MobileAnalyticsDashboard';
import BrandCampaignSelector from '@/components/analytics/BrandCampaignSelector';
import CampaignOverviewPanel from '@/components/analytics/CampaignOverviewPanel';
import InfluencerPerformanceOverview from '@/components/analytics/InfluencerPerformanceOverview';
import HorizontalNotificationSystem from '@/components/analytics/HorizontalNotificationSystem';
import { brandService } from '@/services/brand.service';
import { campaignService } from '@/services/campaign.service';
import { Brand } from '@/types/brand';
import { Campaign } from '@/types/campaign';

const BrandAnalytics = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('all');

  // 실제 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('📊 브랜드 성과분석 - 실제 데이터 로딩 시작');
        
        // 실제 브랜드와 캠페인 데이터 로딩
        const [brandsData, campaignData] = await Promise.all([
          brandService.getBrands(),
          campaignService.getCampaigns()
        ]);
        
        console.log('🏢 로딩된 브랜드:', brandsData.length, '개');
        console.log('🎯 로딩된 캠페인:', campaignData.length, '개');
        
        setBrands(brandsData);
        
        // 분석 가능한 캠페인만 필터링 (라이브, 모니터링, 완료 상태)
        const analyzableCampaigns = campaignData.filter(campaign => 
          ['live', 'monitoring', 'completed'].includes(campaign.status)
        );
        
        setCampaigns(analyzableCampaigns);
        
        // 첫 번째 브랜드를 기본 선택
        if (brandsData.length > 0) {
          setSelectedBrand(brandsData[0].id);
        }
        
        console.log('📈 분석 가능한 캠페인:', analyzableCampaigns.length, '개');
        
        if (analyzableCampaigns.length > 0) {
          toast({
            title: "성과분석 데이터 로딩 완료",
            description: `${analyzableCampaigns.length}개의 분석 가능한 캠페인을 발견했습니다.`
          });
        } else {
          toast({
            title: "분석 가능한 캠페인 없음",
            description: "라이브 또는 완료된 캠페인이 없습니다. 캠페인을 먼저 진행해주세요.",
            variant: "destructive"
          });
        }
        
      } catch (error) {
        console.error('❌ 성과분석 데이터 로딩 실패:', error);
        toast({
          title: "데이터 로딩 실패",
          description: "성과분석 데이터를 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // 선택된 브랜드에 따른 캠페인 필터링
  const filteredCampaigns = selectedBrand === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.brandId === selectedBrand);

  // 선택된 캠페인 데이터
  const selectedCampaignData = selectedCampaign === 'all' 
    ? null 
    : filteredCampaigns.find(c => c.id === selectedCampaign);

  // 선택된 캠페인의 인플루언서 목록 생성
  const availableInfluencers = selectedCampaignData 
    ? selectedCampaignData.influencers
        .filter(inf => inf.status === 'confirmed')
        .map(inf => ({
          id: inf.id,
          name: inf.name,
          platform: inf.platform || 'xiaohongshu'
        }))
    : [];

  // 선택된 인플루언서 데이터
  const selectedInfluencerData = selectedInfluencer === 'all' 
    ? null 
    : availableInfluencers.find(inf => inf.id === selectedInfluencer);

  // 브랜드 변경 핸들러
  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedCampaign('all');
    setSelectedInfluencer('all');
    console.log('🏢 브랜드 변경:', brandId);
  };

  // 캠페인 변경 핸들러
  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setSelectedInfluencer('all');
    console.log('🎯 캠페인 변경:', campaignId);
  };

  // 인플루언서 변경 핸들러
  const handleInfluencerChange = (influencerId: string) => {
    setSelectedInfluencer(influencerId);
    console.log('👤 인플루언서 변경:', influencerId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <div className="text-lg font-medium">성과분석 데이터를 불러오는 중...</div>
            <div className="text-sm text-gray-500 mt-2">브랜드와 캠페인 정보를 로딩하고 있습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (brands.length === 0) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">브랜드 성과 분석</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">등록된 브랜드가 없습니다.</p>
              <p className="text-sm text-yellow-600 mt-1">먼저 브랜드를 등록하고 캠페인을 진행해주세요.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 분석 가능한 캠페인이 없는 경우
  if (campaigns.length === 0) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">브랜드 성과 분석</h1>
            <p className="text-gray-600">중국 플랫폼에서의 캠페인 성과를 실시간으로 모니터링하고 분석하세요</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">분석 가능한 캠페인이 없습니다</h3>
            <p className="text-blue-700 mb-3">
              성과분석을 위해서는 라이브 상태이거나 완료된 캠페인이 필요합니다.
            </p>
            <div className="text-sm text-blue-600">
              <p>• 캠페인 생성 → 인플루언서 확정 → 콘텐츠 기획 → 콘텐츠 제작 → 라이브</p>
              <p>• 라이브된 캠페인에서 성과분석이 가능합니다</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">브랜드 성과 분석</h1>
          <p className="text-gray-600">중국 플랫폼에서의 캠페인 성과를 실시간으로 모니터링하고 분석하세요</p>
        </div>

        {/* 모바일 최적화 대시보드 */}
        <MobileAnalyticsDashboard />

        {/* 데스크톱/태블릿 레이아웃 */}
        <div className="hidden lg:block space-y-6">
          {/* 1. 실시간 알림 섹션 - 맨 상단 */}
          <HorizontalNotificationSystem />

          {/* 2. 캠페인 종합 성과 */}
          {selectedCampaign !== 'all' && selectedCampaignData && (
            <CampaignOverviewPanel
              campaignId={selectedCampaign}
              campaignTitle={selectedCampaignData.title}
            />
          )}

          {/* 3. 브랜드/캠페인/인플루언서 선택 섹션 */}
          <BrandCampaignSelector
            selectedBrand={selectedBrand}
            selectedCampaign={selectedCampaign}
            selectedInfluencer={selectedInfluencer}
            campaigns={filteredCampaigns.map(c => ({ id: c.id, title: c.title }))}
            influencers={availableInfluencers}
            brands={brands}
            onBrandChange={handleBrandChange}
            onCampaignChange={handleCampaignChange}
            onInfluencerChange={handleInfluencerChange}
          />

          {/* 4. 메인 분석 탭 */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                {selectedInfluencer === 'all' ? '전체 성과' : '인플루언서 분석'}
              </TabsTrigger>
              <TabsTrigger value="comments">댓글 분석</TabsTrigger>
              <TabsTrigger value="reports">리포트</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {selectedInfluencer === 'all' ? (
                <PerformanceDashboard 
                  isRealTime={true} 
                  campaignId={selectedCampaign === 'all' ? undefined : selectedCampaign} 
                />
              ) : (
                selectedInfluencerData && (
                  <InfluencerPerformanceOverview
                    influencerId={selectedInfluencer}
                    influencerName={selectedInfluencerData.name}
                    campaignId={selectedCampaign}
                  />
                )
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <ChineseCommentAnalyzer />
            </TabsContent>

            <TabsContent value="reports" className="mt-6 space-y-6">
              <PerformanceReportGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BrandAnalytics;
