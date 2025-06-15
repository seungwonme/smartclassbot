import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CheckCircle, FileImage, FileVideo, AlertTriangle } from 'lucide-react';
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

  const sortInfluencersBySchedule = (influencers: CampaignInfluencer[]) => {
    return [...influencers].sort((a, b) => {
      if (!a.productionStartDate || !a.productionDeadline) return 1;
      if (!b.productionStartDate || !b.productionDeadline) return -1;

      const submissionA = getInfluencerSubmission(a.id);
      const submissionB = getInfluencerSubmission(b.id);
      
      const hasContentA = submissionA && ['submitted', 'approved'].includes(submissionA.status);
      const hasContentB = submissionB && ['submitted', 'approved'].includes(submissionB.status);

      const scheduleA = calculateScheduleStatus(a.productionStartDate, a.productionDeadline, false, !!hasContentA);
      const scheduleB = calculateScheduleStatus(b.productionStartDate, b.productionDeadline, false, !!hasContentB);

      const urgencyOrder = { 
        'deadline-exceeded': 0, 
        '긴급-production-in-progress': 1,
        'production-in-progress': 2, 
        'production-waiting': 3, 
        'content-review': 4 
      };
      
      const urgencyA = scheduleA.status === 'production-in-progress' && scheduleA.isUrgent 
        ? urgencyOrder['긴급-production-in-progress'] 
        : urgencyOrder[scheduleA.status] ?? 5;
      const urgencyB = scheduleB.status === 'production-in-progress' && scheduleB.isUrgent 
        ? urgencyOrder['긴급-production-in-progress'] 
        : urgencyOrder[scheduleB.status] ?? 5;

      if (urgencyA !== urgencyB) return urgencyA - urgencyB;
      return new Date(a.productionDeadline).getTime() - new Date(b.productionDeadline).getTime();
    });
  };

  const getScheduleInfo = (influencer: CampaignInfluencer) => {
    if (!influencer.productionStartDate || !influencer.productionDeadline) return null;
    
    const submission = getInfluencerSubmission(influencer.id);
    const hasContentSubmission = submission && ['submitted', 'approved'].includes(submission.status);
    return calculateScheduleStatus(
      influencer.productionStartDate,
      influencer.productionDeadline,
      false,
      !!hasContentSubmission
    );
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

          <div className="space-y-3">
            {sortedInfluencers.map((influencer) => {
              const submission = getInfluencerSubmission(influencer.id);
              const expectedContentType = getExpectedContentType(influencer);
              const scheduleInfo = getScheduleInfo(influencer);
              const ContentIcon = expectedContentType === 'image' ? FileImage : FileVideo;

              return (
                <div key={influencer.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    {/* 좌측: 인플루언서 정보, 콘텐츠 정보, 상태값 */}
                    <div className="flex-1 space-y-3">
                      {/* 인플루언서 정보 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{influencer.name}</h4>
                          <p className="text-sm text-gray-500">{influencer.platform}</p>
                        </div>
                      </div>

                      {/* 제작예정 콘텐츠 정보 */}
                      <div className="flex items-center gap-2">
                        <ContentIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {expectedContentType === 'image' ? '이미지 콘텐츠' : '영상 콘텐츠'}
                        </span>
                      </div>

                      {/* 상태값 */}
                      <div className="flex items-center gap-2">
                        {scheduleInfo ? (
                          <Badge className={`${
                            scheduleInfo.status === 'deadline-exceeded' ? 'bg-red-100 text-red-800 border-red-200' :
                            scheduleInfo.status === 'production-in-progress' && scheduleInfo.isUrgent ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            scheduleInfo.status === 'production-in-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            scheduleInfo.status === 'production-waiting' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {scheduleInfo.status === 'deadline-exceeded' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {scheduleInfo.status === 'production-in-progress' && scheduleInfo.isUrgent && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {scheduleInfo.status === 'production-in-progress' && !scheduleInfo.isUrgent && <Clock className="w-3 h-3 mr-1" />}
                            {scheduleInfo.status === 'production-waiting' && <Calendar className="w-3 h-3 mr-1" />}
                            {scheduleInfo.status === 'content-review' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {scheduleInfo.status === 'deadline-exceeded' ? '마감초과' :
                             scheduleInfo.status === 'production-in-progress' ? '콘텐츠 제작중' :
                             scheduleInfo.status === 'production-waiting' ? '콘텐츠 제작대기중' :
                             '콘텐츠 검수'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Clock className="w-3 h-3 mr-1" />
                            일정 미설정
                          </Badge>
                        )}

                        {/* 콘텐츠 제출 상태 */}
                        {submission ? (
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.contentType === 'image' ? <FileImage className="w-3 h-3 mr-1" /> : <FileVideo className="w-3 h-3 mr-1" />}
                            {getStatusText(submission.status)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600">
                            콘텐츠 미제출
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 우측: 일정 정보 */}
                    <div className="ml-6 text-right space-y-1 min-w-[200px]">
                      {influencer.productionStartDate && influencer.productionDeadline ? (
                        <>
                          <div className="text-sm">
                            <span className="text-gray-500">시작일: </span>
                            <span className="font-medium">{influencer.productionStartDate}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">마감일: </span>
                            <span className="font-medium">{influencer.productionDeadline}</span>
                          </div>
                          {scheduleInfo && (
                            <div className="text-sm">
                              <span className="text-gray-500">잔여일: </span>
                              <span className={`font-bold ${
                                scheduleInfo.status === 'deadline-exceeded' ? 'text-red-600' :
                                scheduleInfo.isUrgent ? 'text-orange-600' :
                                'text-blue-600'
                              }`}>
                                {scheduleInfo.status === 'deadline-exceeded' 
                                  ? `${Math.abs(scheduleInfo.daysRemaining)}일 초과`
                                  : scheduleInfo.status === 'production-waiting'
                                  ? `${Math.abs(scheduleInfo.daysRemaining)}일 후 시작`
                                  : scheduleInfo.status === 'content-review'
                                  ? '검수 대기중'
                                  : `${scheduleInfo.daysRemaining}일 남음`
                                }
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          제작 일정 미설정
                        </div>
                      )}
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
