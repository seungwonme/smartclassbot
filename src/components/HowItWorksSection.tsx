
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "시장분석",
      description: "AI 분석 모델을 적용하여 중국내 브랜드 자사 제품 분석과 경쟁사 분석을 진행합니다."
    },
    {
      number: 2,
      title: "페르소나 생성",
      description: "자사 제품 분석과 경쟁사 분석을 통해 브랜드 페르소나를 생성합니다."
    },
    {
      number: 3,
      title: "최적의 매칭",
      description: "브랜드 페르소나, 인플루언서 페르소나 그리고 인플루언서 마케팅 캠페인 내용을 반영하여 최적으로 매칭되는 인플루언서를 추천합니다."
    },
    {
      number: 4,
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
            <div key={index} className="flex flex-col">
              <Card className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white border-green-200 flex-1 flex flex-col h-full">
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  {/* Step Number */}
                  <div className="mx-auto mb-4 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  
                  <CardTitle className="text-xl font-semibold text-green-800 group-hover:text-green-700 transition-colors">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center">
                  <p className="text-green-700 text-sm leading-relaxed text-center">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
