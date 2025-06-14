
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, FileText } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      alert('제작 시작일과 마감일을 모두 입력해주세요.');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('마감일은 시작일보다 늦어야 합니다.');
      return;
    }

    onSubmit(formData);
    onClose();
    
    // 폼 리셋
    setFormData({
      startDate: '',
      endDate: '',
      notes: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    제작 시작일
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    제작 마감일
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  제작 가이드라인 (선택사항)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
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
