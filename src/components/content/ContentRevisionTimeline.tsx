
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
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (revision: ContentRevision) => {
    switch (revision.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeText = (revision: ContentRevision) => {
    return revision.requestedBy === 'brand' ? '수정요청' : '수정피드백';
  };

  const getRequestTypeColor = (revision: ContentRevision) => {
    return revision.requestedBy === 'brand' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  if (sortedRevisions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          수정 이력 ({sortedRevisions.length}차)
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
                    <Badge className={getRequestTypeColor(revision)}>
                      {revision.revisionNumber}차 {getRequestTypeText(revision)}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(revision)}>
                      {revision.status === 'completed' ? '완료' : 
                       revision.status === 'in-progress' ? '진행중' : '대기'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(revision.requestedAt).toLocaleDateString()} {new Date(revision.requestedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {revision.requestedByName} ({revision.requestedBy === 'brand' ? '브랜드 관리자' : '시스템 관리자'})
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                      {revision.feedback}
                    </div>
                  </div>

                  {revision.response && revision.status === 'completed' && (
                    <div className="bg-blue-50 rounded-lg p-3 ml-4">
                      <div className="text-sm font-medium text-blue-700 mb-1">
                        응답: {revision.respondedBy} ({revision.requestedBy === 'brand' ? '시스템 관리자' : '브랜드 관리자'})
                      </div>
                      <div className="text-sm text-blue-600 whitespace-pre-wrap mb-1">
                        {revision.response}
                      </div>
                      {revision.respondedAt && (
                        <div className="text-xs text-blue-500">
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
