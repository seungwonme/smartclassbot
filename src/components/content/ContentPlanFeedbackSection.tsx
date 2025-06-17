
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Edit, MessageSquare } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';

interface ContentPlanFeedbackSectionProps {
  selectedPlan: ContentPlanDetail;
  savedComments: any[];
  hasComments: boolean;
  hasPendingRevision: boolean;
  hasJustEdited: boolean;
  revisionFeedback: string;
  setRevisionFeedback: (value: string) => void;
  onSubmitRevision: () => void;
  onCancelRevision: () => void;
  isProcessing?: boolean;
}

const ContentPlanFeedbackSection: React.FC<ContentPlanFeedbackSectionProps> = ({
  selectedPlan,
  savedComments,
  hasComments,
  hasPendingRevision,
  hasJustEdited,
  revisionFeedback,
  setRevisionFeedback,
  onSubmitRevision,
  onCancelRevision,
  isProcessing = false
}) => {
  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  // 편집 완료 후 자동 표시되는 피드백 섹션
  if (hasJustEdited) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Edit className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-800">
            {(selectedPlan.currentRevisionNumber || 0)}차 수정피드백
          </h4>
        </div>
        
        <div className="mb-3 p-2 bg-white rounded border">
          <p className="text-sm font-medium text-gray-700 mb-2">방금 수정한 필드:</p>
          <div className="text-sm text-blue-600">
            방금 필드가 수정되었습니다.
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="auto-revision-feedback" className="text-sm font-medium">
            수정피드백 내용
          </Label>
          <Textarea
            id="auto-revision-feedback"
            value={revisionFeedback}
            onChange={(e) => setRevisionFeedback(e.target.value)}
            placeholder="수정한 내용에 대한 피드백을 작성해주세요..."
            rows={3}
            className="text-sm"
            disabled={isProcessing}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={onSubmitRevision}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
          >
            <Send className="w-4 h-4 mr-2" />
            {isProcessing ? '전송 중...' : `${(selectedPlan.currentRevisionNumber || 0)}차 피드백 전송`}
          </Button>
          <Button
            variant="outline"
            onClick={onCancelRevision}
            disabled={isProcessing}
          >
            취소
          </Button>
        </div>
      </div>
    );
  }

  // 시스템 관리자용: 수정피드백 섹션
  if (isAdminView && hasComments && hasPendingRevision) {
    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-800">
            {(selectedPlan.currentRevisionNumber || 0)}차 수정피드백
          </h4>
        </div>
        
        <div className="mb-3 p-2 bg-white rounded border">
          <p className="text-sm font-medium text-gray-700 mb-2">저장된 필드별 코멘트:</p>
          {savedComments.map((comment, index) => (
            <div key={index} className="text-sm text-gray-600 mb-1">
              <strong>{comment.fieldName}:</strong> {comment.comment}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="revision-feedback" className="text-sm font-medium">
            전체 수정피드백 내용 (선택사항)
          </Label>
          <Textarea
            id="revision-feedback"
            value={revisionFeedback}
            onChange={(e) => setRevisionFeedback(e.target.value)}
            placeholder="필드별 코멘트 외에 추가적인 피드백이 있다면 작성해주세요..."
            rows={3}
            className="text-sm"
            disabled={isProcessing}
          />
        </div>
      </div>
    );
  }

  // 브랜드 관리자용: N차 수정요청 섹션
  if (isBrandView && hasComments) {
    return (
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <h4 className="font-medium text-orange-800">
            {(selectedPlan.currentRevisionNumber || 0) + 1}차 수정요청
          </h4>
        </div>
        
        <div className="mb-3 p-2 bg-white rounded border">
          <p className="text-sm font-medium text-gray-700 mb-2">저장된 필드별 수정코멘트:</p>
          {savedComments.map((comment, index) => (
            <div key={index} className="text-sm text-gray-600 mb-1">
              <strong>{comment.fieldName}:</strong> {comment.comment}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="revision-feedback" className="text-sm font-medium">
            전체 수정요청 내용 (선택사항)
          </Label>
          <Textarea
            id="revision-feedback"
            value={revisionFeedback}
            onChange={(e) => setRevisionFeedback(e.target.value)}
            placeholder="필드별 수정코멘트 외에 추가적인 수정요청 사항이 있다면 작성해주세요..."
            rows={3}
            className="text-sm"
            disabled={isProcessing}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default ContentPlanFeedbackSection;
