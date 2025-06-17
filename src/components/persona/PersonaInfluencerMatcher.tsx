
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Users, Target, DollarSign, TrendingUp, Star, Zap, Crown, Award, Video, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InfluencerMixRecommendations from './InfluencerMixRecommendations';

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
  const [budget, setBudget] = useState('');
  const [adType, setAdType] = useState<'branding' | 'live-commerce' | ''>('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [showMixRecommendations, setShowMixRecommendations] = useState(false);

  // Enhanced mock influencer data with tiers (converted to KRW)
  const mockInfluencers = [
    {
      id: 'inf-mega-1',
      name: '리 샤오메이',
      platform: '샤오홍슈',
      followers: 1250000,
      engagement: 5.8,
      tier: 'mega',
      estimatedCost: 59850000, // ~45,000 CNY * 133 (exchange rate)
      avatar: '👑'
    },
    {
      id: 'inf-macro-1',
      name: '왕 위웨이',
      platform: '도우인',
      followers: 450000,
      engagement: 8.2,
      tier: 'macro',
      estimatedCost: 23940000, // ~18,000 CNY * 133
      avatar: '⭐'
    },
    {
      id: 'inf-macro-2',
      name: '장 시아오리',
      platform: '샤오홍슈',
      followers: 280000,
      engagement: 9.1,
      tier: 'macro',
      estimatedCost: 15960000, // ~12,000 CNY * 133
      avatar: '🌟'
    },
    {
      id: 'inf-micro-1',
      name: '천 메이메이',
      platform: '샤오홍슈',
      followers: 85000,
      engagement: 12.4,
      tier: 'micro',
      estimatedCost: 5985000, // ~4,500 CNY * 133
      avatar: '💎'
    },
    {
      id: 'inf-micro-2',
      name: '루 샤오펑',
      platform: '도우인',
      followers: 62000,
      engagement: 14.2,
      tier: 'micro',
      estimatedCost: 5054000, // ~3,800 CNY * 133
      avatar: '🎯'
    },
    {
      id: 'inf-micro-3',
      name: '쉬 지아',
      platform: '샤오홍슈',
      followers: 48000,
      engagement: 16.1,
      tier: 'micro',
      estimatedCost: 3857000, // ~2,900 CNY * 133
      avatar: '🔥'
    },
    {
      id: 'inf-nano-1',
      name: '고 샤오밍',
      platform: '도우인',
      followers: 25000,
      engagement: 18.5,
      tier: 'nano',
      estimatedCost: 1995000, // ~1,500 CNY * 133
      avatar: '💫'
    }
  ];

  const selectedPersonaData = savedPersonas.find(p => p.id === activePersona);

  const handleStartMatching = async () => {
    if (!activePersona) {
      toast({
        title: "페르소나를 선택해주세요",
        description: "매칭을 위해 먼저 페르소나를 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!budget || parseFloat(budget) <= 0) {
      toast({
        title: "예산을 입력해주세요",
        description: "인플루언서 매칭을 위해 예산을 입력해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!adType) {
      toast({
        title: "광고 유형을 선택해주세요",
        description: "인플루언서 매칭을 위해 광고 유형을 선택해야 합니다.",
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

    setMatchResults(mockInfluencers);
    setShowMixRecommendations(true);
    setIsMatching(false);
    
    toast({
      title: "인플루언서 매칭 완료",
      description: `${mockInfluencers.length}명의 인플루언서를 발견했습니다. 예산 기반 믹스를 확인해보세요.`,
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'mega': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'macro': return <Award className="w-4 h-4 text-blue-600" />;
      case 'micro': return <Star className="w-4 h-4 text-green-600" />;
      case 'nano': return <Zap className="w-4 h-4 text-orange-600" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'mega': return 'border-purple-200 bg-purple-50';
      case 'macro': return 'border-blue-200 bg-blue-50';
      case 'micro': return 'border-green-200 bg-green-50';
      case 'nano': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

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
              <Label className="text-sm font-medium mb-2 block">페르소나 선택</Label>
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
              <Label className="text-sm font-medium mb-2 block">광고 유형</Label>
              <Select value={adType} onValueChange={(value: 'branding' | 'live-commerce') => setAdType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="광고 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branding">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4" />
                      <span>브랜딩</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="live-commerce">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>라이브커머스</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                선택한 광고 유형에 맞는 인플루언서를 우선적으로 추천합니다
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">캠페인 예산 (원)</Label>
              <Input
                type="number"
                placeholder="예: 50,000,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                입력하신 예산을 기반으로 최적의 인플루언서 믹스를 추천해드립니다
              </p>
            </div>
            <div className="flex items-end">
              {adType && (
                <div className="w-full">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    {adType === 'branding' ? <Megaphone className="w-5 h-5 text-blue-600" /> : <Video className="w-5 h-5 text-blue-600" />}
                    <div>
                      <div className="font-medium text-blue-900">
                        {adType === 'branding' ? '브랜딩 캠페인' : '라이브커머스 캠페인'}
                      </div>
                      <div className="text-sm text-blue-700">
                        {adType === 'branding' 
                          ? '브랜드 인지도와 이미지 구축에 최적화' 
                          : '실시간 판매와 전환율에 최적화'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                {adType === 'branding' 
                  ? '브랜딩에 최적화된 인플루언서를 분석하고 있습니다...'
                  : '라이브커머스에 최적화된 인플루언서를 분석하고 있습니다...'
                }
              </div>
            </div>
          )}

          <Button 
            onClick={handleStartMatching}
            disabled={isMatching || !activePersona || !adType}
            className="w-full"
          >
            {isMatching ? '매칭 중...' : '인플루언서 매칭 시작'}
          </Button>
        </CardContent>
      </Card>

      {/* 발견된 인플루언서 목록 */}
      {matchResults.length > 0 && !showMixRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle>발견된 인플루언서 ({matchResults.length}명)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchResults.map((influencer) => (
                <div key={influencer.id} className={`p-4 rounded-lg border-2 ${getTierColor(influencer.tier)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{influencer.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{influencer.name}</h4>
                      <div className="flex items-center gap-2">
                        {getTierIcon(influencer.tier)}
                        <span className="text-sm capitalize">{influencer.tier}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>팔로워:</span>
                      <span>{influencer.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>참여율:</span>
                      <span>{influencer.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예상 비용:</span>
                      <span className="font-semibold">{influencer.estimatedCost.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 믹스 추천 */}
      {showMixRecommendations && matchResults.length > 0 && (
        <InfluencerMixRecommendations
          budget={parseFloat(budget)}
          influencers={matchResults}
          persona={selectedPersonaData}
        />
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
