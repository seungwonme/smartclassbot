
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ImageIcon, VideoIcon, CheckCircle, MessageSquare, Clock, Plus, Users, FileText } from 'lucide-react';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { useInlineComments } from '@/hooks/useInlineComments';
import ContentRevisionTimeline from './ContentRevisionTimeline';
import RevisionRequestForm from './RevisionRequestForm';
import PlanDataRenderer from './PlanDataRenderer';
import InlineCommentForm from './InlineCommentForm';

interface BrandContentPlanReviewProps {
  plans: ContentPlanDetail[];
  confirmedInfluencers: any[];
  onApprove: (planId: string) => void;
  onRequestRevision: (planId: string, feedback: string) => void;
}

const BrandContentPlanReview: React.FC<BrandContentPlanReviewProps> = ({
  plans,
  confirmedInfluencers,
  onApprove,
  onRequestRevision
}) => {
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanDetail | null>(null);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const { toast } = useToast();
  
  const {
    activeCommentField,
    inlineComments,
    currentComment,
    handleInlineComment,
    handleSaveInlineComment,
    handleCancelInlineComment,
    getFieldComment,
    resetComments
  } = useInlineComments();

  console.log('BrandContentPlanReview received plans:', plans);

  const getStatusColor = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'revision-requested': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return '기획초안';
      case 'revision-requested': return '기획수정중';
      case 'revision-feedback': return '기획수정중';
      case 'approved': return '기획완료';
      default: return status;
    }
  };

  const canReviewPlan = (plan: ContentPlanDetail) => {
    return plan.status === 'draft' || plan.status === 'revision-requested' || plan.status === 'revision-feedback';
  };

  const hasPlanContent = (plan: ContentPlanDetail) => {
    if (!plan.planData) {
      console.log('Plan data is undefined for plan:', plan.id);
      return false;
    }

    try {
      if (plan.contentType === 'image') {
        const imageData = plan.planData as ImagePlanData;
        return !!(imageData?.postTitle || imageData?.thumbnailTitle || imageData?.script || 
                 (imageData?.hashtags && imageData.hashtags.length > 0) ||
                 (imageData?.referenceImages && imageData.referenceImages.length > 0));
      } else {
        const videoData = plan.planData as VideoPlanData;
        return !!(videoData?.postTitle || videoData?.scenario || videoData?.script ||
                 (videoData?.hashtags && videoData.hashtags.length > 0) ||
                 (videoData?.scenarioFiles && videoData.scenarioFiles.length > 0));
      }
    } catch (error) {
      console.error('Error checking plan content:', error);
      return false;
    }
  };

  const handleApprove = (planId: string) => {
    onApprove(planId);
    setSelectedPlan(null);
    setShowRevisionForm(false);
    resetComments();
    toast({
      title: "콘텐츠 기획 승인",
      description: "콘텐츠 기획이 승인되었습니다."
    });
  };

  const handleRequestRevision = (feedback: string) => {
    if (!selectedPlan) return;

    const planComments = inlineComments.filter(comment => comment.planId === selectedPlan.id);
    let finalFeedback = feedback.trim();

    if (planComments.length > 0) {
      const commentsFeedback = planComments.map(comment => 
        `[${comment.fieldName}] ${comment.comment}`
      ).join('\n');
      
      finalFeedback = finalFeedback 
        ? `${finalFeedback}\n\n${commentsFeedback}`
        : commentsFeedback;
    }

    if (!finalFeedback) {
      toast({
        title: "피드백을 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    onRequestRevision(selectedPlan.id, finalFeedback);
    setShowRevisionForm(false);
    setSelectedPlan(null);
    resetComments();
    toast({
      title: "수정 요청 전송",
      description: "콘텐츠 기획 수정 요청이 전송되었습니다."
    });
  };

  const renderFieldWithFeedback = (
    plan: ContentPlanDetail,
    fieldName: string,
    fieldLabel: string,
    content: React.ReactNode,
    canAddFeedback: boolean = true
  ) => {
    const commentKey = `${plan.id}-${fieldName}`;
    const isActiveComment = activeCommentField === commentKey;
    const existingComment = getFieldComment(plan.id, fieldLabel);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-medium">{fieldLabel}</Label>
          {canAddFeedback && canReviewPlan(plan) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleInlineComment(plan.id, fieldName, fieldLabel)}
              className="text-xs px-2 py-1 h-6"
            >
              <Plus className="w-3 h-3 mr-1" />
              수정코멘트
            </Button>
          )}
        </div>
        {content}
        
        {existingComment && !isActiveComment && (
          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-orange-700">수정 코멘트: </span>
                <span className="text-orange-600">{existingComment.comment}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleInlineComment(plan.id, fieldName, fieldLabel)}
                className="text-xs px-1 py-0 h-5 text-orange-600 hover:text-orange-800"
              >
                수정
              </Button>
            </div>
          </div>
        )}

        {isActiveComment && (
          <InlineCommentForm
            fieldLabel={fieldLabel}
            currentComment={currentComment}
            onSave={(comment) => handleSaveInlineComment(plan.id, fieldLabel, comment)}
            onCancel={handleCancelInlineComment}
          />
        )}
      </div>
    );
  };

  const getCurrentRevisionInfo = (plan: ContentPlanDetail) => {
    const pendingRevisions = plan.revisions.filter(r => 
      r.requestedBy === 'brand' && r.status === 'pending'
    );
    
    if (pendingRevisions.length > 0) {
      return `${pendingRevisions[0].revisionNumber}차 수정요청`;
    }
    
    const completedBrandRevisions = plan.revisions.filter(r => 
      r.requestedBy === 'brand' && r.status === 'completed'
    ).length;
    
    const pendingAdminFeedback = plan.revisions.filter(r =>
      r.requestedBy === 'admin' && r.status === 'pending'
    );
    
    if (pendingAdminFeedback.length > 0) {
      return `${pendingAdminFeedback[0].revisionNumber}차 수정피드백`;
    }
    
    if (plan.status === 'revision-requested') {
      return `${completedBrandRevisions + 1}차 수정요청`;
    } else if (plan.status === 'revision-feedback') {
      return `${completedBrandRevisions}차 수정피드백`;
    }
    
    return completedBrandRevisions > 0 ? `${completedBrandRevisions}차 완료` : null;
  };

  if (confirmedInfluencers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">확정된 인플루언서가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* 좌측: 인플루언서 목록 */}
      <div className="lg:col-span-1">
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
                const revisionInfo = existingPlan ? getCurrentRevisionInfo(existingPlan) : null;
                const hasContent = existingPlan ? hasPlanContent(existingPlan) : false;
                
                return (
                  <div 
                    key={influencer.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan?.influencerId === influencer.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => existingPlan && setSelectedPlan(existingPlan)}
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
                          {revisionInfo && (
                            <Badge variant="outline" className="text-xs">
                              {revisionInfo}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {existingPlan ? (
                      <div className="mt-2">
                        {hasContent ? (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            기획안 작성완료
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-200">
                            기획안 미작성
                          </Badge>
                        )}
                        
                        {canReviewPlan(existingPlan) && hasContent && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(existingPlan.id);
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
                                setSelectedPlan(existingPlan);
                                setShowRevisionForm(true);
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
      </div>

      {/* 우측: 콘텐츠 기획 상세 */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                콘텐츠 기획 상세
              </div>
              {selectedPlan && !showRevisionForm && canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(selectedPlan.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRevisionForm(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    수정요청
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto">
            {showRevisionForm && selectedPlan ? (
              <div className="space-y-4">
                {inlineComments.filter(c => c.planId === selectedPlan.id).length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-2">필드별 수정 코멘트:</p>
                    {inlineComments
                      .filter(c => c.planId === selectedPlan.id)
                      .map((comment, index) => (
                        <div key={index} className="text-sm text-blue-600 mb-1">
                          <strong>{comment.fieldName}:</strong> {comment.comment}
                        </div>
                      ))}
                  </div>
                )}
                
                <RevisionRequestForm
                  revisionNumber={(selectedPlan.currentRevisionNumber || 0) + 1}
                  onSubmit={handleRequestRevision}
                  onCancel={() => {
                    setShowRevisionForm(false);
                    resetComments();
                  }}
                  requestType="brand-request"
                />
              </div>
            ) : selectedPlan ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b">
                  {selectedPlan.contentType === 'image' ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <VideoIcon className="w-5 h-5" />
                  )}
                  <h3 className="text-lg font-medium">
                    {selectedPlan.influencerName} - {selectedPlan.contentType === 'image' ? '이미지' : '영상'} 기획안
                  </h3>
                </div>

                <PlanDataRenderer plan={selectedPlan} renderFieldWithFeedback={renderFieldWithFeedback} />
                
                {selectedPlan.revisions && selectedPlan.revisions.length > 0 && (
                  <ContentRevisionTimeline revisions={selectedPlan.revisions} />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>좌측에서 인플루언서를 선택하여 기획안을 확인하세요.</p>
                  {plans.length === 0 && (
                    <p className="text-sm mt-2">시스템 관리자가 기획안을 작성하면 여기에 표시됩니다.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandContentPlanReview;
