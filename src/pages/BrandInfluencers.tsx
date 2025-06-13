
import React, { useState } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Eye, Users } from 'lucide-react';
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
}

export default function BrandInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [followerRange, setFollowerRange] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // 임시 인플루언서 데이터
  const influencers: Influencer[] = [
    {
      id: '1',
      profileImage: '',
      nickname: '뷰티마스터',
      channelUrl: 'https://www.douyin.com/user/beauty_master',
      platform: 'douyin',
      followers: 1500000,
      region: '베이징',
      category: ['뷰티', '패션'],
    },
    {
      id: '2',
      profileImage: '',
      nickname: '라이프스타일러',
      channelUrl: 'https://www.xiaohongshu.com/user/lifestyle',
      platform: 'xiaohongshu',
      followers: 850000,
      region: '상하이',
      category: ['라이프스타일', '패션'],
    },
    {
      id: '3',
      profileImage: '',
      nickname: '육아맘',
      channelUrl: 'https://www.douyin.com/user/parenting_mom',
      platform: 'douyin',
      followers: 320000,
      region: '광저우',
      category: ['육아', '라이프스타일'],
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
    // 브랜드 관리자용 인플루언서 상세 페이지로 이동
    console.log('Navigate to influencer detail:', influencerId);
  };

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
                      <SelectItem value="beauty">뷰티</SelectItem>
                      <SelectItem value="fashion">패션</SelectItem>
                      <SelectItem value="lifestyle">라이프스타일</SelectItem>
                      <SelectItem value="parenting">육아</SelectItem>
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
                      <SelectItem value="beijing">베이징</SelectItem>
                      <SelectItem value="shanghai">상하이</SelectItem>
                      <SelectItem value="guangzhou">광저우</SelectItem>
                      <SelectItem value="shenzhen">선전</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 인플루언서 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>인플루언서 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>프로필</TableHead>
                    <TableHead>닉네임</TableHead>
                    <TableHead>플랫폼</TableHead>
                    <TableHead>팔로워 수</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">상세보기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencers.map((influencer) => (
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
    </div>
  );
}
