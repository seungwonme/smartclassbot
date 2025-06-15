
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Edit } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';
import InlineCommentForm from '@/components/content/InlineCommentForm';

interface UseFieldFeedbackProps {
  activeCommentField: string | null;
  currentComment: string;
  handleInlineComment: (planId: string, fieldName: string, fieldLabel: string) => void;
  handleSaveInlineComment: (planId: string, fieldLabel: string, comment: string) => void;
  handleCancelInlineComment: () => void;
  getFieldComment: (planId: string, fieldLabel: string) => any;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
}

export const useFieldFeedback = ({
  activeCommentField,
  currentComment,
  handleInlineComment,
  handleSaveInlineComment,
  handleCancelInlineComment,
  getFieldComment,
  canReviewPlan
}: UseFieldFeedbackProps) => {
  const renderFieldWithFeedback = (
    plan: ContentPlanDetail,
    fieldName: string,
    fieldLabel: string,
    content: React.ReactNode,
    canAddFeedback: boolean = true
  ) => {
    const commentKey = `${plan.id}-${fieldName}`;
    const isActiveComment = activeCommentField === commentKey;
    const existingComment = getFieldComment(plan.id, fieldLabel);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-medium">{fieldLabel}</Label>
          {canAddFeedback && canReviewPlan(plan) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleInlineComment(plan.id, fieldName, fieldLabel)}
              className="text-xs px-2 py-1 h-6"
            >
              {existingComment ? (
                <>
                  <Edit className="w-3 h-3 mr-1" />
                  수정코멘트 수정
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-1" />
                  수정코멘트
                </>
              )}
            </Button>
          )}
        </div>
        {content}
        
        {existingComment && !isActiveComment && (
          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-orange-700">수정 코멘트: </span>
                <span className="text-orange-600">{existingComment.comment}</span>
              </div>
            </div>
          </div>
        )}

        {isActiveComment && (
          <InlineCommentForm
            fieldLabel={fieldLabel}
            currentComment={currentComment}
            onSave={(comment) => handleSaveInlineComment(plan.id, fieldLabel, comment)}
            onCancel={handleCancelInlineComment}
          />
        )}
      </div>
    );
  };

  return { renderFieldWithFeedback };
};
