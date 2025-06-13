
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Tag, TrendingUp, Users, Calendar, DollarSign, BarChart3, Activity, ShoppingCart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface InfluencerDetailProps {
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

export default function InfluencerDetailModal({ influencer }: InfluencerDetailProps) {
  // 관리자 상세 페이지와 동일한 임시 데이터
  const influencerDetail = {
    ...influencer,
    username: '@chensanfeigg31',
    verification: '인증됨',
    followerGrowth: '+127,302',
    growthRate: '최근 증감량',
    growthStatus: '늘음',
    growthDate: '최신도 : 실시간',
    genderDistribution: {
      male: 31.0,
      female: 69.0
    },
    ageDistribution: {
      '18-24세': 18.0,
      '25-34세': 18.0
    },
    regionDistribution: {
      '广东,16.34%': 16.34,
      '广州,2.63%': 2.63,
      '기타': 35
    },
    liveStreams: 14,
    totalViewers: 5046216,
    avgViewersPerStream: 2847,
    totalSales: 2670,
    totalRevenue: 8032,
    conversionRate: 21.63,
    recentActivities: {
      커머스방송: 5,
      최댓전환율: 4.1,
      최댓판매액: 466,
      최댓판매액원: 30.1
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}천만`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
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
              {influencer.platform === 'douyin' && (
                <img 
                  src="/lovable-uploads/ab4c4633-b725-4dea-955a-ec1a22cc8837.png" 
                  alt="도우인" 
                  className="w-6 h-6 rounded"
                />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{influencerDetail.username}</span>
              <Badge variant="secondary">{influencerDetail.verification}</Badge>
            </div>
            
            <div className="flex items-center gap-6">
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
            <div className="text-3xl font-bold">{influencerDetail.followers.toLocaleString()}</div>
            <div className="mt-2">
              <Badge variant="default" className="bg-green-500">
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
          <BarChart3 className="w-5 h-5" />
          팔로워 인구통계분석
        </h2>
        
        <div className="grid grid-cols-4 gap-6">
          {/* 팔로워 증감량 및 활성도 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                팔로워 증감량 및 활성도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {influencerDetail.followerGrowth}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {influencerDetail.growthRate}
              </div>
              <Badge variant="secondary" className="mt-2">
                {influencerDetail.growthStatus}
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">
                {influencerDetail.growthDate}
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                지역 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(influencerDetail.regionDistribution).map(([region, percentage]) => (
                  <div key={region} className="flex justify-between text-sm">
                    <span>{region}</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 라이브 방송 분석 */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          라이브 방송분석
        </h2>
        
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">라이브방송 횟수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{influencerDetail.liveStreams}회</div>
              <div className="text-sm text-muted-foreground mt-1">총 방송 횟수</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">최당 평균 시청자수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(influencerDetail.totalViewers)}명
              </div>
              <div className="text-sm text-muted-foreground mt-1">평균 동시접속자</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">최당 평균 시청시간</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {influencerDetail.avgViewersPerStream.toLocaleString()}초
              </div>
              <div className="text-sm text-muted-foreground mt-1">평균 시청 시간</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 라이브커머스 정보 */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          라이브커머스 정보
        </h2>
        
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">총 판매량</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{influencerDetail.totalSales.toLocaleString()}개</div>
              <div className="text-sm text-muted-foreground mt-1">누적 판매 상품 수</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">판매액</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {influencerDetail.totalRevenue.toLocaleString()}만원
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                누적 총 매출액 ({(influencerDetail.totalRevenue * 10000).toLocaleString()}원)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">주요 소비자 타겟</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                小镇青年,{influencerDetail.conversionRate}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">타겟 소비자층</div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">최근 커머스 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">
                  {influencerDetail.recentActivities.커머스방송}회
                </div>
                <div className="text-sm text-muted-foreground">총 커머스 방송</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">
                  {influencerDetail.recentActivities.최댓전환율}
                </div>
                <div className="text-sm text-muted-foreground">평균 전환율</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">
                  {influencerDetail.recentActivities.최댓판매액}개
                </div>
                <div className="text-sm text-muted-foreground">평균 판매 개수</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {influencerDetail.recentActivities.최댓판매액원}원
                </div>
                <div className="text-sm text-muted-foreground">평균 매출액<br/>(1,584.4만원)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
