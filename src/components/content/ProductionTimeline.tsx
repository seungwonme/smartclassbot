
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import { calculateScheduleStatus } from '@/utils/scheduleUtils';

interface ProductionTimelineProps {
  confirmedInfluencers: CampaignInfluencer[];
  contentSubmissions: ContentSubmission[];
}

const ProductionTimeline: React.FC<ProductionTimelineProps> = ({
  confirmedInfluencers,
  contentSubmissions
}) => {
  const getInfluencerSubmission = (influencerId: string) => {
    return contentSubmissions.find(sub => sub.influencerId === influencerId);
  };

  // 일정 상태별 통계 계산
  const scheduleStats = confirmedInfluencers.reduce((stats, influencer) => {
    if (!influencer.productionStartDate || !influencer.productionDeadline) {
      stats.noSchedule++;
      return stats;
    }

    const submission = getInfluencerSubmission(influencer.id);
    const isCompleted = submission && ['submitted', 'approved'].includes(submission.status);
    const scheduleInfo = calculateScheduleStatus(
      influencer.productionStartDate,
      influencer.productionDeadline,
      isCompleted
    );

    stats[scheduleInfo.status]++;
    if (scheduleInfo.isUrgent && !isCompleted) {
      stats.urgent++;
    }
    
    return stats;
  }, {
    'not-started': 0,
    'in-progress': 0,
    'deadline-approaching': 0,
    'overdue': 0,
    'completed': 0,
    'urgent': 0,
    'noSchedule': 0
  });

  const totalScheduled = confirmedInfluencers.length - scheduleStats.noSchedule;
  const completionRate = totalScheduled > 0 ? Math.round((scheduleStats.completed / totalScheduled) * 100) : 0;

  // 긴급 상황 인플루언서 목록
  const urgentInfluencers = confirmedInfluencers.filter(influencer => {
    if (!influencer.productionStartDate || !influencer.productionDeadline) return false;
    
    const submission = getInfluencerSubmission(influencer.id);
    const isCompleted = submission && ['submitted', 'approved'].includes(submission.status);
    if (isCompleted) return false;

    const scheduleInfo = calculateScheduleStatus(
      influencer.productionStartDate,
      influencer.productionDeadline,
      false
    );
    return scheduleInfo.isUrgent;
  });

  return (
    <div className="space-y-6">
      {/* 전체 현황 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            제작 일정 현황 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{scheduleStats.completed}</div>
              <div className="text-sm text-green-600">제작 완료</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{scheduleStats['in-progress']}</div>
              <div className="text-sm text-blue-600">제작 진행중</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{scheduleStats['deadline-approaching']}</div>
              <div className="text-sm text-orange-600">마감 임박</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{scheduleStats.overdue}</div>
              <div className="text-sm text-red-600">마감 초과</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">전체 완료율: {completionRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm">총 {totalScheduled}명 중 {scheduleStats.completed}명 완료</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 긴급 상황 알림 */}
      {urgentInfluencers.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              긴급 상황 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-red-600 text-sm">
                마감이 임박하거나 초과된 인플루언서가 {urgentInfluencers.length}명 있습니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {urgentInfluencers.map(influencer => {
                  const submission = getInfluencerSubmission(influencer.id);
                  const scheduleInfo = calculateScheduleStatus(
                    influencer.productionStartDate!,
                    influencer.productionDeadline!,
                    false
                  );
                  
                  return (
                    <Badge
                      key={influencer.id}
                      className={`${
                        scheduleInfo.status === 'overdue' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {influencer.name} ({scheduleInfo.status === 'overdue' 
                        ? `${Math.abs(scheduleInfo.daysRemaining)}일 초과`
                        : `${scheduleInfo.daysRemaining}일 남음`
                      })
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 일정 미설정 인플루언서 알림 */}
      {scheduleStats.noSchedule > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                제작 일정이 설정되지 않은 인플루언서가 {scheduleStats.noSchedule}명 있습니다.
                시스템 관리자에게 일정 설정을 요청하세요.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionTimeline;
