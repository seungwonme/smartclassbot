import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContentPlanDetail } from '@/types/content';
import { contentService } from '@/services/content.service';
import { useToast } from '@/hooks/use-toast';
import { Edit, Eye, FileText, VideoIcon, ImageIcon, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AdminContentPlanning = () => {
  const [plans, setPlans] = useState<ContentPlanDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContentPlans();
  }, []);

  const loadContentPlans = async () => {
    setIsLoading(true);
    try {
      const allPlans = await contentService.getAllContentPlans();
      setPlans(allPlans);
    } catch (error) {
      console.error('Error loading content plans:', error);
      toast({
        title: "Failed to load content plans",
        description: "There was an error loading the content plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'waiting': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'revision-request': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentPlanDetail['status']) => {
    switch (status) {
      case 'waiting': return '기획 대기중';
      case 'draft': return '기획초안';
      case 'revision-request': return '기획수정중';
      case 'revision-feedback': return '기획수정중';
      case 'approved': return '기획완료';
      case 'completed': return '콘텐츠 기획완료';
      default: return status;
    }
  };

  const filteredPlans = plans.filter(plan => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      plan.influencerName.toLowerCase().includes(searchTerm) ||
      plan.campaignId.toLowerCase().includes(searchTerm) ||
      ('postTitle' in plan.planData && plan.planData.postTitle.toLowerCase().includes(searchTerm))
    );
  });

  const handleDeletePlan = async (planId: string) => {
    try {
      await contentService.deleteContentPlan(planId);
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
      toast({
        title: "Content plan deleted",
        description: "The content plan has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting content plan:", error);
      toast({
        title: "Failed to delete content plan",
        description: "There was an error deleting the content plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderPlanCard = (plan: ContentPlanDetail) => {
    const hasRevisions = plan.revisions && plan.revisions.length > 0;
    const hasPendingRevision = plan.status === 'revision-request';

    return (
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
        <TableCell>{plan.campaignId}</TableCell>
        <TableCell>{plan.influencerName}</TableCell>
        <TableCell>
          {'postTitle' in plan.planData ? plan.planData.postTitle : '제목 없음'}
        </TableCell>
        <TableCell className="text-center">
          <Badge className={getStatusColor(plan.status)}>
            {getStatusText(plan.status)}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          {hasRevisions ? `${plan.revisions.length}회` : '없음'}
        </TableCell>
        <TableCell className="text-center">
          {new Date(plan.updatedAt).toLocaleDateString()}
        </TableCell>
        <TableCell className="text-center">
          <div className="flex justify-center gap-2">
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeletePlan(plan.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">콘텐츠 기획 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="search">검색:</Label>
              <Input
                type="text"
                id="search"
                placeholder="캠페인 ID, 인플루언서 이름, 제목 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">타입</TableHead>
                    <TableHead>캠페인 ID</TableHead>
                    <TableHead>인플루언서</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-center">수정 횟수</TableHead>
                    <TableHead className="text-center">수정일</TableHead>
                    <TableHead className="text-center w-32">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No content plans found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlans.map(renderPlanCard)
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContentPlanning;
