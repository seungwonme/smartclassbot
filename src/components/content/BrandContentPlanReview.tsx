import React, { useState } from 'react';
import { ContentPlanDetail } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { useInlineComments } from '@/hooks/useInlineComments';
import { useFieldFeedback } from '@/hooks/useFieldFeedback';
import InfluencerListForReview from './InfluencerListForReview';
import ContentPlanDetailView from './ContentPlanDetailView';

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
      case 'revision-request': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return '기획초안';
      case 'revision-request': return '기획수정중';
      case 'revision-feedback': return '기획수정중';
      case 'approved': return '기획완료';
      default: return status;
    }
  };

  const canReviewPlan = (plan: ContentPlanDetail) => {
    return plan.status === 'draft' || plan.status === 'revision-request' || plan.status === 'revision-feedback';
  };

  const hasPlanContent = (plan: ContentPlanDetail) => {
    if (!plan.planData) {
      console.log('Plan data is undefined for plan:', plan.id);
      return false;
    }

    try {
      if (plan.contentType === 'image') {
        const imageData = plan.planData as any;
        return !!(imageData?.postTitle || imageData?.thumbnailTitle || imageData?.script || 
                 (imageData?.hashtags && imageData.hashtags.length > 0) ||
                 (imageData?.referenceImages && imageData.referenceImages.length > 0));
      } else {
        const videoData = plan.planData as any;
        return !!(videoData?.postTitle || videoData?.scenario || videoData?.script ||
                 (videoData?.hashtags && videoData.hashtags.length > 0) ||
                 (videoData?.scenarioFiles && videoData.scenarioFiles.length > 0));
      }
    } catch (error) {
      console.error('Error checking plan content:', error);
      return false;
    }
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
    
    if (plan.status === 'revision-request') {
      return `${completedBrandRevisions + 1}차 수정요청`;
    } else if (plan.status === 'revision-feedback') {
      return `${completedBrandRevisions}차 수정피드백`;
    }
    
    return completedBrandRevisions > 0 ? `${completedBrandRevisions}차 완료` : null;
  };

  const { renderFieldWithFeedback } = useFieldFeedback({
    activeCommentField,
    currentComment,
    handleInlineComment,
    handleSaveInlineComment,
    handleCancelInlineComment,
    getFieldComment,
    canReviewPlan
  });

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

  const handleSelectPlan = (plan: ContentPlanDetail) => {
    setSelectedPlan(plan);
    setShowRevisionForm(false);
  };

  const handleRequestRevisionClick = (plan: ContentPlanDetail) => {
    setSelectedPlan(plan);
    setShowRevisionForm(true);
  };

  const handleCancelRevision = () => {
    setShowRevisionForm(false);
    resetComments();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* 좌측: 인플루언서 목록 */}
      <div className="lg:col-span-1">
        <InfluencerListForReview
          confirmedInfluencers={confirmedInfluencers}
          plans={plans}
          selectedPlan={selectedPlan}
          onSelectPlan={handleSelectPlan}
          onApprove={handleApprove}
          onRequestRevision={handleRequestRevisionClick}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getCurrentRevisionInfo={getCurrentRevisionInfo}
          canReviewPlan={canReviewPlan}
          hasPlanContent={hasPlanContent}
        />
      </div>

      {/* 우측: 콘텐츠 기획 상세 */}
      <div className="lg:col-span-2">
        <ContentPlanDetailView
          selectedPlan={selectedPlan}
          showRevisionForm={showRevisionForm}
          inlineComments={inlineComments}
          onApprove={handleApprove}
          onRequestRevision={() => setShowRevisionForm(true)}
          onSubmitRevision={handleRequestRevision}
          onCancelRevision={handleCancelRevision}
          canReviewPlan={canReviewPlan}
          hasPlanContent={hasPlanContent}
          renderFieldWithFeedback={renderFieldWithFeedback}
          plans={plans}
        />
      </div>
    </div>
  );
};

export default BrandContentPlanReview;
