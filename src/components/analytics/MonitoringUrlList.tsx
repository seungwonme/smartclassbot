
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, User, Calendar } from 'lucide-react';
import { PlatformUrlData, getPlatformDisplayName, getPlatformColor, getPlatformBgColor } from '@/utils/chinesePlatformUtils';

interface MonitoringUrlListProps {
  urls: PlatformUrlData[];
  onRemoveUrl: (urlId: string) => void;
}

const MonitoringUrlList: React.FC<MonitoringUrlListProps> = ({
  urls,
  onRemoveUrl
}) => {
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

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          등록된 콘텐츠 URL
          <Badge variant="outline">{urls.length}개</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {urls.map((urlData) => (
            <div 
              key={urlData.id} 
              className={`p-4 rounded-lg border ${getPlatformBgColor(urlData.platform)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={urlData.platform === 'xiaohongshu' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                      {getPlatformDisplayName(urlData.platform)}
                    </Badge>
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
      </CardContent>
    </Card>
  );
};

export default MonitoringUrlList;
