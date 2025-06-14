
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';

interface InlineCommentFormProps {
  fieldLabel: string;
  currentComment: string;
  onSave: (comment: string) => void;
  onCancel: () => void;
}

const InlineCommentForm: React.FC<InlineCommentFormProps> = ({
  fieldLabel,
  currentComment,
  onSave,
  onCancel
}) => {
  const [comment, setComment] = useState(currentComment);

  const handleSave = () => {
    if (comment.trim()) {
      onSave(comment.trim());
    }
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
      <div className="space-y-2">
        <Label className="text-sm font-medium">수정 코멘트</Label>
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`${fieldLabel}에 대한 수정 요청 사항을 입력하세요...`}
          className="text-sm"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs px-3 py-1 h-7"
            disabled={!comment.trim()}
          >
            <Send className="w-3 h-3 mr-1" />
            저장
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="text-xs px-3 py-1 h-7"
          >
            <X className="w-3 h-3 mr-1" />
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InlineCommentForm;
