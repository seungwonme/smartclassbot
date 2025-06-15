import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import ProductionTimeline from './ProductionTimeline';
import InfluencerListItem from './InfluencerListItem';
import InfluencerDetailPanel from './InfluencerDetailPanel';
import { useToast } from '@/hooks/use-toast';

interface BrandContentProductionTabProps {
  campaignId: string;
  confirmedInfluencers: CampaignInfluencer[];
}

const BrandContentProductionTab: React.FC<BrandContentProductionTabProps> = ({
  campaignId,
  confirmedInfluencers
}) => {
  const [contentSubmissions, setContentSubmissions] = useState<ContentSubmission[]>([]);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContentSubmissions();
  }, [campaignId]);

  // 첫 번째 인플루언서를 기본 선택
  useEffect(() => {
    if (confirmedInfluencers.length > 0 && !selectedInfluencerId) {
      setSelectedInfluencerId(confirmedInfluencers[0].id);
    }
  }, [confirmedInfluencers, selectedInfluencerId]);

  const loadContentSubmissions = async () => {
    try {
      setIsLoading(true);
      console.log('=== 브랜드 관리자 - 콘텐츠 제출물 현황 로딩 시작 ===');
      console.log('캠페인 ID:', campaignId);
      
      const submissions = await contentSubmissionService.getContentSubmissions(campaignId);
      setContentSubmissions(submissions);
      
      console.log('로딩된 제출물:', submissions.length, '개');
    } catch (error) {
      console.error('콘텐츠 제출물 로딩 실패:', error);
      toast({
        title: "로딩 실패",
        description: "콘텐츠 제출물을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInfluencerSubmission = (influencerId: string) => {
    return contentSubmissions.find(sub => sub.influencerId === influencerId);
  };

  const selectedInfluencer = confirmedInfluencers.find(inf => inf.id === selectedInfluencerId);
  const selectedSubmission = selectedInfluencerId ? getInfluencerSubmission(selectedInfluencerId) : undefined;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-lg">콘텐츠 제작 현황을 로딩 중...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProductionTimeline 
        confirmedInfluencers={confirmedInfluencers}
        contentSubmissions={contentSubmissions}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              콘텐츠 제작 현황
            </div>
            <Badge variant="secondary">
              {contentSubmissions.length}/{confirmedInfluencers.length} 제출완료
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 브랜드 관리자는 각 인플루언서의 제작 일정을 확인할 수 있습니다. 
              실제 콘텐츠 업로드는 시스템 관리자가 진행하며, 완성된 콘텐츠는 콘텐츠 검수 탭에서 확인할 수 있습니다.
            </p>
          </div>

          {/* 2칼럼 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 좌측: 인플루언서 목록 */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">인플루언서 목록</h3>
              <div className="space-y-2">
                {confirmedInfluencers.map((influencer) => {
                  const submission = getInfluencerSubmission(influencer.id);
                  return (
                    <InfluencerListItem
                      key={influencer.id}
                      influencer={influencer}
                      submission={submission}
                      isSelected={selectedInfluencerId === influencer.id}
                      onClick={() => setSelectedInfluencerId(influencer.id)}
                    />
                  );
                })}
              </div>
            </div>

            {/* 우측: 통합된 상세 정보 패널 */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">인플루언서 정보</h3>
              {selectedInfluencer ? (
                <InfluencerDetailPanel
                  influencer={selectedInfluencer}
                  submission={selectedSubmission}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">인플루언서를 선택해주세요.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandContentProductionTab;
