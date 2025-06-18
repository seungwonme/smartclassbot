import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, Users, BarChart3, MessageSquare, Shield } from 'lucide-react';
const FeaturesSection = () => {
  const features = [{
    icon: Brain,
    title: "AI 시장 분석",
    description: "중국의 실시간 트렌드와 소비자 인사이트를 AI로 분석하여 최적의 마케팅 전략을 제공합니다.",
    badge: "AI 기반",
    color: "text-green-600"
  }, {
    icon: Users,
    title: "인플루언서 매칭",
    description: "브랜드와 제품에 최적화된 인플루언서를 AI가 추천하고, 성과 예측까지 제공하여 ROI를 극대화합니다.",
    badge: "스마트 매칭",
    color: "text-gray-700"
  }, {
    icon: Search,
    title: "페르소나 생성",
    description: "타겟 고객의 상세한 페르소나를 자동으로 생성하여 더욱 정확한 마케팅 타겟팅을 가능하게 합니다.",
    badge: "자동화",
    color: "text-green-600"
  }, {
    icon: BarChart3,
    title: "실시간 성과 분석",
    description: "캠페인의 실시간 성과를 모니터링하고, 데이터 기반의 인사이트를 제공하여 즉시 최적화할 수 있습니다.",
    badge: "실시간",
    color: "text-gray-700"
  }, {
    icon: MessageSquare,
    title: "통합 커뮤니케이션",
    description: "브랜드, 에이전시, 인플루언서 간의 모든 소통을 한 플랫폼에서 관리하여 프로젝트 효율성을 높입니다.",
    badge: "올인원",
    color: "text-green-600"
  }, {
    icon: Shield,
    title: "계약 관리",
    description: "인플루언서와의 계약부터 정산까지 전 과정을 투명하고 안전하게 관리할 수 있는 시스템을 제공합니다.",
    badge: "안전한",
    color: "text-gray-700"
  }];
  return <section id="features" className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            
            <br />
            <span className="text-foreground">마케팅 혁신</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            복잡한 중국 인플루언서 마케팅을 간단하고 효율적으로 만드는 6가지 핵심 기능
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default FeaturesSection;