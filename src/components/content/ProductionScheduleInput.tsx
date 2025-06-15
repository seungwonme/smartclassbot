
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Save, X } from 'lucide-react';
import { CampaignInfluencer } from '@/types/campaign';

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
  const [startDate, setStartDate] = useState(influencer.productionStartDate || '');
  const [deadline, setDeadline] = useState(influencer.productionDeadline || '');

  const handleSave = () => {
    if (!startDate || !deadline) {
      alert('시작일과 마감일을 모두 입력해주세요.');
      return;
    }

    if (new Date(startDate) >= new Date(deadline)) {
      alert('마감일은 시작일보다 늦어야 합니다.');
      return;
    }

    onSave(influencer.id, startDate, deadline);
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
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="deadline">제작 마감일</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1"
            />
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
