import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Globe, Sparkles, Loader2, User, Eye, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface BrandManager {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const AdminBrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    managerId: '1',
    name: '샘플 브랜드 A',
    website: 'https://example-a.com',
    story: '혁신적인 기술과 고품질 소재를 바탕으로 고객에게 최고의 경험을 제공하는 브랜드입니다. 지속가능한 미래를 위해 친환경 제품 개발에 힘쓰고 있습니다.',
    products: '스킨케어 세트, 클렌징폼, 토너, 에센스, 크림',
    channels: '네이버 스마트스토어, 쿠팡, 올리브영, 세포라, 자사몰',
    marketing: 'SNS 마케팅, 인플루언서 협업, 브랜드 체험 이벤트, 온라인 광고',
    socialChannels: 'Instagram (@brand_official), YouTube (브랜드 공식채널), TikTok (@brand_kr)'
  });

  const brandManagers: BrandManager[] = [
    { id: '1', name: '김브랜드', email: 'brand1@example.com', phone: '010-1234-5678' },
    { id: '2', name: '이제품', email: 'brand2@example.com', phone: '010-2345-6789' },
    { id: '3', name: '박마케팅', email: 'brand3@example.com', phone: '010-3456-7890' }
  ];

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
    
    if (!formData.managerId) {
      toast({
        title: "브랜드 관리자를 선택해주세요",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "브랜드명을 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "브랜드가 수정되었습니다",
        description: "브랜드 정보가 성공적으로 업데이트되었습니다."
      });
      
      setIsEditing(false);
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

  const handleDelete = async () => {
    if (!confirm('정말로 이 브랜드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "브랜드가 삭제되었습니다",
        description: "브랜드가 성공적으로 삭제되었습니다."
      });
      
      navigate('/admin/brands');
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "브랜드 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedManager = brandManagers.find(manager => manager.id === formData.managerId);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/admin/brands">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  브랜드 관리로
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? '브랜드 수정' : '브랜드 상세'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isEditing ? '브랜드 정보를 수정하세요' : '브랜드 상세 정보를 확인하세요'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    보기 모드
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    수정 모드
                  </>
                )}
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* 브랜드 관리자 선택 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>브랜드 관리자</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="managerId">브랜드 관리자 *</Label>
                  <Select 
                    value={formData.managerId} 
                    onValueChange={(value) => handleInputChange('managerId', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="브랜드 관리자를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandManagers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">{manager.name}</div>
                              <div className="text-sm text-gray-500">{manager.email}</div>
                            </div>
                            <div className="text-sm text-gray-500 ml-4">{manager.phone}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedManager && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-900">{selectedManager.name}</div>
                          <div className="text-sm text-blue-700">{selectedManager.email} | {selectedManager.phone}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 기본 정보 */}
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
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">홈페이지 URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                
                {isEditing && (
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
                )}
              </CardContent>
            </Card>

            {/* 상세 정보 */}
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
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">대표제품 리스트</Label>
                  <Textarea
                    id="products"
                    value={formData.products}
                    onChange={(e) => handleInputChange('products', e.target.value)}
                    placeholder="대표 제품들을 쉼표로 구분하여 입력하세요"
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channels">주요 판매채널</Label>
                  <Textarea
                    id="channels"
                    value={formData.channels}
                    onChange={(e) => handleInputChange('channels', e.target.value)}
                    placeholder="판매 채널을 쉼표로 구분하여 입력하세요"
                    rows={3}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialChannels">주요 소셜채널</Label>
                  <Textarea
                    id="socialChannels"
                    value={formData.socialChannels}
                    onChange={(e) => handleInputChange('socialChannels', e.target.value)}
                    placeholder="소셜미디어 채널을 입력하세요"
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            {isEditing && (
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminBrandDetail;
