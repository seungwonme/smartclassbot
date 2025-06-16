
import React, { useState } from 'react';
import { ContentPlanDetail } from '@/types/content';

interface UseFieldEditingProps {
  onSaveEdit: (planId: string, fieldName: string, newValue: any) => void;
}

export const useFieldEditing = ({ onSaveEdit }: UseFieldEditingProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<any>(null);

  const startEditing = (planId: string, fieldName: string, currentValue: any) => {
    const editKey = `${planId}-${fieldName}`;
    setEditingField(editKey);
    setEditingValue(currentValue);
  };

  const saveEdit = (planId: string, fieldName: string) => {
    onSaveEdit(planId, fieldName, editingValue);
    setEditingField(null);
    setEditingValue(null);
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
