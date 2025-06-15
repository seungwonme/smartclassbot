
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, FileVideo, User } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import ProductionRangeCalendar from './ProductionRangeCalendar';

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
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* 좌측: 인플루언서 및 콘텐츠 정보 (60%) */}
          <div className="flex-1" style={{ flexBasis: '60%' }}>
            {/* 인플루언서 정보 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                  <p className="text-sm text-gray-500">{influencer.platform}</p>
                </div>
              </div>
              
              {/* 콘텐츠 상태 */}
              <div>
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
            </div>

            {/* 구분선 */}
            <hr className="border-gray-200 mb-4" />

            {/* 콘텐츠 타입 정보 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ContentIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  {expectedContentType === 'image' ? '이미지 콘텐츠' : '영상 콘텐츠'}
                </span>
              </div>
              
              {influencer.deliverables && influencer.deliverables.length > 0 && (
                <div className="ml-7">
                  <div className="text-sm text-gray-600 mb-1">산출물</div>
                  <div className="flex flex-wrap gap-1">
                    {influencer.deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 제작 기간 정보 */}
              {influencer.productionStartDate && influencer.productionDeadline && (
                <div className="ml-7">
                  <div className="text-sm text-gray-600 mb-1">제작 기간</div>
                  <div className="text-sm text-gray-800">
                    {influencer.productionStartDate} ~ {influencer.productionDeadline}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px bg-gray-200"></div>

          {/* 우측: 제작 일정 달력 (40%) */}
          <div style={{ flexBasis: '40%' }}>
            {influencer.productionStartDate && influencer.productionDeadline ? (
              <ProductionRangeCalendar
                startDate={influencer.productionStartDate}
                deadline={influencer.productionDeadline}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">제작 일정이 설정되지 않았습니다.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerDetailPanel;
