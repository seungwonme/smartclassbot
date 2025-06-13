import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Tag, TrendingUp, Users, Calendar, Heart, MessageCircle, FileText, Camera, Video, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface XiaohongshuInfluencerDetailProps {
  influencer: {
    id: string;
    profileImage: string;
    nickname: string;
    platform: 'douyin' | 'xiaohongshu';
    followers: number;
    region: string;
    category: string[];
  };
}

export default function XiaohongshuInfluencerDetailModal({ influencer }: XiaohongshuInfluencerDetailProps) {
  // 샤오홍슈 인플루언서 상세 데이터
  const influencerDetail = {
    ...influencer,
    xiaohongshuId: '@beauty_lifestyle_xhs',
    gender: '여성',
    verification: '인증됨',
    idProperty: '개인계정',
    // 팔로워 인구통계
    followerGrowth: '+8,547',
    avgLikes: 2847,
    avgComments: 186,
    contentCount: 234,
    genderDistribution: {
      male: 15.0,
      female: 85.0
    },
    ageDistribution: {
      '18-24세': 32.0,
      '25-34세': 28.0
    },
    regionDistribution: {
      '上海': 22.15,
      '北京': 18.67,
      '广州': 12.34,
      '기타': 46.84
    },
    // 광고비 정보
    imageTextPrice: 15000,
    videoPrice: 25000,
    // 팔로워 주요관심사
    mainInterest: 32.85
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}천만`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const formatFollowersDisplay = (num: number) => {
    const formatted = formatNumber(num);
    const original = num.toLocaleString();
    return { formatted, original };
  };

  // 성별 분포 데이터 (차트용)
  const genderData = [
    { name: '남성', value: influencerDetail.genderDistribution.male, color: '#3B82F6' },
    { name: '여성', value: influencerDetail.genderDistribution.female, color: '#EC4899' }
  ];

  // 연령 분포 데이터 (차트용)
  const ageData = Object.entries(influencerDetail.ageDistribution).map(([age, value], index) => ({
    name: age,
    value: value,
    color: index === 0 ? '#8B5CF6' : '#06B6D4'
  }));

  const followersDisplay = formatFollowersDisplay(influencerDetail.followers);

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={influencerDetail.profileImage} />
            <AvatarFallback className="text-2xl">
              {influencerDetail.nickname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{influencerDetail.nickname}</h1>
              <img 
                src="/lovable-uploads/e703f951-a663-4cec-a5ed-9321f609d145.png" 
                alt="샤오홍슈" 
                className="w-6 h-6 rounded"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{influencerDetail.xiaohongshuId}</span>
              <Badge variant="secondary">{influencerDetail.verification}</Badge>
              <span>성별: {influencerDetail.gender}</span>
            </div>
            
            <div className="flex items-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>ID속성: {influencerDetail.idProperty}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{influencerDetail.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {influencerDetail.category.map((cat) => (
                  <Badge key={cat} variant="outline">{cat}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">팔로워</div>
            <div className="text-3xl font-bold">{followersDisplay.formatted}</div>
            <div className="text-sm text-muted-foreground">({followersDisplay.original}명)</div>
            <div className="mt-2">
              <Badge variant="default" className="bg-pink-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                활성 인플루언서
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 팔로워 인구통계 분석 */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          팔로워 인구통계분석
        </h2>
        
        <div className="grid grid-cols-4 gap-6">
          {/* 새롭게 증가한 팔로워수 */}
          <Card className="h-64 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                새롭게 증가한 팔로워수
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center text-center">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {influencerDetail.followerGrowth}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    최근 증가량
                  </div>
                </div>
                
                <div className="pt-4 border-t w-full">
                  <div className="text-purple-600 font-medium">
                    {influencerDetail.mainInterest}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    팔로워 주요관심사
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 성별 분포 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                성별 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {genderData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 연령 분포 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                연령 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {ageData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 지역 분포 */}
          <Card className="h-64 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                지역 분포
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="space-y-2 w-full">
                {Object.entries(influencerDetail.regionDistribution).map(([region, percentage]) => (
                  <div key={region} className="flex items-center justify-between text-sm w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span>{region}</span>
                    </div>
                    <span className="font-medium ml-4">{percentage.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 콘텐츠 및 참여도 분석 */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          콘텐츠 및 참여도 분석
        </h2>
        
        <div className="grid grid-cols-4 gap-6">
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">콘텐츠수량 (笔记数)</div>
              <div className="text-3xl font-bold text-purple-600 mb-1">{influencerDetail.contentCount}개</div>
              <div className="text-sm text-muted-foreground">총 게시물 수</div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-100">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">평균 좋아요</div>
              <div className="text-3xl font-bold text-red-600 mb-1 flex items-center justify-center gap-1">
                <Heart className="w-6 h-6" />
                {formatNumber(influencerDetail.avgLikes)}
              </div>
              <div className="text-sm text-muted-foreground">게시물당 평균</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">평균 댓글</div>
              <div className="text-3xl font-bold text-blue-600 mb-1 flex items-center justify-center gap-1">
                <MessageCircle className="w-6 h-6" />
                {influencerDetail.avgComments}
              </div>
              <div className="text-sm text-muted-foreground">게시물당 평균</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">참여도</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {((influencerDetail.avgLikes + influencerDetail.avgComments) / influencerDetail.followers * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">참여율</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 광고비 정보 */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          광고비 정보
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                이미지 + Text 가격
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {influencerDetail.imageTextPrice.toLocaleString()}원
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                게시물당 ({(influencerDetail.imageTextPrice / 150).toFixed(0)}위안)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                영상 가격
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {influencerDetail.videoPrice.toLocaleString()}원
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                영상당 ({(influencerDetail.videoPrice / 150).toFixed(0)}위안)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
