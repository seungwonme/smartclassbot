import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Calendar, Clock, CheckCircle, FileImage, FileVideo, User } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import ContentUploadModal from './ContentUploadModal';
import { useToast } from '@/hooks/use-toast';
import ProductionScheduleStatus from './ProductionScheduleStatus';
import ProductionTimeline from './ProductionTimeline';
import { calculateScheduleStatus } from '@/utils/scheduleUtils';

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

  const getContentTypeInfo = (contentType: 'image' | 'video') => {
    if (contentType === 'image') {
      return {
        icon: FileImage,
        label: '이미지 콘텐츠',
        description: '피드용 이미지 포스팅',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      };
    } else {
      return {
        icon: FileVideo,
        label: '영상 콘텐츠',
        description: '동영상 포스팅',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
      };
    }
  };

  // 인플루언서의 예상 콘텐츠 타입 결정 (deliverables를 기반으로)
  const getExpectedContentType = (influencer: CampaignInfluencer): 'image' | 'video' => {
    const deliverables = influencer.deliverables || [];
    const hasVideo = deliverables.some(d => 
      d.toLowerCase().includes('영상') || 
      d.toLowerCase().includes('video') || 
      d.toLowerCase().includes('릴스') ||
      d.toLowerCase().includes('쇼츠')
    );
    return hasVideo ? 'video' : 'image';
  };

  const allContentSubmitted = confirmedInfluencers.every(inf => {
    const submission = getInfluencerSubmission(inf.id);
    return submission && submission.status !== 'draft';
  });

  // 일정별로 인플루언서 정렬하는 함수 추가
  const sortInfluencersBySchedule = (influencers: CampaignInfluencer[]) => {
    return [...influencers].sort((a, b) => {
      // 일정이 없는 경우 맨 뒤로
      if (!a.productionStartDate || !a.productionDeadline) return 1;
      if (!b.productionStartDate || !b.productionDeadline) return -1;

      const submissionA = getInfluencerSubmission(a.id);
      const submissionB = getInfluencerSubmission(b.id);
      
      const isCompletedA = submissionA && ['submitted', 'approved'].includes(submissionA.status);
      const isCompletedB = submissionB && ['submitted', 'approved'].includes(submissionB.status);

      // 완료된 것은 맨 뒤로
      if (isCompletedA && !isCompletedB) return 1;
      if (!isCompletedA && isCompletedB) return -1;
      if (isCompletedA && isCompletedB) return 0;

      const scheduleA = calculateScheduleStatus(a.productionStartDate, a.productionDeadline, false);
      const scheduleB = calculateScheduleStatus(b.productionStartDate, b.productionDeadline, false);

      // 긴급도 순서: overdue > deadline-approaching > in-progress > not-started
      const urgencyOrder = { 'overdue': 0, 'deadline-approaching': 1, 'in-progress': 2, 'not-started': 3 };
      const urgencyA = urgencyOrder[scheduleA.status] ?? 4;
      const urgencyB = urgencyOrder[scheduleB.status] ?? 4;

      if (urgencyA !== urgencyB) return urgencyA - urgencyB;

      // 같은 긴급도면 마감일이 빠른 순
      return new Date(a.productionDeadline).getTime() - new Date(b.productionDeadline).getTime();
    });
  };

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

  // 일정별로 정렬된 인플루언서 목록
  const sortedInfluencers = sortInfluencersBySchedule(confirmedInfluencers);

  return (
    <>
      <div className="space-y-6">
        {/* 제작 일정 현황 대시보드 추가 */}
        <ProductionTimeline 
          confirmedInfluencers={confirmedInfluencers}
          contentSubmissions={contentSubmissions}
        />

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
              {sortedInfluencers.map((influencer) => {
                const submission = getInfluencerSubmission(influencer.id);
                const expectedContentType = getExpectedContentType(influencer);
                const contentTypeInfo = getContentTypeInfo(submission?.contentType || expectedContentType);
                const ContentTypeIcon = contentTypeInfo.icon;

                return (
                  <div key={influencer.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-8 h-8 p-1 bg-gray-100 rounded-full" />
                          <div>
                            <h4 className="font-medium">{influencer.name}</h4>
                            <p className="text-sm text-gray-500">{influencer.platform}</p>
                          </div>
                        </div>

                        {/* 예상 콘텐츠 유형 표시 */}
                        <div className={`p-2 rounded-lg border ${contentTypeInfo.bgColor} ${contentTypeInfo.borderColor} mb-3`}>
                          <div className="flex items-center gap-2">
                            <ContentTypeIcon className={`w-4 h-4 ${contentTypeInfo.textColor}`} />
                            <span className={`text-sm font-medium ${contentTypeInfo.textColor}`}>
                              제작 예정: {contentTypeInfo.label}
                            </span>
                          </div>
                          <p className={`text-xs ${contentTypeInfo.textColor} opacity-80 mt-1`}>
                            {contentTypeInfo.description}
                          </p>
                          {influencer.deliverables && influencer.deliverables.length > 0 && (
                            <div className="mt-1">
                              <span className={`text-xs ${contentTypeInfo.textColor} opacity-60`}>
                                산출물: {influencer.deliverables.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 제작 일정 상태 표시 (새로 추가) */}
                        {influencer.productionStartDate && influencer.productionDeadline ? (
                          <ProductionScheduleStatus
                            startDate={influencer.productionStartDate}
                            deadline={influencer.productionDeadline}
                            submission={submission}
                            className="mb-3"
                          />
                        ) : (
                          <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-1 text-yellow-700">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">제작 일정이 설정되지 않았습니다.</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {submission ? (
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(submission.status)}>
                                {(() => {
                                  const SubmissionIcon = getContentTypeIcon(submission.contentType);
                                  return <SubmissionIcon className="w-3 h-3 mr-1" />;
                                })()}
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
