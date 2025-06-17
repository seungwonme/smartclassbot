
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Award, 
  Star, 
  Zap, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart,
  DollarSign,
  Target,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface InfluencerMixRecommendationsProps {
  budget: number;
  influencers: any[];
  persona: any;
}

interface MixStrategy {
  id: string;
  name: string;
  description: string;
  strategy: string;
  influencers: any[];
  totalCost: number;
  expectedReach: number;
  expectedEngagement: number;
  riskLevel: 'low' | 'medium' | 'high';
  bestFor: string[];
}

const InfluencerMixRecommendations: React.FC<InfluencerMixRecommendationsProps> = ({
  budget,
  influencers,
  persona
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedMix, setSelectedMix] = useState<string>('');

  // 인플루언서를 티어별로 분류
  const influencersByTier = useMemo(() => {
    return {
      mega: influencers.filter(inf => inf.tier === 'mega'),
      macro: influencers.filter(inf => inf.tier === 'macro'),
      micro: influencers.filter(inf => inf.tier === 'micro'),
      nano: influencers.filter(inf => inf.tier === 'nano')
    };
  }, [influencers]);

  // 믹스 전략 생성
  const mixStrategies = useMemo((): MixStrategy[] => {
    const strategies: MixStrategy[] = [];

    // 전략 1: 메가 인플루언서 중심 (브랜드 인지도 극대화)
    if (influencersByTier.mega.length > 0 && budget >= 40000) {
      const megaInfluencer = influencersByTier.mega[0];
      const remainingBudget = budget - megaInfluencer.estimatedCost;
      const additionalMicros = influencersByTier.micro
        .filter(inf => inf.estimatedCost <= remainingBudget)
        .slice(0, Math.floor(remainingBudget / 4000));

      strategies.push({
        id: 'mega-focused',
        name: '메가 인플루언서 중심 전략',
        description: '높은 도달률과 브랜드 인지도 극대화',
        strategy: '메가 인플루언서 1명 + 마이크로 인플루언서 다수',
        influencers: [megaInfluencer, ...additionalMicros],
        totalCost: megaInfluencer.estimatedCost + additionalMicros.reduce((sum, inf) => sum + inf.estimatedCost, 0),
        expectedReach: megaInfluencer.followers + additionalMicros.reduce((sum, inf) => sum + inf.followers, 0),
        expectedEngagement: 6.8,
        riskLevel: 'low',
        bestFor: ['브랜드 인지도', '대규모 리치', '신제품 런칭']
      });
    }

    // 전략 2: 마이크로 인플루언서 다수 (참여율 극대화)
    const microBudgetCount = Math.floor(budget / 3500);
    const selectedMicros = influencersByTier.micro.slice(0, Math.min(microBudgetCount, 6));
    
    if (selectedMicros.length >= 3) {
      strategies.push({
        id: 'micro-swarm',
        name: '마이크로 인플루언서 다수 전략',
        description: '높은 참여율과 진정성 있는 리뷰',
        strategy: `마이크로 인플루언서 ${selectedMicros.length}명`,
        influencers: selectedMicros,
        totalCost: selectedMicros.reduce((sum, inf) => sum + inf.estimatedCost, 0),
        expectedReach: selectedMicros.reduce((sum, inf) => sum + inf.followers, 0),
        expectedEngagement: 14.2,
        riskLevel: 'medium',
        bestFor: ['높은 참여율', '진정성', '니치 타겟팅']
      });
    }

    // 전략 3: 하이브리드 전략 (매크로 + 마이크로)
    if (influencersByTier.macro.length > 0 && budget >= 20000) {
      const macroInfluencer = influencersByTier.macro[0];
      const remainingBudget = budget - macroInfluencer.estimatedCost;
      const additionalMicros = influencersByTier.micro
        .filter(inf => inf.estimatedCost <= remainingBudget)
        .slice(0, Math.floor(remainingBudget / 3500));

      strategies.push({
        id: 'hybrid-balanced',
        name: '하이브리드 균형 전략',
        description: '도달률과 참여율의 최적 균형',
        strategy: '매크로 인플루언서 1명 + 마이크로 인플루언서 다수',
        influencers: [macroInfluencer, ...additionalMicros],
        totalCost: macroInfluencer.estimatedCost + additionalMicros.reduce((sum, inf) => sum + inf.estimatedCost, 0),
        expectedReach: macroInfluencer.followers + additionalMicros.reduce((sum, inf) => sum + inf.followers, 0),
        expectedEngagement: 10.5,
        riskLevel: 'low',
        bestFor: ['균형잡힌 캠페인', '안정적 성과', 'ROI 최적화']
      });
    }

    // 전략 4: 니치 타겟팅 (나노 + 마이크로)
    if (influencersByTier.nano.length > 0 && budget >= 15000) {
      const nanoInfluencers = influencersByTier.nano.slice(0, 2);
      const remainingBudget = budget - nanoInfluencers.reduce((sum, inf) => sum + inf.estimatedCost, 0);
      const additionalMicros = influencersByTier.micro
        .filter(inf => inf.estimatedCost <= remainingBudget)
        .slice(0, Math.floor(remainingBudget / 3500));

      strategies.push({
        id: 'niche-targeting',
        name: '니치 타겟팅 전략',
        description: '초고참여율과 깊이 있는 연결',
        strategy: '나노 인플루언서 + 마이크로 인플루언서',
        influencers: [...nanoInfluencers, ...additionalMicros],
        totalCost: nanoInfluencers.reduce((sum, inf) => sum + inf.estimatedCost, 0) + 
                   additionalMicros.reduce((sum, inf) => sum + inf.estimatedCost, 0),
        expectedReach: nanoInfluencers.reduce((sum, inf) => sum + inf.followers, 0) + 
                      additionalMicros.reduce((sum, inf) => sum + inf.followers, 0),
        expectedEngagement: 16.8,
        riskLevel: 'high',
        bestFor: ['니치 마켓', '커뮤니티 구축', '브랜드 로열티']
      });
    }

    return strategies.filter(strategy => strategy.totalCost <= budget * 1.1); // 10% 여유 허용
  }, [budget, influencersByTier]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'mega': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'macro': return <Award className="w-4 h-4 text-blue-600" />;
      case 'micro': return <Star className="w-4 h-4 text-green-600" />;
      case 'nano': return <Zap className="w-4 h-4 text-orange-600" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCreateCampaign = (strategy: MixStrategy) => {
    const campaignData = {
      persona: persona,
      selectedInfluencers: strategy.influencers,
      mixStrategy: strategy,
      estimatedBudget: strategy.totalCost
    };

    // localStorage에 임시 저장하여 캠페인 생성 페이지에서 사용
    localStorage.setItem('campaignInfluencerData', JSON.stringify(campaignData));

    toast({
      title: "캠페인 생성 페이지로 이동",
      description: `${strategy.name}으로 캠페인을 생성합니다.`,
    });

    // 캠페인 생성 페이지로 이동
    navigate('/brand/campaigns/create');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            예산 기반 인플루언서 믹스 추천
          </CardTitle>
          <div className="text-sm text-gray-600">
            예산: {budget.toLocaleString()}위안 | 페르소나: {persona?.name}
          </div>
        </CardHeader>
        <CardContent>
          {mixStrategies.length > 0 ? (
            <Tabs value={selectedMix} onValueChange={setSelectedMix} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {mixStrategies.map((strategy) => (
                  <TabsTrigger key={strategy.id} value={strategy.id} className="text-xs">
                    {strategy.name.split(' ')[0]} 전략
                  </TabsTrigger>
                ))}
              </TabsList>

              {mixStrategies.map((strategy) => (
                <TabsContent key={strategy.id} value={strategy.id} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 전략 개요 */}
                    <Card className="lg:col-span-1">
                      <CardHeader>
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">총 비용:</span>
                            <span className="font-semibold">{strategy.totalCost.toLocaleString()}위안</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">예상 도달:</span>
                            <span className="font-semibold">{strategy.expectedReach.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">평균 참여율:</span>
                            <span className="font-semibold">{strategy.expectedEngagement}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">리스크:</span>
                            <Badge className={getRiskColor(strategy.riskLevel)}>
                              {strategy.riskLevel}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">최적 용도:</h4>
                          <div className="flex flex-wrap gap-1">
                            {strategy.bestFor.map((use, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleCreateCampaign(strategy)}
                          className="w-full"
                        >
                          이 믹스로 캠페인 생성
                        </Button>
                      </CardContent>
                    </Card>

                    {/* 선택된 인플루언서 목록 */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">선택된 인플루언서 ({strategy.influencers.length}명)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {strategy.influencers.map((influencer, index) => (
                            <div key={influencer.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{influencer.avatar}</div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{influencer.name}</h4>
                                    {getTierIcon(influencer.tier)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {influencer.platform} • {influencer.followers.toLocaleString()} 팔로워
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 text-sm">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span>{influencer.engagement}%</span>
                                </div>
                                <div className="font-semibold text-green-600">
                                  {influencer.estimatedCost.toLocaleString()}위안
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">추천 가능한 믹스가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                입력하신 예산({budget.toLocaleString()}위안)으로는 적절한 인플루언서 믹스를 구성할 수 없습니다.
              </p>
              <p className="text-sm text-gray-500">
                최소 15,000위안 이상의 예산을 권장합니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerMixRecommendations;
