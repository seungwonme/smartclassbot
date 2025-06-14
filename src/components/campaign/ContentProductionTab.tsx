
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Users, ImageIcon, VideoIcon } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { ContentSubmission } from '@/types/contentSubmission';

interface ContentProductionTabProps {
  campaign: Campaign;
  contentSubmissions: ContentSubmission[];
  onShowUploadForm: (influencer: any, contentType: 'image' | 'video') => void;
}

const ContentProductionTab: React.FC<ContentProductionTabProps> = ({
  campaign,
  contentSubmissions,
  onShowUploadForm
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          콘텐츠 제작 및 업로드
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!campaign.influencers || campaign.influencers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">확정된 인플루언서가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 제작 가이드 */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📋 제작 가이드</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 승인된 기획안을 바탕으로 콘텐츠를 제작해주세요</li>
                <li>• 이미지는 JPEG, PNG, GIF, WebP 형식을 지원합니다</li>
                <li>• 영상은 MP4, AVI, MOV, WMV 형식을 지원합니다</li>
                <li>• 업로드 완료 후 자동으로 검수 단계로 넘어갑니다</li>
              </ul>
            </div>

            {/* 인플루언서별 콘텐츠 업로드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaign.influencers?.map((influencer) => {
                const influencerSubmissions = contentSubmissions.filter(s => s.influencerId === influencer.id);
                const hasSubmissions = influencerSubmissions.length > 0;
                
                return (
                  <Card key={influencer.id} className={hasSubmissions ? 'border-green-200 bg-green-50' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {influencer.name}
                        {hasSubmissions && (
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            제작완료
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          카테고리: {influencer.category}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onShowUploadForm(influencer, 'image')}
                            className="flex items-center gap-2"
                          >
                            <ImageIcon className="w-4 h-4" />
                            이미지 업로드
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onShowUploadForm(influencer, 'video')}
                            className="flex items-center gap-2"
                          >
                            <VideoIcon className="w-4 h-4" />
                            영상 업로드
                          </Button>
                        </div>

                        {hasSubmissions && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">제작된 콘텐츠:</p>
                            <div className="space-y-1">
                              {influencerSubmissions.map(submission => (
                                <div key={submission.id} className="text-xs text-gray-600 flex items-center gap-2">
                                  {submission.contentType === 'image' ? (
                                    <ImageIcon className="w-3 h-3" />
                                  ) : (
                                    <VideoIcon className="w-3 h-3" />
                                  )}
                                  {submission.contentType === 'image' ? '이미지' : '영상'} - {submission.contentFiles.length}개 파일
                                  <Badge variant="outline" className="text-xs">
                                    {submission.status === 'draft' ? '검수대기' : 
                                     submission.status === 'revision' ? '수정중' : '승인완료'}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentProductionTab;
