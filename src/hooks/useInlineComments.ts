
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface InlineComment {
  planId: string;
  fieldName: string;
  comment: string;
}

export const useInlineComments = () => {
  const [activeCommentField, setActiveCommentField] = useState<string | null>(null);
  const [inlineComments, setInlineComments] = useState<InlineComment[]>([]);
  const [currentComment, setCurrentComment] = useState('');
  const { toast } = useToast();

  const handleInlineComment = (planId: string, fieldName: string, fieldLabel: string) => {
    const commentKey = `${planId}-${fieldName}`;
    if (activeCommentField === commentKey) {
      setActiveCommentField(null);
      setCurrentComment('');
    } else {
      const existingComment = inlineComments.find(c => c.planId === planId && c.fieldName === fieldLabel);
      setActiveCommentField(commentKey);
      setCurrentComment(existingComment?.comment || '');
    }
  };

  const handleSaveInlineComment = (planId: string, fieldLabel: string, comment: string) => {
    const newComment: InlineComment = {
      planId,
      fieldName: fieldLabel,
      comment
    };

    setInlineComments(prev => {
      const filtered = prev.filter(c => !(c.planId === planId && c.fieldName === fieldLabel));
      return [...filtered, newComment];
    });

    setActiveCommentField(null);
    setCurrentComment('');
    
    toast({
      title: "코멘트 저장됨",
      description: `${fieldLabel}에 대한 코멘트가 저장되었습니다.`
    });
  };

  const handleCancelInlineComment = () => {
    setActiveCommentField(null);
    setCurrentComment('');
  };

  const getFieldComment = (planId: string, fieldLabel: string) => {
    return inlineComments.find(c => c.planId === planId && c.fieldName === fieldLabel);
  };

  const resetComments = () => {
    setInlineComments([]);
    setActiveCommentField(null);
    setCurrentComment('');
  };

  return {
    activeCommentField,
    inlineComments,
    currentComment,
    handleInlineComment,
    handleSaveInlineComment,
    handleCancelInlineComment,
    getFieldComment,
    resetComments
  };
};
