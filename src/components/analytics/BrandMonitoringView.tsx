
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { PlatformUrlData } from '@/types/analytics';
import ChinesePlatformStats from './ChinesePlatformStats';

interface BrandMonitoringViewProps {
  campaignId: string;
  confirmedInfluencers: Array<{
    id: string;
    name: string;
    platform: string;
  }>;
  monitoringUrls: PlatformUrlData[];
}

const BrandMonitoringView: React.FC<BrandMonitoringViewProps> = ({
  campaignId,
  confirmedInfluencers,
  monitoringUrls
}) => {
  // 인플루언서별 URL 등록 상태 계산
  const getInfluencerUrlStatus = (influencerId: string) => {
    const influencerUrls = monitoringUrls.filter(url => url.influencerId === influencerId);
    return {
      hasUrls: influencerUrls.length > 0,
      urlCount: influencerUrls.length,
      urls: influencerUrls
    };
  };

  const totalRegisteredUrls = monitoringUrls.length;
  const influencersWithUrls = confirmedInfluencers.filter(inf => 
    getInfluencerUrlStatus(inf.id).hasUrls
  ).length;

  return (
    <div className="space-y-6">
      {/* 상단: 통계 카드 */}
      <ChinesePlatformStats urls={monitoringUrls} />

      {/* 중간: 등록 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">콘텐츠 URL 등록률</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {confirmedInfluencers.length > 0 
                ? Math.round((influencersWithUrls / confirmedInfluencers.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {influencersWithUrls}/{confirmedInfluencers.length} 인플루언서
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 등록 URL</CardTitle>
            <ExternalLink className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegisteredUrls}</div>
            <p className="text-xs text-muted-foreground">
              모니터링 대상 콘텐츠
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 완료</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{influencersWithUrls}</div>
            <p className="text-xs text-muted-foreground">
              URL 등록 완료한 인플루언서
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 하단: 인플루언서별 URL 등록 상태 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            인플루언서별 콘텐츠 URL 등록 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confirmedInfluencers.map((influencer) => {
              const status = getInfluencerUrlStatus(influencer.id);
              
              return (
                <div key={influencer.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{influencer.name}</h4>
                        <p className="text-sm text-gray-500">{influencer.platform}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {status.hasUrls ? (
                        <>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            등록완료
                          </Badge>
                          <Badge variant="outline">
                            {status.urlCount}개 URL
                          </Badge>
                        </>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Clock className="w-3 h-3 mr-1" />
                          등록대기
                        </Badge>
                      )}
                    </div>
                  </div>

                  {status.hasUrls && (
                    <div className="mt-3 space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">등록된 콘텐츠:</h5>
                      {status.urls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                          <span className="text-lg">
                            {url.platform === 'xiaohongshu' ? '📕' : '🎵'}
                          </span>
                          <span className="font-medium">
                            {url.platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'}
                          </span>
                          {url.contentTitle && (
                            <span className="text-gray-600">- {url.contentTitle}</span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {new Date(url.addedAt).toLocaleDateString('ko-KR')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {confirmedInfluencers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              확정된 인플루언서가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 안내 메시지 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-2">성과 모니터링 안내</h3>
            <p className="text-gray-600 text-sm mb-4">
              시스템 관리자가 인플루언서별 콘텐츠 URL을 등록하면, 
              <br />브랜드 관리자님의 <strong>성과분석</strong> 메뉴에서 상세한 성과 데이터를 확인하실 수 있습니다.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 콘텐츠 URL 등록이 완료되면 실시간 성과 데이터 수집이 시작됩니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandMonitoringView;
