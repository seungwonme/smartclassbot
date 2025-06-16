
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Image, Video } from 'lucide-react';
import { ContentReviewDetail } from '@/types/content';
import { contentReviewService } from '@/services/contentReview.service';
import ContentReviewDetailView from './ContentReviewDetailView';

interface AdminContentReviewTabProps {
  campaignId: string;
  confirmedInfluencers: any[];
  toast: any;
}

const AdminContentReviewTab: React.FC<AdminContentReviewTabProps> = ({
  campaignId,
  confirmedInfluencers,
  toast
}) => {
  const [contentReviews, setContentReviews] = useState<ContentReviewDetail[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentReviewDetail | null>(null);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContentReviews();
  }, [campaignId]);

  const loadContentReviews = async () => {
    try {
      setIsLoading(true);
      console.log('🔧 시스템 관리자 - 콘텐츠 검수 데이터 로딩');
      
      const reviews = await contentReviewService.getContentForReview(campaignId);
      console.log('📋 로딩된 검수 콘텐츠:', reviews);
      
      setContentReviews(reviews);
    } catch (error) {
      console.error('콘텐츠 검수 데이터 로딩 실패:', error);
      toast({
        title: "데이터 로딩 실패",
        description: "콘텐츠 검수 데이터를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRevision = async (contentId: string, response: string) => {
    try {
      const updatedContent = await contentReviewService.submitContentRevision(campaignId, contentId, response);
      
      // 로컬 상태 업데이트
      setContentReviews(prev => prev.map(content =>
        content.id === contentId ? updatedContent : content
      ));

      // 선택된 콘텐츠도 업데이트
      if (selectedContent?.id === contentId) {
        setSelectedContent(updatedContent);
      }

      setShowRevisionForm(false);

      toast({
        title: "수정 피드백 전송 완료",
        description: "브랜드 관리자에게 수정 피드백이 전송되었습니다."
      });

    } catch (error) {
      console.error('수정 피드백 전송 실패:', error);
      toast({
        title: "전송 실패",
        description: "수정 피드백 전송에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'revision-requested': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return '검수 대기중';
      case 'under-review': return '검수중';
      case 'revision-requested': return '수정요청';
      case 'approved': return '승인완료';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-lg">콘텐츠 검수 데이터를 로딩 중...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </CardContent>
      </Card>
    );
  }

  if (contentReviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-gray-500">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>아직 제출된 콘텐츠가 없습니다.</p>
          <p className="text-sm mt-2">콘텐츠 제작 탭에서 콘텐츠를 업로드해주세요.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* 좌측: 인플루언서별 콘텐츠 목록 */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              콘텐츠 검수 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentReviews.map((content) => {
                const hasPendingRevision = content.reviewRevisions?.some(rev => rev.status === 'pending');
                
                return (
                  <div 
                    key={content.id} 
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedContent?.id === content.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedContent(content);
                      if (hasPendingRevision) {
                        setShowRevisionForm(true);
                      } else {
                        setShowRevisionForm(false);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{content.influencerName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {content.contentType === 'image' ? (
                            <Image className="w-4 h-4" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                          <span className="text-sm text-gray-500">
                            {content.contentType === 'image' ? '이미지' : '영상'}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <Badge className={getStatusColor(content.reviewStatus)}>
                            {getStatusText(content.reviewStatus)}
                          </Badge>
                          {content.currentReviewRevision > 0 && (
                            <Badge className="bg-gray-100 text-gray-800 ml-1">
                              {content.currentReviewRevision}차 검수
                            </Badge>
                          )}
                          {hasPendingRevision && (
                            <Badge className="bg-red-100 text-red-800 ml-1">
                              🔔 수정요청 확인
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 우측: 콘텐츠 검수 상세 */}
      <div className="lg:col-span-2">
        <ContentReviewDetailView
          selectedContent={selectedContent}
          onApprove={() => {}} // 시스템 관리자는 승인하지 않음
          onRequestRevision={() => {}} // 시스템 관리자는 수정요청하지 않음
          onSubmitRevision={handleSubmitRevision}
          showRevisionForm={showRevisionForm}
          setShowRevisionForm={setShowRevisionForm}
        />
      </div>
    </div>
  );
};

export default AdminContentReviewTab;
