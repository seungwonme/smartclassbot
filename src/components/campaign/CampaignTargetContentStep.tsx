
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Sparkles } from 'lucide-react';
import { CAMPAIGN_CATEGORIES, INFLUENCER_IMPACTS } from '@/constants/campaign';
import { CampaignFormData } from '@/hooks/useCampaignForm';

interface CampaignTargetContentStepProps {
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  isPersonaBased?: boolean;
  personaData?: any;
  applyTargetContentPersonaData?: () => void;
}

const CampaignTargetContentStep: React.FC<CampaignTargetContentStepProps> = ({
  formData,
  setFormData,
  isPersonaBased = false,
  personaData,
  applyTargetContentPersonaData
}) => {
  const [customCategory, setCustomCategory] = useState('');

  // Apply persona data when entering this step
  useEffect(() => {
    if (isPersonaBased && personaData && applyTargetContentPersonaData) {
      console.log('🎯 타겟 콘텐츠 단계 진입 - 페르소나 데이터 적용');
      applyTargetContentPersonaData();
    }
  }, [isPersonaBased, personaData, applyTargetContentPersonaData]);

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
        <CardTitle className="flex items-center gap-2">
          타겟 콘텐츠 정보
          {isPersonaBased && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Users className="w-3 h-3 mr-1" />
              페르소나 기반
            </Badge>
          )}
        </CardTitle>
        {isPersonaBased && personaData && (
          <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="font-medium">페르소나 기반 스마트 추천</span>
            </div>
            <p>
              <strong>{personaData.persona?.name}</strong> 페르소나의 관심사와 광고 유형을 기반으로 
              타겟 콘텐츠 정보가 자동으로 설정되었습니다.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="flex items-center gap-2">
            인플루언서 카테고리 (다중선택 가능)
            {isPersonaBased && formData.targetContent.influencerCategories.length > 0 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                페르소나 관심사 기반
              </Badge>
            )}
          </Label>
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
          
          {isPersonaBased && formData.targetContent.influencerCategories.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              페르소나의 관심사를 기반으로 카테고리가 자동 선택되었습니다.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="targetAge" className="flex items-center gap-2">
            타겟 연령층
            {isPersonaBased && formData.targetContent.targetAge && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                페르소나 연령 기반
              </Badge>
            )}
          </Label>
          <Input
            id="targetAge"
            value={formData.targetContent.targetAge}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, targetAge: e.target.value }
            }))}
            placeholder="예: 20-35"
          />
          {isPersonaBased && formData.targetContent.targetAge && (
            <p className="text-xs text-green-600 mt-1">
              페르소나 연령 정보를 기반으로 자동 설정되었습니다.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="uspImportance" className="flex items-center gap-2">
            USP 중요도 (1-10)
            {isPersonaBased && formData.targetContent.uspImportance !== 5 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                광고 유형 기반
              </Badge>
            )}
          </Label>
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
          {isPersonaBased && formData.targetContent.uspImportance !== 5 && (
            <p className="text-xs text-green-600 mt-1">
              {formData.adType === 'branding' ? '브랜딩' : '라이브커머스'} 캠페인에 최적화된 값으로 설정되었습니다.
            </p>
          )}
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
          <Label htmlFor="additionalDescription" className="flex items-center gap-2">
            추가 설명
            {isPersonaBased && formData.targetContent.additionalDescription && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                자동 생성됨
              </Badge>
            )}
          </Label>
          <Textarea
            id="additionalDescription"
            value={formData.targetContent.additionalDescription}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              targetContent: { ...prev.targetContent, additionalDescription: e.target.value }
            }))}
            placeholder="캠페인에 대한 추가 설명을 입력하세요"
          />
          {isPersonaBased && formData.targetContent.additionalDescription && (
            <p className="text-xs text-green-600 mt-1">
              페르소나와 믹스 전략 정보를 기반으로 자동 생성된 설명입니다.
            </p>
          )}
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
