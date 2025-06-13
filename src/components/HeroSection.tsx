
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, TrendingUp, Users, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-background via-background to-blue-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-blue-200 text-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            AI 기반 인플루언서 마케팅 플랫폼
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">중국 시장에서</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              성공하는 방법
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            AI 기반 인플루언서 마케팅 플랫폼으로 브랜드 성장을 가속화하세요. 
            <br className="hidden md:block" />
            시장 분석부터 캠페인 관리까지 한 번에 해결합니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 hover:bg-primary/5"
            >
              <Play className="mr-2 h-5 w-5" />
              데모 보기
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-foreground">300%</span>
              </div>
              <p className="text-sm text-muted-foreground">평균 ROI 증가</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-600 mr-2" />
                <span className="text-3xl font-bold text-foreground">10,000+</span>
              </div>
              <p className="text-sm text-muted-foreground">검증된 인플루언서</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-foreground">50%</span>
              </div>
              <p className="text-sm text-muted-foreground">캠페인 시간 단축</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
