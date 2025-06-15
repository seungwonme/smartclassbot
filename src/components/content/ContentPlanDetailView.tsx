
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquare, FileText, ImageIcon, VideoIcon } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';
import ContentRevisionTimeline from './ContentRevisionTimeline';
import RevisionRequestForm from './RevisionRequestForm';
import PlanDataRenderer from './PlanDataRenderer';

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
  plans
}) => {
  const renderContent = () => {
    if (showRevisionForm && selectedPlan) {
      return (
        <div className="space-y-4">
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
            requestType="brand-request"
          />
        </div>
      );
    }

    if (selectedPlan) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b">
            {selectedPlan.contentType === 'image' ? (
              <ImageIcon className="w-5 h-5" />
            ) : (
              <VideoIcon className="w-5 h-5" />
            )}
            <h3 className="text-lg font-medium">
              {selectedPlan.influencerName} - {selectedPlan.contentType === 'image' ? '이미지' : '영상'} 기획안
            </h3>
          </div>

          <PlanDataRenderer plan={selectedPlan} renderFieldWithFeedback={renderFieldWithFeedback} />
          
          {selectedPlan.revisions && selectedPlan.revisions.length > 0 && (
            <ContentRevisionTimeline revisions={selectedPlan.revisions} />
          )}

          {/* 승인/수정요청 버튼을 하단으로 이동 */}
          {!showRevisionForm && canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
            <div className="pt-6 border-t bg-gray-50 -mx-6 px-6 pb-4 rounded-b-lg">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => onApprove(selectedPlan.id)}
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인
                </Button>
                <Button
                  variant="outline"
                  onClick={onRequestRevision}
                  className="px-8"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  수정요청
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                기획안 내용을 충분히 검토한 후 승인 또는 수정요청을 진행해주세요.
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>좌측에서 인플루언서를 선택하여 기획안을 확인하세요.</p>
          {plans.length === 0 && (
            <p className="text-sm mt-2">시스템 관리자가 기획안을 작성하면 여기에 표시됩니다.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          콘텐츠 기획 상세
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ContentPlanDetailView;
