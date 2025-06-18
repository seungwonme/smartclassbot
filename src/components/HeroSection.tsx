
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, TrendingUp, Users, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-32 bg-gradient-to-br from-background via-background to-green-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline - separate container with full width */}
        <div className="text-center max-w-6xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
            AI 기반 중국 인플루언서<span className="text-green-600"> 매칭 </span>플랫폼
          </h1>
        </div>

        {/* Rest of content with original max-width */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto md:text-xl">
            "감(感)"과 "꽌시(关系)"에 의존했던 중국 인플루언서 마케팅, AI 기술을 활용한 시장분석 및 페르소나 매칭 기술을 통해 나의 브랜드와 중국 인플루언서를 완벽하게 연결하세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-foreground">AI 기반</span>
              </div>
              <p className="text-sm text-muted-foreground">시장 분석 및 매칭</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-foreground">12,000+</span>
              </div>
              <p className="text-sm text-muted-foreground">중국 인플루언서 DB</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-foreground">통합</span>
              </div>
              <p className="text-sm text-muted-foreground">캠페인 관리 시스템</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
