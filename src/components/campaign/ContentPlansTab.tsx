
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentPlanDetail } from '@/types/content';
import BrandContentPlanReview from '@/components/content/BrandContentPlanReview';

interface ContentPlansTabProps {
  contentPlans: ContentPlanDetail[];
  onApprove: (planId: string) => void;
  onRequestRevision: (planId: string, feedback: string) => void;
}

const ContentPlansTab: React.FC<ContentPlansTabProps> = ({
  contentPlans,
  onApprove,
  onRequestRevision
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>콘텐츠 기획안 검토</CardTitle>
      </CardHeader>
      <CardContent>
        {contentPlans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">등록된 콘텐츠 기획안이 없습니다.</p>
            <p className="text-sm text-gray-400">인플루언서가 콘텐츠 기획안을 제출하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <BrandContentPlanReview
            plans={contentPlans}
            onApprove={onApprove}
            onRequestRevision={onRequestRevision}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContentPlansTab;
