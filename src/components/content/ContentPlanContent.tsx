
import React from 'react';
import { FileText } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';
import PlanDataRenderer from './PlanDataRenderer';
import ContentRevisionTimeline from './ContentRevisionTimeline';

interface ContentPlanContentProps {
  selectedPlan: ContentPlanDetail | null;
  plans: ContentPlanDetail[];
  renderFieldWithFeedback: any;
  editingField?: string | null;
  editingValue?: any;
  setEditingValue?: (value: any) => void;
  onStartEdit?: (planId: string, fieldName: string, currentValue: any) => void;
  onSaveEdit?: (planId: string, fieldName: string) => void;
  onCancelEdit?: () => void;
}

const ContentPlanContent: React.FC<ContentPlanContentProps> = ({
  selectedPlan,
  plans,
  renderFieldWithFeedback,
  editingField,
  editingValue,
  setEditingValue,
  onStartEdit,
  onSaveEdit,
  onCancelEdit
}) => {
  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');

  if (!selectedPlan) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>좌측에서 인플루언서를 선택하여 기획안을 확인하세요.</p>
          {plans.length === 0 && (
            <p className="text-sm mt-2">
              {isAdminView 
                ? "기획안을 생성하거나 브랜드의 수정요청에 응답하세요."
                : "시스템 관리자가 기획안을 작성하면 여기에 표시됩니다."
              }
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlanDataRenderer 
        plan={selectedPlan} 
        renderFieldWithFeedback={renderFieldWithFeedback}
        editingField={editingField}
        editingValue={editingValue}
        setEditingValue={setEditingValue}
        onStartEdit={onStartEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
      />
      
      {selectedPlan.revisions && selectedPlan.revisions.length > 0 && (
        <ContentRevisionTimeline revisions={selectedPlan.revisions} />
      )}
    </div>
  );
};

export default ContentPlanContent;
