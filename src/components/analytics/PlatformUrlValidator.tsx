
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ChinesePlatform, detectChinesePlatform } from '@/utils/chinesePlatformUtils';

interface UrlValidationResult {
  isValid: boolean;
  platform: ChinesePlatform | null;
  contentId: string | null;
  error: string | null;
  suggestion: string | null;
}

interface PlatformUrlValidatorProps {
  url: string;
  onValidationChange: (result: UrlValidationResult) => void;
}

const PlatformUrlValidator: React.FC<PlatformUrlValidatorProps> = ({
  url,
  onValidationChange
}) => {
  const validateUrl = (inputUrl: string): UrlValidationResult => {
    if (!inputUrl.trim()) {
      return {
        isValid: false,
        platform: null,
        contentId: null,
        error: null,
        suggestion: null
      };
    }

    const cleanUrl = inputUrl.trim();
    const platform = detectChinesePlatform(cleanUrl);

    if (!platform) {
      return {
        isValid: false,
        platform: null,
        contentId: null,
        error: '지원하지 않는 플랫폼입니다.',
        suggestion: '샤오홍슈(xiaohongshu.com) 또는 도우인(douyin.com) URL만 지원됩니다.'
      };
    }

    // 플랫폼별 URL 패턴 검증 및 콘텐츠 ID 추출
    let contentId = null;
    let isValid = false;
    let error = null;
    let suggestion = null;

    if (platform === 'xiaohongshu') {
      const xhsPatterns = [
        /xiaohongshu\.com\/discovery\/item\/([a-zA-Z0-9]+)/,
        /xiaohongshu\.com\/explore\/([a-zA-Z0-9]+)/,
        /xhslink\.com\/([a-zA-Z0-9]+)/
      ];

      for (const pattern of xhsPatterns) {
        const match = cleanUrl.match(pattern);
        if (match) {
          contentId = match[1];
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        error = '올바른 샤오홍슈 URL 형식이 아닙니다.';
        suggestion = '예시: https://www.xiaohongshu.com/discovery/item/[콘텐츠ID]';
      }
    } else if (platform === 'douyin') {
      const douyinPatterns = [
        /douyin\.com\/video\/([0-9]+)/,
        /douyin\.com\/share\/video\/([0-9]+)/,
        /iesdouyin\.com\/share\/video\/([0-9]+)/
      ];

      for (const pattern of douyinPatterns) {
        const match = cleanUrl.match(pattern);
        if (match) {
          contentId = match[1];
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        error = '올바른 도우인 URL 형식이 아닙니다.';
        suggestion = '예시: https://www.douyin.com/video/[콘텐츠ID]';
      }
    }

    return {
      isValid,
      platform,
      contentId,
      error,
      suggestion
    };
  };

  React.useEffect(() => {
    const result = validateUrl(url);
    onValidationChange(result);
  }, [url, onValidationChange]);

  const validationResult = validateUrl(url);

  if (!url.trim()) return null;

  return (
    <div className="mt-2 space-y-2">
      {validationResult.isValid ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>유효한 {validationResult.platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'} URL입니다.</span>
          {validationResult.contentId && (
            <span className="text-gray-500">(ID: {validationResult.contentId})</span>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {validationResult.error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{validationResult.error}</span>
            </div>
          )}
          {validationResult.suggestion && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Info className="w-4 h-4" />
              <span>{validationResult.suggestion}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlatformUrlValidator;
