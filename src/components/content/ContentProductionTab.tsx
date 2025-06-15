
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Calendar, Clock, CheckCircle, FileImage, FileVideo, User } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import ContentUploadModal from './ContentUploadModal';
import { useToast } from '@/hooks/use-toast';

interface ContentProductionTabProps {
  campaignId: string;
  confirmedInfluencers: CampaignInfluencer[];
  onContentReviewReady: () => void;
}

const ContentProductionTab: React.FC<ContentProductionTabProps> = ({
  campaignId,
  confirmedInfluencers,
  onContentReviewReady
}) => {
  const [contentSubmissions, setContentSubmissions] = useState<ContentSubmission[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<CampaignInfluencer | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContentSubmissions();
  }, [campaignId]);

  const loadContentSubmissions = async () => {
    try {
      setIsLoading(true);
      console.log('=== 콘텐츠 제출물 로딩 시작 ===');
      console.log('캠페인 ID:', campaignId);
      
      const submissions = await contentSubmissionService.getContentSubmissions(campaignId);
      setContentSubmissions(submissions);
      
      console.log('로딩된 제출물:', submissions.length, '개');
      console.log('=== 콘텐츠 제출물 로딩 완료 ===');
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

  const handleUploadClick = (influencer: CampaignInfluencer) => {
    setSelectedInfluencer(influencer);
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = async (submissionData: Partial<ContentSubmission>) => {
    try {
      console.log('=== 콘텐츠 업로드 완료 처리 시작 ===');
      console.log('제출 데이터:', submissionData);

      await contentSubmissionService.createContentSubmission(campaignId, submissionData);
      
      // 제출물 목록 재로딩
      await loadContentSubmissions();
      
      setIsUploadModalOpen(false);
      setSelectedInfluencer(null);

      toast({
        title: "콘텐츠 업로드 완료",
        description: `${submissionData.influencerName}의 콘텐츠가 성공적으로 업로드되었습니다.`
      });

      console.log('=== 콘텐츠 업로드 완료 처리 완료 ===');
    } catch (error) {
      console.error('콘텐츠 업로드 실패:', error);
      toast({
        title: "업로드 실패",
        description: "콘텐츠 업로드에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getInfluencerSubmission = (influencerId: string) => {
    return contentSubmissions.find(sub => sub.influencerId === influencerId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'revision-request': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '임시저장';
      case 'submitted': return '제출완료';
      case 'revision-request': return '수정요청';
      case 'revision-feedback': return '수정완료';
      case 'approved': return '승인완료';
      case 'rejected': return '반려';
      default: return status;
    }
  };

  const getContentTypeIcon = (contentType: 'image' | 'video') => {
    return contentType === 'image' ? FileImage : FileVideo;
  };

  const allContentSubmitted = confirmedInfluencers.every(inf => {
    const submission = getInfluencerSubmission(inf.id);
    return submission && submission.status !== 'draft';
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-lg">콘텐츠 제출 현황을 로딩 중...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                콘텐츠 제작 현황
              </div>
              <Badge variant={allContentSubmitted ? "default" : "secondary"}>
                {contentSubmissions.length}/{confirmedInfluencers.length} 제출완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmedInfluencers.map((influencer) => {
                const submission = getInfluencerSubmission(influencer.id);
                const ContentTypeIcon = submission ? getContentTypeIcon(submission.contentType) : Upload;

                return (
                  <div key={influencer.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <User className="w-8 h-8 p-1 bg-gray-100 rounded-full" />
                          <div>
                            <h4 className="font-medium">{influencer.name}</h4>
                            <p className="text-sm text-gray-500">{influencer.platform}</p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {influencer.productionStartDate && influencer.productionDeadline && (
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>시작: {influencer.productionStartDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>마감: {influencer.productionDeadline}</span>
                              </div>
                            </div>
                          )}

                          {submission ? (
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(submission.status)}>
                                <ContentTypeIcon className="w-3 h-3 mr-1" />
                                {getStatusText(submission.status)}
                              </Badge>
                              {submission.contentFiles && submission.contentFiles.length > 0 && (
                                <span className="text-sm text-gray-500">
                                  파일 {submission.contentFiles.length}개
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">콘텐츠 미제출</Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleUploadClick(influencer)}
                        variant={submission ? "outline" : "default"}
                        className={submission ? "" : "bg-blue-600 hover:bg-blue-700"}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {submission ? '재업로드' : '업로드'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {allContentSubmitted && (
              <div className="mt-6 pt-4 border-t">
                <Button 
                  onClick={onContentReviewReady}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  콘텐츠 검수 단계로 전환
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ContentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedInfluencer(null);
        }}
        influencer={selectedInfluencer}
        campaignId={campaignId}
        onUploadComplete={handleUploadComplete}
        existingSubmission={selectedInfluencer ? getInfluencerSubmission(selectedInfluencer.id) : undefined}
      />
    </>
  );
};

export default ContentProductionTab;
