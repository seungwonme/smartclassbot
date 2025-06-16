
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Video } from 'lucide-react';
import { ContentReviewDetail } from '@/types/content';
import ContentReviewActions from './ContentReviewActions';
import ContentReviewFeedbackSection from './ContentReviewFeedbackSection';
import ContentReviewTimeline from './ContentReviewTimeline';
import MediaPreview from './MediaPreview';

interface ContentReviewDetailViewProps {
  selectedContent: ContentReviewDetail | null;
  onApprove: (contentId: string) => void;
  onRequestRevision: (contentId: string, feedback: string) => void;
  onSubmitRevision: (contentId: string, response: string) => void;
  showRevisionForm: boolean;
  setShowRevisionForm: (show: boolean) => void;
}

const ContentReviewDetailView: React.FC<ContentReviewDetailViewProps> = ({
  selectedContent,
  onApprove,
  onRequestRevision,
  onSubmitRevision,
  showRevisionForm,
  setShowRevisionForm
}) => {
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'revision-requested': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return '검수 대기중';
      case 'under-review': return '검수중';
      case 'revision-requested': return '수정요청';
      case 'approved': return '승인완료';
      default: return status;
    }
  };

  const canReviewContent = (content: ContentReviewDetail) => {
    return content.reviewStatus === 'submitted' || content.reviewStatus === 'revision-requested' || content.reviewStatus === 'under-review';
  };

  const hasContentFiles = (content: ContentReviewDetail) => {
    return content.contentFiles && content.contentFiles.length > 0;
  };

  const handleSubmitFeedback = () => {
    if (!selectedContent) return;
    
    // 업로드된 파일이 있는지 확인
    const uploadedFiles = (window as any).uploadedContentFiles || [];
    
    if (isBrandView) {
      onRequestRevision(selectedContent.id, revisionFeedback);
    } else if (isAdminView) {
      // 시스템 관리자의 경우 업로드된 파일과 함께 피드백 전송
      if (uploadedFiles.length > 0) {
        // contentReview.service.ts의 submitContentRevision 함수 호출
        console.log('업로드된 파일과 함께 피드백 전송:', uploadedFiles);
        // TODO: 실제 서비스 호출 시 파일 정보 전달
      }
      onSubmitRevision(selectedContent.id, revisionFeedback);
    }
    
    setRevisionFeedback('');
    setShowRevisionForm(false);
    // 업로드된 파일 정보 초기화
    delete (window as any).uploadedContentFiles;
  };

  if (!selectedContent) {
    return (
      <div className="h-full flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>좌측에서 인플루언서를 선택하여 콘텐츠를 확인하세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // pending revision이 있는 시스템 관리자는 자동으로 피드백 폼 표시
  const shouldShowFeedbackForm = showRevisionForm || 
    (isAdminView && selectedContent.reviewRevisions?.some(rev => rev.status === 'pending'));

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center gap-2 pb-4 border-b">
            {selectedContent.contentType === 'image' ? (
              <Image className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
            <CardTitle className="text-lg font-medium">
              {selectedContent.influencerName} - {selectedContent.contentType === 'image' ? '이미지' : '영상'} 콘텐츠
            </CardTitle>
            <Badge className={getStatusColor(selectedContent.reviewStatus)}>
              {getStatusText(selectedContent.reviewStatus)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-6">
            {/* 콘텐츠 미리보기 */}
            <MediaPreview files={selectedContent.contentFiles} />

            {/* 검수 히스토리 */}
            {selectedContent.reviewRevisions && selectedContent.reviewRevisions.length > 0 && (
              <ContentReviewTimeline revisions={selectedContent.reviewRevisions} />
            )}

            {/* 피드백 섹션 */}
            <ContentReviewFeedbackSection
              selectedContent={selectedContent}
              showRevisionForm={shouldShowFeedbackForm}
              revisionFeedback={revisionFeedback}
              setRevisionFeedback={setRevisionFeedback}
              onSubmitFeedback={handleSubmitFeedback}
              onCancelRevision={() => {
                setShowRevisionForm(false);
                setRevisionFeedback('');
                delete (window as any).uploadedContentFiles;
              }}
            />
          </div>
        </CardContent>

        {/* 액션 버튼 - 브랜드 관리자만 표시 */}
        {isBrandView && (
          <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
            <ContentReviewActions
              selectedContent={selectedContent}
              onApprove={onApprove}
              onRequestRevision={() => setShowRevisionForm(true)}
              onSubmitRevision={handleSubmitFeedback}
              canReviewContent={canReviewContent}
              hasContentFiles={hasContentFiles}
              showRevisionForm={showRevisionForm}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContentReviewDetailView;
