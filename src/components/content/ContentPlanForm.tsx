
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
  onContentUpdated?: () => void;
  disabled?: boolean;
}

const ContentPlanForm: React.FC<ContentPlanFormProps> = ({
  influencer,
  campaignId,
  existingPlan,
  onSave,
  onCancel,
  onContentUpdated,
  disabled = false
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

  // 수정 요청이 있는지 확인 (가장 최근 revision이 pending 상태인지)
  const hasPendingRevision = existingPlan?.revisions?.some(
    revision => revision.status === 'pending'
  );

  useEffect(() => {
    console.log('=== ContentPlanForm 데이터 로딩 ===');
    console.log('existingPlan:', existingPlan);
    console.log('hasPendingRevision:', hasPendingRevision);
    
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
  }, [existingPlan, hasPendingRevision]);

  const handleImageDataUpdate = (updates: Partial<ImagePlanData>) => {
    setImageData(prev => ({ ...prev, ...updates }));
    if (onContentUpdated) {
      onContentUpdated();
    }
  };

  const handleVideoDataUpdate = (updates: Partial<VideoPlanData>) => {
    setVideoData(prev => ({ ...prev, ...updates }));
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
    console.log('기존 기획안 존재 여부:', !!existingPlan);
    console.log('수정 요청 대기 중:', hasPendingRevision);
    
    const currentPlanData = contentType === 'image' ? imageData : videoData;
    console.log('저장할 planData:', currentPlanData);
    
    // 상태 결정 로직
    let newStatus: 'draft' | 'revision-feedback' = 'draft';
    let updatedRevisions = existingPlan?.revisions || [];
    
    if (hasPendingRevision && existingPlan) {
      console.log('🔄 수정 요청에 대한 응답 처리');
      newStatus = 'revision-feedback';
      
      // 가장 최근 pending revision을 completed로 변경
      updatedRevisions = existingPlan.revisions.map(revision => {
        if (revision.status === 'pending') {
          return {
            ...revision,
            status: 'completed' as const,
            response: '수정 요청사항을 반영하여 기획안을 업데이트했습니다.',
            respondedAt: new Date().toISOString(),
            respondedBy: '시스템 관리자'
          };
        }
        return revision;
      });
      
      console.log('🔄 업데이트된 revisions:', updatedRevisions);
    } else {
      console.log('🆕 최초 기획안 생성 또는 일반 수정');
    }
    
    const planData: Partial<ContentPlanDetail> = {
      campaignId,
      influencerId: influencer.id,
      influencerName: influencer.name,
      contentType,
      planData: currentPlanData,
      status: newStatus,
      revisions: updatedRevisions,
      currentRevisionNumber: existingPlan?.currentRevisionNumber || 0
    };
    
    console.log('최종 저장 데이터:', planData);
    console.log('상태:', newStatus);
    console.log('=== 기획안 저장 완료 ===');
    
    onSave(planData);
  };

  const currentHashtags = contentType === 'image' ? imageData.hashtags : videoData.hashtags;

  return (
    <div className="space-y-6">
      {/* 수정 요청 알림 표시 */}
      {hasPendingRevision && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">🔄 브랜드 관리자 수정 요청</h4>
          {existingPlan?.revisions
            ?.filter(revision => revision.status === 'pending')
            .map(revision => (
              <div key={revision.id} className="text-sm text-orange-700">
                <p><strong>요청일:</strong> {new Date(revision.requestedAt).toLocaleDateString()}</p>
                <p><strong>요청 내용:</strong> {revision.feedback}</p>
              </div>
            ))}
          <p className="text-sm text-orange-600 mt-2">
            💡 수정 요청사항을 반영한 후 저장하면 브랜드 관리자에게 피드백이 전달됩니다.
          </p>
        </div>
      )}

      {/* 콘텐츠 타입 선택 */}
      <div>
        <Label className="text-base font-medium mb-3 block">콘텐츠 타입</Label>
        <RadioGroup 
          value={contentType} 
          onValueChange={(value) => {
            console.log('콘텐츠 타입 변경:', value);
            setContentType(value as 'image' | 'video');
            if (onContentUpdated) {
              onContentUpdated();
            }
          }}
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" disabled={disabled} />
            <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              이미지 포스팅
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" disabled={disabled} />
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
        <Button variant="outline" onClick={onCancel} disabled={disabled}>
          취소
        </Button>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={disabled}>
          {hasPendingRevision ? '수정 완료' : '저장'}
        </Button>
      </div>
    </div>
  );
};

export default ContentPlanForm;
