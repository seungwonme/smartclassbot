
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Save, X } from 'lucide-react';
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
  // 편집 기능을 위한 props (시스템 관리자용)
  editingField?: string | null;
  editingValue?: any;
  setEditingValue?: (value: any) => void;
  onStartEdit?: (planId: string, fieldName: string, currentValue: any) => void;
  onSaveEdit?: (planId: string, fieldName: string) => void;
  onCancelEdit?: () => void;
}

export const useFieldFeedback = ({
  activeCommentField,
  currentComment,
  handleInlineComment,
  handleSaveInlineComment,
  handleCancelInlineComment,
  getFieldComment,
  canReviewPlan,
  editingField,
  editingValue,
  setEditingValue,
  onStartEdit,
  onSaveEdit,
  onCancelEdit
}: UseFieldFeedbackProps) => {
  
  const renderFieldWithFeedback = (
    plan: ContentPlanDetail,
    fieldName: string,
    fieldLabel: string,
    content: React.ReactNode,
    canAddFeedback: boolean = true,
    fieldType: 'text' | 'textarea' | 'array' = 'text',
    currentValue?: any,
    editProps?: any // 편집 관련 props를 받기 위한 추가 매개변수
  ) => {
    const commentKey = `${plan.id}-${fieldName}`;
    const editKey = `${plan.id}-${fieldName}`;
    const isActiveComment = activeCommentField === commentKey;
    const isEditing = editingField === editKey;
    const existingComment = getFieldComment(plan.id, fieldLabel);

    // editProps가 전달된 경우 해당 값들을 사용, 그렇지 않으면 기본 props 사용
    const actualEditingField = editProps?.editingField || editingField;
    const actualEditingValue = editProps?.editingValue || editingValue;
    const actualSetEditingValue = editProps?.setEditingValue || setEditingValue;
    const actualOnStartEdit = editProps?.onStartEdit || onStartEdit;
    const actualOnSaveEdit = editProps?.onSaveEdit || onSaveEdit;
    const actualOnCancelEdit = editProps?.onCancelEdit || onCancelEdit;

    // 브랜드 관리자인지 확인 (URL 기반) - 더 포괄적으로 체크
    const isBrandView = window.location.pathname.includes('/brand');
    // 시스템 관리자인지 확인 (URL 기반) - 더 포괄적으로 체크
    const isAdminView = window.location.pathname.includes('/admin');

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-medium">{fieldLabel}</Label>
          {canAddFeedback && canReviewPlan(plan) && (
            <div className="flex gap-2">
              {/* 시스템 관리자용 수정하기 버튼만 표시 */}
              {isAdminView && actualOnStartEdit && !isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log('🔧 수정하기 버튼 클릭:', { planId: plan.id, fieldName, currentValue });
                    actualOnStartEdit(plan.id, fieldName, currentValue);
                  }}
                  className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  수정하기
                </Button>
              )}
              
              {/* 브랜드 관리자용 수정코멘트 버튼 */}
              {isBrandView && (
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
          )}
        </div>

        {/* 시스템 관리자용 편집 모드 */}
        {isEditing && isAdminView ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-700">필드 수정</Label>
              {fieldType === 'textarea' ? (
                <Textarea
                  value={actualEditingValue || ''}
                  onChange={(e) => actualSetEditingValue?.(e.target.value)}
                  className="text-sm"
                  rows={3}
                />
              ) : fieldType === 'array' ? (
                <Textarea
                  value={Array.isArray(actualEditingValue) ? actualEditingValue.join(', ') : actualEditingValue || ''}
                  onChange={(e) => actualSetEditingValue?.(e.target.value.split(',').map(s => s.trim()))}
                  placeholder="쉼표로 구분하여 입력하세요"
                  className="text-sm"
                />
              ) : (
                <Input
                  value={actualEditingValue || ''}
                  onChange={(e) => actualSetEditingValue?.(e.target.value)}
                  className="text-sm"
                />
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => actualOnSaveEdit?.(plan.id, fieldName)}
                  className="text-xs px-3 py-1 h-7 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-3 h-3 mr-1" />
                  수정저장
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={actualOnCancelEdit}
                  className="text-xs px-3 py-1 h-7"
                >
                  <X className="w-3 h-3 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // 일반 표시 모드
          content
        )}
        
        {existingComment && !isActiveComment && !isEditing && (
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
