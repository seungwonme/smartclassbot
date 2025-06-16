import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContentPlanDetail } from '@/types/content';
import { contentService } from '@/services/content.service';
import { useToast } from '@/hooks/use-toast';
import { useInlineComments } from '@/hooks/useInlineComments';
import { useFieldFeedback } from '@/hooks/useFieldFeedback';
import { useFieldEditing } from '@/hooks/useFieldEditing';
import { Edit, Eye, FileText, VideoIcon, ImageIcon, Trash2 } from 'lucide-react';
import ContentPlanDetailView from '@/components/content/ContentPlanDetailView';
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
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanDetail | null>(null);
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

  const handleSaveFieldEdit = async (planId: string, fieldName: string, newValue: any) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('기획안을 찾을 수 없습니다');
      }

      // planData 업데이트
      const updatedPlanData = {
        ...plan.planData,
        [fieldName]: newValue
      };

      // 서버에 저장
      const updatedPlan = await contentService.updateContentPlan(plan.campaignId, planId, {
        planData: updatedPlanData
      });

      // 로컬 상태 업데이트
      setPlans(prev => prev.map(p => p.id === planId ? updatedPlan : p));
      
      // 선택된 플랜도 업데이트
      if (selectedPlan?.id === planId) {
        setSelectedPlan(updatedPlan);
      }

      toast({
        title: "수정 완료",
        description: `${fieldName} 필드가 성공적으로 수정되었습니다.`
      });

    } catch (error) {
      console.error('필드 수정 실패:', error);
      toast({
        title: "수정 실패",
        description: "필드 수정에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
      throw error; // useFieldEditing에서 에러를 처리할 수 있도록
    }
  };

  const {
    editingField,
    editingValue,
    setEditingValue,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing
  } = useFieldEditing({
    onSaveEdit: handleSaveFieldEdit
  });

  const canReviewPlan = (plan: ContentPlanDetail) => {
    return true; // 시스템 관리자는 모든 기획안을 검토할 수 있음
  };

  // 디버깅을 위한 로그 추가
  console.log('📊 AdminContentPlanning Debug:', {
    currentPath: window.location.pathname,
    selectedPlan: selectedPlan?.id,
    editingField,
    editingValue,
    hasStartEditing: !!startEditing,
    hasSaveEdit: !!saveEdit,
    hasCancelEdit: !!cancelEdit,
    startEditingType: typeof startEditing
  });

  const { renderFieldWithFeedback } = useFieldFeedback({
    activeCommentField,
    currentComment,
    handleInlineComment,
    handleSaveInlineComment,
    handleCancelInlineComment,
    getFieldComment,
    canReviewPlan,
    editingField,
    editingValue,
    setEditingValue,
    onStartEdit: startEditing,
    onSaveEdit: saveEdit,
    onCancelEdit: cancelEdit
  });

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

  const handleSelectPlan = (plan: ContentPlanDetail) => {
    setSelectedPlan(plan);
    setShowRevisionForm(false);
    // 기획안 선택 시 편집 모드 초기화
    cancelEdit();
  };

  const handleApprove = (planId: string) => {
    // TODO: 승인 로직 구현
    toast({
      title: "콘텐츠 기획 승인",
      description: "콘텐츠 기획이 승인되었습니다."
    });
  };

  const handleRequestRevision = (feedback: string) => {
    // TODO: 수정요청 로직 구현
    toast({
      title: "수정 요청 전송",
      description: "콘텐츠 기획 수정 요청이 전송되었습니다."
    });
  };

  const renderPlanCard = (plan: ContentPlanDetail) => {
    const hasRevisions = plan.revisions && plan.revisions.length > 0;

    return (
      <TableRow key={plan.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectPlan(plan)}>
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
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan); }}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 기획안 목록 */}
        <div className="lg:col-span-2">
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

        {/* 우측: 콘텐츠 기획 상세 */}
        <div className="lg:col-span-1">
          <ContentPlanDetailView
            selectedPlan={selectedPlan}
            showRevisionForm={showRevisionForm}
            inlineComments={inlineComments}
            onApprove={handleApprove}
            onRequestRevision={() => setShowRevisionForm(true)}
            onSubmitRevision={handleRequestRevision}
            onCancelRevision={() => setShowRevisionForm(false)}
            canReviewPlan={canReviewPlan}
            hasPlanContent={() => true}
            renderFieldWithFeedback={renderFieldWithFeedback}
            plans={plans}
            editingField={editingField}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            onStartEdit={startEditing}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminContentPlanning;
