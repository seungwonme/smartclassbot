import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Users, Target, DollarSign, TrendingUp, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonaInfluencerMatcherProps {
  activePersona: string | null;
  selectedProduct: string;
  savedPersonas: any[];
  onPersonaSelect: (personaId: string) => void;
}

const PersonaInfluencerMatcher: React.FC<PersonaInfluencerMatcherProps> = ({
  activePersona,
  selectedProduct,
  savedPersonas,
  onPersonaSelect
}) => {
  const { toast } = useToast();
  const [budgetRange, setBudgetRange] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchResults, setMatchResults] = useState<any[]>([]);

  // 모의 매칭 결과 데이터
  const mockMatchResults = [
    {
      id: 'inf-match-1',
      name: '리 샤오메이',
      platform: '샤오홍슈',
      followers: 125000,
      engagement: 8.4,
      matchScore: 94,
      estimatedCost: 15000,
      matchReasons: [
        '타겟 페르소나와 팔로워 연령대 92% 일치',
        '뷰티 콘텐츠 전문성',
        'K-뷰티 리뷰 경험 다수'
      ],
      recentPosts: [
        { title: '한국 스킨케어 루틴', views: 45000, likes: 3200 },
        { title: '세럼 성분 분석', views: 38000, likes: 2800 }
      ],
      avatar: '👩‍💼'
    },
    {
      id: 'inf-match-2',
      name: '왕 위웨이',
      platform: '도우인',
      followers: 89000,
      engagement: 12.1,
      matchScore: 89,
      estimatedCost: 12000,
      matchReasons: [
        '페르소나 관심사와 콘텐츠 주제 일치',
        '높은 참여율과 신뢰도',
        '타겟 지역 팔로워 비율 높음'
      ],
      recentPosts: [
        { title: '뷰티 제품 테스트', views: 67000, likes: 8100 },
        { title: '스킨케어 팁', views: 52000, likes: 6300 }
      ],
      avatar: '🧑‍💻'
    },
    {
      id: 'inf-match-3',
      name: '장 시아오리',
      platform: '샤오홍슈',
      followers: 156000,
      engagement: 6.8,
      matchScore: 85,
      estimatedCost: 18000,
      matchReasons: [
        '브랜드 협업 경험 풍부',
        '페르소나 선호 콘텐츠 스타일',
        '안정적인 팔로워 성장세'
      ],
      recentPosts: [
        { title: '아침 루틴 제품 추천', views: 73000, likes: 4900 },
        { title: '피부 타입별 관리법', views: 61000, likes: 4200 }
      ],
      avatar: '👩‍🎨'
    }
  ];

  const budgetOptions = [
    { value: '5000-10000', label: '5,000 - 10,000위안' },
    { value: '10000-20000', label: '10,000 - 20,000위안' },
    { value: '20000-50000', label: '20,000 - 50,000위안' },
    { value: '50000+', label: '50,000위안 이상' }
  ];

  const handleStartMatching = async () => {
    if (!activePersona) {
      toast({
        title: "페르소나를 선택해주세요",
        description: "매칭을 위해 먼저 페르소나를 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsMatching(true);
    setMatchProgress(0);

    // 매칭 진행 시뮬레이션
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setMatchProgress(i);
    }

    setMatchResults(mockMatchResults);
    setIsMatching(false);
    
    toast({
      title: "인플루언서 매칭 완료",
      description: `${mockMatchResults.length}명의 최적 인플루언서를 찾았습니다.`,
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getPlatformIcon = (platform: string) => {
    return platform === '샤오홍슈' ? '📕' : '🎵';
  };

  const selectedPersonaData = savedPersonas.find(p => p.id === activePersona);

  return (
    <div className="space-y-6">
      {/* 매칭 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            인플루언서 매칭 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">페르소나 선택</label>
              <Select value={activePersona || ''} onValueChange={onPersonaSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="페르소나를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {savedPersonas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPersonaData && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{selectedPersonaData.name}</div>
                  <div className="text-gray-600">
                    {selectedPersonaData.demographics?.age} • {selectedPersonaData.demographics?.location}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">예산 범위</label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger>
                  <SelectValue placeholder="예산 범위 선택" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isMatching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>매칭 진행률</span>
                <span>{matchProgress}%</span>
              </div>
              <Progress value={matchProgress} />
              <div className="text-sm text-gray-600 text-center">
                페르소나 특성과 인플루언서 프로필을 분석하고 있습니다...
              </div>
            </div>
          )}

          <Button 
            onClick={handleStartMatching}
            disabled={isMatching || !activePersona}
            className="w-full"
          >
            {isMatching ? '매칭 중...' : '인플루언서 매칭 시작'}
          </Button>
        </CardContent>
      </Card>

      {/* 매칭 결과 */}
      {matchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">매칭 결과 ({matchResults.length}명)</h3>
          
          <div className="space-y-4">
            {matchResults.map((influencer) => (
              <Card key={influencer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 인플루언서 기본 정보 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{influencer.avatar}</div>
                        <div>
                          <h4 className="font-semibold">{influencer.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{getPlatformIcon(influencer.platform)}</span>
                            <span>{influencer.platform}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{influencer.followers.toLocaleString()} 팔로워</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>참여율 {influencer.engagement}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4" />
                          <span>예상 비용: {influencer.estimatedCost.toLocaleString()}위안</span>
                        </div>
                      </div>
                    </div>

                    {/* 매칭 점수 및 이유 */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`inline-block px-4 py-2 rounded-full ${getMatchScoreColor(influencer.matchScore)}`}>
                          <span className="font-semibold">매칭 점수: {influencer.matchScore}%</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">매칭 근거</h5>
                        <ul className="space-y-1">
                          {influencer.matchReasons.map((reason: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-xs">
                              <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 최근 성과 */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">최근 콘텐츠 성과</h5>
                      <div className="space-y-3">
                        {influencer.recentPosts.map((post: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-sm">{post.title}</div>
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>조회수: {post.views.toLocaleString()}</span>
                              <span>좋아요: {post.likes.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          상세보기
                        </Button>
                        <Button size="sm">
                          캠페인 초대
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 매칭 없음 상태 */}
      {!activePersona && matchResults.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">페르소나를 선택해주세요</h3>
            <p className="text-gray-600 mb-4">
              먼저 AI 페르소나를 생성하고 선택한 후 인플루언서 매칭을 진행하세요
            </p>
            <Button variant="outline">
              페르소나 생성하러 가기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaInfluencerMatcher;
