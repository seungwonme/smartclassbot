
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  isPersonaBased?: boolean;
  personaData?: any;
  applyInfluencerPersonaData?: () => void;
}

const CampaignInfluencerStep: React.FC<CampaignInfluencerStepProps> = ({
  formData,
  isLoading,
  recommendedInfluencers,
  personas,
  handlePersonaRecommendation,
  handleAIRecommendation,
  handleInfluencerToggle,
  isPersonaBased = false,
  personaData,
  applyInfluencerPersonaData
}) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isPersonaDialogOpen, setIsPersonaDialogOpen] = useState(false);

  // Apply persona data when entering this step
  useEffect(() => {
    if (isPersonaBased && personaData && applyInfluencerPersonaData) {
      console.log('🎯 인플루언서 단계 진입 - 페르소나 데이터 적용');
      applyInfluencerPersonaData();
    }
  }, [isPersonaBased, personaData, applyInfluencerPersonaData]);

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handlePersonaRecommendationWithSelection = () => {
    if (selectedPersona) {
      handlePersonaRecommendation();
      setIsPersonaDialogOpen(false);
    }
  };

  const selectedInfluencers = recommendedInfluencers.filter(influencer => 
    formData.selectedInfluencers.includes(influencer.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          인플루언서 정보
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
              <span className="font-medium">인플루언서 믹스 기반 자동 선택</span>
            </div>
            <p>
              선택한 <strong>{personaData.mixStrategy?.name}</strong>에 따라 
              {recommendedInfluencers.length}명의 인플루언서가 자동으로 추천되고 선택되었습니다.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        
        {!isPersonaBased && (
          <div className="flex gap-4">
            <Dialog open={isPersonaDialogOpen} onOpenChange={setIsPersonaDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={isLoading}
                  className="flex-1"
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  페르소나로 추천받기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>페르소나 선택</DialogTitle>
                  <DialogDescription>
                    인플루언서 추천을 받을 페르소나를 선택해주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {personas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {personas.map((persona) => (
                        <Card 
                          key={persona.id} 
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedPersona === persona.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handlePersonaSelect(persona.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h4 className="font-medium">{persona.name}</h4>
                              <p className="text-sm text-muted-foreground">연령: {persona.age}</p>
                              <div className="flex flex-wrap gap-1">
                                {persona.interests.map((interest) => (
                                  <Badge key={interest} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedPersona === persona.id}
                              onChange={() => {}} // onClick으로 처리
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      페르소나 데이터를 먼저 생성해주세요.
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPersonaDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={handlePersonaRecommendationWithSelection}
                      disabled={!selectedPersona || isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? '추천 중...' : '선택한 페르소나로 추천받기'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
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
        )}

        {personas.length > 0 && !isPersonaBased && (
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

        {isPersonaBased && personaData && (
          <div>
            <Label>사용된 페르소나</Label>
            <Card className="p-4 mt-2 bg-green-50 border-green-200">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-900">{personaData.persona?.name}</h4>
                  <p className="text-sm text-green-700">
                    연령: {personaData.persona?.demographics?.age} | 
                    위치: {personaData.persona?.demographics?.location}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {personaData.persona?.interests?.map((interest: string) => (
                      <Badge key={interest} variant="outline" className="text-xs bg-white text-green-700 border-green-300">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {personaData.mixStrategy?.name}
                </Badge>
              </div>
            </Card>
          </div>
        )}

        {recommendedInfluencers.length > 0 && (
          <div>
            <Label className="flex items-center gap-2">
              {isPersonaBased ? '선택된 인플루언서 믹스' : '추천 인플루언서'}
              {isPersonaBased && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  믹스 전략 기반
                </Badge>
              )}
            </Label>
            <Card className="mt-4">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">선택</TableHead>
                      <TableHead>프로필</TableHead>
                      <TableHead>인플루언서명</TableHead>
                      <TableHead>팔로워 수</TableHead>
                      <TableHead>참여율</TableHead>
                      <TableHead>카테고리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendedInfluencers.map((influencer) => (
                      <TableRow 
                        key={influencer.id}
                        className={`cursor-pointer transition-colors ${
                          formData.selectedInfluencers.includes(influencer.id) 
                            ? 'bg-green-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInfluencerToggle(influencer.id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={formData.selectedInfluencers.includes(influencer.id)}
                            onChange={() => {}} // onClick으로 처리
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={influencer.profileImageUrl || influencer.profileImage} />
                            <AvatarFallback>
                              {influencer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{influencer.name}</div>
                        </TableCell>
                        <TableCell>{formatFollowers(influencer.followers)}</TableCell>
                        <TableCell>{influencer.engagementRate}%</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {influencer.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedInfluencers.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              {selectedInfluencers.length}명의 인플루언서가 선택되었습니다.
              {isPersonaBased && personaData && (
                <span className="block mt-1">
                  예상 총 비용: {personaData.mixStrategy?.totalCost?.toLocaleString()}원
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignInfluencerStep;
