
export type ScheduleStatus = 'not-started' | 'in-progress' | 'deadline-approaching' | 'overdue' | 'completed';

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
  isCompleted: boolean = false
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

  if (isCompleted) {
    status = 'completed';
  } else if (now < start) {
    status = 'not-started';
  } else if (now > end) {
    status = 'overdue';
    isUrgent = true;
  } else if (remainingDays <= 3) {
    status = 'deadline-approaching';
    isUrgent = remainingDays <= 1;
  } else {
    status = 'in-progress';
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
    case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'deadline-approaching': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusText = (status: ScheduleStatus) => {
  switch (status) {
    case 'not-started': return '제작 대기';
    case 'in-progress': return '제작 진행중';
    case 'deadline-approaching': return '마감 임박';
    case 'overdue': return '마감 초과';
    case 'completed': return '제작 완료';
    default: return '상태 확인중';
  }
};

export const getUrgencyBadge = (scheduleInfo: ScheduleInfo) => {
  if (scheduleInfo.status === 'overdue') {
    return { text: `${Math.abs(scheduleInfo.daysRemaining)}일 초과`, color: 'bg-red-500 text-white' };
  } else if (scheduleInfo.status === 'deadline-approaching') {
    return { 
      text: scheduleInfo.daysRemaining === 0 ? '오늘 마감' : `${scheduleInfo.daysRemaining}일 남음`,
      color: scheduleInfo.daysRemaining <= 1 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
    };
  } else if (scheduleInfo.status === 'in-progress') {
    return { text: `${scheduleInfo.daysRemaining}일 남음`, color: 'bg-blue-500 text-white' };
  } else if (scheduleInfo.status === 'not-started') {
    return { text: `${Math.abs(scheduleInfo.daysRemaining)}일 후 시작`, color: 'bg-gray-500 text-white' };
  }
  return null;
};
