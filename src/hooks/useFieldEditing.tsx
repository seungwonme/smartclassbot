
import React, { useState } from 'react';
import { ContentPlanDetail } from '@/types/content';

interface UseFieldEditingProps {
  onSaveEdit: (planId: string, fieldName: string, newValue: any) => void;
  onAfterSave?: (planId: string, fieldName: string) => void; // 편집 완료 후 콜백
}

export const useFieldEditing = ({ onSaveEdit, onAfterSave }: UseFieldEditingProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [justEditedField, setJustEditedField] = useState<string | null>(null);

  const startEditing = (planId: string, fieldName: string, currentValue: any) => {
    const editKey = `${planId}-${fieldName}`;
    setEditingField(editKey);
    setEditingValue(currentValue);
    // 편집 시작 시 justEditedField 초기화
    setJustEditedField(null);
  };

  const saveEdit = async (planId: string, fieldName: string) => {
    try {
      await onSaveEdit(planId, fieldName, editingValue);
      
      const editKey = `${planId}-${fieldName}`;
      setEditingField(null);
      setEditingValue(null);
      
      // 편집 완료된 필드 설정 (피드백 섹션 표시용)
      setJustEditedField(editKey);
      
      // 편집 완료 후 콜백 실행
      if (onAfterSave) {
        onAfterSave(planId, fieldName);
      }
    } catch (error) {
      console.error('편집 저장 실패:', error);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue(null);
  };

  const clearJustEdited = () => {
    setJustEditedField(null);
  };

  const isEditing = (planId: string, fieldName: string) => {
    const editKey = `${planId}-${fieldName}`;
    return editingField === editKey;
  };

  return {
    editingField,
    editingValue,
    setEditingValue,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing,
    justEditedField,
    clearJustEdited
  };
};
