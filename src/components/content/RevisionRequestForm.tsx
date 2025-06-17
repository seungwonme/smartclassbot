
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, X } from 'lucide-react';

interface RevisionRequestFormProps {
  revisionNumber: number;
  onSubmit: (feedback: string) => void;
  onCancel: () => void;
  requestType: 'brand-request' | 'admin-feedback' | 'brand-revision';
  isProcessing?: boolean;
}

const RevisionRequestForm: React.FC<RevisionRequestFormProps> = ({
  revisionNumber,
  onSubmit,
  onCancel,
  requestType,
  isProcessing = false
}) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    onSubmit(feedback.trim());
    setFeedback('');
  };

  const getTitle = () => {
    switch (requestType) {
      case 'brand-request':
        return `${revisionNumber}차 수정요청`;
      case 'brand-revision':
        return `${revisionNumber}차 수정요청`;
      case 'admin-feedback':
        return `${revisionNumber}차 수정피드백`;
      default:
        return `${revisionNumber}차 수정요청`;
    }
  };

  const getPlaceholder = () => {
    switch (requestType) {
      case 'brand-request':
      case 'brand-revision':
        return '수정이 필요한 사항을 구체적으로 작성해주세요...';
      case 'admin-feedback':
        return '수정 요청에 대한 피드백을 작성해주세요...';
      default:
        return '수정이 필요한 사항을 구체적으로 작성해주세요...';
    }
  };

  const getButtonText = () => {
    switch (requestType) {
      case 'brand-request':
      case 'brand-revision':
        return '수정요청 전송';
      case 'admin-feedback':
        return '수정피드백 전송';
      default:
        return '수정요청 전송';
    }
  };

  return (
    <Card className="mt-4 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="revision-feedback">
              {requestType === 'admin-feedback' ? '수정 피드백 내용' : '수정 요청 사항'}
            </Label>
            <Textarea
              id="revision-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={getPlaceholder()}
              rows={4}
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={!feedback.trim() || isProcessing}
              className={requestType === 'admin-feedback' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              <Send className="w-4 h-4 mr-2" />
              {isProcessing ? '전송 중...' : getButtonText()}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisionRequestForm;
