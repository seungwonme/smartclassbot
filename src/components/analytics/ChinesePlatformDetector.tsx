
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChinesePlatform, detectChinesePlatform, getPlatformDisplayName } from '@/utils/chinesePlatformUtils';

interface ChinesePlatformDetectorProps {
  url: string;
  className?: string;
}

const ChinesePlatformDetector: React.FC<ChinesePlatformDetectorProps> = ({
  url,
  className = ""
}) => {
  const platform = detectChinesePlatform(url);

  if (!platform || !url.trim()) return null;

  const getPlatformIcon = (platform: ChinesePlatform) => {
    return platform === 'xiaohongshu' ? '📕' : '🎵';
  };

  const getPlatformBadgeStyle = (platform: ChinesePlatform) => {
    return platform === 'xiaohongshu' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Badge 
      className={`${getPlatformBadgeStyle(platform)} ${className}`}
      variant="outline"
    >
      <span className="mr-1">{getPlatformIcon(platform)}</span>
      {getPlatformDisplayName(platform)}
    </Badge>
  );
};

export default ChinesePlatformDetector;
