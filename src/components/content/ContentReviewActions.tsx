
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { ContentReviewDetail } from '@/types/content';

interface ContentReviewActionsProps {
  selectedContent: ContentReviewDetail;
  onApprove: (contentId: string) => void;
  onRequestRevision: () => void;
  onSubmitRevision: () => void;
  canReviewContent: (content: ContentReviewDetail) => boolean;
  hasContentFiles: (content: ContentReviewDetail) => boolean;
  showRevisionForm: boolean;
}

const ContentReviewActions: React.FC<ContentReviewActionsProps> = ({
  selectedContent,
  onApprove,
  onRequestRevision,
  canReviewContent,
  hasContentFiles,
  showRevisionForm
}) => {
  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  const hasPendingRevision = selectedContent.reviewRevisions?.some(rev => rev.status === 'pending');

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-4">
        {/* 브랜드 관리자 버튼들 */}
        {isBrandView && canReviewContent(selectedContent) && hasContentFiles(selectedContent) && (
          <>
            <Button
              onClick={() => onApprove(selectedContent.id)}
              className="bg-green-600 hover:bg-green-700 px-8"
              disabled={selectedContent.reviewStatus === 'approved'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              검수확정
            </Button>
            
            {!showRevisionForm && selectedContent.reviewStatus !== 'approved' && (
              <Button
                variant="outline"
                onClick={onRequestRevision}
                className="px-8"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {(selectedContent.currentReviewRevision || 0) + 1}차 검수 수정요청
              </Button>
            )}
          </>
        )}

        {/* 시스템 관리자는 피드백 섹션에서 처리하므로 여기서는 버튼 표시하지 않음 */}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        {isBrandView 
          ? "콘텐츠를 충분히 검토한 후 검수확정 또는 수정요청을 진행해주세요."
          : "브랜드의 수정요청에 대한 피드백을 작성해주세요."
        }
      </p>
    </div>
  );
};

export default ContentReviewActions;
