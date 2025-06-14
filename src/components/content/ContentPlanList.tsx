
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, FileText, VideoIcon, ImageIcon } from 'lucide-react';
import { ContentPlanDetail } from '@/types/content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ContentPlanListProps {
  plans: ContentPlanDetail[];
  onEdit?: (plan: ContentPlanDetail) => void;
  onView?: (plan: ContentPlanDetail) => void;
  onPlanUpdate?: (planId: string, updates: any) => void;
  userType?: 'admin' | 'brand';
}

const ContentPlanList: React.FC<ContentPlanListProps> = ({
  plans,
  onEdit,
  onView,
  onPlanUpdate,
  userType = 'admin'
}) => {
  const getStatusColor = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'revision-requested': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'draft': return '기획초안';
      case 'revision-requested': return '기획수정중';
      case 'revision-feedback': return '기획수정중';
      case 'approved': return '기획완료';
      default: return status;
    }
  };

  const handleStatusUpdate = (planId: string, newStatus: ContentPlanDetail['status']) => {
    if (onPlanUpdate) {
      onPlanUpdate(planId, { status: newStatus });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          콘텐츠 기획 목록 ({plans.length}개)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {plans.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">타입</TableHead>
                  <TableHead>인플루언서</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">수정일</TableHead>
                  <TableHead className="text-center w-32">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex justify-center">
                        {plan.contentType === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <VideoIcon className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {plan.influencerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{plan.influencerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {'postTitle' in plan.planData ? plan.planData.postTitle : '제목 없음'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusText(plan.status)}
                        </Badge>
                        {userType === 'admin' && plan.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(plan.id, 'approved')}
                            className="text-xs"
                          >
                            승인
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-500">
                      {new Date(plan.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        {onView && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onView(plan)}
                            className="p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(plan)}
                            className="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            작성된 콘텐츠 기획이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentPlanList;
