
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { ContentReviewDetail } from '@/types/content';

interface ContentReviewFeedbackSectionProps {
  selectedContent: ContentReviewDetail;
  showRevisionForm: boolean;
  revisionFeedback: string;
  setRevisionFeedback: (value: string) => void;
  onSubmitFeedback: () => void;
  onCancelRevision: () => void;
}

const ContentReviewFeedbackSection: React.FC<ContentReviewFeedbackSectionProps> = ({
  selectedContent,
  showRevisionForm,
  revisionFeedback,
  setRevisionFeedback,
  onSubmitFeedback,
  onCancelRevision
}) => {
  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  const hasPendingRevision = selectedContent.reviewRevisions?.some(rev => rev.status === 'pending');

  // 브랜드 관리자용: 수정요청 작성 폼
  if (isBrandView && showRevisionForm) {
    return (
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <h4 className="font-medium text-orange-800">
            {(selectedContent.currentReviewRevision || 0) + 1}차 검수 수정요청
          </h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revision-feedback" className="text-sm font-medium">
            수정요청 내용
          </Label>
          <Textarea
            id="revision-feedback"
            value={revisionFeedback}
            onChange={(e) => setRevisionFeedback(e.target.value)}
            placeholder="콘텐츠에 대한 수정요청 사항을 구체적으로 작성해주세요..."
            rows={4}
            className="text-sm"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={onSubmitFeedback}
            className="bg-orange-600 hover:bg-orange-700"
            disabled={!revisionFeedback.trim()}
          >
            수정요청 전송
          </Button>
          <Button
            variant="outline"
            onClick={onCancelRevision}
          >
            취소
          </Button>
        </div>
      </div>
    );
  }

  // 시스템 관리자용: 수정 피드백 폼 (pending revision이 있을 때)
  if (isAdminView && hasPendingRevision && showRevisionForm) {
    const pendingRevision = selectedContent.reviewRevisions?.find(rev => rev.status === 'pending');
    
    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-800">
            {selectedContent.currentReviewRevision}차 검수 피드백
          </h4>
        </div>
        
        {pendingRevision && (
          <div className="mb-3 p-2 bg-white rounded border">
            <p className="text-sm font-medium text-gray-700 mb-2">브랜드의 수정요청:</p>
            <div className="text-sm text-gray-600">
              {pendingRevision.feedback}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="revision-response" className="text-sm font-medium">
            수정 완료 피드백
          </Label>
          <Textarea
            id="revision-response"
            value={revisionFeedback}
            onChange={(e) => setRevisionFeedback(e.target.value)}
            placeholder="수정 완료된 내용에 대한 피드백을 작성해주세요..."
            rows={3}
            className="text-sm"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={onSubmitFeedback}
            className="bg-blue-600 hover:bg-blue-700"
          >
            피드백 전송
          </Button>
          <Button
            variant="outline"
            onClick={onCancelRevision}
          >
            취소
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ContentReviewFeedbackSection;
