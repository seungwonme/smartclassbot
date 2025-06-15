
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateScheduleStatus, getStatusColor, getStatusText, getUrgencyBadge } from '@/utils/scheduleUtils';
import { ContentSubmission } from '@/types/campaign';

interface ProductionScheduleStatusProps {
  startDate: string;
  deadline: string;
  submission?: ContentSubmission;
  className?: string;
}

const ProductionScheduleStatus: React.FC<ProductionScheduleStatusProps> = ({
  startDate,
  deadline,
  submission,
  className = ''
}) => {
  const isCompleted = submission && ['submitted', 'approved'].includes(submission.status);
  const scheduleInfo = calculateScheduleStatus(startDate, deadline, isCompleted);
  const urgencyBadge = getUrgencyBadge(scheduleInfo);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 일정 상태 배지 */}
      <div className="flex items-center justify-between">
        <Badge className={`${getStatusColor(scheduleInfo.status)} px-2 py-1`}>
          {scheduleInfo.status === 'completed' ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : scheduleInfo.isUrgent ? (
            <AlertTriangle className="w-3 h-3 mr-1" />
          ) : (
            <Clock className="w-3 h-3 mr-1" />
          )}
          {getStatusText(scheduleInfo.status)}
        </Badge>
        
        {urgencyBadge && (
          <Badge className={`${urgencyBadge.color} px-2 py-1 text-xs`}>
            {urgencyBadge.text}
          </Badge>
        )}
      </div>

      {/* 일정 정보 */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>시작: {startDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>마감: {deadline}</span>
        </div>
      </div>

      {/* 진행률 표시 (제작 중인 경우만) */}
      {scheduleInfo.status === 'in-progress' && !isCompleted && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>진행률</span>
            <span>{scheduleInfo.progressPercentage}%</span>
          </div>
          <Progress 
            value={scheduleInfo.progressPercentage} 
            className="h-2"
          />
          <div className="text-xs text-gray-500 text-center">
            {scheduleInfo.daysElapsed}일 경과 / 총 {scheduleInfo.daysElapsed + scheduleInfo.daysRemaining}일
          </div>
        </div>
      )}

      {/* 긴급 상황 알림 */}
      {scheduleInfo.isUrgent && !isCompleted && (
        <div className={`p-2 rounded-lg text-xs ${
          scheduleInfo.status === 'overdue' 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-orange-50 text-orange-700 border border-orange-200'
        }`}>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-medium">
              {scheduleInfo.status === 'overdue' 
                ? '마감일이 초과되었습니다!' 
                : '마감일이 임박했습니다!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionScheduleStatus;
