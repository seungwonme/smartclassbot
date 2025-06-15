
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquare, Clock, FileImage, FileVideo } from 'lucide-react';
import { ContentSubmission } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { useInlineComments } from '@/hooks/useInlineComments';
import ContentRevisionTimeline from './ContentRevisionTimeline';
import RevisionRequestForm from './RevisionRequestForm';
import InlineCommentForm from './InlineCommentForm';

interface BrandContentReviewProps {
  submissions: ContentSubmission[];
  onApprove: (submissionId: string) => void;
  onRequestRevision: (submissionId: string, feedback: string) => void;
}

const BrandContentReview: React.FC<BrandContentReviewProps> = ({
  submissions,
  onApprove,
  onRequestRevision
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<ContentSubmission | null>(null);
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

  const getStatusColor = (status: ContentSubmission['status']) => {
    switch (status) {
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'revision-request': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentSubmission['status']) => {
    switch (status) {
      case 'draft': return '콘텐츠 초안';
      case 'submitted': return '제출완료';
      case 'revision-request': return '수정요청';
      case 'revision-feedback': return '수정완료';
      case 'approved': return '콘텐츠 승인';
      case 'rejected': return '반려';
      default: return status;
    }
  };

  const getContentTypeInfo = (contentType: 'image' | 'video') => {
    if (contentType === 'image') {
      return {
        icon: FileImage,
        label: '이미지 콘텐츠',
        description: '피드용 이미지 포스팅',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      };
    } else {
      return {
        icon: FileVideo,
        label: '영상 콘텐츠',
        description: '동영상 포스팅',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
      };
    }
  };

  const canReviewSubmission = (submission: ContentSubmission) => {
    return submission.status === 'submitted' || submission.status === 'revision-feedback';
  };

  const handleApprove = (submissionId: string) => {
    onApprove(submissionId);
    setSelectedSubmission(null);
    setShowRevisionForm(false);
    resetComments();
    toast({
      title: "콘텐츠 승인",
      description: "콘텐츠가 승인되었습니다."
    });
  };

  const handleRequestRevision = (feedback: string) => {
    if (!selectedSubmission) return;

    const submissionComments = inlineComments.filter(comment => comment.planId === selectedSubmission.id);
    let finalFeedback = feedback.trim();

    if (submissionComments.length > 0) {
      const commentsFeedback = submissionComments.map(comment => 
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

    onRequestRevision(selectedSubmission.id, finalFeedback);
    setShowRevisionForm(false);
    setSelectedSubmission(null);
    resetComments();
    toast({
      title: "수정 요청 전송",
      description: "콘텐츠 수정 요청이 전송되었습니다."
    });
  };

  const renderContentPreview = (submission: ContentSubmission) => {
    return (
      <div className="space-y-4">
        <h4 className="font-medium">제출된 콘텐츠</h4>
        <div className="grid grid-cols-2 gap-4">
          {submission.contentFiles.map((file, index) => (
            <div key={file.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {file.type === 'image' ? (
                  <FileImage className="w-4 h-4" />
                ) : (
                  <FileVideo className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <video 
                  src={file.url} 
                  controls
                  className="w-full h-48 rounded"
                />
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                업로드: {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">아직 제출된 콘텐츠가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {submissions.map((submission) => {
          const contentTypeInfo = getContentTypeInfo(submission.contentType);
          const ContentTypeIcon = contentTypeInfo.icon;

          return (
            <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedSubmission(submission)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <ContentTypeIcon className="w-5 h-5" />
                    {submission.influencerName}
                  </CardTitle>
                  <Badge className={getStatusColor(submission.status)}>
                    {getStatusText(submission.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* 콘텐츠 유형 정보 카드 */}
                  <div className={`p-3 rounded-lg border ${contentTypeInfo.bgColor} ${contentTypeInfo.borderColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <ContentTypeIcon className={`w-4 h-4 ${contentTypeInfo.textColor}`} />
                      <span className={`text-sm font-medium ${contentTypeInfo.textColor}`}>
                        {contentTypeInfo.label}
                      </span>
                    </div>
                    <p className={`text-xs ${contentTypeInfo.textColor} opacity-80`}>
                      {contentTypeInfo.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      파일 수: {submission.contentFiles.length}개
                    </p>
                    <p className="text-sm text-gray-600">
                      제출일: {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                    {submission.revisions && submission.revisions.length > 0 && (
                      <p className="text-sm text-gray-600">
                        수정 차수: {submission.currentRevisionNumber}차
                      </p>
                    )}
                  </div>

                  {canReviewSubmission(submission) && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(submission.id);
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
                          setSelectedSubmission(submission);
                          setShowRevisionForm(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        수정요청
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSubmission && !showRevisionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white mx-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {selectedSubmission.contentType === 'image' ? (
                    <FileImage className="w-5 h-5" />
                  ) : (
                    <FileVideo className="w-5 h-5" />
                  )}
                  {selectedSubmission.influencerName} - 콘텐츠 상세
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  닫기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 콘텐츠 유형 정보 */}
              <div className="mb-6">
                {(() => {
                  const contentTypeInfo = getContentTypeInfo(selectedSubmission.contentType);
                  const ContentTypeIcon = contentTypeInfo.icon;
                  return (
                    <div className={`p-4 rounded-lg border ${contentTypeInfo.bgColor} ${contentTypeInfo.borderColor}`}>
                      <div className="flex items-center gap-3">
                        <ContentTypeIcon className={`w-6 h-6 ${contentTypeInfo.textColor}`} />
                        <div>
                          <h3 className={`font-medium ${contentTypeInfo.textColor}`}>
                            {contentTypeInfo.label}
                          </h3>
                          <p className={`text-sm ${contentTypeInfo.textColor} opacity-80`}>
                            {contentTypeInfo.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {renderContentPreview(selectedSubmission)}
              
              {selectedSubmission.revisions && selectedSubmission.revisions.length > 0 && (
                <ContentRevisionTimeline revisions={selectedSubmission.revisions} />
              )}
              
              {canReviewSubmission(selectedSubmission) && (
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={() => handleApprove(selectedSubmission.id)}
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

      {showRevisionForm && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white mx-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  수정 요청 - {selectedSubmission.influencerName}
                </CardTitle>
                <Button variant="outline" onClick={() => {
                  setShowRevisionForm(false);
                  setSelectedSubmission(null);
                  resetComments();
                }}>
                  닫기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RevisionRequestForm
                revisionNumber={(selectedSubmission.currentRevisionNumber || 0) + 1}
                onSubmit={handleRequestRevision}
                onCancel={() => {
                  setShowRevisionForm(false);
                  setSelectedSubmission(null);
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

export default BrandContentReview;
