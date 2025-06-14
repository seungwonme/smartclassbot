
import React, { useState } from 'react';
import { CampaignInfluencer } from '@/types/campaign';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit } from 'lucide-react';

interface InfluencerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: CampaignInfluencer | null;
  onSave: (influencer: CampaignInfluencer, editData: EditFormData) => Promise<void>;
}

interface EditFormData {
  adFee: string;
  region: string;
  category: string;
}

const InfluencerEditModal: React.FC<InfluencerEditModalProps> = ({
  isOpen,
  onClose,
  influencer,
  onSave
}) => {
  const [editForm, setEditForm] = useState<EditFormData>({
    adFee: '',
    region: '',
    category: ''
  });

  React.useEffect(() => {
    if (influencer) {
      setEditForm({
        adFee: (influencer.adFee || influencer.proposedFee || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        region: influencer.region || '',
        category: influencer.category || ''
      });
    }
  }, [influencer]);

  const formatBudget = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAdFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBudget(e.target.value);
    setEditForm(prev => ({ ...prev, adFee: formatted }));
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handleSave = async () => {
    if (!influencer) return;
    
    try {
      await onSave(influencer, editForm);
      onClose();
    } catch (error) {
      console.error('인플루언서 수정 실패:', error);
    }
  };

  if (!influencer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            인플루언서 정보 수정
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
            <Avatar className="w-10 h-10">
              <AvatarImage src={influencer.profileImageUrl || influencer.profileImage} />
              <AvatarFallback>
                {influencer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{influencer.name}</div>
              <div className="text-sm text-gray-500">{formatFollowers(influencer.followers)} 팔로워</div>
            </div>
          </div>

          <div>
            <Label htmlFor="adFee">광고비 (원)</Label>
            <Input
              id="adFee"
              value={editForm.adFee}
              onChange={handleAdFeeChange}
              placeholder="5,000,000"
            />
          </div>

          <div>
            <Label htmlFor="region">지역</Label>
            <Input
              id="region"
              value={editForm.region}
              onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
              placeholder="서울"
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리</Label>
            <Input
              id="category"
              value={editForm.category}
              onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              placeholder="뷰티"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfluencerEditModal;
