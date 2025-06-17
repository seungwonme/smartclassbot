
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, Calendar, TrendingUp, Target, FileText } from 'lucide-react';

interface PersonaDetailModalProps {
  persona: any | null;
  isOpen: boolean;
  onClose: () => void;
  onStartMatching?: (personaId: string) => void;
}

const PersonaDetailModal: React.FC<PersonaDetailModalProps> = ({
  persona,
  isOpen,
  onClose,
  onStartMatching
}) => {
  if (!persona) return null;

  const handleStartMatching = () => {
    if (onStartMatching) {
      onStartMatching(persona.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {persona.name}
          </DialogTitle>
          <DialogDescription>
            AI 페르소나 상세 정보
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">브랜드</label>
                  <p className="text-lg">{persona.brandName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">제품</label>
                  <p className="text-lg">{persona.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">신뢰도</label>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-green-600">{persona.confidence}%</p>
                    <Badge variant="outline" className="text-green-600">
                      높음
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">생성일</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p>{new Date(persona.completedAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 인구통계학적 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                인구통계학적 특성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">연령</label>
                  <p className="text-lg">{persona.demographics?.age || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">성별</label>
                  <p className="text-lg">{persona.demographics?.gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">지역</label>
                  <p className="text-lg">{persona.demographics?.location || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">소득 수준</label>
                  <p className="text-lg">{persona.demographics?.income || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 관심사 및 플랫폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관심사</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {persona.interests?.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">선호 플랫폼</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {persona.platforms?.map((platform: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 페르소나 설명 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">페르소나 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {persona.description || '페르소나 설명이 없습니다.'}
              </p>
            </CardContent>
          </Card>

          {/* 기반 리포트 정보 */}
          {persona.reportName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  기반 시장조사 리포트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{persona.reportName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  이 페르소나는 위 시장조사 리포트를 기반으로 생성되었습니다.
                </p>
              </CardContent>
            </Card>
          )}

          {/* 액션 버튼들 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button onClick={handleStartMatching} className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              인플루언서 매칭 시작
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonaDetailModal;
