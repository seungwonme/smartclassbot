
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, ExternalLink, User, Calendar, Filter, Users } from 'lucide-react';
import { PlatformUrlData, getPlatformDisplayName, getPlatformColor, getPlatformBgColor } from '@/utils/chinesePlatformUtils';

interface MonitoringUrlListProps {
  urls: PlatformUrlData[];
  onRemoveUrl: (urlId: string) => void;
}

const MonitoringUrlList: React.FC<MonitoringUrlListProps> = ({
  urls,
  onRemoveUrl
}) => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [influencerFilter, setInfluencerFilter] = useState<string>('all');

  if (urls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>등록된 콘텐츠 URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            등록된 콘텐츠 URL이 없습니다.
            <br />
            위 폼을 사용하여 모니터링할 콘텐츠 URL을 등록해주세요.
          </div>
        </CardContent>
      </Card>
    );
  }

  // 필터링 로직
  const filteredUrls = urls.filter(url => {
    const platformMatch = platformFilter === 'all' || url.platform === platformFilter;
    const influencerMatch = influencerFilter === 'all' || url.influencerId === influencerFilter;
    return platformMatch && influencerMatch;
  });

  // 고유 인플루언서 목록
  const uniqueInfluencers = Array.from(
    new Set(urls.map(url => url.influencerId))
  ).map(id => {
    const url = urls.find(u => u.influencerId === id);
    return { id, name: url?.influencerName || '' };
  });

  // 플랫폼별 그룹화
  const groupedByPlatform = filteredUrls.reduce((acc, url) => {
    if (!acc[url.platform]) {
      acc[url.platform] = [];
    }
    acc[url.platform].push(url);
    return acc;
  }, {} as Record<string, PlatformUrlData[]>);

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          등록된 콘텐츠 URL
          <Badge variant="outline">{filteredUrls.length}개</Badge>
        </CardTitle>
        
        {/* 필터 섹션 */}
        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 플랫폼</SelectItem>
                <SelectItem value="xiaohongshu">샤오홍슈</SelectItem>
                <SelectItem value="douyin">도우인</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <Select value={influencerFilter} onValueChange={setInfluencerFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 인플루언서</SelectItem>
                {uniqueInfluencers.map((influencer) => (
                  <SelectItem key={influencer.id} value={influencer.id}>
                    {influencer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedByPlatform).map(([platform, platformUrls]) => (
            <div key={platform}>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={platform === 'xiaohongshu' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                  {platform === 'xiaohongshu' ? '📕' : '🎵'} {getPlatformDisplayName(platform as any)}
                </Badge>
                <span className="text-sm text-gray-500">({platformUrls.length}개)</span>
              </div>
              
              <div className="space-y-3 ml-4">
                {platformUrls.map((urlData) => (
                  <div 
                    key={urlData.id} 
                    className={`p-4 rounded-lg border ${getPlatformBgColor(urlData.platform)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            {urlData.influencerName}
                          </div>
                        </div>
                        
                        {urlData.contentTitle && (
                          <h4 className="font-medium text-gray-900 mb-1 truncate">
                            {urlData.contentTitle}
                          </h4>
                        )}
                        
                        <p className="text-sm text-gray-600 truncate mb-2">
                          {urlData.url}
                        </p>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          등록일: {new Date(urlData.addedAt).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenUrl(urlData.url)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveUrl(urlData.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonitoringUrlList;
