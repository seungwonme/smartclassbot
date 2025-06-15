
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, FileVideo, User } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import ProductionMiniCalendar from './ProductionMiniCalendar';

interface InfluencerDetailPanelProps {
  influencer: CampaignInfluencer;
  submission?: ContentSubmission;
}

const InfluencerDetailPanel: React.FC<InfluencerDetailPanelProps> = ({
  influencer,
  submission
}) => {
  const getExpectedContentType = (): 'image' | 'video' => {
    const deliverables = influencer.deliverables || [];
    const hasVideo = deliverables.some(d => 
      d.toLowerCase().includes('영상') || 
      d.toLowerCase().includes('video') || 
      d.toLowerCase().includes('릴스') ||
      d.toLowerCase().includes('쇼츠')
    );
    return hasVideo ? 'video' : 'image';
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'revision-request': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '임시저장';
      case 'submitted': return '제출완료';
      case 'revision-request': return '수정요청';
      case 'revision-feedback': return '수정완료';
      case 'approved': return '승인완료';
      case 'rejected': return '반려';
      default: return status;
    }
  };

  const expectedContentType = getExpectedContentType();
  const ContentIcon = expectedContentType === 'image' ? FileImage : FileVideo;

  return (
    <div className="space-y-4">
      {/* 인플루언서 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{influencer.name}</h3>
              <p className="text-sm text-gray-500">{influencer.platform}</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 콘텐츠 정보 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">콘텐츠 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <ContentIcon className="w-4 h-4 text-blue-600" />
            <span className="font-medium">
              {expectedContentType === 'image' ? '이미지 콘텐츠' : '영상 콘텐츠'}
            </span>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">제출 상태: </span>
            {submission ? (
              <Badge className={getSubmissionStatusColor(submission.status)}>
                {submission.contentType === 'image' ? <FileImage className="w-3 h-3 mr-1" /> : <FileVideo className="w-3 h-3 mr-1" />}
                {getSubmissionStatusText(submission.status)}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                콘텐츠 미제출
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 제작 일정 달력 */}
      {influencer.productionStartDate && influencer.productionDeadline ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductionMiniCalendar
            title="제작 시작일"
            selectedDate={influencer.productionStartDate}
          />
          <ProductionMiniCalendar
            title="제작 마감일"
            selectedDate={influencer.productionDeadline}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">제작 일정이 설정되지 않았습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfluencerDetailPanel;
