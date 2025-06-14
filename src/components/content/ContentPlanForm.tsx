
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';
import { CampaignInfluencer } from '@/types/campaign';
import ImagePlanForm from './ImagePlanForm';
import VideoPlanForm from './VideoPlanForm';
import HashtagInput from './HashtagInput';

interface ContentPlanFormProps {
  influencer: CampaignInfluencer;
  campaignId: string;
  existingPlan?: ContentPlanDetail;
  onSave: (planData: Partial<ContentPlanDetail>) => void;
  onCancel: () => void;
  onContentUpdated?: () => void; // 새로운 콜백 추가
}

const ContentPlanForm: React.FC<ContentPlanFormProps> = ({
  influencer,
  campaignId,
  existingPlan,
  onSave,
  onCancel,
  onContentUpdated
}) => {
  const [contentType, setContentType] = useState<'image' | 'video'>(
    existingPlan?.contentType || 'image'
  );
  const [imageData, setImageData] = useState<ImagePlanData>({
    postTitle: '',
    thumbnailTitle: '',
    referenceImages: [],
    script: '',
    hashtags: []
  });
  const [videoData, setVideoData] = useState<VideoPlanData>({
    postTitle: '',
    scenario: '',
    scenarioFiles: [],
    script: '',
    hashtags: []
  });

  useEffect(() => {
    console.log('=== ContentPlanForm 데이터 로딩 ===');
    console.log('existingPlan:', existingPlan);
    
    if (existingPlan) {
      console.log('기존 기획안 데이터 복원 시작');
      console.log('contentType:', existingPlan.contentType);
      console.log('planData:', existingPlan.planData);
      
      setContentType(existingPlan.contentType);
      
      if (existingPlan.contentType === 'image') {
        const imagePlan = existingPlan.planData as ImagePlanData;
        console.log('이미지 기획안 데이터:', imagePlan);
        
        setImageData({
          postTitle: imagePlan.postTitle || '',
          thumbnailTitle: imagePlan.thumbnailTitle || '',
          referenceImages: imagePlan.referenceImages || [],
          script: imagePlan.script || '',
          hashtags: imagePlan.hashtags || []
        });
        
        console.log('복원된 이미지 데이터:', {
          postTitle: imagePlan.postTitle,
          thumbnailTitle: imagePlan.thumbnailTitle,
          referenceImages: imagePlan.referenceImages?.length || 0,
          script: imagePlan.script,
          hashtags: imagePlan.hashtags?.length || 0
        });
      } else {
        const videoPlan = existingPlan.planData as VideoPlanData;
        console.log('영상 기획안 데이터:', videoPlan);
        
        setVideoData({
          postTitle: videoPlan.postTitle || '',
          scenario: videoPlan.scenario || '',
          scenarioFiles: videoPlan.scenarioFiles || [],
          script: videoPlan.script || '',
          hashtags: videoPlan.hashtags || []
        });
        
        console.log('복원된 영상 데이터:', {
          postTitle: videoPlan.postTitle,
          scenario: videoPlan.scenario,
          scenarioFiles: videoPlan.scenarioFiles?.length || 0,
          script: videoPlan.script,
          hashtags: videoPlan.hashtags?.length || 0
        });
      }
    } else {
      console.log('새 기획안 작성 - 초기값 설정');
    }
  }, [existingPlan]);

  const handleImageDataUpdate = (updates: Partial<ImagePlanData>) => {
    setImageData(prev => ({ ...prev, ...updates }));
    // 콘텐츠가 수정되었음을 알림
    if (onContentUpdated) {
      onContentUpdated();
    }
  };

  const handleVideoDataUpdate = (updates: Partial<VideoPlanData>) => {
    setVideoData(prev => ({ ...prev, ...updates }));
    // 콘텐츠가 수정되었음을 알림
    if (onContentUpdated) {
      onContentUpdated();
    }
  };

  const handleHashtagUpdate = (hashtags: string[]) => {
    if (contentType === 'image') {
      handleImageDataUpdate({ hashtags });
    } else {
      handleVideoDataUpdate({ hashtags });
    }
  };

  const handleSave = () => {
    console.log('=== 기획안 저장 시작 ===');
    console.log('contentType:', contentType);
    console.log('현재 imageData:', imageData);
    console.log('현재 videoData:', videoData);
    
    const currentPlanData = contentType === 'image' ? imageData : videoData;
    console.log('저장할 planData:', currentPlanData);
    
    const planData: Partial<ContentPlanDetail> = {
      campaignId,
      influencerId: influencer.id,
      influencerName: influencer.name,
      contentType,
      planData: currentPlanData,
      status: 'draft'
    };
    
    console.log('최종 저장 데이터:', planData);
    onSave(planData);
  };

  const currentHashtags = contentType === 'image' ? imageData.hashtags : videoData.hashtags;

  return (
    <div className="space-y-6">
      {/* 콘텐츠 타입 선택 */}
      <div>
        <Label className="text-base font-medium mb-3 block">콘텐츠 타입</Label>
        <RadioGroup value={contentType} onValueChange={(value) => {
          console.log('콘텐츠 타입 변경:', value);
          setContentType(value as 'image' | 'video');
          // 타입 변경도 콘텐츠 수정으로 간주
          if (onContentUpdated) {
            onContentUpdated();
          }
        }}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" />
            <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              이미지 포스팅
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
              <VideoIcon className="w-4 h-4" />
              영상 포스팅
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 콘텐츠 타입별 폼 */}
      {contentType === 'image' ? (
        <ImagePlanForm 
          imageData={imageData}
          onUpdate={handleImageDataUpdate}
        />
      ) : (
        <VideoPlanForm
          videoData={videoData}
          onUpdate={handleVideoDataUpdate}
        />
      )}

      {/* 해시태그 입력 */}
      <HashtagInput
        hashtags={currentHashtags}
        onUpdate={handleHashtagUpdate}
      />

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          저장
        </Button>
      </div>
    </div>
  );
};

export default ContentPlanForm;
