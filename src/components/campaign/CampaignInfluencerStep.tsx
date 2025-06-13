
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Sparkles } from 'lucide-react';
import { CampaignInfluencer, Persona } from '@/types/campaign';
import { CampaignFormData } from '@/hooks/useCampaignForm';

interface CampaignInfluencerStepProps {
  formData: CampaignFormData;
  isLoading: boolean;
  recommendedInfluencers: CampaignInfluencer[];
  personas: Persona[];
  handlePersonaRecommendation: () => void;
  handleAIRecommendation: () => void;
  handleInfluencerToggle: (influencerId: string) => void;
}

const CampaignInfluencerStep: React.FC<CampaignInfluencerStepProps> = ({
  formData,
  isLoading,
  recommendedInfluencers,
  personas,
  handlePersonaRecommendation,
  handleAIRecommendation,
  handleInfluencerToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>인플루언서 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button
            onClick={handlePersonaRecommendation}
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            <Users className="w-4 h-4 mr-2" />
            페르소나로 추천받기
          </Button>
          <Button
            onClick={handleAIRecommendation}
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 인플루언서 추천받기
          </Button>
        </div>

        {personas.length > 0 && (
          <div>
            <Label>발견된 페르소나</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {personas.map((persona) => (
                <Card key={persona.id} className="p-4">
                  <h4 className="font-medium">{persona.name}</h4>
                  <p className="text-sm text-muted-foreground">연령: {persona.age}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {persona.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {recommendedInfluencers.length > 0 && (
          <div>
            <Label>추천 인플루언서</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {recommendedInfluencers.map((influencer) => (
                <Card 
                  key={influencer.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    formData.selectedInfluencers.includes(influencer.id) 
                      ? 'border-green-500 bg-green-50' 
                      : ''
                  }`}
                  onClick={() => handleInfluencerToggle(influencer.id)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={influencer.profileImage}
                      alt={influencer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{influencer.name}</h4>
                      <p className="text-sm text-muted-foreground">{influencer.category}</p>
                      <p className="text-xs text-muted-foreground">
                        팔로워: {influencer.followers.toLocaleString()}명 | 
                        참여율: {influencer.engagementRate}%
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.selectedInfluencers.includes(influencer.id)}
                      onChange={() => {}} // onClick으로 처리
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {formData.selectedInfluencers.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              {formData.selectedInfluencers.length}명의 인플루언서가 선택되었습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignInfluencerStep;
