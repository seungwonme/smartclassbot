
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { addDays, isAfter, isBefore, isSameDay, isWithinInterval } from 'date-fns';

interface ProductionRangeCalendarProps {
  startDate: string;
  deadline: string;
  className?: string;
}

const ProductionRangeCalendar: React.FC<ProductionRangeCalendarProps> = ({
  startDate,
  deadline,
  className = ''
}) => {
  const start = new Date(startDate);
  const end = new Date(deadline);
  const today = new Date();

  // Determine which month to display (prefer the month with start date)
  const displayMonth = start;

  const modifiers = {
    start: start,
    end: end,
    inRange: (date: Date) => {
      return isAfter(date, start) && isBefore(date, end);
    },
    today: today
  };

  const modifiersStyles = {
    start: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderRadius: '50%'
    },
    end: {
      backgroundColor: '#EF4444',
      color: 'white',
      borderRadius: '50%'
    },
    inRange: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF'
    },
    today: {
      backgroundColor: '#F59E0B',
      color: 'white',
      fontWeight: 'bold'
    }
  };

  // Calculate remaining days
  const remainingDays = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercentage = Math.min(100, Math.max(0, ((today.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100));

  return (
    <div className={`${className}`}>
      {/* 달력 - 헤더 제거하고 크기 확대 */}
      <Calendar
        mode="single"
        month={displayMonth}
        className="w-full"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        classNames={{
          months: "flex w-full",
          month: "space-y-2 w-full",
          caption: "flex justify-center pt-1 relative items-center text-sm",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 text-sm",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem] flex-1",
          row: "flex w-full mt-1",
          cell: "h-8 w-8 text-center text-[0.7rem] p-0 relative focus-within:relative focus-within:z-20 flex-1",
          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-[0.7rem] w-full",
          day_today: "bg-orange-500 text-white rounded-full",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50"
        }}
        disabled={() => false}
      />
      
      {/* 범례 및 진행 정보 */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-600">
            {remainingDays > 0 ? `D-${remainingDays}` : remainingDays === 0 ? 'D-Day' : '마감완료'}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>시작</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-100 border border-blue-200"></div>
            <span>진행</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>마감</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProductionRangeCalendar;
