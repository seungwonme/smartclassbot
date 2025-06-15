
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CheckCircle, FileImage, FileVideo } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import { contentSubmissionService } from '@/services/contentSubmission.service';
import ProductionScheduleStatus from './ProductionScheduleStatus';
import ProductionTimeline from './ProductionTimeline';
import { calculateScheduleStatus } from '@/utils/scheduleUtils';
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContentSubmissions();
  }, [campaignId]);

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

  // 인플루언서의 예상 콘텐츠 타입 결정
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

  // 일정별로 인플루언서 정렬
  const sortInfluencersBySchedule = (influencers: CampaignInfluencer[]) => {
    return [...influencers].sort((a, b) => {
      if (!a.productionStartDate || !a.productionDeadline) return 1;
      if (!b.productionStartDate || !b.productionDeadline) return -1;

      const submissionA = getInfluencerSubmission(a.id);
      const submissionB = getInfluencerSubmission(b.id);
      
      const isCompletedA = submissionA && ['submitted', 'approved'].includes(submissionA.status);
      const isCompletedB = submissionB && ['submitted', 'approved'].includes(submissionB.status);

      if (isCompletedA && !isCompletedB) return 1;
      if (!isCompletedA && isCompletedB) return -1;
      if (isCompletedA && isCompletedB) return 0;

      const scheduleA = calculateScheduleStatus(a.productionStartDate, a.productionDeadline, false);
      const scheduleB = calculateScheduleStatus(b.productionStartDate, b.productionDeadline, false);

      const urgencyOrder = { 'overdue': 0, 'deadline-approaching': 1, 'in-progress': 2, 'not-started': 3 };
      const urgencyA = urgencyOrder[scheduleA.status] ?? 4;
      const urgencyB = urgencyOrder[scheduleB.status] ?? 4;

      if (urgencyA !== urgencyB) return urgencyA - urgencyB;
      return new Date(a.productionDeadline).getTime() - new Date(b.productionDeadline).getTime();
    });
  };

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

  const sortedInfluencers = sortInfluencersBySchedule(confirmedInfluencers);

  return (
    <div className="space-y-6">
      {/* 제작 일정 현황 대시보드 */}
      <ProductionTimeline 
        confirmedInfluencers={confirmedInfluencers}
        contentSubmissions={contentSubmissions}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              콘텐츠 제작 일정 현황
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

          <div className="space-y-4">
            {sortedInfluencers.map((influencer) => {
              const submission = getInfluencerSubmission(influencer.id);
              const expectedContentType = getExpectedContentType(influencer);
              const contentTypeInfo = getContentTypeInfo(submission?.contentType || expectedContentType);
              const ContentTypeIcon = contentTypeInfo.icon;

              return (
                <div key={influencer.id} className="p-4 border rounded-lg bg-gray-50">
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

                      {/* 제작 일정 상태 표시 */}
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
                                파일 {submission.contentFiles.length}개 업로드됨
                              </span>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline">콘텐츠 미제출</Badge>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Badge 
                        variant="outline" 
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        일정 확인됨
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandContentProductionTab;
