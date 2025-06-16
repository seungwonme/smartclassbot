
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { ContentReviewDetail, ContentFile } from '@/types/content';
import AdminContentUploadForm from './AdminContentUploadForm';

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
  const [uploadedFiles, setUploadedFiles] = useState<ContentFile[]>([]);
  
  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  const hasPendingRevision = selectedContent.reviewRevisions?.some(rev => rev.status === 'pending');

  const handleSubmitWithFiles = () => {
    // 업로드된 파일이 있으면 onSubmitFeedback에 파일 정보 전달
    if (uploadedFiles.length > 0) {
      // 파일 정보를 전역 상태나 context에 저장하여 상위 컴포넌트에서 사용할 수 있도록 함
      (window as any).uploadedContentFiles = uploadedFiles;
    }
    onSubmitFeedback();
  };

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
  if (isAdminView && hasPendingRevision) {
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
          <div className="mb-4 p-3 bg-white rounded border">
            <p className="text-sm font-medium text-gray-700 mb-2">브랜드의 수정요청:</p>
            <div className="text-sm text-gray-600">
              {pendingRevision.feedback}
            </div>
          </div>
        )}

        {/* 수정된 콘텐츠 업로드 섹션 */}
        <div className="mb-4">
          <AdminContentUploadForm
            onFilesChange={setUploadedFiles}
            contentType={selectedContent.contentType}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revision-response" className="text-sm font-medium">
            수정 완료 피드백 (선택사항)
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
            onClick={handleSubmitWithFiles}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={uploadedFiles.length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            {selectedContent.currentReviewRevision}차 검수 피드백 전송
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
