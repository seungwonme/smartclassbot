
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, TrendingUp, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
}

interface MarketResearchCrawlerProps {
  selectedProduct: string;
  products: Product[];
  onProductChange: (productId: string) => void;
}

const MarketResearchCrawler: React.FC<MarketResearchCrawlerProps> = ({
  selectedProduct,
  products,
  onProductChange
}) => {
  const { toast } = useToast();
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const chinesePlatforms = [
    { id: 'xiaohongshu', name: '샤오홍슈', icon: '📕', color: 'bg-red-100 text-red-700' },
    { id: 'douyin', name: '도우인', icon: '🎵', color: 'bg-blue-100 text-blue-700' },
    { id: 'tmall', name: '티몰', icon: '🛒', color: 'bg-orange-100 text-orange-700' },
    { id: 'taobao', name: '타오바오', icon: '🛍️', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'jd', name: '징동', icon: '📦', color: 'bg-purple-100 text-purple-700' },
    { id: 'baidu', name: '바이두', icon: '🔍', color: 'bg-green-100 text-green-700' },
    { id: 'zhihu', name: '즈후', icon: '💭', color: 'bg-indigo-100 text-indigo-700' },
    { id: '360', name: '360', icon: '🌐', color: 'bg-gray-100 text-gray-700' }
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleStartCrawling = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "플랫폼을 선택해주세요",
        description: "최소 1개 이상의 중국 플랫폼을 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsCrawling(true);
    setCrawlProgress(0);

    // 시뮬레이션: 실제로는 Firecrawl API 호출
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCrawlProgress(i);
    }

    setIsCrawling(false);
    toast({
      title: "시장조사 완료",
      description: `${selectedPlatforms.length}개 플랫폼에서 데이터 수집이 완료되었습니다.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* 제품 및 키워드 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            시장조사 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">분석 제품</label>
              <Select value={selectedProduct} onValueChange={onProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="제품 선택" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">검색 키워드</label>
              <Input
                placeholder="예: 스킨케어, 세럼, 안티에이징"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 플랫폼 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            중국 플랫폼 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {chinesePlatforms.map((platform) => (
              <div
                key={platform.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{platform.icon}</div>
                  <div className="text-sm font-medium">{platform.name}</div>
                  {selectedPlatforms.includes(platform.id) && (
                    <Badge className="mt-2" variant="outline">선택됨</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            선택된 플랫폼: {selectedPlatforms.length}개
          </div>
        </CardContent>
      </Card>

      {/* 크롤링 실행 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            데이터 수집 실행
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCrawling && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>수집 진행률</span>
                <span>{crawlProgress}%</span>
              </div>
              <Progress value={crawlProgress} />
            </div>
          )}

          <Button 
            onClick={handleStartCrawling}
            disabled={isCrawling || selectedPlatforms.length === 0}
            className="w-full"
          >
            {isCrawling ? '데이터 수집 중...' : '시장조사 시작하기'}
          </Button>

          {selectedProductData && (
            <div className="text-sm text-gray-600 text-center">
              {selectedProductData.name}에 대한 중국 시장 데이터를 수집합니다
            </div>
          )}
        </CardContent>
      </Card>

      {/* 수집 결과 미리보기 (크롤링 완료 후) */}
      {crawlProgress === 100 && !isCrawling && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              수집 결과 미리보기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1,250</div>
                <div className="text-sm text-gray-600">콘텐츠 수집</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8,420</div>
                <div className="text-sm text-gray-600">댓글 분석</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">키워드 추출</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="outline">
                상세 분석 결과 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketResearchCrawler;
