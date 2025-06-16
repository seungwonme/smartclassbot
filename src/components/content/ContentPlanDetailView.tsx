
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, MessageSquare, FileText, ImageIcon, VideoIcon, Send, Edit } from 'lucide-react';
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
  // 편집 관련 props 추가
  editingField?: string | null;
  editingValue?: any;
  setEditingValue?: (value: any) => void;
  onStartEdit?: (planId: string, fieldName: string, currentValue: any) => void;
  onSaveEdit?: (planId: string, fieldName: string) => void;
  onCancelEdit?: () => void;
  // 편집 완료 후 피드백 모드 관련 props 추가
  justEditedField?: string | null;
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
  plans,
  editingField,
  editingValue,
  setEditingValue,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  justEditedField
}) => {
  const [revisionFeedback, setRevisionFeedback] = React.useState('');

  // 시스템 관리자인지 확인 (URL 기반)
  const isAdminView = window.location.pathname.includes('/admin/');
  // 브랜드 관리자인지 확인 (URL 기반)
  const isBrandView = window.location.pathname.includes('/brand/');

  // 방금 편집한 필드인지 확인
  const isJustEditedField = (planId: string, fieldName: string) => {
    return justEditedField === `${planId}-${fieldName}`;
  };

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
    // 전용 수정요청 폼 모드 (브랜드에서 처음 수정요청 시)
    if (showRevisionForm && selectedPlan && !justEditedField) {
      return (
        <div className="space-y-4">
          {/* 기존 인라인 코멘트 기반 피드백 섹션 */}
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
            requestType={isAdminView ? "admin-feedback" : "brand-request"}
          />
        </div>
      );
    }

    if (selectedPlan) {
      const savedComments = inlineComments.filter(c => c.planId === selectedPlan.id);
      const hasComments = savedComments.length > 0;
      const hasPendingRevision = selectedPlan.revisions?.some(rev => rev.status === 'pending');
      const hasJustEdited = justEditedField && justEditedField.startsWith(selectedPlan.id);

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

          <PlanDataRenderer 
            plan={selectedPlan} 
            renderFieldWithFeedback={renderFieldWithFeedback}
            editingField={editingField}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
          
          {selectedPlan.revisions && selectedPlan.revisions.length > 0 && (
            <ContentRevisionTimeline revisions={selectedPlan.revisions} />
          )}

          {/* 편집 완료 후 자동 표시되는 피드백 섹션 */}
          {hasJustEdited && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Edit className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">
                  {(selectedPlan.currentRevisionNumber || 0)}차 수정피드백
                </h4>
              </div>
              
              <div className="mb-3 p-2 bg-white rounded border">
                <p className="text-sm font-medium text-gray-700 mb-2">방금 수정한 필드:</p>
                <div className="text-sm text-blue-600">
                  {justEditedField?.split('-')[1]} 필드가 수정되었습니다.
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-revision-feedback" className="text-sm font-medium">
                  수정피드백 내용
                </Label>
                <Textarea
                  id="auto-revision-feedback"
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="수정한 내용에 대한 피드백을 작성해주세요..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSubmitRevision}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {(selectedPlan.currentRevisionNumber || 0)}차 피드백 전송
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancelRevision}
                >
                  취소
                </Button>
              </div>
            </div>
          )}

          {/* 시스템 관리자용: 수정피드백 섹션 */}
          {isAdminView && hasComments && hasPendingRevision && !showRevisionForm && !hasJustEdited && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">
                  {(selectedPlan.currentRevisionNumber || 0)}차 수정피드백
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
                  전체 수정피드백 내용 (선택사항)
                </Label>
                <Textarea
                  id="revision-feedback"
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="필드별 코멘트 외에 추가적인 피드백이 있다면 작성해주세요..."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* 브랜드 관리자용: N차 수정요청 섹션 */}
          {isBrandView && hasComments && canReviewPlan(selectedPlan) && !showRevisionForm && !hasJustEdited && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium text-orange-800">
                  {(selectedPlan.currentRevisionNumber || 0) + 1}차 수정요청
                </h4>
              </div>
              
              <div className="mb-3 p-2 bg-white rounded border">
                <p className="text-sm font-medium text-gray-700 mb-2">저장된 필드별 수정코멘트:</p>
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
                  placeholder="필드별 수정코멘트 외에 추가적인 수정요청 사항이 있다면 작성해주세요..."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* 하단 액션 버튼 */}
          {!showRevisionForm && !hasJustEdited && (
            <div className="pt-6 border-t bg-gray-50 -mx-6 px-6 pb-4 rounded-b-lg">
              <div className="flex justify-center gap-4">
                {/* 브랜드 관리자만 승인 버튼 표시 */}
                {isBrandView && canReviewPlan(selectedPlan) && hasPlanContent(selectedPlan) && (
                  <Button
                    onClick={() => onApprove(selectedPlan.id)}
                    className="bg-green-600 hover:bg-green-700 px-8"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    승인
                  </Button>
                )}
                
                {/* 수정요청/피드백 버튼 */}
                {hasComments ? (
                  <Button
                    onClick={handleSubmitRevision}
                    className={isAdminView ? "bg-blue-600 hover:bg-blue-700 px-8" : "bg-orange-600 hover:bg-orange-700 px-8"}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isAdminView 
                      ? `${(selectedPlan.currentRevisionNumber || 0)}차 수정피드백 전송`
                      : `${(selectedPlan.currentRevisionNumber || 0) + 1}차 수정요청 전송`
                    }
                  </Button>
                ) : (
                  canReviewPlan(selectedPlan) && (
                    <Button
                      variant="outline"
                      onClick={onRequestRevision}
                      className="px-8"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {isAdminView ? '수정피드백' : '수정코멘트'}
                    </Button>
                  )
                )}
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                {hasComments 
                  ? isAdminView 
                    ? "저장된 코멘트와 함께 수정피드백을 전송해주세요."
                    : "저장된 수정코멘트와 함께 수정요청을 전송하거나 승인을 진행해주세요."
                  : isAdminView
                    ? "기획안 내용을 충분히 검토한 후 피드백을 진행해주세요."
                    : "기획안 내용을 충분히 검토한 후 승인 또는 수정코멘트를 진행해주세요."
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
            <p className="text-sm mt-2">
              {isAdminView 
                ? "기획안을 생성하거나 브랜드의 수정요청에 응답하세요."
                : "시스템 관리자가 기획안을 작성하면 여기에 표시됩니다."
              }
            </p>
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
