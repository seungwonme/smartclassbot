
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BrandContentPlanReview from '@/components/content/BrandContentPlanReview';
import { ContentPlanDetail } from '@/types/content';
import { CampaignInfluencer } from '@/types/campaign';

interface CampaignPlanningTabProps {
  contentPlans: ContentPlanDetail[];
  confirmedInfluencers: CampaignInfluencer[];
  isContentLoading: boolean;
  onApprove: (planId: string) => void;
  onRequestRevision: (planId: string, feedback: string) => void;
  onDebugStorage: () => void;
}

const CampaignPlanningTab: React.FC<CampaignPlanningTabProps> = ({
  contentPlans,
  confirmedInfluencers,
  isContentLoading,
  onApprove,
  onRequestRevision,
  onDebugStorage
}) => {
  if (isContentLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-lg">콘텐츠 기획안을 불러오는 중...</div>
          <p className="text-sm text-gray-500 mt-2">데이터를 동기화하고 있습니다.</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 현재 {contentPlans.length}개의 기획안이 로딩되었습니다. 
          {contentPlans.length === 0 && " 시스템 관리자가 기획안을 작성하면 여기에 표시됩니다."}
        </p>
        <button 
          onClick={onDebugStorage}
          className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
        >
          🔍 스토리지 상태 확인
        </button>
      </div>
      <BrandContentPlanReview
        plans={contentPlans}
        confirmedInfluencers={confirmedInfluencers}
        onApprove={onApprove}
        onRequestRevision={onRequestRevision}
      />
    </div>
  );
};

export default CampaignPlanningTab;
