
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(100, Math.max(0, ((today.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100));

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">제작 일정</CardTitle>
        <div className="text-xs text-gray-500">
          {startDate} ~ {deadline} ({totalDays}일간)
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <Calendar
          mode="single"
          month={displayMonth}
          className="w-full"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          classNames={{
            months: "flex w-full",
            month: "space-y-2 w-full",
            caption: "flex justify-center pt-1 relative items-center text-xs",
            caption_label: "text-xs font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 text-xs",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-6 font-normal text-[0.6rem]",
            row: "flex w-full mt-1",
            cell: "h-6 w-6 text-center text-[0.6rem] p-0 relative focus-within:relative focus-within:z-20",
            day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100 text-[0.6rem]",
            day_today: "bg-orange-500 text-white rounded-full",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50"
          }}
          disabled={() => false}
        />
        
        {/* 범례 및 진행 정보 */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>시작일</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200"></div>
                <span>진행중</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>마감일</span>
              </div>
            </div>
            <div className="text-gray-600">
              {remainingDays > 0 ? `D-${remainingDays}` : remainingDays === 0 ? 'D-Day' : '마감완료'}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionRangeCalendar;
