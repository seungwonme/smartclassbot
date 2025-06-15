
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, MessageSquare, FileText, ImageIcon, VideoIcon, Send } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';
import ContentRevisionTimeline from './ContentRevisionTimeline';
import RevisionRequestForm from './RevisionRequestForm';
import PlanDataRenderer from './PlanDataRenderer';

interface ContentPlanDetailViewProps {
  selectedPlan: ContentPlanDetail | null;
  showRevisionForm: boolean;
  inlineComments: any[];
  onApprove: (planId: string) => void;
  onRequestRevision: () => void;
  onSubmitRevision: (feedback: string) => void;
  onCancelRevision: () => void;
  canReviewPlan: (plan: ContentPlanDetail) => boolean;
  hasPlanContent: (plan: ContentPlanDetail) => boolean;
  renderFieldWithFeedback: any;
  plans: ContentPlanDetail[];
}

const ContentPlanDetailView: React.FC<ContentPlanDetailViewProps> = ({
  selectedPlan,
  showRevisionForm,
  inlineComments,
  onApprove,
  onRequestRevision,
  onSubmitRevision,
  onCancelRevision,
  canReviewPlan,
  hasPlanContent,
  renderFieldWithFeedback,
  plans
}) => {
  const [revisionFeedback, setRevisionFeedback] = React.useState('');

  const handleSubmitRevision = () => {
    if (!selectedPlan) return;

    const planComments = inlineComments.filter(comment => comment.planId === selectedPlan.id);
    let finalFeedback = revisionFeedback.trim();

    if (planComments.length > 0) {
      const commentsFeedback = planComments.map(comment => 
        `[${comment.fieldName}] ${comment.comment}`
      ).join('\n');
      
      finalFeedback = finalFeedback 
        ? `${finalFeedback}\n\n${commentsFeedback}`
        : commentsFeedback;
    }

    onSubmitRevision(finalFeedback);
    setRevisionFeedback('');
  };

  const renderContent = () => {
    if (showRevisionForm && selectedPlan) {
      return (
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
            onSubmit={onSubmitRevision}
            onCancel={onCancelRevision}
            requestType="brand-request"
          />
        </div>
      );
    }

    if (selectedPlan) {
      const savedComments = inlineComments.filter(c => c.planId === selectedPlan.id);
      const hasComments = savedComments.length > 0;

      return (
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

          {/* N차 수정요청 섹션 - 저장된 코멘트가 있을 때만 표시 */}
          {hasComments && canReviewPlan(selectedPlan) && !showRevisionForm && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium text-orange-800">
                  {(selectedPlan.currentRevisionNumber || 0) + 1}차 수정요청
                </h4>
              </div>
              
              <div className="mb-3 p-2 bg-white rounded border">
                <p className="text-sm font-medium text-gray-700 mb-2">저장된 필드별 코멘트:</p>
                {savedComments.map((comment, index) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    <strong>{comment.fieldName}:</strong> {comment.comment}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="revision-feedback" className="text-sm font-medium">
                  전체 수정요청 내용 (선택사항)
                </Label>
                <Textarea
                  id="revision-feedback"
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="필드별 코멘트 외에 추가적인 수정요청 사항이 있다면 작성해주세요..."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* 승인/수정요청 버튼을 하단으로 이동 */}
          {!showRevisionForm && canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
            <div className="pt-6 border-t bg-gray-50 -mx-6 px-6 pb-4 rounded-b-lg">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => onApprove(selectedPlan.id)}
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인
                </Button>
                {hasComments ? (
                  <Button
                    onClick={handleSubmitRevision}
                    className="bg-orange-600 hover:bg-orange-700 px-8"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {(selectedPlan.currentRevisionNumber || 0) + 1}차 수정요청 전송
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={onRequestRevision}
                    className="px-8"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    수정요청
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                {hasComments 
                  ? "저장된 코멘트와 함께 수정요청을 전송하거나 승인을 진행해주세요."
                  : "기획안 내용을 충분히 검토한 후 승인 또는 수정요청을 진행해주세요."
                }
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>좌측에서 인플루언서를 선택하여 기획안을 확인하세요.</p>
          {plans.length === 0 && (
            <p className="text-sm mt-2">시스템 관리자가 기획안을 작성하면 여기에 표시됩니다.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          콘텐츠 기획 상세
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ContentPlanDetailView;
