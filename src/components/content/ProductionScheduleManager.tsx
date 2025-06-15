
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, Play } from 'lucide-react';
import { CampaignInfluencer } from '@/types/campaign';
import ProductionScheduleInput from './ProductionScheduleInput';

interface ProductionScheduleManagerProps {
  confirmedInfluencers: CampaignInfluencer[];
  onUpdateSchedule: (influencerId: string, startDate: string, deadline: string) => void;
  onStartProduction: () => void;
  canStartProduction: boolean;
  disableReason?: string;
}

const ProductionScheduleManager: React.FC<ProductionScheduleManagerProps> = ({
  confirmedInfluencers,
  onUpdateSchedule,
  onStartProduction,
  canStartProduction,
  disableReason = ''
}) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<CampaignInfluencer | null>(null);

  const handleSaveSchedule = (influencerId: string, startDate: string, deadline: string) => {
    onUpdateSchedule(influencerId, startDate, deadline);
    setSelectedInfluencer(null);
  };

  const hasSchedule = (influencer: CampaignInfluencer) => {
    return influencer.productionStartDate && influencer.productionDeadline;
  };

  const scheduledCount = confirmedInfluencers.filter(hasSchedule).length;
  const totalCount = confirmedInfluencers.length;

  if (selectedInfluencer) {
    return (
      <ProductionScheduleInput
        influencer={selectedInfluencer}
        onSave={handleSaveSchedule}
        onCancel={() => setSelectedInfluencer(null)}
      />
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            제작 일정 관리
          </div>
          <Badge variant={canStartProduction ? "default" : "secondary"}>
            {scheduledCount}/{totalCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {confirmedInfluencers.map((influencer) => (
            <div 
              key={influencer.id} 
              className="p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{influencer.name}</h4>
                  <p className="text-sm text-gray-500">{influencer.platform}</p>
                  
                  {hasSchedule(influencer) ? (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>시작: {influencer.productionStartDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>마감: {influencer.productionDeadline}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        일정 설정 완료
                      </Badge>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Badge variant="outline">일정 미설정</Badge>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant={hasSchedule(influencer) ? "outline" : "default"}
                  onClick={() => setSelectedInfluencer(influencer)}
                >
                  {hasSchedule(influencer) ? '수정' : '일정 설정'}
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <Button 
              onClick={onStartProduction}
              disabled={!canStartProduction}
              className={`w-full ${
                canStartProduction 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 opacity-50 cursor-not-allowed'
              }`}
              title={disableReason || undefined}
            >
              <Play className="w-4 h-4 mr-2" />
              {disableReason === '이미 제작 단계 진행 중' ? '제작 단계 진행 중' : '콘텐츠 제작 단계로 전환'}
            </Button>
            {disableReason && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {disableReason}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionScheduleManager;
