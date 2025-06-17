
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, CheckCircle } from 'lucide-react';

interface PersonaGenerationPanelProps {
  isGenerating: boolean;
  generateProgress: number;
  generationCompleted: boolean;
  currentPersona: any;
  selectedBrand: string;
  selectedProduct: string;
  selectedReport: string;
  onGeneratePersona: () => void;
  onSavePersona: (personaData: any) => void;
}

const PersonaGenerationPanel: React.FC<PersonaGenerationPanelProps> = ({
  isGenerating,
  generateProgress,
  generationCompleted,
  currentPersona,
  selectedBrand,
  selectedProduct,
  selectedReport,
  onGeneratePersona,
  onSavePersona
}) => {
  return (
    <>
      {/* 페르소나 생성 실행 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI 페르소나 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI 페르소나 생성 진행률</span>
                <span>{generateProgress}%</span>
              </div>
              <Progress value={generateProgress} />
              <div className="text-sm text-gray-600 text-center">
                선택된 시장조사 보고서를 분석하여 최적의 페르소나를 생성하고 있습니다...
              </div>
            </div>
          )}

          <Button 
            onClick={onGeneratePersona}
            disabled={isGenerating || !selectedBrand || !selectedProduct || !selectedReport}
            className="w-full"
          >
            {isGenerating ? 'AI 페르소나 생성 중...' : '페르소나 생성하기'}
          </Button>
        </CardContent>
      </Card>

      {/* 생성된 페르소나 미리보기 */}
      {generationCompleted && currentPersona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>생성된 페르소나</span>
              <Badge variant="outline" className="ml-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">{currentPersona.name}</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>연령:</strong> {currentPersona.demographics.age}</div>
                  <div><strong>성별:</strong> {currentPersona.demographics.gender}</div>
                  <div><strong>지역:</strong> {currentPersona.demographics.location}</div>
                  <div><strong>소득:</strong> {currentPersona.demographics.income}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <strong className="text-sm">주요 플랫폼:</strong>
                  <div className="flex gap-2 mt-1">
                    {currentPersona.platforms.map((platform: string, index: number) => (
                      <Badge key={index} variant="secondary">{platform}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="text-sm">관심사:</strong>
                  <div className="flex gap-2 mt-1">
                    {currentPersona.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm">
                  <strong>신뢰도:</strong> {currentPersona.confidence}%
                </div>
                <div className="text-sm">
                  <strong>기반 보고서:</strong> {currentPersona.reportName}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => onSavePersona(currentPersona)}
              >
                페르소나 저장하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default PersonaGenerationPanel;
