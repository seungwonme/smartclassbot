
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';

interface PlanDataRendererProps {
  plan: ContentPlanDetail;
  renderFieldWithFeedback: any;
  // 편집 관련 props 추가
  editingField?: string | null;
  editingValue?: any;
  setEditingValue?: (value: any) => void;
  onStartEdit?: (planId: string, fieldName: string, currentValue: any) => void;
  onSaveEdit?: (planId: string, fieldName: string) => void;
  onCancelEdit?: () => void;
}

const PlanDataRenderer: React.FC<PlanDataRendererProps> = ({
  plan,
  renderFieldWithFeedback
}) => {
  const isImagePlan = plan.contentType === 'image';
  const planData = plan.planData as ImagePlanData | VideoPlanData;

  return (
    <div className="space-y-6">
      {/* 게시물 제목 */}
      {renderFieldWithFeedback(
        plan,
        'postTitle',
        '게시물 제목',
        <div className="p-3 bg-gray-50 rounded border">
          <p className="text-sm">{planData.postTitle}</p>
        </div>,
        true,
        'text',
        planData.postTitle
      )}

      {/* 이미지 기획 전용 필드 */}
      {isImagePlan && (
        <>
          {renderFieldWithFeedback(
            plan,
            'thumbnailTitle',
            '썸네일 제목',
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm">{(planData as ImagePlanData).thumbnailTitle}</p>
            </div>,
            true,
            'text',
            (planData as ImagePlanData).thumbnailTitle
          )}

          {renderFieldWithFeedback(
            plan,
            'referenceImages',
            '참고 이미지',
            <div className="p-3 bg-gray-50 rounded border">
              <div className="space-y-2">
                {(planData as ImagePlanData).referenceImages?.map((image, index) => (
                  <div key={index} className="text-sm text-blue-600 underline">
                    {image}
                  </div>
                )) || <p className="text-sm text-gray-500">참고 이미지가 없습니다.</p>}
              </div>
            </div>,
            true,
            'array',
            (planData as ImagePlanData).referenceImages
          )}
        </>
      )}

      {/* 영상 기획 전용 필드 */}
      {!isImagePlan && (
        <>
          {renderFieldWithFeedback(
            plan,
            'scenario',
            '시나리오',
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm whitespace-pre-wrap">{(planData as VideoPlanData).scenario}</p>
            </div>,
            true,
            'textarea',
            (planData as VideoPlanData).scenario
          )}

          {renderFieldWithFeedback(
            plan,
            'scenarioFiles',
            '시나리오 파일',
            <div className="p-3 bg-gray-50 rounded border">
              <div className="space-y-2">
                {(planData as VideoPlanData).scenarioFiles?.map((file, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-gray-500 ml-2">({file.type})</span>
                  </div>
                )) || <p className="text-sm text-gray-500">시나리오 파일이 없습니다.</p>}
              </div>
            </div>,
            false // 파일은 편집 불가
          )}
        </>
      )}

      {/* 공통 필드 */}
      {renderFieldWithFeedback(
        plan,
        'script',
        '스크립트',
        <div className="p-3 bg-gray-50 rounded border">
          <p className="text-sm whitespace-pre-wrap">{planData.script}</p>
        </div>,
        true,
        'textarea',
        planData.script
      )}

      {renderFieldWithFeedback(
        plan,
        'hashtags',
        '해시태그',
        <div className="p-3 bg-gray-50 rounded border">
          <div className="flex flex-wrap gap-1">
            {planData.hashtags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            )) || <p className="text-sm text-gray-500">해시태그가 없습니다.</p>}
          </div>
        </div>,
        true,
        'array',
        planData.hashtags
      )}
    </div>
  );
};

export default PlanDataRenderer;
