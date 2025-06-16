
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Video } from 'lucide-react';
import { ContentReviewDetail } from '@/types/content';
import ContentReviewActions from './ContentReviewActions';
import ContentReviewFeedbackSection from './ContentReviewFeedbackSection';
import ContentReviewTimeline from './ContentReviewTimeline';

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
    
    if (isBrandView) {
      onRequestRevision(selectedContent.id, revisionFeedback);
    } else if (isAdminView) {
      onSubmitRevision(selectedContent.id, revisionFeedback);
    }
    
    setRevisionFeedback('');
    setShowRevisionForm(false);
  };

  if (!selectedContent) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>좌측에서 인플루언서를 선택하여 콘텐츠를 확인하세요.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
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

      <CardContent className="h-full overflow-auto pb-32">
        <div className="space-y-6">
          {/* 콘텐츠 미리보기 */}
          <div>
            <h4 className="font-medium mb-3">업로드된 콘텐츠</h4>
            <div className="grid grid-cols-2 gap-4">
              {selectedContent.contentFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {file.type === 'image' ? (
                      <Image className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <video 
                      src={file.url}
                      className="w-full h-32 object-cover rounded"
                      controls
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 검수 히스토리 */}
          {selectedContent.reviewRevisions && selectedContent.reviewRevisions.length > 0 && (
            <ContentReviewTimeline revisions={selectedContent.reviewRevisions} />
          )}

          {/* 피드백 섹션 */}
          <ContentReviewFeedbackSection
            selectedContent={selectedContent}
            showRevisionForm={showRevisionForm}
            revisionFeedback={revisionFeedback}
            setRevisionFeedback={setRevisionFeedback}
            onSubmitFeedback={handleSubmitFeedback}
            onCancelRevision={() => {
              setShowRevisionForm(false);
              setRevisionFeedback('');
            }}
          />
        </div>
      </CardContent>

      {/* 액션 버튼 */}
      <ContentReviewActions
        selectedContent={selectedContent}
        onApprove={onApprove}
        onRequestRevision={() => setShowRevisionForm(true)}
        onSubmitRevision={handleSubmitFeedback}
        canReviewContent={canReviewContent}
        hasContentFiles={hasContentFiles}
        showRevisionForm={showRevisionForm}
      />
    </Card>
  );
};

export default ContentReviewDetailView;
