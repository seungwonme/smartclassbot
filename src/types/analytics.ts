
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

export interface ChinesePerformanceMetrics {
  id: string;
  urlId: string;
  campaignId: string;
  influencerId: string;
  platform: ChinesePlatform;
  
  // 샤오홍슈 전용 지표
  xiaohongshuMetrics?: {
    exposure: number;      // 노출량(曝光量)
    likes: number;         // 좋아요(点赞)
    collections: number;   // 수집(收藏)
    comments: number;      // 댓글(评论)
    shares: number;        // 공유(分享)
  };
  
  // 도우인 전용 지표
  douyinMetrics?: {
    views: number;         // 재생량(播放量)
    likes: number;         // 좋아요(点赞)
    comments: number;      // 댓글(评论)
    shares: number;        // 공유(转发)
    follows: number;       // 팔로우(关注)
  };
  
  // 중국어 댓글 분석
  chineseCommentAnalysis?: {
    totalComments: number;
    sentiment: {
      positive: number;    // 긍정 (积极)
      negative: number;    // 부정 (消极)
      neutral: number;     // 중립 (中性)
    };
    keywords: string[];    // 주요 키워드 (중국어)
    emotions: {
      joy: number;         // 기쁨 (喜悦)
      anger: number;       // 분노 (愤怒)
      surprise: number;    // 놀람 (惊讶)
    };
  };
  
  lastUpdated: string;
}
