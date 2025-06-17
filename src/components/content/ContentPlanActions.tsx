
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';

interface ContentPlanActionsProps {
  selectedPlan: ContentPlanDetail;
  hasComments: boolean;
  onApprove: (planId: string) => void;
  onRequestRevision: () => void;
  onSubmitRevision: () => void;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
  hasPlanContent: (plan: ContentPlanDetail) => boolean;
  isProcessing?: boolean;
}

const ContentPlanActions: React.FC<ContentPlanActionsProps> = ({
  selectedPlan,
  hasComments,
  onApprove,
  onRequestRevision,
  canReviewPlan,
  hasPlanContent,
  isProcessing = false
}) => {
  const isAdminView = window.location.pathname.includes('/admin/');
  const isBrandView = window.location.pathname.includes('/brand/');

  const hasPendingRevision = selectedPlan.revisions?.some(rev => rev.status === 'pending');

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-4">
        {/* 브랜드 관리자 버튼들 */}
        {isBrandView && canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
          <>
            <Button
              onClick={() => onApprove(selectedPlan.id)}
              className="bg-green-600 hover:bg-green-700 px-8"
              disabled={selectedPlan.status === 'approved' || isProcessing}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isProcessing ? '승인 처리중...' : '기획확정'}
            </Button>
            
            {selectedPlan.status !== 'approved' && (
              <Button
                variant="outline"
                onClick={onRequestRevision}
                className="px-8"
                disabled={isProcessing}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {isProcessing ? '처리중...' : `${(selectedPlan.currentRevisionNumber || 0) + 1}차 기획 수정요청`}
              </Button>
            )}
          </>
        )}

        {/* 시스템 관리자는 피드백 섹션에서 처리하므로 여기서는 버튼 표시하지 않음 */}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        {isBrandView 
          ? "콘텐츠 기획을 충분히 검토한 후 기획확정 또는 수정요청을 진행해주세요."
          : "브랜드의 수정요청에 대한 피드백을 작성해주세요."
        }
      </p>
    </div>
  );
};

export default ContentPlanActions;
