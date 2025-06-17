
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ReportConfigurationFormProps {
  reportType: 'summary' | 'detailed' | 'comparison';
  dateRange: { from?: Date; to?: Date };
  onReportTypeChange: (value: 'summary' | 'detailed' | 'comparison') => void;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

const ReportConfigurationForm: React.FC<ReportConfigurationFormProps> = ({
  reportType,
  dateRange,
  onReportTypeChange,
  onDateRangeChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">리포트 유형</label>
        <Select value={reportType} onValueChange={onReportTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summary">요약 리포트</SelectItem>
            <SelectItem value="detailed">상세 리포트</SelectItem>
            <SelectItem value="comparison">비교 분석</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">기간 선택</label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, 'MM/dd', { locale: ko }) : '시작일'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, 'MM/dd', { locale: ko }) : '종료일'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ReportConfigurationForm;
