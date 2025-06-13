
import React, { useState } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Globe, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Brand {
  id: string;
  name: string;
  website: string;
  story: string;
  products: string[];
  channels: string[];
  marketing: string;
  socialChannels: string[];
  activeCampaigns: number;
}

const BrandProducts = () => {
  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  const [brands] = useState<Brand[]>([
    {
      id: '1',
      name: '샘플 브랜드 A',
      website: 'https://example-a.com',
      story: '혁신적인 뷰티 브랜드입니다.',
      products: ['립스틱', '파운데이션', '아이섀도'],
      channels: ['네이버 스마트스토어', '쿠팡', '올리브영'],
      marketing: 'SNS 마케팅 중심',
      socialChannels: ['Instagram', 'YouTube'],
      activeCampaigns: 2
    },
    {
      id: '2',
      name: '샘플 브랜드 B',
      website: 'https://example-b.com',
      story: '친환경 라이프스타일 브랜드입니다.',
      products: ['세제', '샴푸', '바디워시'],
      channels: ['자사몰', '마켓컬리'],
      marketing: '인플루언서 마케팅',
      socialChannels: ['Instagram', 'TikTok'],
      activeCampaigns: 0
    }
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">브랜드 및 제품관리</h1>
              <p className="text-gray-600 mt-2">브랜드를 생성하고 관리하세요</p>
            </div>
            <Link to="/brand/products/create">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                새 브랜드 생성
              </Button>
            </Link>
          </div>

          {/* Brand Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to={`/brand/products/${brand.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-green-600" />
                        <span>{brand.name}</span>
                      </CardTitle>
                      {brand.activeCampaigns > 0 && (
                        <Badge className="bg-blue-100 text-blue-700">
                          {brand.activeCampaigns}개 진행중
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span className="truncate">{brand.website}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.story}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">대표 제품</p>
                        <div className="flex flex-wrap gap-1">
                          {brand.products.slice(0, 3).map((product, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                          {brand.products.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{brand.products.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">판매 채널</p>
                        <div className="flex flex-wrap gap-1">
                          {brand.channels.slice(0, 2).map((channel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {channel}
                            </Badge>
                          ))}
                          {brand.channels.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              +{brand.channels.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}

            {/* Empty State */}
            {brands.length === 0 && (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">브랜드가 없습니다</h3>
                  <p className="text-gray-600 mb-6">첫 번째 브랜드를 생성해보세요</p>
                  <Link to="/brand/products/create">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      브랜드 생성하기
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;
