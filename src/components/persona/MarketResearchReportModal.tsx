
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Save, TrendingUp, Users, MessageSquare, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketResearchReportModalProps {
  reportData: any;
  selectedBrand: string;
  selectedProduct: string;
  onSaveReport: (reportData: any) => void;
  trigger?: React.ReactNode;
}

const MarketResearchReportModal: React.FC<MarketResearchReportModalProps> = ({
  reportData,
  selectedBrand,
  selectedProduct,
  onSaveReport,
  trigger
}) => {
  const { toast } = useToast();

  const handleSaveReport = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const reportName = `${selectedBrand}_${selectedProduct}_${currentDate}`;
    
    const savedReport = {
      ...reportData,
      id: Date.now().toString(),
      name: reportName,
      brandId: selectedBrand,
      productId: selectedProduct,
      createdAt: new Date().toISOString(),
    };

    onSaveReport(savedReport);
    
    toast({
      title: "시장조사 리포트 저장 완료",
      description: `${reportName} 리포트가 저장되었습니다.`,
    });
  };

  const mockDetailedData = {
    overview: {
      totalContent: 1250,
      totalComments: 8420,
      keywords: 156,
      platforms: ['샤오홍슈', '도우인', '티몰', '타오바오']
    },
    demographics: {
      ageGroups: [
        { range: '18-25', percentage: 35 },
        { range: '26-35', percentage: 45 },
        { range: '36-45', percentage: 20 }
      ],
      locations: [
        { city: '베이징', percentage: 25 },
        { city: '상하이', percentage: 22 },
        { city: '광저우', percentage: 18 },
        { city: '선전', percentage: 15 },
        { city: '기타', percentage: 20 }
      ]
    },
    trends: [
      { keyword: '한국 스킨케어', mentions: 2800, sentiment: 'positive' },
      { keyword: '세럼 추천', mentions: 2100, sentiment: 'positive' },
      { keyword: '안티에이징', mentions: 1650, sentiment: 'neutral' },
      { keyword: '성분 분석', mentions: 1200, sentiment: 'positive' }
    ],
    platforms: [
      { name: '샤오홍슈', engagement: 8.2, reach: 450000 },
      { name: '도우인', engagement: 12.1, reach: 320000 },
      { name: '티몰', engagement: 3.4, reach: 180000 },
      { name: '타오바오', engagement: 2.8, reach: 220000 }
    ]
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            상세 분석 결과 보기
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            시장조사 상세 리포트
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 개요 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">조사 개요</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockDetailedData.overview.totalContent}</div>
                  <div className="text-sm text-gray-600">수집 콘텐츠</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockDetailedData.overview.totalComments.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">분석 댓글</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{mockDetailedData.overview.keywords}</div>
                  <div className="text-sm text-gray-600">핵심 키워드</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{mockDetailedData.overview.platforms.length}</div>
                  <div className="text-sm text-gray-600">분석 플랫폼</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 인구통계학적 데이터 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  연령대 분포
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDetailedData.demographics.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{group.range}세</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{group.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">지역 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDetailedData.demographics.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{location.city}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 트렌드 키워드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                핵심 트렌드 키워드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDetailedData.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{trend.keyword}</span>
                      <div className="text-sm text-gray-600">{trend.mentions.toLocaleString()} 언급</div>
                    </div>
                    <Badge variant={trend.sentiment === 'positive' ? 'default' : 'secondary'}>
                      {trend.sentiment === 'positive' ? '긍정적' : '중립적'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 플랫폼 성과 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">플랫폼별 성과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDetailedData.platforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <span className="font-medium">{platform.name}</span>
                      <div className="text-sm text-gray-600">도달률: {platform.reach.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{platform.engagement}%</div>
                      <div className="text-sm text-gray-600">참여율</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              PDF 다운로드
            </Button>
            <Button onClick={handleSaveReport} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              리포트 저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketResearchReportModal;
