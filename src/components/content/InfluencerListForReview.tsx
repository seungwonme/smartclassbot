
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquare, Users } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';

interface InfluencerListForReviewProps {
  confirmedInfluencers: any[];
  plans: ContentPlanDetail[];
  selectedPlan: ContentPlanDetail | null;
  onSelectPlan: (plan: ContentPlanDetail) => void;
  onApprove: (planId: string) => void;
  onRequestRevision: (plan: ContentPlanDetail) => void;
  getStatusColor: (status: ContentPlanDetail['status']) => string;
  getStatusText: (plan: ContentPlanDetail) => string;
  getCurrentRevisionInfo: (plan: ContentPlanDetail) => string | null;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
  isProcessing?: boolean;
}

const InfluencerListForReview: React.FC<InfluencerListForReviewProps> = ({
  confirmedInfluencers,
  plans,
  selectedPlan,
  onSelectPlan,
  onApprove,
  onRequestRevision,
  getStatusColor,
  getStatusText,
  getCurrentRevisionInfo,
  canReviewPlan,
  isProcessing = false
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          인플루언서별 기획안
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        {plans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">기획안이 없습니다</div>
            <p className="text-sm">시스템 관리자가 기획안을 작성하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => {
              const influencer = confirmedInfluencers.find(inf => inf.id === plan.influencerId);
              const revisionInfo = getCurrentRevisionInfo(plan);
              const isSelected = selectedPlan?.id === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSelectPlan(plan)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{influencer?.name || '알 수 없는 인플루언서'}</h4>
                      <p className="text-sm text-gray-500">{plan.contentType === 'image' ? '이미지' : '비디오'} 기획</p>
                    </div>
                    <Badge className={getStatusColor(plan.status)}>
                      {getStatusText(plan)}
                    </Badge>
                  </div>

                  {revisionInfo && (
                    <div className="mb-3">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {revisionInfo}
                      </span>
                    </div>
                  )}

                  {canReviewPlan(plan) && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(plan.id);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {isProcessing ? '처리중...' : '승인'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestRevision(plan);
                        }}
                        disabled={isProcessing}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        수정요청
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfluencerListForReview;
