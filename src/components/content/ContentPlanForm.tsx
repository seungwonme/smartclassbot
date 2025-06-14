
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ImageIcon, VideoIcon, X, Plus, Upload } from 'lucide-react';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';
import { CampaignInfluencer } from '@/types/campaign';

interface ContentPlanFormProps {
  influencer: CampaignInfluencer;
  campaignId: string;
  existingPlan?: ContentPlanDetail;
  onSave: (planData: Partial<ContentPlanDetail>) => void;
  onCancel: () => void;
}

const ContentPlanForm: React.FC<ContentPlanFormProps> = ({
  influencer,
  campaignId,
  existingPlan,
  onSave,
  onCancel
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
    script: '',
    hashtags: []
  });
  const [hashtagInput, setHashtagInput] = useState('');

  useEffect(() => {
    if (existingPlan) {
      setContentType(existingPlan.contentType);
      if (existingPlan.contentType === 'image') {
        setImageData(existingPlan.planData as ImagePlanData);
      } else {
        setVideoData(existingPlan.planData as VideoPlanData);
      }
    }
  }, [existingPlan]);

  const addHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
      if (contentType === 'image') {
        setImageData(prev => ({
          ...prev,
          hashtags: [...prev.hashtags, tag]
        }));
      } else {
        setVideoData(prev => ({
          ...prev,
          hashtags: [...prev.hashtags, tag]
        }));
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (index: number) => {
    if (contentType === 'image') {
      setImageData(prev => ({
        ...prev,
        hashtags: prev.hashtags.filter((_, i) => i !== index)
      }));
    } else {
      setVideoData(prev => ({
        ...prev,
        hashtags: prev.hashtags.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImageData(prev => ({
            ...prev,
            referenceImages: [...prev.referenceImages, result]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageData(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const planData: Partial<ContentPlanDetail> = {
      campaignId,
      influencerId: influencer.id,
      influencerName: influencer.name,
      contentType,
      planData: contentType === 'image' ? imageData : videoData,
      status: 'draft'
    };
    onSave(planData);
  };

  const currentHashtags = contentType === 'image' ? imageData.hashtags : videoData.hashtags;

  return (
    <div className="space-y-6">
      {/* 콘텐츠 타입 선택 */}
      <div>
        <Label className="text-base font-medium mb-3 block">콘텐츠 타입</Label>
        <RadioGroup value={contentType} onValueChange={(value) => setContentType(value as 'image' | 'video')}>
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

      {/* 이미지 포스팅 필드 */}
      {contentType === 'image' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="postTitle">포스팅 제목</Label>
            <Input
              id="postTitle"
              value={imageData.postTitle}
              onChange={(e) => setImageData(prev => ({ ...prev, postTitle: e.target.value }))}
              placeholder="포스팅 제목을 입력하세요"
            />
          </div>

          <div>
            <Label htmlFor="thumbnailTitle">썸네일 제목</Label>
            <Input
              id="thumbnailTitle"
              value={imageData.thumbnailTitle}
              onChange={(e) => setImageData(prev => ({ ...prev, thumbnailTitle: e.target.value }))}
              placeholder="썸네일 제목을 입력하세요"
            />
          </div>

          <div>
            <Label>Reference 이미지</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="reference-images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                  </div>
                  <input
                    id="reference-images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {imageData.referenceImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imageData.referenceImages.map((image, index) => (
                    <div key={index} className="relative border rounded p-2">
                      <img src={image} alt={`Reference ${index + 1}`} className="w-full h-20 object-cover rounded mb-2" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="script">스크립트</Label>
            <Textarea
              id="script"
              value={imageData.script}
              onChange={(e) => setImageData(prev => ({ ...prev, script: e.target.value }))}
              placeholder="콘텐츠 스크립트를 입력하세요"
              rows={6}
            />
          </div>
        </div>
      )}

      {/* 영상 포스팅 필드 */}
      {contentType === 'video' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="postTitle">포스팅 제목</Label>
            <Input
              id="postTitle"
              value={videoData.postTitle}
              onChange={(e) => setVideoData(prev => ({ ...prev, postTitle: e.target.value }))}
              placeholder="포스팅 제목을 입력하세요"
            />
          </div>

          <div>
            <Label htmlFor="scenario">시나리오</Label>
            <Textarea
              id="scenario"
              value={videoData.scenario}
              onChange={(e) => setVideoData(prev => ({ ...prev, scenario: e.target.value }))}
              placeholder="영상 시나리오를 입력하세요"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="script">스크립트</Label>
            <Textarea
              id="script"
              value={videoData.script}
              onChange={(e) => setVideoData(prev => ({ ...prev, script: e.target.value }))}
              placeholder="콘텐츠 스크립트를 입력하세요"
              rows={6}
            />
          </div>
        </div>
      )}

      {/* 해시태그 공통 */}
      <div>
        <Label>해시태그</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            placeholder="#해시태그를 입력하세요"
            onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
          />
          <Button type="button" onClick={addHashtag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {currentHashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {currentHashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="w-3 h-3 cursor-pointer" onClick={() => removeHashtag(index)} />
              </Badge>
            ))}
          </div>
        )}
      </div>

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
