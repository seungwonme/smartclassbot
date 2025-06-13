
import React, { useState, useEffect } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Brand {
  id: string;
  name: string;
  website: string;
  story: string;
  products: string;
  channels: string;
  marketing: string;
  socialChannels: string;
  activeCampaigns: number;
}

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    website: '',
    story: '',
    products: '',
    channels: '',
    marketing: '',
    socialChannels: ''
  });

  useEffect(() => {
    // 브랜드 데이터 로드 시뮬레이션 (실제로는 API 호출)
    const loadBrand = () => {
      const mockBrand: Brand = {
        id: id || '1',
        name: '샘플 브랜드 A',
        website: 'https://example-a.com',
        story: '혁신적인 뷰티 브랜드입니다. 고품질 제품과 지속가능한 가치를 추구합니다.',
        products: '립스틱, 파운데이션, 아이섀도, 마스카라, 컨실러',
        channels: '네이버 스마트스토어, 쿠팡, 올리브영, 롯데백화점, 신세계백화점',
        marketing: 'SNS 마케팅 중심, 인플루언서 협업, 브랜드 체험 이벤트',
        socialChannels: 'Instagram (@sample_brand_a), YouTube (샘플브랜드A 공식채널), TikTok (@samplebrand_a)',
        activeCampaigns: id === '1' ? 2 : 0
      };
      setBrand(mockBrand);
      setFormData({
        website: mockBrand.website,
        story: mockBrand.story,
        products: mockBrand.products,
        channels: mockBrand.channels,
        marketing: mockBrand.marketing,
        socialChannels: mockBrand.socialChannels
      });
    };

    loadBrand();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (brand) {
      setFormData({
        website: brand.website,
        story: brand.story,
        products: brand.products,
        channels: brand.channels,
        marketing: brand.marketing,
        socialChannels: brand.socialChannels
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (brand) {
        setBrand(prev => prev ? { ...prev, ...formData } : null);
      }
      
      toast({
        title: "브랜드가 수정되었습니다",
        description: "변경사항이 성공적으로 저장되었습니다."
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "브랜드 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // API 삭제 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "브랜드가 삭제되었습니다",
        description: "브랜드가 성공적으로 삭제되었습니다."
      });
      
      navigate('/brand/products');
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

  if (!brand) {
    return <div>로딩 중...</div>;
  }

  const canDelete = brand.activeCampaigns === 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/brand/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  브랜드 목록으로
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-gray-600">브랜드 상세 정보</p>
                  {brand.activeCampaigns > 0 && (
                    <Badge className="bg-blue-100 text-blue-700">
                      {brand.activeCampaigns}개 캠페인 진행중
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex space-x-2">
                <Button onClick={handleEdit} className="bg-green-500 hover:bg-green-600 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      disabled={!canDelete}
                      className={!canDelete ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>브랜드를 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다. 브랜드와 관련된 모든 데이터가 영구적으로 삭제됩니다.
                        {!canDelete && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                              진행 중인 캠페인이 있어 삭제할 수 없습니다.
                            </span>
                          </div>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={!canDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {isEditing && (
              <div className="flex space-x-2">
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleSave} disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            )}
          </div>

          <div className="max-w-4xl">
            {/* 기본 정보 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>브랜드명</Label>
                    <Input value={brand.name} disabled className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">홈페이지 URL</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상세 정보 */}
            <Card>
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
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">대표제품 리스트</Label>
                  <Textarea
                    id="products"
                    value={formData.products}
                    onChange={(e) => handleInputChange('products', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channels">주요 판매채널</Label>
                  <Textarea
                    id="channels"
                    value={formData.channels}
                    onChange={(e) => handleInputChange('channels', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketing">홍보 마케팅현황</Label>
                  <Textarea
                    id="marketing"
                    value={formData.marketing}
                    onChange={(e) => handleInputChange('marketing', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialChannels">주요 소셜채널</Label>
                  <Textarea
                    id="socialChannels"
                    value={formData.socialChannels}
                    onChange={(e) => handleInputChange('socialChannels', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
