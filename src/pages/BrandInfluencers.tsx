
import React, { useState } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Eye, Users, BarChart3 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InfluencerDetailModal from '@/components/InfluencerDetailModal';

// 임시 인플루언서 데이터 타입
interface Influencer {
  id: string;
  profileImage: string;
  nickname: string;
  channelUrl: string;
  platform: 'douyin' | 'xiaohongshu';
  followers: number;
  region: string;
  category: string[];
  engagementRate: number;
}

export default function BrandInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [followerRange, setFollowerRange] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  // 다양한 인플루언서 데모 데이터
  const influencers: Influencer[] = [
    // 도우인 인플루언서 5명
    {
      id: '1',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '뷰티마스터',
      channelUrl: 'https://www.douyin.com/user/beauty_master',
      platform: 'douyin',
      followers: 1500000,
      region: '베이징',
      category: ['뷰티', '패션'],
      engagementRate: 4.2,
    },
    {
      id: '2',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '요리왕김셰프',
      channelUrl: 'https://www.douyin.com/user/cooking_chef_kim',
      platform: 'douyin',
      followers: 890000,
      region: '상하이',
      category: ['요리', '라이프스타일'],
      engagementRate: 6.8,
    },
    {
      id: '3',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '피트니스걸',
      channelUrl: 'https://www.douyin.com/user/fitness_girl',
      platform: 'douyin',
      followers: 650000,
      region: '광저우',
      category: ['피트니스', '건강'],
      engagementRate: 5.4,
    },
    {
      id: '4',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '테크리뷰어',
      channelUrl: 'https://www.douyin.com/user/tech_reviewer',
      platform: 'douyin',
      followers: 420000,
      region: '선전',
      category: ['테크', '리뷰'],
      engagementRate: 3.9,
    },
    {
      id: '5',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '육아맘일상',
      channelUrl: 'https://www.douyin.com/user/parenting_mom_daily',
      platform: 'douyin',
      followers: 320000,
      region: '항저우',
      category: ['육아', '라이프스타일'],
      engagementRate: 7.2,
    },
    // 샤오홍슈 인플루언서 5명
    {
      id: '6',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '패션스타일러',
      channelUrl: 'https://www.xiaohongshu.com/user/fashion_styler',
      platform: 'xiaohongshu',
      followers: 1200000,
      region: '상하이',
      category: ['패션', '뷰티'],
      engagementRate: 5.1,
    },
    {
      id: '7',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '홈카페마스터',
      channelUrl: 'https://www.xiaohongshu.com/user/home_cafe_master',
      platform: 'xiaohongshu',
      followers: 780000,
      region: '베이징',
      category: ['라이프스타일', '요리'],
      engagementRate: 4.7,
    },
    {
      id: '8',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '여행작가',
      channelUrl: 'https://www.xiaohongshu.com/user/travel_writer',
      platform: 'xiaohongshu',
      followers: 950000,
      region: '청두',
      category: ['여행', '라이프스타일'],
      engagementRate: 6.3,
    },
    {
      id: '9',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '독서인플루언서',
      channelUrl: 'https://www.xiaohongshu.com/user/book_influencer',
      platform: 'xiaohongshu',
      followers: 280000,
      region: '난징',
      category: ['독서', '교육'],
      engagementRate: 8.1,
    },
    {
      id: '10',
      profileImage: '/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png',
      nickname: '반려동물전문가',
      channelUrl: 'https://www.xiaohongshu.com/user/pet_expert',
      platform: 'xiaohongshu',
      followers: 540000,
      region: '시안',
      category: ['반려동물', '라이프스타일'],
      engagementRate: 5.8,
    },
  ];

  // 통계 데이터
  const stats = {
    total: influencers.length,
    douyin: influencers.filter(i => i.platform === 'douyin').length,
    xiaohongshu: influencers.filter(i => i.platform === 'xiaohongshu').length,
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handleInfluencerDetail = (influencerId: string) => {
    const influencer = influencers.find(inf => inf.id === influencerId);
    if (influencer) {
      setSelectedInfluencer(influencer);
      setIsModalOpen(true);
    }
  };

  // 필터링 로직
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || influencer.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'all' || influencer.category.some(cat => 
      cat.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    const matchesRegion = selectedRegion === 'all' || influencer.region === selectedRegion;
    
    let matchesFollowerRange = true;
    if (followerRange !== 'all') {
      switch (followerRange) {
        case '0-10k':
          matchesFollowerRange = influencer.followers < 10000;
          break;
        case '10k-100k':
          matchesFollowerRange = influencer.followers >= 10000 && influencer.followers < 100000;
          break;
        case '100k-1m':
          matchesFollowerRange = influencer.followers >= 100000 && influencer.followers < 1000000;
          break;
        case '1m+':
          matchesFollowerRange = influencer.followers >= 1000000;
          break;
      }
    }

    return matchesSearch && matchesPlatform && matchesCategory && matchesRegion && matchesFollowerRange;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">인플루언서</h1>
          <p className="text-muted-foreground mt-2">
            인플루언서를 검색하고 협업을 위한 정보를 확인할 수 있습니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* 미니 대시보드 */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  총 인플루언서
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/ab4c4633-b725-4dea-955a-ec1a22cc8837.png" 
                    alt="도우인" 
                    className="w-5 h-5 rounded"
                  />
                  도우인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.douyin}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/e703f951-a663-4cec-a5ed-9321f609d145.png" 
                    alt="샤오홍슈" 
                    className="w-5 h-5 rounded"
                  />
                  샤오홍슈
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.xiaohongshu}</div>
              </CardContent>
            </Card>
          </div>

          {/* 검색 필터 */}
          <Card>
            <CardHeader>
              <CardTitle>검색 필터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>검색어</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="닉네임 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>플랫폼</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="douyin">도우인</SelectItem>
                      <SelectItem value="xiaohongshu">샤오홍슈</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>카테고리</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="뷰티">뷰티</SelectItem>
                      <SelectItem value="패션">패션</SelectItem>
                      <SelectItem value="라이프스타일">라이프스타일</SelectItem>
                      <SelectItem value="요리">요리</SelectItem>
                      <SelectItem value="피트니스">피트니스</SelectItem>
                      <SelectItem value="테크">테크</SelectItem>
                      <SelectItem value="육아">육아</SelectItem>
                      <SelectItem value="여행">여행</SelectItem>
                      <SelectItem value="독서">독서</SelectItem>
                      <SelectItem value="반려동물">반려동물</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>팔로워 수</Label>
                  <Select value={followerRange} onValueChange={setFollowerRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="0-10k">0-1만</SelectItem>
                      <SelectItem value="10k-100k">1만-10만</SelectItem>
                      <SelectItem value="100k-1m">10만-100만</SelectItem>
                      <SelectItem value="1m+">100만+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>지역</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="베이징">베이징</SelectItem>
                      <SelectItem value="상하이">상하이</SelectItem>
                      <SelectItem value="광저우">광저우</SelectItem>
                      <SelectItem value="선전">선전</SelectItem>
                      <SelectItem value="청두">청두</SelectItem>
                      <SelectItem value="항저우">항저우</SelectItem>
                      <SelectItem value="난징">난징</SelectItem>
                      <SelectItem value="시안">시안</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 인플루언서 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>인플루언서 목록 ({filteredInfluencers.length}명)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>프로필</TableHead>
                    <TableHead>닉네임</TableHead>
                    <TableHead>플랫폼</TableHead>
                    <TableHead>팔로워 수</TableHead>
                    <TableHead>참여율</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">상세보기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInfluencers.map((influencer) => (
                    <TableRow key={influencer.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={influencer.profileImage} />
                          <AvatarFallback>
                            {influencer.nickname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <a
                          href={influencer.channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {influencer.nickname}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {influencer.platform === 'douyin' ? (
                            <>
                              <img 
                                src="/lovable-uploads/ab4c4633-b725-4dea-955a-ec1a22cc8837.png" 
                                alt="도우인" 
                                className="w-5 h-5 rounded"
                              />
                              <span>도우인</span>
                            </>
                          ) : (
                            <>
                              <img 
                                src="/lovable-uploads/e703f951-a663-4cec-a5ed-9321f609d145.png" 
                                alt="샤오홍슈" 
                                className="w-5 h-5 rounded"
                              />
                              <span>샤오홍슈</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatFollowers(influencer.followers)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4 text-green-600" />
                          <span>{influencer.engagementRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{influencer.region}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {influencer.category.map((cat) => (
                            <Badge key={cat} variant="secondary">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleInfluencerDetail(influencer.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 인플루언서 상세보기 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>인플루언서 상세정보</DialogTitle>
          </DialogHeader>
          {selectedInfluencer && (
            <InfluencerDetailModal influencer={selectedInfluencer} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
