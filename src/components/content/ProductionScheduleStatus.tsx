
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
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
  const hasContentSubmission = submission && ['submitted', 'approved'].includes(submission.status);
  const scheduleInfo = calculateScheduleStatus(startDate, deadline, false, !!hasContentSubmission);
  const urgencyBadge = getUrgencyBadge(scheduleInfo);

  const getStatusIcon = () => {
    switch (scheduleInfo.status) {
      case 'content-review': return <Eye className="w-3 h-3 mr-1" />;
      case 'deadline-exceeded': return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'production-in-progress': 
        return scheduleInfo.isUrgent ? <AlertTriangle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />;
      case 'production-waiting': return <Calendar className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 일정 상태 배지 */}
      <div className="flex items-center justify-between">
        <Badge className={`${getStatusColor(scheduleInfo.status)} px-2 py-1`}>
          {getStatusIcon()}
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
      {scheduleInfo.status === 'production-in-progress' && (
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
            {scheduleInfo.daysElapsed}일 경과 / 총 {scheduleInfo.daysElapsed + Math.max(0, scheduleInfo.daysRemaining)}일
          </div>
        </div>
      )}

      {/* 상태별 알림 메시지 */}
      {scheduleInfo.status === 'deadline-exceeded' && (
        <div className="p-2 rounded-lg text-xs bg-red-50 text-red-700 border border-red-200">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-medium">마감일이 초과되었습니다!</span>
          </div>
        </div>
      )}

      {scheduleInfo.status === 'production-in-progress' && scheduleInfo.isUrgent && (
        <div className="p-2 rounded-lg text-xs bg-orange-50 text-orange-700 border border-orange-200">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-medium">마감일이 임박했습니다!</span>
          </div>
        </div>
      )}

      {scheduleInfo.status === 'content-review' && (
        <div className="p-2 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span className="font-medium">콘텐츠가 업로드되어 검수 대기 중입니다.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionScheduleStatus;
