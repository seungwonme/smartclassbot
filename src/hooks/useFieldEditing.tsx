
import React, { useState } from 'react';
import { ContentPlanDetail } from '@/types/content';

interface UseFieldEditingProps {
  onSaveEdit: (planId: string, fieldName: string, newValue: any) => void;
  onAfterSave?: (planId: string, fieldName: string) => void; // 편집 완료 후 콜백
}

export const useFieldEditing = ({ onSaveEdit, onAfterSave }: UseFieldEditingProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<any>(null);

  const startEditing = (planId: string, fieldName: string, currentValue: any) => {
    const editKey = `${planId}-${fieldName}`;
    setEditingField(editKey);
    setEditingValue(currentValue);
  };

  const saveEdit = async (planId: string, fieldName: string) => {
    try {
      await onSaveEdit(planId, fieldName, editingValue);
      setEditingField(null);
      setEditingValue(null);
      
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
    isEditing
  };
};
