
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquare, Users, Clock } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';

interface InfluencerListForReviewProps {
  confirmedInfluencers: any[];
  plans: ContentPlanDetail[];
  selectedPlan: ContentPlanDetail | null;
  onSelectPlan: (plan: ContentPlanDetail) => void;
  onApprove: (planId: string) => void;
  onRequestRevision: (plan: ContentPlanDetail) => void;
  getStatusColor: (status: ContentPlanDetail['status']) => string;
  getStatusText: (status: ContentPlanDetail['status']) => string;
  getCurrentRevisionInfo: (plan: ContentPlanDetail) => string | null;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
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
  canReviewPlan
}) => {
  const getDetailedRevisionStatus = (plan: ContentPlanDetail) => {
    if (!plan.revisions || plan.revisions.length === 0) {
      return null;
    }

    const pendingBrandRevisions = plan.revisions.filter(r => 
      r.requestedBy === 'brand' && r.status === 'pending'
    );
    
    const pendingAdminRevisions = plan.revisions.filter(r => 
      r.requestedBy === 'admin' && r.status === 'pending'
    );

    if (pendingBrandRevisions.length > 0) {
      return {
        text: `${pendingBrandRevisions[0].revisionNumber}차 수정요청`,
        color: 'bg-orange-100 text-orange-800'
      };
    }

    if (pendingAdminRevisions.length > 0) {
      return {
        text: `${pendingAdminRevisions[0].revisionNumber}차 피드백 완료`,
        color: 'bg-purple-100 text-purple-800'
      };
    }

    // 최근 완료된 수정 요청이 있다면
    const completedRevisions = plan.revisions.filter(r => r.status === 'completed');
    if (completedRevisions.length > 0) {
      const latestRevision = completedRevisions[completedRevisions.length - 1];
      return {
        text: `${latestRevision.revisionNumber}차 완료`,
        color: 'bg-gray-100 text-gray-600'
      };
    }

    return null;
  };

  if (confirmedInfluencers.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">확정된 인플루언서가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          확정된 인플루언서
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {confirmedInfluencers.map((influencer) => {
            const existingPlan = plans.find(plan => plan.influencerId === influencer.id);
            const revisionStatus = existingPlan ? getDetailedRevisionStatus(existingPlan) : null;
            
            return (
              <div 
                key={influencer.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPlan?.influencerId === influencer.id 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => existingPlan && onSelectPlan(existingPlan)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{influencer.name}</h4>
                    <p className="text-sm text-gray-500">{influencer.platform}</p>
                  </div>
                  {existingPlan && (
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(existingPlan.status)}>
                        {getStatusText(existingPlan.status)}
                      </Badge>
                      {revisionStatus && (
                        <Badge className={revisionStatus.color}>
                          {revisionStatus.text}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {existingPlan ? (
                  <div className="mt-2">
                    {canReviewPlan(existingPlan) && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onApprove(existingPlan.id);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestRevision(existingPlan);
                          }}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          수정요청
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-gray-500">
                      기획 대기중
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">시스템 관리자가 기획안을 작성 중입니다.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerListForReview;
