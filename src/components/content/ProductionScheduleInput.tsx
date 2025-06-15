
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Save, X } from 'lucide-react';
import { CampaignInfluencer } from '@/types/campaign';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ProductionScheduleInputProps {
  influencer: CampaignInfluencer;
  onSave: (influencerId: string, startDate: string, deadline: string) => void;
  onCancel: () => void;
}

const ProductionScheduleInput: React.FC<ProductionScheduleInputProps> = ({
  influencer,
  onSave,
  onCancel
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    influencer.productionStartDate ? new Date(influencer.productionStartDate) : undefined
  );
  const [deadline, setDeadline] = useState<Date | undefined>(
    influencer.productionDeadline ? new Date(influencer.productionDeadline) : undefined
  );

  const handleSave = () => {
    if (!startDate || !deadline) {
      alert('시작일과 마감일을 모두 입력해주세요.');
      return;
    }

    if (startDate >= deadline) {
      alert('마감일은 시작일보다 늦어야 합니다.');
      return;
    }

    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedDeadline = format(deadline, 'yyyy-MM-dd');

    onSave(influencer.id, formattedStartDate, formattedDeadline);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          제작 일정 입력 - {influencer.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-date">제작 시작일</Label>
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
                  {startDate ? format(startDate, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="deadline">제작 마감일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => {
                    if (startDate) {
                      return date <= startDate;
                    }
                    return date < new Date();
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={!startDate || !deadline}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionScheduleInput;
