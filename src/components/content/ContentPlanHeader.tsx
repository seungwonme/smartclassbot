
import React from 'react';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';

interface ContentPlanHeaderProps {
  selectedPlan: ContentPlanDetail;
}

const ContentPlanHeader: React.FC<ContentPlanHeaderProps> = ({
  selectedPlan
}) => {
  return (
    <div className="flex items-center gap-2 pb-4 border-b">
      {selectedPlan.contentType === 'image' ? (
        <ImageIcon className="w-5 h-5" />
      ) : (
        <VideoIcon className="w-5 h-5" />
      )}
      <h3 className="text-lg font-medium">
        {selectedPlan.influencerName} - {selectedPlan.contentType === 'image' ? '이미지' : '영상'} 기획안
      </h3>
    </div>
  );
};

export default ContentPlanHeader;
