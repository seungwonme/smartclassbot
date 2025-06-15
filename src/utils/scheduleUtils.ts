
export type ScheduleStatus = 'production-waiting' | 'production-in-progress' | 'deadline-exceeded' | 'content-review';

export interface ScheduleInfo {
  status: ScheduleStatus;
  daysRemaining: number;
  daysElapsed: number;
  isUrgent: boolean;
  progressPercentage: number;
}

export const calculateScheduleStatus = (
  startDate: string,
  deadline: string,
  isCompleted: boolean = false,
  hasContentSubmission: boolean = false
): ScheduleInfo => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(deadline);
  
  // 날짜를 한국 시간 기준으로 정규화
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let status: ScheduleStatus;
  let isUrgent = false;

  // 시스템관리자가 콘텐츠를 업로드한 경우
  if (hasContentSubmission) {
    status = 'content-review';
  } 
  // 콘텐츠 제작대기중 - 시작 일정에 도달하지 않았을 경우
  else if (now < start) {
    status = 'production-waiting';
  } 
  // 마감초과 - 종료 일정을 초과했을 때
  else if (now > end) {
    status = 'deadline-exceeded';
    isUrgent = true;
  } 
  // 콘텐츠 제작중 - 시작 일정에 도달하고 종료일정이 도달하지 않았을 경우
  else {
    status = 'production-in-progress';
    // 마감 3일 전부터 긴급으로 표시
    isUrgent = remainingDays <= 3;
  }

  const progressPercentage = totalDays > 0 
    ? Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
    : 0;

  return {
    status,
    daysRemaining: remainingDays,
    daysElapsed: Math.max(0, elapsedDays),
    isUrgent,
    progressPercentage: Math.round(progressPercentage)
  };
};

export const getStatusColor = (status: ScheduleStatus) => {
  switch (status) {
    case 'production-waiting': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'production-in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'deadline-exceeded': return 'bg-red-100 text-red-800 border-red-200';
    case 'content-review': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusText = (status: ScheduleStatus) => {
  switch (status) {
    case 'production-waiting': return '콘텐츠 제작대기중';
    case 'production-in-progress': return '콘텐츠 제작중';
    case 'deadline-exceeded': return '마감초과';
    case 'content-review': return '콘텐츠 검수';
    default: return '상태 확인중';
  }
};

export const getUrgencyBadge = (scheduleInfo: ScheduleInfo) => {
  if (scheduleInfo.status === 'deadline-exceeded') {
    return { text: `${Math.abs(scheduleInfo.daysRemaining)}일 초과`, color: 'bg-red-500 text-white' };
  } else if (scheduleInfo.status === 'production-in-progress' && scheduleInfo.isUrgent) {
    return { 
      text: scheduleInfo.daysRemaining === 0 ? '오늘 마감' : `${scheduleInfo.daysRemaining}일 남음`,
      color: scheduleInfo.daysRemaining <= 1 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
    };
  } else if (scheduleInfo.status === 'production-in-progress') {
    return { text: `${scheduleInfo.daysRemaining}일 남음`, color: 'bg-blue-500 text-white' };
  } else if (scheduleInfo.status === 'production-waiting') {
    return { text: `${Math.abs(scheduleInfo.daysRemaining)}일 후 시작`, color: 'bg-gray-500 text-white' };
  } else if (scheduleInfo.status === 'content-review') {
    return { text: '검수 대기중', color: 'bg-green-500 text-white' };
  }
  return null;
};
