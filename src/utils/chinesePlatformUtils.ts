
export type ChinesePlatform = 'xiaohongshu' | 'douyin';

export interface PlatformUrlData {
  id: string;
  url: string;
  platform: ChinesePlatform;
  influencerId: string;
  influencerName: string;
  contentTitle?: string;
  addedAt: string;
}

export const detectChinesePlatform = (url: string): ChinesePlatform | null => {
  const cleanUrl = url.trim().toLowerCase();
  
  if (cleanUrl.includes('xiaohongshu.com') || cleanUrl.includes('xhslink.com')) {
    return 'xiaohongshu';
  }
  
  if (cleanUrl.includes('douyin.com') || cleanUrl.includes('iesdouyin.com')) {
    return 'douyin';
  }
  
  return null;
};

export const validatePlatformUrl = (url: string): boolean => {
  const patterns = {
    xiaohongshu: /^https?:\/\/(www\.)?(xiaohongshu\.com|xhslink\.com)\/(discovery\/item|explore)\/[\w-]+/i,
    douyin: /^https?:\/\/(www\.)?(douyin\.com|iesdouyin\.com)\/(video|share\/video)\/[\w-]+/i
  };
  
  const platform = detectChinesePlatform(url);
  if (!platform) return false;
  
  return patterns[platform].test(url);
};

export const getPlatformDisplayName = (platform: ChinesePlatform): string => {
  return platform === 'xiaohongshu' ? '샤오홍슈(小红书)' : '도우인(抖音)';
};

export const getPlatformColor = (platform: ChinesePlatform): string => {
  return platform === 'xiaohongshu' ? 'text-red-600' : 'text-gray-800';
};

export const getPlatformBgColor = (platform: ChinesePlatform): string => {
  return platform === 'xiaohongshu' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200';
};
