
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ImageIcon, VideoIcon, CheckCircle, MessageSquare, Clock, Plus } from 'lucide-react';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { useInlineComments } from '@/hooks/useInlineComments';
import ContentRevisionTimeline from './ContentRevisionTimeline';
import RevisionRequestForm from './RevisionRequestForm';
import PlanDataRenderer from './PlanDataRenderer';
import InlineCommentForm from './InlineCommentForm';

interface BrandContentPlanReviewProps {
  plans: ContentPlanDetail[];
  onApprove: (planId: string) => void;
  onRequestRevision: (planId: string, feedback: string) => void;
}

const BrandContentPlanReview: React.FC<BrandContentPlanReviewProps> = ({
  plans,
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
      case 'revision': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 상태 표시 텍스트 통일
  const getStatusText = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return '기획초안';
      case 'revision': return '기획수정중';
      case 'approved': return '기획완료';
      default: return status;
    }
  };

  const canReviewPlan = (plan: ContentPlanDetail) => {
    return plan.status === 'draft' || plan.status === 'revision';
  };

  const hasPlanContent = (plan: ContentPlanDetail) => {
    if (plan.contentType === 'image') {
      const imageData = plan.planData as ImagePlanData;
      return !!(imageData.postTitle || imageData.thumbnailTitle || imageData.script || 
               (imageData.hashtags && imageData.hashtags.length > 0) ||
               (imageData.referenceImages && imageData.referenceImages.length > 0));
    } else {
      const videoData = plan.planData as VideoPlanData;
      return !!(videoData.postTitle || videoData.scenario || videoData.script ||
               (videoData.hashtags && videoData.hashtags.length > 0) ||
               (videoData.scenarioFiles && videoData.scenarioFiles.length > 0));
    }
  };

  const handleApprove = (planId: string) => {
    onApprove(planId);
    // Close modal after approval
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

  // 현재 진행중인 수정 차수 표시 개선
  const getCurrentRevisionInfo = (plan: ContentPlanDetail) => {
    const pendingRevisions = plan.revisions.filter(r => 
      r.requestedBy === 'brand' && r.status === 'pending'
    );
    
    if (pendingRevisions.length > 0) {
      return `${pendingRevisions[0].revisionNumber}차 수정요청`;
    }
    
    const completedRevisions = plan.revisions.filter(r => r.status === 'completed').length;
    return completedRevisions > 0 ? `${completedRevisions}차 완료` : null;
  };

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">아직 콘텐츠 기획이 전달되지 않았습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const revisionInfo = getCurrentRevisionInfo(plan);
          
          return (
            <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPlan(plan)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {plan.contentType === 'image' ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <VideoIcon className="w-5 h-5" />
                    )}
                    {plan.influencerName}
                  </CardTitle>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(plan.status)}>
                      {getStatusText(plan.status)}
                    </Badge>
                    {revisionInfo && (
                      <Badge variant="outline" className="text-xs">
                        {revisionInfo}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    콘텐츠 타입: {plan.contentType === 'image' ? '이미지 포스팅' : '영상 포스팅'}
                  </p>
                  <p className="text-sm text-gray-600">
                    작성일: {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-2">
                    {hasPlanContent(plan) ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        기획안 작성완료
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500 border-gray-200">
                        기획안 미작성
                      </Badge>
                    )}
                  </div>

                  {canReviewPlan(plan) && hasPlanContent(plan) && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(plan.id);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan);
                          setShowRevisionForm(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        수정요청
                      </Button>
                    </div>
                  )}

                  {canReviewPlan(plan) && !hasPlanContent(plan) && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">인플루언서가 기획안을 작성 중입니다.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPlan && !showRevisionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white mx-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {selectedPlan.contentType === 'image' ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <VideoIcon className="w-5 h-5" />
                  )}
                  {selectedPlan.influencerName} - 콘텐츠 기획 상세
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                  닫기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PlanDataRenderer plan={selectedPlan} renderFieldWithFeedback={renderFieldWithFeedback} />
              
              {selectedPlan.revisions && selectedPlan.revisions.length > 0 && (
                <ContentRevisionTimeline revisions={selectedPlan.revisions} />
              )}
              
              {canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={() => handleApprove(selectedPlan.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    승인
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRevisionForm(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    수정요청
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showRevisionForm && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white mx-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  수정 요청 - {selectedPlan.influencerName}
                </CardTitle>
                <Button variant="outline" onClick={() => {
                  setShowRevisionForm(false);
                  setSelectedPlan(null);
                  resetComments();
                }}>
                  닫기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {inlineComments.filter(c => c.planId === selectedPlan.id).length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg mb-4">
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
                  setSelectedPlan(null);
                  resetComments();
                }}
                requestType="brand-request"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BrandContentPlanReview;
