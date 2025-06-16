
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, Link, TrendingUp } from 'lucide-react';
import { PlatformUrlData } from '@/types/analytics';

interface ChinesePlatformStatsProps {
  urls: PlatformUrlData[];
}

const ChinesePlatformStats: React.FC<ChinesePlatformStatsProps> = ({ urls }) => {
  const xiaohongshuUrls = urls.filter(url => url.platform === 'xiaohongshu');
  const douyinUrls = urls.filter(url => url.platform === 'douyin');
  
  const getLatestUpdate = () => {
    if (urls.length === 0) return null;
    const latest = urls.reduce((latest, url) => 
      new Date(url.addedAt) > new Date(latest.addedAt) ? url : latest
    );
    return new Date(latest.addedAt);
  };

  const latestUpdate = getLatestUpdate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 등록 URL</CardTitle>
          <Link className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{urls.length}</div>
          <p className="text-xs text-muted-foreground">
            모니터링 중인 콘텐츠
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">샤오홍슈</CardTitle>
          <span className="text-red-600">📕</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{xiaohongshuUrls.length}</div>
          <p className="text-xs text-muted-foreground">
            小红书 콘텐츠
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">도우인</CardTitle>
          <span className="text-gray-600">🎵</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{douyinUrls.length}</div>
          <p className="text-xs text-muted-foreground">
            抖音 콘텐츠
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">최근 업데이트</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {latestUpdate ? latestUpdate.toLocaleDateString('ko-KR') : '없음'}
          </div>
          <p className="text-xs text-muted-foreground">
            마지막 URL 등록
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChinesePlatformStats;
