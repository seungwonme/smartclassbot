
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentSubmission } from '@/types/contentSubmission';
import BrandContentReview from '@/components/content/BrandContentReview';

interface ContentReviewTabProps {
  contentSubmissions: ContentSubmission[];
  onApprove: (submissionId: string) => void;
  onRequestRevision: (submissionId: string, feedback: string) => void;
}

const ContentReviewTab: React.FC<ContentReviewTabProps> = ({
  contentSubmissions,
  onApprove,
  onRequestRevision
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>콘텐츠 검수 및 승인</CardTitle>
      </CardHeader>
      <CardContent>
        {contentSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">제출된 콘텐츠가 없습니다.</p>
            <p className="text-sm text-gray-400">콘텐츠 제작 탭에서 콘텐츠를 업로드하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <BrandContentReview
            submissions={contentSubmissions}
            onApprove={onApprove}
            onRequestRevision={onRequestRevision}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContentReviewTab;
