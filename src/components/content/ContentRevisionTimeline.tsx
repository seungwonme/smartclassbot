
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
        return '피드백 대기중';
      default:
        return '대기';
    }
  };

  if (sortedRevisions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          수정 이력 ({sortedRevisions.filter(r => r.status === 'completed').length}차 완료)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedRevisions.map((revision, index) => (
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
                    <Badge className="bg-blue-100 text-blue-800">
                      {revision.revisionNumber + 1}차 수정요청
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(revision)}>
                      {getStatusText(revision)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(revision.requestedAt).toLocaleDateString()} {new Date(revision.requestedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      수정요청: {revision.requestedByName}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                      {revision.feedback}
                    </div>
                  </div>

                  {revision.response && revision.status === 'completed' && (
                    <div className="bg-purple-50 rounded-lg p-3 ml-4">
                      <div className="text-sm font-medium text-purple-700 mb-1">
                        시스템 피드백: {revision.respondedBy}
                      </div>
                      <div className="text-sm text-purple-600 whitespace-pre-wrap mb-1">
                        {revision.response}
                      </div>
                      {revision.respondedAt && (
                        <div className="text-xs text-purple-500">
                          {new Date(revision.respondedAt).toLocaleDateString()} {new Date(revision.respondedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentRevisionTimeline;
