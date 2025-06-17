
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';
import RevisionRequestForm from './RevisionRequestForm';
import ContentPlanHeader from './ContentPlanHeader';
import ContentPlanContent from './ContentPlanContent';
import ContentPlanFeedbackSection from './ContentPlanFeedbackSection';
import ContentPlanActions from './ContentPlanActions';

interface ContentPlanDetailViewProps {
  selectedPlan: ContentPlanDetail | null;
  showRevisionForm: boolean;
  inlineComments: any[];
  onApprove: (planId: string) => void;
  onRequestRevision: () => void;
  onSubmitRevision: (feedback: string) => void;
  onCancelRevision: () => void;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
  hasPlanContent: (plan: ContentPlanDetail) => boolean;
  renderFieldWithFeedback: any;
  plans: ContentPlanDetail[];
  isProcessing?: boolean;
  // 편집 관련 props 추가
  editingField?: string | null;
  editingValue?: any;
  setEditingValue?: (value: any) => void;
  onStartEdit?: (planId: string, fieldName: string, currentValue: any) => void;
  onSaveEdit?: (planId: string, fieldName: string) => void;
  onCancelEdit?: () => void;
  // 편집 완료 후 피드백 모드 관련 props 추가
  justEditedField?: string | null;
}

const ContentPlanDetailView: React.FC<ContentPlanDetailViewProps> = ({
  selectedPlan,
  showRevisionForm,
  inlineComments,
  onApprove,
  onRequestRevision,
  onSubmitRevision,
  onCancelRevision,
  canReviewPlan,
  hasPlanContent,
  renderFieldWithFeedback,
  plans,
  isProcessing = false,
  editingField,
  editingValue,
  setEditingValue,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  justEditedField
}) => {
  const [revisionFeedback, setRevisionFeedback] = React.useState('');

  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');

  const handleSubmitRevision = () => {
    if (!selectedPlan) return;

    const planComments = inlineComments.filter(comment => comment.planId === selectedPlan.id);
    let finalFeedback = revisionFeedback.trim();

    if (planComments.length > 0) {
      const commentsFeedback = planComments.map(comment => 
        `[${comment.fieldName}] ${comment.comment}`
      ).join('\n');
      
      finalFeedback = finalFeedback 
        ? `${finalFeedback}\n\n${commentsFeedback}`
        : commentsFeedback;
    }

    onSubmitRevision(finalFeedback);
    setRevisionFeedback('');
  };

  const renderContent = () => {
    // 전용 수정요청 폼 모드 (브랜드에서 처음 수정요청 시)
    if (showRevisionForm && selectedPlan && !justEditedField) {
      return (
        <div className="space-y-4">
          {/* 기존 인라인 코멘트 기반 피드백 섹션 */}
          {inlineComments.filter(c => c.planId === selectedPlan.id).length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2">필드별 수정 코멘트:</p>
              {inlineComments
                .filter(c => c.planId === selectedPlan.id)
                .map((comment, index) => (
                  <div key={index} className="text-sm text-blue-600 mb-1">
                    <strong>{comment.fieldName}:</strong> {comment.comment}
                  </div>
                ))}
            </div>
          )}
          
          <RevisionRequestForm
            revisionNumber={(selectedPlan.currentRevisionNumber || 0) + 1}
            onSubmit={onSubmitRevision}
            onCancel={onCancelRevision}
            requestType={isAdminView ? "admin-feedback" : "brand-request"}
            isProcessing={isProcessing}
          />
        </div>
      );
    }

    if (selectedPlan) {
      const savedComments = inlineComments.filter(c => c.planId === selectedPlan.id);
      const hasComments = savedComments.length > 0;
      const hasPendingRevision = selectedPlan.revisions?.some(rev => rev.status === 'pending');
      const hasJustEdited = justEditedField && justEditedField.startsWith(selectedPlan.id);

      return (
        <div className="space-y-6">
          <ContentPlanHeader selectedPlan={selectedPlan} />

          <ContentPlanContent
            selectedPlan={selectedPlan}
            plans={plans}
            renderFieldWithFeedback={renderFieldWithFeedback}
            editingField={editingField}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />

          <ContentPlanFeedbackSection
            selectedPlan={selectedPlan}
            savedComments={savedComments}
            hasComments={hasComments}
            hasPendingRevision={hasPendingRevision}
            hasJustEdited={hasJustEdited}
            revisionFeedback={revisionFeedback}
            setRevisionFeedback={setRevisionFeedback}
            onSubmitRevision={handleSubmitRevision}
            onCancelRevision={onCancelRevision}
            isProcessing={isProcessing}
          />

          {/* 하단 액션 버튼 */}
          {!showRevisionForm && !hasJustEdited && (
            <ContentPlanActions
              selectedPlan={selectedPlan}
              hasComments={hasComments}
              onApprove={onApprove}
              onRequestRevision={onRequestRevision}
              onSubmitRevision={handleSubmitRevision}
              canReviewPlan={canReviewPlan}
              hasPlanContent={hasPlanContent}
              isProcessing={isProcessing}
            />
          )}
        </div>
      );
    }

    return (
      <ContentPlanContent
        selectedPlan={null}
        plans={plans}
        renderFieldWithFeedback={renderFieldWithFeedback}
      />
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          콘텐츠 기획 상세
          {isProcessing && (
            <div className="ml-2 text-sm text-blue-600">처리중...</div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ContentPlanDetailView;
