
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Users, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "AI 기반",
      label: "시장 분석 시스템",
      description: "실시간 중국 시장 트렌드 분석"
    },
    {
      icon: Globe,
      value: "10+",
      label: "플랫폼 연동",
      description: "주요 중국 소셜미디어 플랫폼 지원"
    },
    {
      icon: Users,
      value: "12,000+",
      label: "인플루언서 DB",
      description: "검증된 중국 인플루언서 데이터베이스"
    },
    {
      icon: Award,
      value: "통합",
      label: "캠페인 관리",
      description: "기획부터 성과분석까지 원스톱"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
            플랫폼 현황
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            신뢰할 수 있는
            <br />
            <span className="text-green-100">플랫폼 현황</span>
          </h2>
          <p className="text-xl text-green-100 leading-relaxed">
            실제 데이터로 검증된 Circlue.ai의 현황을 확인해보세요
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2 text-green-100">
                {stat.label}
              </div>
              <div className="text-green-200 text-sm leading-relaxed">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
