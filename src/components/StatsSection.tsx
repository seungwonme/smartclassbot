
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Users, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "500%",
      label: "평균 매출 증가",
      description: "Circlue.ai 사용 후 평균 매출 성장률"
    },
    {
      icon: Globe,
      value: "50+",
      label: "플랫폼 연동",
      description: "중국 주요 소셜미디어 플랫폼 지원"
    },
    {
      icon: Users,
      value: "100K+",
      label: "인플루언서 DB",
      description: "검증된 중국 인플루언서 데이터베이스"
    },
    {
      icon: Award,
      value: "99.9%",
      label: "고객 만족도",
      description: "실제 고객 피드백 기반 만족도"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
            성과 지표
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            숫자로 증명하는
            <br />
            <span className="text-blue-100">플랫폼의 힘</span>
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            실제 데이터로 검증된 Circlue.ai의 성과를 확인해보세요
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
              <div className="text-xl font-semibold mb-2 text-blue-100">
                {stat.label}
              </div>
              <div className="text-blue-200 text-sm leading-relaxed">
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
