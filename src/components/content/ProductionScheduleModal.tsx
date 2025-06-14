
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ProductionScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData: {
    startDate: string;
    endDate: string;
    notes?: string;
  }) => void;
  campaignTitle: string;
}

const ProductionScheduleModal: React.FC<ProductionScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  campaignTitle
}) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert('제작 시작일과 마감일을 모두 선택해주세요.');
      return;
    }

    if (startDate >= endDate) {
      alert('마감일은 시작일보다 늦어야 합니다.');
      return;
    }

    onSubmit({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      notes
    });
    onClose();
    
    // 폼 리셋
    setStartDate(undefined);
    setEndDate(undefined);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            콘텐츠 제작 일정 설정
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{campaignTitle}</CardTitle>
            <p className="text-sm text-gray-600">
              모든 콘텐츠 기획이 완료되었습니다. 제작 일정을 입력하여 제작 단계로 진행하세요.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    제작 시작일
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "yyyy년 MM월 dd일", { locale: ko }) : "시작일 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    제작 마감일
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "yyyy년 MM월 dd일", { locale: ko }) : "마감일 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < new Date() || (startDate && date <= startDate)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  제작 가이드라인 (선택사항)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="제작 시 주의사항이나 가이드라인을 입력하세요..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  제작 단계 시작
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionScheduleModal;
