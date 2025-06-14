
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { ContentRevision } from '@/types/content';

interface ContentRevisionTimelineProps {
  revisions: ContentRevision[];
}

const ContentRevisionTimeline: React.FC<ContentRevisionTimelineProps> = ({ revisions }) => {
  const sortedRevisions = [...revisions].sort((a, b) => 
    new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
  );

  const getStatusIcon = (revision: ContentRevision) => {
    switch (revision.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (revision: ContentRevision) => {
    switch (revision.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (revision: ContentRevision) => {
    switch (revision.status) {
      case 'completed':
        return '완료';
      case 'pending':
        return revision.requestedBy === 'brand' ? '수정피드백 대기중' : '수정반영 대기중';
      default:
        return '대기';
    }
  };

  // 수정요청 번호를 브랜드 요청 기준으로 계산
  const getRevisionDisplayNumber = (revision: ContentRevision) => {
    const brandRevisions = sortedRevisions.filter(r => r.requestedBy === 'brand');
    
    if (revision.requestedBy === 'brand') {
      const brandIndex = brandRevisions.findIndex(r => r.id === revision.id);
      return brandIndex + 1;
    } else {
      // 시스템 피드백의 경우, 해당하는 브랜드 수정요청과 동일한 번호 사용
      const relatedBrandRevision = brandRevisions.find(br => 
        br.revisionNumber === revision.revisionNumber
      );
      if (relatedBrandRevision) {
        const brandIndex = brandRevisions.findIndex(r => r.id === relatedBrandRevision.id);
        return brandIndex + 1;
      }
      return revision.revisionNumber;
    }
  };

  const getRevisionTypeText = (revision: ContentRevision) => {
    return revision.requestedBy === 'brand' ? '수정요청' : '수정피드백';
  };

  if (sortedRevisions.length === 0) {
    return null;
  }

  const completedCount = sortedRevisions.filter(r => r.status === 'completed' && r.requestedBy === 'brand').length;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          수정 이력 ({completedCount}차 완료)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedRevisions.map((revision, index) => {
            const displayNumber = getRevisionDisplayNumber(revision);
            
            return (
              <div key={revision.id} className="relative">
                {index < sortedRevisions.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    {getStatusIcon(revision)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={
                        revision.requestedBy === 'brand' 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-purple-100 text-purple-800'
                      }>
                        {displayNumber}차 {getRevisionTypeText(revision)}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(revision)}>
                        {getStatusText(revision)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(revision.requestedAt).toLocaleDateString()} {new Date(revision.requestedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className={`rounded-lg p-3 mb-2 ${
                      revision.requestedBy === 'brand' 
                        ? 'bg-orange-50' 
                        : 'bg-purple-50'
                    }`}>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {revision.requestedBy === 'brand' ? '브랜드 수정요청' : '시스템 수정피드백'}: {revision.requestedByName}
                      </div>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap">
                        {revision.feedback}
                      </div>
                    </div>

                    {revision.response && revision.status === 'completed' && (
                      <div className="bg-green-50 rounded-lg p-3 ml-4">
                        <div className="text-sm font-medium text-green-700 mb-1">
                          수정 완료: {revision.respondedBy}
                        </div>
                        <div className="text-sm text-green-600 whitespace-pre-wrap mb-1">
                          {revision.response}
                        </div>
                        {revision.respondedAt && (
                          <div className="text-xs text-green-500">
                            {new Date(revision.respondedAt).toLocaleDateString()} {new Date(revision.respondedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentRevisionTimeline;
