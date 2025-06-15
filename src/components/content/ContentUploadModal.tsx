
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import ContentUploadForm from './ContentUploadForm';

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: CampaignInfluencer | null;
  campaignId: string;
  onUploadComplete: (submissionData: Partial<ContentSubmission>) => void;
  existingSubmission?: ContentSubmission;
}

const ContentUploadModal: React.FC<ContentUploadModalProps> = ({
  isOpen,
  onClose,
  influencer,
  campaignId,
  onUploadComplete,
  existingSubmission
}) => {
  const [selectedContentType, setSelectedContentType] = useState<'image' | 'video'>(
    existingSubmission?.contentType || 'image'
  );
  const [showUploadForm, setShowUploadForm] = useState(false);

  if (!influencer) return null;

  const handleContentTypeSelect = () => {
    setShowUploadForm(true);
  };

  const handleUploadComplete = (submissionData: Partial<ContentSubmission>) => {
    const finalSubmissionData = {
      ...submissionData,
      contentType: selectedContentType
    };
    onUploadComplete(finalSubmissionData);
  };

  const handleCancel = () => {
    setShowUploadForm(false);
    setSelectedContentType(existingSubmission?.contentType || 'image');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            콘텐츠 업로드 - {influencer.name}
          </DialogTitle>
        </DialogHeader>

        {!showUploadForm ? (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">콘텐츠 타입을 선택해주세요</Label>
              <RadioGroup
                value={selectedContentType}
                onValueChange={(value) => setSelectedContentType(value as 'image' | 'video')}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">이미지 콘텐츠</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">영상 콘텐츠</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleContentTypeSelect}>
                다음 단계로
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <ContentUploadForm
            influencer={{
              id: influencer.id,
              name: influencer.name,
              category: influencer.category
            }}
            campaignId={campaignId}
            contentType={selectedContentType}
            existingSubmission={existingSubmission}
            onSubmit={handleUploadComplete}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContentUploadModal;
