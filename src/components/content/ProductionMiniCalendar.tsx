
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductionMiniCalendarProps {
  title: string;
  selectedDate: string;
  className?: string;
}

const ProductionMiniCalendar: React.FC<ProductionMiniCalendarProps> = ({
  title,
  selectedDate,
  className = ''
}) => {
  const date = new Date(selectedDate);
  const today = new Date();
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <p className="text-xs text-gray-500">{selectedDate}</p>
      </CardHeader>
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={date}
          month={date}
          className="w-full"
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
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50"
          }}
          disabled={() => false}
        />
      </CardContent>
    </Card>
  );
};

export default ProductionMiniCalendar;
