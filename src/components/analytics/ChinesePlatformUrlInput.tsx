
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AlertCircle } from 'lucide-react';
import { ChinesePlatform, PlatformUrlData } from '@/utils/chinesePlatformUtils';
import PlatformUrlValidator from './PlatformUrlValidator';
import ChinesePlatformDetector from './ChinesePlatformDetector';

interface ChinesePlatformUrlInputProps {
  confirmedInfluencers: Array<{
    id: string;
    name: string;
    platform: string;
  }>;
  onAddUrl: (urlData: Omit<PlatformUrlData, 'id' | 'addedAt'>) => void;
}

interface UrlValidationResult {
  isValid: boolean;
  platform: ChinesePlatform | null;
  contentId: string | null;
  error: string | null;
  suggestion: string | null;
}

const ChinesePlatformUrlInput: React.FC<ChinesePlatformUrlInputProps> = ({
  confirmedInfluencers,
  onAddUrl
}) => {
  const [url, setUrl] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [validationResult, setValidationResult] = useState<UrlValidationResult>({
    isValid: false,
    platform: null,
    contentId: null,
    error: null,
    suggestion: null
  });
  const [submitError, setSubmitError] = useState('');

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setSubmitError('');
  };

  const handleValidationChange = (result: UrlValidationResult) => {
    setValidationResult(result);
    setSubmitError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setSubmitError('URL을 입력해주세요.');
      return;
    }
    
    if (!selectedInfluencer) {
      setSubmitError('인플루언서를 선택해주세요.');
      return;
    }
    
    if (!validationResult.isValid) {
      setSubmitError('올바른 URL을 입력해주세요.');
      return;
    }

    if (!validationResult.platform) {
      setSubmitError('플랫폼을 감지할 수 없습니다.');
      return;
    }
    
    const influencer = confirmedInfluencers.find(inf => inf.id === selectedInfluencer);
    if (!influencer) return;
    
    onAddUrl({
      url: url.trim(),
      platform: validationResult.platform,
      influencerId: selectedInfluencer,
      influencerName: influencer.name,
      contentTitle: contentTitle.trim() || undefined
    });
    
    // 폼 초기화
    setUrl('');
    setSelectedInfluencer('');
    setContentTitle('');
    setValidationResult({
      isValid: false,
      platform: null,
      contentId: null,
      error: null,
      suggestion: null
    });
    setSubmitError('');
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
                className={submitError || validationResult.error ? 'border-red-500' : ''}
              />
              
              <div className="flex items-center gap-2">
                <ChinesePlatformDetector url={url} />
              </div>
              
              <PlatformUrlValidator 
                url={url} 
                onValidationChange={handleValidationChange}
              />
              
              {submitError && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {submitError}
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
            disabled={!url.trim() || !selectedInfluencer || !validationResult.isValid}
          >
            URL 등록
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChinesePlatformUrlInput;
