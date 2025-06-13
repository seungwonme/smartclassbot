
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CAMPAIGN_CATEGORIES, INFLUENCER_IMPACTS } from '@/constants/campaign';
import { CampaignFormData } from '@/hooks/useCampaignForm';

interface CampaignTargetContentStepProps {
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
}

const CampaignTargetContentStep: React.FC<CampaignTargetContentStepProps> = ({
  formData,
  setFormData
}) => {
  const [customCategory, setCustomCategory] = useState('');

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      targetContent: {
        ...prev.targetContent,
        influencerCategories: prev.targetContent.influencerCategories.includes(category)
          ? prev.targetContent.influencerCategories.filter(c => c !== category)
          : [...prev.targetContent.influencerCategories, category]
      }
    }));
  };

  const handleCustomCategoryAdd = () => {
    if (customCategory.trim() && !formData.targetContent.influencerCategories.includes(customCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        targetContent: {
          ...prev.targetContent,
          influencerCategories: [...prev.targetContent.influencerCategories, customCategory.trim()]
        }
      }));
      setCustomCategory('');
    }
  };

  const handleCustomCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomCategoryAdd();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>타겟 콘텐츠 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>인플루언서 카테고리 (다중선택 가능)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CAMPAIGN_CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={formData.targetContent.influencerCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          {formData.targetContent.influencerCategories.filter(cat => !CAMPAIGN_CATEGORIES.includes(cat)).length > 0 && (
            <div className="mt-2">
              <Label className="text-sm text-muted-foreground">추가된 카테고리:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.targetContent.influencerCategories
                  .filter(cat => !CAMPAIGN_CATEGORIES.includes(cat))
                  .map((category) => (
                    <Badge
                      key={category}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
          
          {formData.targetContent.influencerCategories.includes('기타') && (
            <div className="mt-3 space-y-2">
              <Label htmlFor="customCategory">기타 카테고리 입력</Label>
              <div className="flex gap-2">
                <Input
                  id="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyPress={handleCustomCategoryKeyPress}
                  placeholder="직접 입력하세요"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleCustomCategoryAdd}
                  disabled={!customCategory.trim()}
                  variant="outline"
                >
                  추가
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="targetAge">타겟 연령층</Label>
          <Input
            id="targetAge"
            value={formData.targetContent.targetAge}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, targetAge: e.target.value }
            }))}
            placeholder="예: 20-35"
          />
        </div>

        <div>
          <Label htmlFor="uspImportance">USP 중요도 (1-10)</Label>
          <Input
            id="uspImportance"
            type="number"
            min="1"
            max="10"
            value={formData.targetContent.uspImportance}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, uspImportance: parseInt(e.target.value) }
            }))}
          />
        </div>

        <div>
          <Label htmlFor="influencerImpact">인플루언서 영향력</Label>
          <Select
            value={formData.targetContent.influencerImpact}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, influencerImpact: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="영향력 범위를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {INFLUENCER_IMPACTS.map((impact) => (
                <SelectItem key={impact} value={impact}>{impact}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="additionalDescription">추가 설명</Label>
          <Textarea
            id="additionalDescription"
            value={formData.targetContent.additionalDescription}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, additionalDescription: e.target.value }
            }))}
            placeholder="캠페인에 대한 추가 설명을 입력하세요"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="secondaryContentUsage"
            checked={formData.targetContent.secondaryContentUsage}
            onCheckedChange={(checked) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, secondaryContentUsage: checked as boolean }
            }))}
          />
          <Label htmlFor="secondaryContentUsage">콘텐츠 2차 활용 동의</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTargetContentStep;
