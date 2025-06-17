
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit3, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonaValidationProps {
  persona: any;
  onPersonaUpdate: (updatedPersona: any) => void;
}

const PersonaValidation: React.FC<PersonaValidationProps> = ({ persona, onPersonaUpdate }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersona, setEditedPersona] = useState(persona);

  const handleSave = () => {
    onPersonaUpdate(editedPersona);
    setIsEditing(false);
    toast({
      title: "페르소나 업데이트 완료",
      description: "페르소나 정보가 성공적으로 저장되었습니다.",
    });
  };

  const handleReset = () => {
    setEditedPersona(persona);
    setIsEditing(false);
  };

  const updateDemographic = (field: string, value: string) => {
    setEditedPersona({
      ...editedPersona,
      demographics: {
        ...editedPersona.demographics,
        [field]: value
      }
    });
  };

  const updatePsychographic = (field: string, value: string | string[]) => {
    setEditedPersona({
      ...editedPersona,
      psychographics: {
        ...editedPersona.psychographics,
        [field]: value
      }
    });
  };

  const addInsight = () => {
    setEditedPersona({
      ...editedPersona,
      insights: [...editedPersona.insights, '새로운 인사이트를 입력하세요']
    });
  };

  const updateInsight = (index: number, value: string) => {
    const newInsights = [...editedPersona.insights];
    newInsights[index] = value;
    setEditedPersona({
      ...editedPersona,
      insights: newInsights
    });
  };

  const removeInsight = (index: number) => {
    const newInsights = editedPersona.insights.filter((_: any, i: number) => i !== index);
    setEditedPersona({
      ...editedPersona,
      insights: newInsights
    });
  };

  return (
    <div className="space-y-6">
      {/* 편집 컨트롤 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch checked={isEditing} onCheckedChange={setIsEditing} />
          <span className="text-sm font-medium">편집 모드</span>
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        )}
      </div>

      {/* 페르소나 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">페르소나 이름</label>
              {isEditing ? (
                <Input
                  value={editedPersona.name}
                  onChange={(e) => setEditedPersona({ ...editedPersona, name: e.target.value })}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded">{editedPersona.name}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">신뢰도</label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{editedPersona.confidence}%</Badge>
                <span className="text-sm text-gray-600">AI 생성 신뢰도</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 인구통계학적 특성 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">인구통계학적 특성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">연령</label>
              {isEditing ? (
                <Input
                  value={editedPersona.demographics.age}
                  onChange={(e) => updateDemographic('age', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded">{editedPersona.demographics.age}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">성별</label>
              {isEditing ? (
                <Input
                  value={editedPersona.demographics.gender}
                  onChange={(e) => updateDemographic('gender', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded">{editedPersona.demographics.gender}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">지역</label>
              {isEditing ? (
                <Input
                  value={editedPersona.demographics.location}
                  onChange={(e) => updateDemographic('location', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded">{editedPersona.demographics.location}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">소득</label>
              {isEditing ? (
                <Input
                  value={editedPersona.demographics.income}
                  onChange={(e) => updateDemographic('income', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded">{editedPersona.demographics.income}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 심리통계학적 특성 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">심리통계학적 특성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">관심사</label>
            {isEditing ? (
              <Input
                value={editedPersona.psychographics.interests.join(', ')}
                onChange={(e) => updatePsychographic('interests', e.target.value.split(', '))}
                placeholder="쉼표로 구분하여 입력"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">
                {editedPersona.psychographics.interests.join(', ')}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">성격</label>
            {isEditing ? (
              <Textarea
                value={editedPersona.psychographics.personality}
                onChange={(e) => updatePsychographic('personality', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{editedPersona.psychographics.personality}</div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">가치관</label>
            {isEditing ? (
              <Textarea
                value={editedPersona.psychographics.values}
                onChange={(e) => updatePsychographic('values', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{editedPersona.psychographics.values}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 주요 인사이트 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">주요 인사이트</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addInsight}>
                인사이트 추가
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {editedPersona.insights.map((insight: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-600 mt-1">
                {index + 1}
              </div>
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={insight}
                    onChange={(e) => updateInsight(index, e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeInsight(index)}
                  >
                    삭제
                  </Button>
                </div>
              ) : (
                <div className="flex-1 p-2 bg-gray-50 rounded">{insight}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 검증 결과 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">페르소나 검증 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8.5/10</div>
              <div className="text-sm text-gray-600">시장 적합성</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-gray-600">데이터 일치도</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">A</div>
              <div className="text-sm text-gray-600">활용 가능성</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaValidation;
