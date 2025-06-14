
import React, { useState, useEffect } from 'react';
import { CampaignInfluencer } from '@/types/campaign';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Plus, Eye, TrendingUp } from 'lucide-react';

interface SimilarInfluencerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectedInfluencer: CampaignInfluencer | null;
  onAddInfluencers: (influencers: CampaignInfluencer[]) => Promise<void>;
}

const SimilarInfluencerModal: React.FC<SimilarInfluencerModalProps> = ({
  isOpen,
  onClose,
  rejectedInfluencer,
  onAddInfluencers
}) => {
  const [similarInfluencers, setSimilarInfluencers] = useState<CampaignInfluencer[]>([]);
  const [selectedInfluencers, setSelectedInfluencers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && rejectedInfluencer) {
      loadSimilarInfluencers();
    }
  }, [isOpen, rejectedInfluencer]);

  const loadSimilarInfluencers = async () => {
    if (!rejectedInfluencer) return;
    
    setIsLoading(true);
    
    // 임시 유사 인플루언서 데이터 생성 (브랜드 관리자 검색 목록과 동일한 형태)
    const mockSimilarInfluencers: CampaignInfluencer[] = [
      {
        id: `similar-${Date.now()}-1`,
        name: '뷰티구루김',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b9130f02?w=150&h=150&fit=crop&crop=face',
        followers: 85000,
        engagementRate: 4.2,
        platform: rejectedInfluencer.platform || 'douyin',
        status: 'pending',
        region: rejectedInfluencer.region || '서울',
        category: rejectedInfluencer.category || '뷰티',
        adFee: Math.floor(Math.random() * 2000000) + 1000000,
        socialChannels: ['douyin'],
        isSelected: false
      },
      {
        id: `similar-${Date.now()}-2`,
        name: '메이크업아티스트이',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        followers: 92000,
        engagementRate: 3.8,
        platform: rejectedInfluencer.platform || 'douyin',
        status: 'pending',
        region: rejectedInfluencer.region || '서울',
        category: rejectedInfluencer.category || '뷰티',
        adFee: Math.floor(Math.random() * 2000000) + 1000000,
        socialChannels: ['douyin'],
        isSelected: false
      },
      {
        id: `similar-${Date.now()}-3`,
        name: '코스메틱리뷰어박',
        profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
        followers: 78000,
        engagementRate: 4.5,
        platform: rejectedInfluencer.platform || 'douyin',
        status: 'pending',
        region: rejectedInfluencer.region || '서울',
        category: rejectedInfluencer.category || '뷰티',
        adFee: Math.floor(Math.random() * 2000000) + 1000000,
        socialChannels: ['douyin'],
        isSelected: false
      },
      {
        id: `similar-${Date.now()}-4`,
        name: '스타일링전문가최',
        profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
        followers: 95000,
        engagementRate: 4.1,
        platform: rejectedInfluencer.platform || 'xiaohongshu',
        status: 'pending',
        region: rejectedInfluencer.region || '서울',
        category: rejectedInfluencer.category || '뷰티',
        adFee: Math.floor(Math.random() * 2000000) + 1000000,
        socialChannels: ['xiaohongshu'],
        isSelected: false
      }
    ];
    
    setSimilarInfluencers(mockSimilarInfluencers);
    setIsLoading(false);
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handleInfluencerSelect = (influencerId: string) => {
    const newSelected = new Set(selectedInfluencers);
    if (newSelected.has(influencerId)) {
      newSelected.delete(influencerId);
    } else {
      newSelected.add(influencerId);
    }
    setSelectedInfluencers(newSelected);
  };

  const handleAddSelected = async () => {
    const selectedInfluencerData = similarInfluencers.filter(inf => 
      selectedInfluencers.has(inf.id)
    );
    
    if (selectedInfluencerData.length > 0) {
      try {
        await onAddInfluencers(selectedInfluencerData);
        setSelectedInfluencers(new Set());
        onClose();
      } catch (error) {
        console.error('인플루언서 추가 실패:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            유사 인플루언서 추천
            {rejectedInfluencer && (
              <span className="text-sm font-normal text-gray-500">
                ({rejectedInfluencer.name}과 유사한 인플루언서)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              선택한 인플루언서: {selectedInfluencers.size}명
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {similarInfluencers.map((influencer) => (
                <Card 
                  key={influencer.id} 
                  className={`cursor-pointer transition-all border-2 ${
                    selectedInfluencers.has(influencer.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInfluencerSelect(influencer.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={influencer.profileImage} />
                          <AvatarFallback>
                            {influencer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-blue-600">
                            {influencer.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <img 
                              src={influencer.platform === 'xiaohongshu' ? 
                                "/lovable-uploads/e703f951-a663-4cec-a5ed-9321f609d145.png" : 
                                "/lovable-uploads/ab4c4633-b725-4dea-955a-ec1a22cc8837.png"
                              } 
                              alt={influencer.platform === 'xiaohongshu' ? "샤오홍슈" : "도우인"} 
                              className="w-5 h-5 rounded"
                            />
                            <span className="text-sm text-gray-500">{influencer.region}</span>
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedInfluencers.has(influencer.id)}
                        onChange={() => handleInfluencerSelect(influencer.id)}
                        className="w-5 h-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{formatFollowers(influencer.followers)}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <span>{influencer.engagementRate}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        {influencer.category}
                      </Badge>
                      <span className="text-green-600 font-medium text-sm">
                        {influencer.adFee?.toLocaleString()}원
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">예상 광고비</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 상세 정보 모달 열기 (향후 구현)
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          상세보기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button 
            onClick={handleAddSelected}
            disabled={selectedInfluencers.size === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            선택한 인플루언서 추가 ({selectedInfluencers.size}명)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarInfluencerModal;
