
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, MessageSquare, Send } from 'lucide-react';
import { ContentReviewRevision } from '@/types/content';

interface ContentReviewTimelineProps {
  revisions: ContentReviewRevision[];
}

const ContentReviewTimeline: React.FC<ContentReviewTimelineProps> = ({ revisions }) => {
  const getRevisionIcon = (revision: ContentReviewRevision) => {
    if (revision.status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (revision.status === 'pending') {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return <MessageSquare className="w-4 h-4 text-blue-500" />;
  };

  const getRevisionStatusText = (revision: ContentReviewRevision) => {
    if (revision.requestedBy === 'brand') {
      return revision.status === 'completed' ? '수정요청 (완료됨)' : '수정요청 (대기중)';
    } else {
      return revision.status === 'completed' ? '수정피드백 (완료됨)' : '수정피드백 (진행중)';
    }
  };

  const getRevisionStatusColor = (revision: ContentReviewRevision) => {
    if (revision.status === 'completed') {
      return 'bg-green-100 text-green-800';
    } else if (revision.status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  const sortedRevisions = [...revisions].sort((a, b) => 
    new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  return (
    <div>
      <h4 className="font-medium mb-3">검수 히스토리</h4>
      <div className="space-y-4">
        {sortedRevisions.map((revision) => (
          <div key={revision.id} className="border-l-2 border-gray-200 pl-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getRevisionIcon(revision)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getRevisionStatusColor(revision)}>
                    {revision.revisionNumber}차 {getRevisionStatusText(revision)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(revision.requestedAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    {revision.requestedByName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {revision.feedback}
                  </p>
                </div>

                {revision.response && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      응답 ({revision.respondedBy})
                    </p>
                    <p className="text-sm text-gray-600">
                      {revision.response}
                    </p>
                    {revision.respondedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(revision.respondedAt).toLocaleString('ko-KR')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentReviewTimeline;
