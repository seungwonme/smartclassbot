
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquare, Send } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';

interface ContentPlanActionsProps {
  selectedPlan: ContentPlanDetail;
  hasComments: boolean;
  onApprove: (planId: string) => void;
  onRequestRevision: () => void;
  onSubmitRevision: () => void;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
  hasPlanContent: (plan: ContentPlanDetail) => boolean;
}

const ContentPlanActions: React.FC<ContentPlanActionsProps> = ({
  selectedPlan,
  hasComments,
  onApprove,
  onRequestRevision,
  onSubmitRevision,
  canReviewPlan,
  hasPlanContent
}) => {
  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  return (
    <div className="pt-6 border-t bg-gray-50 -mx-6 px-6 pb-4 rounded-b-lg">
      <div className="flex justify-center gap-4">
        {/* 브랜드 관리자만 승인 버튼 표시 */}
        {isBrandView && canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
          <Button
            onClick={() => onApprove(selectedPlan.id)}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            승인
          </Button>
        )}
        
        {/* 수정요청/피드백 버튼 */}
        {hasComments ? (
          <Button
            onClick={onSubmitRevision}
            className={isAdminView ? "bg-blue-600 hover:bg-blue-700 px-8" : "bg-orange-600 hover:bg-orange-700 px-8"}
          >
            <Send className="w-4 h-4 mr-2" />
            {isAdminView 
              ? `${(selectedPlan.currentRevisionNumber || 0)}차 수정피드백 전송`
              : `${(selectedPlan.currentRevisionNumber || 0) + 1}차 수정요청 전송`
            }
          </Button>
        ) : (
          canReviewPlan(selectedPlan) && (
            <Button
              variant="outline"
              onClick={onRequestRevision}
              className="px-8"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {isAdminView ? '수정피드백' : '수정코멘트'}
            </Button>
          )
        )}
      </div>
      <p className="text-xs text-gray-500 text-center mt-3">
        {hasComments 
          ? isAdminView 
            ? "저장된 코멘트와 함께 수정피드백을 전송해주세요."
            : "저장된 수정코멘트와 함께 수정요청을 전송하거나 승인을 진행해주세요."
          : isAdminView
            ? "기획안 내용을 충분히 검토한 후 피드백을 진행해주세요."
            : "기획안 내용을 충분히 검토한 후 승인 또는 수정코멘트를 진행해주세요."
        }
      </p>
    </div>
  );
};

export default ContentPlanActions;
