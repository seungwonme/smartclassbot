
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface MarketInsightComparisonProps {
  persona: any;
}

const MarketInsightComparison: React.FC<MarketInsightComparisonProps> = ({ persona }) => {
  // 한국 브랜드 관점 vs 중국 시장 현실 비교 데이터
  const comparisonData = [
    {
      category: '타겟 연령층',
      korean: '20-30대 초반',
      chinese: '22-35세',
      difference: 'expand',
      insight: '중국에서는 더 넓은 연령대가 K-뷰티에 관심을 보임'
    },
    {
      category: '주요 관심사',
      korean: '트렌드, 미용',
      chinese: '성분, 효과, 안전성',
      difference: 'different',
      insight: '중국 소비자들은 제품의 성분과 효과를 더 중시함'
    },
    {
      category: '구매 결정 요인',
      korean: '브랜드, 디자인',
      chinese: '리뷰, 성분, 가성비',
      difference: 'different',
      insight: '실제 사용 후기와 성분 정보가 구매에 더 큰 영향'
    },
    {
      category: '주요 플랫폼',
      korean: '인스타그램, 유튜브',
      chinese: '샤오홍슈, 도우인',
      difference: 'different',
      insight: '중국 고유 플랫폼에서의 마케팅이 필수'
    },
    {
      category: '가격 민감도',
      korean: '중간',
      chinese: '높음',
      difference: 'warning',
      insight: '프로모션과 할인 전략이 중요함'
    }
  ];

  const getDifferenceIcon = (type: string) => {
    switch (type) {
      case 'expand':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'different':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'warning':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getDifferenceBadge = (type: string) => {
    switch (type) {
      case 'expand':
        return <Badge variant="outline" className="text-blue-600">확장 필요</Badge>;
      case 'different':
        return <Badge variant="outline" className="text-yellow-600">차이점</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-red-600">주의</Badge>;
      default:
        return <Badge variant="outline" className="text-green-600">일치</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">한국 브랜드 관점 vs 중국 시장 현실</h3>
        <p className="text-gray-600 text-sm">
          AI가 중국 시장 데이터를 분석하여 발견한 차이점들을 확인하세요
        </p>
      </div>

      <div className="space-y-4">
        {comparisonData.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium">{item.category}</h4>
                <div className="flex items-center gap-2">
                  {getDifferenceIcon(item.difference)}
                  {getDifferenceBadge(item.difference)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">한국 브랜드 관점</div>
                  <div className="font-medium">{item.korean}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 mb-1">중국 시장 현실</div>
                  <div className="font-medium">{item.chinese}</div>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-green-600 mb-1">AI 인사이트</div>
                <div className="text-sm">{item.insight}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 종합 추천사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI 종합 추천사항</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-sm">타겟 연령층 확장</div>
              <div className="text-xs text-gray-600">20대 초반에서 30대 중반까지 타겟 확장 권장</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-sm">성분 중심 마케팅</div>
              <div className="text-xs text-gray-600">제품의 핵심 성분과 효과를 강조한 콘텐츠 제작</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-sm">중국 플랫폼 특화 전략</div>
              <div className="text-xs text-gray-600">샤오홍슈와 도우인에 최적화된 콘텐츠 형식 채택</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketInsightComparison;
