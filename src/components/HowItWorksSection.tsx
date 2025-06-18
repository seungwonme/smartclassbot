
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: TrendingUp,
      title: "시장분석",
      description: "AI 분석 모델을 적용하여 중국내 브랜드 자사 제품 분석과 경쟁사 분석을 진행합니다."
    },
    {
      number: 2,
      icon: Users,
      title: "페르소나 생성",
      description: "자사 제품 분석과 경쟁사 분석을 통해 브랜드 페르소나를 생성합니다."
    },
    {
      number: 3,
      icon: Target,
      title: "최적의 매칭",
      description: "브랜드 페르소나, 인플루언서 페르소나 그리고 인플루언서 마케팅 캠페인 내용을 반영하여 최적으로 매칭되는 인플루언서를 추천합니다."
    },
    {
      number: 4,
      icon: BarChart3,
      title: "실시간 모니터링",
      description: "캠페인 진행 중 실시간으로 성과를 모니터링하고 분석하여 최적화 인사이트를 제공합니다."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-green-100/50 to-green-200/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-green-800">
            How It Works
          </h2>
          <p className="text-xl text-green-700 leading-relaxed">
            간단한 4단계로 완성되는 스마트한 인플루언서 마케팅
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Arrow - Only show on desktop and not for last item */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 z-10">
                  <div className="w-8 h-0.5 bg-green-400"></div>
                  <div className="absolute -right-1 -top-1 w-0 h-0 border-l-4 border-l-green-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              )}
              
              <Card className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white border-green-200">
                <CardHeader className="text-center pb-4">
                  {/* Step Number */}
                  <div className="mx-auto mb-4 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
                      <step.icon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-semibold text-green-800 group-hover:text-green-700 transition-colors">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 text-sm leading-relaxed text-center">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Mobile Connection Arrows */}
        <div className="lg:hidden flex flex-col items-center mt-8 space-y-4">
          {steps.slice(0, -1).map((_, index) => (
            <div key={index} className="w-0.5 h-8 bg-green-400"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
