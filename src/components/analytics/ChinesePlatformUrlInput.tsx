
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle } from 'lucide-react';
import { detectChinesePlatform, validatePlatformUrl, getPlatformDisplayName, ChinesePlatform, PlatformUrlData } from '@/utils/chinesePlatformUtils';

interface ChinesePlatformUrlInputProps {
  confirmedInfluencers: Array<{
    id: string;
    name: string;
    platform: string;
  }>;
  onAddUrl: (urlData: Omit<PlatformUrlData, 'id' | 'addedAt'>) => void;
}

const ChinesePlatformUrlInput: React.FC<ChinesePlatformUrlInputProps> = ({
  confirmedInfluencers,
  onAddUrl
}) => {
  const [url, setUrl] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<ChinesePlatform | null>(null);
  const [urlError, setUrlError] = useState('');

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setUrlError('');
    
    if (value.trim()) {
      const platform = detectChinesePlatform(value);
      setDetectedPlatform(platform);
      
      if (platform && !validatePlatformUrl(value)) {
        setUrlError('올바른 URL 형식이 아닙니다.');
      }
    } else {
      setDetectedPlatform(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setUrlError('URL을 입력해주세요.');
      return;
    }
    
    if (!selectedInfluencer) {
      setUrlError('인플루언서를 선택해주세요.');
      return;
    }
    
    if (!detectedPlatform) {
      setUrlError('지원하지 않는 플랫폼입니다. 샤오홍슈 또는 도우인 URL만 입력 가능합니다.');
      return;
    }
    
    if (!validatePlatformUrl(url)) {
      setUrlError('올바른 URL 형식이 아닙니다.');
      return;
    }
    
    const influencer = confirmedInfluencers.find(inf => inf.id === selectedInfluencer);
    if (!influencer) return;
    
    onAddUrl({
      url: url.trim(),
      platform: detectedPlatform,
      influencerId: selectedInfluencer,
      influencerName: influencer.name,
      contentTitle: contentTitle.trim() || undefined
    });
    
    // 폼 초기화
    setUrl('');
    setSelectedInfluencer('');
    setContentTitle('');
    setDetectedPlatform(null);
    setUrlError('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          콘텐츠 URL 등록
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="influencer">인플루언서 선택</Label>
            <Select value={selectedInfluencer} onValueChange={setSelectedInfluencer}>
              <SelectTrigger>
                <SelectValue placeholder="인플루언서를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {confirmedInfluencers.map((influencer) => (
                  <SelectItem key={influencer.id} value={influencer.id}>
                    {influencer.name} ({influencer.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="url">콘텐츠 URL</Label>
            <div className="space-y-2">
              <Input
                id="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.xiaohongshu.com/discovery/item/... 또는 https://www.douyin.com/video/..."
                className={urlError ? 'border-red-500' : ''}
              />
              
              {detectedPlatform && !urlError && (
                <Badge className={detectedPlatform === 'xiaohongshu' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                  감지된 플랫폼: {getPlatformDisplayName(detectedPlatform)}
                </Badge>
              )}
              
              {urlError && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {urlError}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="contentTitle">콘텐츠 제목 (선택사항)</Label>
            <Input
              id="contentTitle"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              placeholder="콘텐츠 제목을 입력하세요"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!url.trim() || !selectedInfluencer || !detectedPlatform || !!urlError}
          >
            URL 등록
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChinesePlatformUrlInput;
