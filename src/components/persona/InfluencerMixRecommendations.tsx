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
  adType?: 'branding' | 'live-commerce';
  brandInfo?: any;
  productInfo?: any;
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
  persona,
  adType,
  brandInfo,
  productInfo
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedMix, setSelectedMix] = useState<string>('');

  const influencersByTier = useMemo(() => {
    return {
      mega: influencers.filter(inf => inf.tier === 'mega'),
      macro: influencers.filter(inf => inf.tier === 'macro'),
      micro: influencers.filter(inf => inf.tier === 'micro'),
      nano: influencers.filter(inf => inf.tier === 'nano')
    };
  }, [influencers]);

  const mixStrategies = useMemo((): MixStrategy[] => {
    const strategies: MixStrategy[] = [];

    if (influencersByTier.mega.length > 0 && budget >= 53200000) {
      const megaInfluencer = influencersByTier.mega[0];
      const remainingBudget = budget - megaInfluencer.estimatedCost;
      const additionalMicros = influencersByTier.micro
        .filter(inf => inf.estimatedCost <= remainingBudget)
        .slice(0, Math.floor(remainingBudget / 5320000));

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

    const microBudgetCount = Math.floor(budget / 4655000);
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

    if (influencersByTier.macro.length > 0 && budget >= 26600000) {
      const macroInfluencer = influencersByTier.macro[0];
      const remainingBudget = budget - macroInfluencer.estimatedCost;
      const additionalMicros = influencersByTier.micro
        .filter(inf => inf.estimatedCost <= remainingBudget)
        .slice(0, Math.floor(remainingBudget / 4655000));

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

    if (influencersByTier.nano.length > 0 && budget >= 19950000) {
      const nanoInfluencers = influencersByTier.nano.slice(0, 2);
      const remainingBudget = budget - nanoInfluencers.reduce((sum, inf) => sum + inf.estimatedCost, 0);
      const additionalMicros = influencersByTier.micro
        .filter(inf => inf.estimatedCost <= remainingBudget)
        .slice(0, Math.floor(remainingBudget / 4655000));

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

    return strategies.filter(strategy => strategy.totalCost <= budget * 1.1);
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
    console.log('🎯 캠페인 생성 데이터 준비:', {
      brandInfo,
      productInfo,
      persona,
      strategy,
      adType
    });

    if (!brandInfo?.id || !productInfo?.id) {
      toast({
        title: "브랜드/제품 정보 오류",
        description: "올바른 브랜드와 제품 정보가 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    const campaignData = {
      persona: persona,
      selectedInfluencers: strategy.influencers,
      mixStrategy: strategy,
      estimatedBudget: strategy.totalCost,
      adType: adType,
      brandInfo: {
        id: brandInfo.id,
        name: brandInfo.name || brandInfo.brandName
      },
      productInfo: {
        id: productInfo.id,
        name: productInfo.name || productInfo.productName
      },
      autoFillData: {
        brandId: brandInfo.id,
        brandName: brandInfo.name || brandInfo.brandName,
        productId: productInfo.id,
        productName: productInfo.name || productInfo.productName,
        budget: strategy.totalCost.toLocaleString(),
        adType: adType || 'branding',
        selectedInfluencers: strategy.influencers.map(inf => inf.id),
        targetContent: {
          influencerCategories: persona?.interests || [],
          targetAge: persona?.demographics?.age || '',
          uspImportance: adType === 'branding' ? 8 : 6,
          influencerImpact: '',
          additionalDescription: `${persona?.name} 페르소나 기반 ${strategy.name}으로 구성된 캠페인입니다.`,
          secondaryContentUsage: false
        }
      }
    };

    console.log('💾 저장할 캠페인 데이터:', campaignData);

    sessionStorage.setItem('personaBasedCampaignData', JSON.stringify(campaignData));
    localStorage.setItem('campaignInfluencerData', JSON.stringify(campaignData));

    toast({
      title: "페르소나 기반 캠페인 생성",
      description: `${persona?.name} 페르소나와 ${strategy.name}으로 캠페인을 생성합니다.`,
    });

    const params = new URLSearchParams({
      persona: 'true',
      mixStrategy: strategy.id,
      adType: adType || 'branding'
    });
    
    navigate(`/brand/campaigns/create?${params.toString()}`);
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
            예산: {budget.toLocaleString()}원 | 페르소나: {persona?.name}
            {adType && <span> | 광고 유형: {adType === 'branding' ? '브랜딩' : '라이브커머스'}</span>}
            {brandInfo && <span> | 브랜드: {brandInfo.name || brandInfo.brandName}</span>}
            {productInfo && <span> | 제품: {productInfo.name || productInfo.productName}</span>}
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
                    <Card className="lg:col-span-1">
                      <CardHeader>
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">총 비용:</span>
                            <span className="font-semibold">{strategy.totalCost.toLocaleString()}원</span>
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
                                  {influencer.estimatedCost.toLocaleString()}원
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
                입력하신 예산({budget.toLocaleString()}원)으로는 적절한 인플루언서 믹스를 구성할 수 없습니다.
              </p>
              <p className="text-sm text-gray-500">
                최소 19,950,000원 이상의 예산을 권장합니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerMixRecommendations;
