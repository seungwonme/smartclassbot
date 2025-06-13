
import React, { useState } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Globe, Sparkles, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CreateBrand = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    story: '',
    products: '',
    channels: '',
    marketing: '',
    socialChannels: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAICrawl = async () => {
    if (!formData.website) {
      toast({
        title: "URL을 입력해주세요",
        description: "AI로 정보를 가져오려면 먼저 홈페이지 URL을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // AI 크롤링 시뮬레이션 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 샘플 데이터로 자동 입력
      setFormData(prev => ({
        ...prev,
        story: "혁신적인 기술과 고품질 소재를 바탕으로 고객에게 최고의 경험을 제공하는 브랜드입니다. 지속가능한 미래를 위해 친환경 제품 개발에 힘쓰고 있습니다.",
        products: "스킨케어 세트, 클렌징폼, 토너, 에센스, 크림",
        channels: "네이버 스마트스토어, 쿠팡, 올리브영, 세포라, 자사몰",
        marketing: "SNS 마케팅, 인플루언서 협업, 브랜드 체험 이벤트, 온라인 광고",
        socialChannels: "Instagram (@brand_official), YouTube (브랜드 공식채널), TikTok (@brand_kr)"
      }));

      toast({
        title: "정보 수집 완료",
        description: "AI가 브랜드 정보를 성공적으로 수집했습니다. 내용을 확인하고 수정해주세요."
      });
    } catch (error) {
      toast({
        title: "정보 수집 실패",
        description: "브랜드 정보를 가져오는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "브랜드명을 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // API 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "브랜드가 생성되었습니다",
        description: "새로운 브랜드가 성공적으로 등록되었습니다."
      });
      
      navigate('/brand/products');
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "브랜드 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/brand/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                브랜드 목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">새 브랜드 생성</h1>
              <p className="text-gray-600 mt-2">브랜드 정보를 입력하여 새로운 브랜드를 생성하세요</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* 상단 섹션 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">브랜드명 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="브랜드명을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">홈페이지 URL</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAICrawl}
                    disabled={isLoading || !formData.website}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    AI로 브랜드정보 가져오기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 하단 섹션 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="story">브랜드 스토리</Label>
                  <Textarea
                    id="story"
                    value={formData.story}
                    onChange={(e) => handleInputChange('story', e.target.value)}
                    placeholder="브랜드의 철학과 스토리를 입력하세요"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">대표제품 리스트</Label>
                  <Textarea
                    id="products"
                    value={formData.products}
                    onChange={(e) => handleInputChange('products', e.target.value)}
                    placeholder="대표 제품들을 쉼표로 구분하여 입력하세요 (예: 립스틱, 파운데이션, 아이섀도)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channels">주요 판매채널 (국내외 온오프라인)</Label>
                  <Textarea
                    id="channels"
                    value={formData.channels}
                    onChange={(e) => handleInputChange('channels', e.target.value)}
                    placeholder="판매 채널을 쉼표로 구분하여 입력하세요 (예: 네이버 스마트스토어, 쿠팡, 올리브영)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketing">홍보 마케팅현황</Label>
                  <Textarea
                    id="marketing"
                    value={formData.marketing}
                    onChange={(e) => handleInputChange('marketing', e.target.value)}
                    placeholder="현재 진행 중인 마케팅 활동을 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialChannels">주요 소셜채널 (인스타, 유튜브 등)</Label>
                  <Textarea
                    id="socialChannels"
                    value={formData.socialChannels}
                    onChange={(e) => handleInputChange('socialChannels', e.target.value)}
                    placeholder="소셜미디어 채널을 입력하세요 (예: Instagram (@brand_name), YouTube (채널명))"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white px-8"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                저장하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBrand;
