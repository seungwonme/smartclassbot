
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImageIcon, VideoIcon, CheckCircle, MessageSquare, Clock, Plus, Send, X } from 'lucide-react';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';
import { useToast } from '@/hooks/use-toast';

interface BrandContentPlanReviewProps {
  plans: ContentPlanDetail[];
  onApprove: (planId: string) => void;
  onRequestRevision: (planId: string, feedback: string) => void;
}

interface FieldFeedback {
  planId: string;
  fieldName: string;
  fieldLabel: string;
}

interface InlineComment {
  planId: string;
  fieldName: string;
  comment: string;
}

const BrandContentPlanReview: React.FC<BrandContentPlanReviewProps> = ({
  plans,
  onApprove,
  onRequestRevision
}) => {
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanDetail | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [fieldFeedback, setFieldFeedback] = useState<FieldFeedback | null>(null);
  const [activeCommentField, setActiveCommentField] = useState<string | null>(null);
  const [inlineComments, setInlineComments] = useState<InlineComment[]>([]);
  const [currentComment, setCurrentComment] = useState('');
  const { toast } = useToast();

  // 디버깅을 위한 로그 추가
  console.log('BrandContentPlanReview received plans:', plans);
  plans.forEach((plan, index) => {
    console.log(`Plan ${index}:`, plan);
    console.log(`Plan ${index} planData:`, plan.planData);
    console.log(`Plan ${index} status:`, plan.status);
  });

  const getStatusColor = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'revision': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return '초안';
      case 'submitted': return '제출됨';
      case 'revision': return '수정요청';
      case 'approved': return '승인됨';
      default: return status;
    }
  };

  const canReviewPlan = (plan: ContentPlanDetail) => {
    return plan.status === 'draft' || plan.status === 'submitted';
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
    toast({
      title: "콘텐츠 기획 승인",
      description: "콘텐츠 기획이 승인되었습니다."
    });
  };

  const handleRequestRevision = () => {
    if (!selectedPlan) return;

    // 인라인 코멘트들을 수집하여 피드백으로 구성
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
    setFeedback('');
    setShowFeedbackForm(false);
    setSelectedPlan(null);
    setFieldFeedback(null);
    setInlineComments([]);
    toast({
      title: "수정 요청 전송",
      description: "콘텐츠 기획 수정 요청이 전송되었습니다."
    });
  };

  const handleInlineComment = (plan: ContentPlanDetail, fieldName: string, fieldLabel: string) => {
    const commentKey = `${plan.id}-${fieldName}`;
    if (activeCommentField === commentKey) {
      setActiveCommentField(null);
      setCurrentComment('');
    } else {
      const existingComment = inlineComments.find(c => c.planId === plan.id && c.fieldName === fieldLabel);
      setActiveCommentField(commentKey);
      setCurrentComment(existingComment?.comment || '');
    }
  };

  const handleSaveInlineComment = (plan: ContentPlanDetail, fieldLabel: string) => {
    if (!currentComment.trim()) return;

    const newComment: InlineComment = {
      planId: plan.id,
      fieldName: fieldLabel,
      comment: currentComment.trim()
    };

    setInlineComments(prev => {
      const filtered = prev.filter(c => !(c.planId === plan.id && c.fieldName === fieldLabel));
      return [...filtered, newComment];
    });

    setActiveCommentField(null);
    setCurrentComment('');
    
    toast({
      title: "코멘트 저장됨",
      description: `${fieldLabel}에 대한 코멘트가 저장되었습니다.`
    });
  };

  const handleCancelInlineComment = () => {
    setActiveCommentField(null);
    setCurrentComment('');
  };

  const getFieldComment = (planId: string, fieldLabel: string) => {
    return inlineComments.find(c => c.planId === planId && c.fieldName === fieldLabel);
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
              onClick={() => handleInlineComment(plan, fieldName, fieldLabel)}
              className="text-xs px-2 py-1 h-6"
            >
              <Plus className="w-3 h-3 mr-1" />
              수정코멘트
            </Button>
          )}
        </div>
        {content}
        
        {/* 기존 코멘트 표시 */}
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
                onClick={() => handleInlineComment(plan, fieldName, fieldLabel)}
                className="text-xs px-1 py-0 h-5 text-orange-600 hover:text-orange-800"
              >
                수정
              </Button>
            </div>
          </div>
        )}

        {/* 인라인 코멘트 입력 필드 */}
        {isActiveComment && (
          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
            <div className="space-y-2">
              <Label className="text-sm font-medium">수정 코멘트</Label>
              <Input
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder={`${fieldLabel}에 대한 수정 요청 사항을 입력하세요...`}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSaveInlineComment(plan, fieldLabel)}
                  className="text-xs px-3 py-1 h-7"
                  disabled={!currentComment.trim()}
                >
                  <Send className="w-3 h-3 mr-1" />
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelInlineComment}
                  className="text-xs px-3 py-1 h-7"
                >
                  <X className="w-3 h-3 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPlanData = (plan: ContentPlanDetail) => {
    console.log('Rendering plan data for:', plan.influencerName, plan.planData);
    
    if (plan.contentType === 'image') {
      const imageData = plan.planData as ImagePlanData;
      return (
        <div className="space-y-4">
          {renderFieldWithFeedback(
            plan,
            'postTitle',
            '포스팅 제목',
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{imageData.postTitle || '제목이 입력되지 않았습니다.'}</p>
          )}
          
          {renderFieldWithFeedback(
            plan,
            'thumbnailTitle',
            '썸네일 제목',
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{imageData.thumbnailTitle || '썸네일 제목이 입력되지 않았습니다.'}</p>
          )}
          
          {renderFieldWithFeedback(
            plan,
            'referenceImages',
            '참고 이미지',
            imageData.referenceImages && imageData.referenceImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imageData.referenceImages.map((image, index) => (
                  <img key={index} src={image} alt={`Reference ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                ))}
              </div>
            ) : (
              <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">참고 이미지가 업로드되지 않았습니다.</p>
            )
          )}
          
          {renderFieldWithFeedback(
            plan,
            'script',
            '스크립트',
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{imageData.script || '스크립트가 입력되지 않았습니다.'}</p>
          )}
          
          {renderFieldWithFeedback(
            plan,
            'hashtags',
            '해시태그',
            imageData.hashtags && imageData.hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {imageData.hashtags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">해시태그가 입력되지 않았습니다.</p>
            )
          )}
        </div>
      );
    } else {
      const videoData = plan.planData as VideoPlanData;
      return (
        <div className="space-y-4">
          {renderFieldWithFeedback(
            plan,
            'postTitle',
            '포스팅 제목',
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{videoData.postTitle || '제목이 입력되지 않았습니다.'}</p>
          )}
          
          {renderFieldWithFeedback(
            plan,
            'scenario',
            '시나리오',
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{videoData.scenario || '시나리오가 입력되지 않았습니다.'}</p>
          )}
          
          {renderFieldWithFeedback(
            plan,
            'scenarioFiles',
            '시나리오 파일',
            videoData.scenarioFiles && videoData.scenarioFiles.length > 0 ? (
              <div className="space-y-2 mt-2">
                {videoData.scenarioFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">시나리오 파일이 업로드되지 않았습니다.</p>
            )
          )}
          
          {renderFieldWithFeedback(
            plan,
            'script',
            '스크립트',
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{videoData.script || '스크립트가 입력되지 않았습니다.'}</p>
          )}
          
          {renderFieldWithFeedback(
            plan,
            'hashtags',
            '해시태그',
            videoData.hashtags && videoData.hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {videoData.hashtags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">해시태그가 입력되지 않았습니다.</p>
            )
          )}
        </div>
      );
    }
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
        {plans.map((plan) => (
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
                <Badge className={getStatusColor(plan.status)}>
                  {getStatusText(plan.status)}
                </Badge>
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
                        setFieldFeedback(null);
                        setShowFeedbackForm(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      전체 수정요청
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
        ))}
      </div>

      {/* 상세보기 모달 - A4+ size width */}
      {selectedPlan && !showFeedbackForm && (
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
              {renderPlanData(selectedPlan)}
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
                    onClick={() => {
                      setFieldFeedback(null);
                      setShowFeedbackForm(true);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    전체 수정요청
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 피드백 모달 - A4+ size width */}
      {showFeedbackForm && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white mx-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  전체 수정 요청 - {selectedPlan.influencerName}
                </CardTitle>
                <Button variant="outline" onClick={() => {
                  setShowFeedbackForm(false);
                  setSelectedPlan(null);
                  setFieldFeedback(null);
                  setFeedback('');
                }}>
                  닫기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 저장된 인라인 코멘트들 표시 */}
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
                
                <div>
                  <Label htmlFor="feedback">전체 수정 요청 사항 (선택사항)</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="전체적인 수정 요청 사항이 있다면 입력해주세요..."
                    rows={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRequestRevision} className="bg-orange-600 hover:bg-orange-700">
                    수정 요청 전송
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowFeedbackForm(false);
                    setSelectedPlan(null);
                    setFieldFeedback(null);
                    setFeedback('');
                  }}>
                    취소
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BrandContentPlanReview;
