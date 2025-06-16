import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Send, Calendar, Users, DollarSign, CheckCircle, FileText, Video } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import CampaignWorkflowSteps from '@/components/CampaignWorkflowSteps';
import InfluencerManagementTab from '@/components/campaign/InfluencerManagementTab';
import CampaignConfirmationSummary from '@/components/campaign/CampaignConfirmationSummary';
import ContentPlanList from '@/components/content/ContentPlanList';
import ContentPlanDetailView from '@/components/content/ContentPlanDetailView';
import BrandContentProductionTab from '@/components/content/BrandContentProductionTab';
import { Campaign } from '@/types/campaign';
import { ContentPlanDetail } from '@/types/content';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { useInlineComments } from '@/hooks/useInlineComments';
import { useFieldEditing } from '@/hooks/useFieldEditing';
import { useFieldFeedback } from '@/hooks/useFieldFeedback';
import { campaignService } from '@/services/campaign.service';
import { contentService } from '@/services/content.service';

const AdminCampaignDetail = () => {
  const {
    campaign,
    setCampaign,
    isLoading,
    activeTab,
    setActiveTab,
    handleEdit,
    handleDelete,
    handleInfluencerApproval,
    handleFinalConfirmation,
    updateCampaignInfluencers,
    toast
  } = useCampaignDetail();

  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanDetail | null>(null);

  // Inline comments state
  const {
    inlineComments,
    activeCommentField,
    currentComment,
    handleInlineComment,
    handleSaveInlineComment,
    handleCancelInlineComment,
    getFieldComment
  } = useInlineComments();

  // Field editing state
  const {
    editingField,
    editingValue,
    setEditingValue,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing
  } = useFieldEditing({
    onSaveEdit: async (planId: string, fieldName: string, newValue: any) => {
      if (!campaign) return;

      try {
        console.log('🔧 필드 수정 저장:', { planId, fieldName, newValue });
        
        const targetPlan = contentPlans.find(p => p.id === planId);
        if (!targetPlan) return;

        const updatedPlan = {
          ...targetPlan,
          [fieldName]: newValue,
          updatedAt: new Date().toISOString()
        };

        await contentService.updateContentPlan(campaign.id, planId, updatedPlan);

        setContentPlans(prev => prev.map(plan =>
          plan.id === planId ? updatedPlan : plan
        ));

        toast({
          title: "필드 수정 완료",
          description: `${fieldName} 필드가 성공적으로 수정되었습니다.`
        });

      } catch (error) {
        console.error('❌ 필드 수정 실패:', error);
        toast({
          title: "수정 실패",
          description: "필드 수정에 실패했습니다.",
          variant: "destructive"
        });
      }
    },
    onAfterSave: (planId: string, fieldName: string) => {
      console.log('✅ 편집 완료 콜백 실행:', { planId, fieldName });
      setJustEditedField(`${planId}-${fieldName}`);
    }
  });

  // 편집 완료 후 피드백 모드를 위한 상태
  const [justEditedField, setJustEditedField] = useState<string | null>(null);

  // Load content plans when campaign is loaded (강화된 로딩 및 디버깅)
  React.useEffect(() => {
    const loadContentPlans = async () => {
      if (campaign?.id) {
        try {
          setIsContentLoading(true);
          console.log('🎯 브랜드 관리자 - 콘텐츠 기획 로딩 시작');
          console.log('🎯 캠페인 정보:', {
            id: campaign.id,
            title: campaign.title,
            status: campaign.status,
            currentStage: campaign.currentStage
          });
          
          // 스토리지 전체 상태 및 디버깅 정보 확인
          const debugResult = await contentService.debugContentPlanStorage();
          console.log('🔍 디버깅 결과:', debugResult);
          
          // 강제 새로고침을 위해 약간의 지연 추가
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const plans = await contentService.getContentPlans(campaign.id);
          console.log('📋 로딩된 콘텐츠 기획:', plans);
          console.log('📊 기획안 개수:', plans.length);
          
          setContentPlans(plans);
          
          if (plans.length > 0) {
            console.log('✅ 콘텐츠 기획안 로딩 성공');
            toast({
              title: "콘텐츠 기획안 로딩 완료",
              description: `${plans.length}개의 기획안을 불러왔습니다.`
            });
          } else {
            console.log('⚠️ 해당 캠페인의 콘텐츠 기획안이 없습니다');
            // 디버깅: 전체 localStorage 상태 한번 더 확인
            console.log('🔍 localStorage 전체 상태 재확인:');
            Object.keys(localStorage).forEach(key => {
              if (key.includes('content') || key.includes('plan')) {
                console.log(`📝 ${key}:`, localStorage.getItem(key));
              }
            });
          }
        } catch (error) {
          console.error('❌ 콘텐츠 기획 로딩 실패:', error);
          toast({
            title: "콘텐츠 기획 로딩 실패",
            description: "콘텐츠 기획안을 불러오는데 실패했습니다.",
            variant: "destructive"
          });
        } finally {
          setIsContentLoading(false);
        }
      }
    };

    loadContentPlans();
  }, [campaign?.id, toast]);

  // 탭이 콘텐츠 기획으로 변경될 때 데이터 다시 로딩 (강화된 재로딩 및 디버깅)
  React.useEffect(() => {
    if (activeTab === 'planning' && campaign?.id) {
      const reloadContentPlans = async () => {
        try {
          setIsContentLoading(true);
          console.log('🔄 콘텐츠 기획 탭 활성화 - 강제 데이터 재로딩 시작');
          
          // 즉시 디버깅 정보 출력
          console.log('🔄 탭 활성화 시점 스토리지 디버깅:');
          const debugResult = await contentService.debugContentPlanStorage();
          console.log('🔄 디버깅 결과:', debugResult);
          
          // 약간의 지연 후 데이터 로딩
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const plans = await contentService.getContentPlans(campaign.id);
          console.log('🔄 재로딩된 기획안:', plans.length, '개');
          console.log('🔄 재로딩 상세:', plans);
          
          setContentPlans(plans);
          
          if (plans.length > 0) {
            toast({
              title: "기획안 업데이트",
              description: `${plans.length}개의 기획안이 확인되었습니다.`
            });
          } else {
            // 기획안이 없을 때 추가 디버깅
            console.log('🔄 기획안이 없음 - 추가 디버깅 시작');
            const allPlans = JSON.parse(localStorage.getItem('content_plans') || '[]');
            console.log('🔄 전체 기획안 목록:', allPlans);
            console.log('🔄 현재 캠페인 ID로 필터링 시도:', campaign.id);
            const matchingPlans = allPlans.filter((plan: any) => plan.campaignId === campaign.id);
            console.log('🔄 매칭되는 기획안:', matchingPlans);
          }
        } catch (error) {
          console.error('🔄 재로딩 실패:', error);
        } finally {
          setIsContentLoading(false);
        }
      };
      reloadContentPlans();
    }
  }, [activeTab, campaign?.id, toast]);

  const handleCreatePlan = async (newPlan: ContentPlanDetail) => {
    if (!campaign) return;

    try {
      setIsContentLoading(true);
      // Optimistically update the local state
      setContentPlans(prevPlans => [...prevPlans, newPlan]);
      setSelectedPlan(newPlan);

      // Persist the new content plan
      await contentService.createContentPlan(campaign.id, newPlan);

      toast({
        title: "기획안 생성 완료",
        description: "새로운 콘텐츠 기획안이 생성되었습니다."
      });
    } catch (error) {
      console.error('기획안 생성 실패:', error);
      toast({
        title: "생성 실패",
        description: "새로운 콘텐츠 기획안 생성에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleContentPlanApprove = async (planId: string) => {
    if (!campaign) return;

    try {
      await contentService.updateContentPlan(campaign.id, planId, { status: 'approved' });

      // Update local state
      setContentPlans(prev => prev.map(plan =>
        plan.id === planId ? { ...plan, status: 'approved' } : plan
      ));

      toast({
        title: "콘텐츠 기획 승인 완료",
        description: "콘텐츠 기획안이 승인되었습니다."
      });

    } catch (error) {
      console.error('콘텐츠 기획 승인 실패:', error);
      toast({
        title: "승인 실패",
        description: "콘텐츠 기획 승인에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleContentPlanRevision = async (planId: string, feedback: string) => {
    if (!campaign) return;

    try {
      const targetPlan = contentPlans.find(p => p.id === planId);
      
      const revisionNumber = (targetPlan?.currentRevisionNumber || 0) + 1;
      
      const newRevision = {
        id: `revision_${Date.now()}`,
        revisionNumber,
        feedback,
        requestedBy: 'admin' as const,
        requestedByName: '시스템 관리자',
        requestedAt: new Date().toISOString(),
        status: 'pending' as const
      };

      const updatedPlan = {
        ...targetPlan!,
        status: 'revision-feedback' as const,
        revisions: [...(targetPlan?.revisions || []), newRevision],
        currentRevisionNumber: revisionNumber,
        updatedAt: new Date().toISOString()
      };

      await contentService.updateContentPlan(campaign.id, planId, updatedPlan);

      setContentPlans(prev => prev.map(plan =>
        plan.id === planId ? updatedPlan : plan
      ));

      // 편집 완료 후 피드백 모드 해제
      setJustEditedField(null);

      toast({
        title: "수정 피드백 완료",
        description: "콘텐츠 기획 수정 피드백이 브랜드 관리자에게 전송되었습니다."
      });

    } catch (error) {
      console.error('콘텐츠 기획 수정 피드백 실패:', error);
      toast({
        title: "피드백 전송 실패",
        description: "콘텐츠 기획 수정 피드백 전송에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!campaign) return;
    
    try {
      console.log('캠페인 제출 시작 - 현재 상태:', campaign.status);
      
      // 캠페인을 제출됨 상태로 변경 - 올바른 방식으로 호출
      const updatedInfluencers = campaign.influencers.map(inf => ({ ...inf }));
      await updateCampaignInfluencers(updatedInfluencers);
      
      // 상태 업데이트를 위한 별도 호출
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { status: 'submitted' });
      
      console.log('캠페인 상태를 submitted로 변경 완료');
      
      toast({
        title: "캠페인 제출 완료",
        description: "캠페인이 성공적으로 제출되었습니다. 시스템 관리자가 검토 후 섭외를 진행합니다."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('캠페인 제출 실패:', error);
      toast({
        title: "제출 실패",
        description: "캠페인 제출에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 캠페인 진행 동의 처리
  const handleCampaignConfirmation = async () => {
    if (!campaign) return;
    
    try {
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { 
        status: 'planning',
        currentStage: 2
      });
      
      toast({
        title: "캠페인 진행 동의 완료",
        description: "캠페인이 콘텐츠 기획 단계로 진행됩니다. 정산 관리에서 납부 정보를 확인하세요."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('캠페인 진행 동의 실패:', error);
      toast({
        title: "처리 실패",
        description: "캠페인 진행 동의 처리에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 콘텐츠 검수 단계로 전환하는 함수 추가
  const handleContentReviewReady = async () => {
    if (!campaign) return;
    
    try {
      const { campaignService } = await import('@/services/campaign.service');
      await campaignService.updateCampaign(campaign.id, { 
        status: 'content-review',
        currentStage: 4
      });
      
      toast({
        title: "콘텐츠 검수 단계로 전환",
        description: "모든 콘텐츠가 제출되어 검수 단계로 진행됩니다."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('콘텐츠 검수 단계 전환 실패:', error);
      toast({
        title: "전환 실패",
        description: "콘텐츠 검수 단계로 전환에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'revising': return 'bg-red-100 text-red-800';
      case 'revision-feedback': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'plan-review': return 'bg-indigo-100 text-indigo-800';
      case 'plan-approved': return 'bg-lime-100 text-lime-800';
      case 'producing': return 'bg-teal-100 text-teal-800';
      case 'content-review': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'live': return 'bg-rose-100 text-rose-800';
      case 'monitoring': return 'bg-cyan-100 text-cyan-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'submitted': return '제출됨';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'revising': return '제안수정요청';
      case 'revision-feedback': return '제안수정피드백';
      case 'confirmed': return '확정됨';
      case 'planning': return '콘텐츠 기획중';
      case 'plan-review': return '콘텐츠 기획중';
      case 'plan-revision': return '콘텐츠 기획중';
      case 'plan-approved': return '콘텐츠 기획중';
      case 'producing': return '제작중';
      case 'content-review': return '콘텐츠검토';
      case 'live': return '라이브';
      case 'monitoring': return '모니터링';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const getNextAction = () => {
    if (!campaign) return null;
    
    const stage = campaign.currentStage;
    const status = campaign.status;
    
    switch (stage) {
      case 1:
        if (status === 'creating') return '캠페인 제출 필요';
        if (status === 'recruiting') return '인플루언서 섭외 진행중';
        if (status === 'proposing') return '제안 검토 필요';
        if (status === 'confirmed') return '콘텐츠 기획 단계로 진행 가능';
        break;
      case 2:
        return '콘텐츠 기획안 작성/검토';
      case 3:
        return '콘텐츠 제작/검수';
      case 4:
        return '성과 모니터링';
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">캠페인을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const isCreating = campaign.status === 'creating';
  const isConfirmed = campaign.status === 'confirmed';
  const isPlanning = ['planning', 'plan-review'].includes(campaign.status);
  const isProducing = ['producing', 'content-review'].includes(campaign.status);

  // Define confirmedInfluencers from campaign data
  const confirmedInfluencers = campaign.influencers?.filter(inf => inf.status === 'confirmed') || [];

  const handleEditClick = () => {
    if (handleEdit) {
      handleEdit();
    }
  };

  const handleDeleteClick = () => {
    if (handleDelete) {
      handleDelete();
    }
  };

  const handleSubmitClick = () => {
    if (handleSubmit) {
      handleSubmit();
    }
  };

  const handleFinalConfirmationClick = () => {
    if (handleFinalConfirmation) {
      handleFinalConfirmation();
    }
  };

  // useFieldFeedback hook for rendering fields with feedback functionality
  const { renderFieldWithFeedback } = useFieldFeedback({
    activeCommentField,
    currentComment,
    handleInlineComment,
    handleSaveInlineComment,
    handleCancelInlineComment,
    getFieldComment,
    canReviewPlan: () => true,
    editingField,
    editingValue,
    setEditingValue,
    onStartEdit: startEditing,
    onSaveEdit: saveEdit,
    onCancelEdit: cancelEdit
  });

  const canReviewPlan = (plan: ContentPlanDetail) => {
    return plan.status === 'draft' || plan.status === 'revision-request';
  };

  const hasPlanContent = (plan: ContentPlanDetail) => {
    if (plan.contentType === 'image') {
      const imageData = plan.planData as any;
      return !!(imageData.postTitle && imageData.script && imageData.hashtags?.length);
    } else {
      const videoData = plan.planData as any;
      return !!(videoData.postTitle && videoData.script && videoData.hashtags?.length);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                캠페인 목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusText(campaign.status)}
                </Badge>
                {getNextAction() && (
                  <Badge variant="outline" className="text-blue-600">
                    {getNextAction()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isCreating && (
              <>
                <Button onClick={handleEditClick} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button onClick={handleDeleteClick} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
                <Button onClick={handleSubmitClick} className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  제출
                </Button>
              </>
            )}
            {isConfirmed && (
              <Button onClick={handleFinalConfirmationClick} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                최종 확정
              </Button>
            )}
          </div>
        </div>

        <CampaignWorkflowSteps campaign={campaign} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">📋 기본정보</TabsTrigger>
            <TabsTrigger value="influencers">👥 인플루언서 관리</TabsTrigger>
            <TabsTrigger value="planning" disabled={campaign.currentStage < 2 && !isPlanning}>💡 콘텐츠 기획</TabsTrigger>
            <TabsTrigger value="production" disabled={campaign.currentStage < 3}>🎬 콘텐츠 제작</TabsTrigger>
            <TabsTrigger value="content" disabled={campaign.currentStage < 4}>🔍 콘텐츠 검수</TabsTrigger>
          </TabsList>

          
          <TabsContent value="basic" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">브랜드</label>
                    <p className="text-lg">{campaign.brandName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">제품</label>
                    <p className="text-lg">{campaign.productName}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">예산</label>
                      <p className="text-lg">{campaign.budget.toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">캠페인 기간</label>
                      <p className="text-lg">{campaign.campaignStartDate} ~ {campaign.campaignEndDate}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">제안 마감일</label>
                    <p className="text-lg">{campaign.proposalDeadline}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">광고 유형</label>
                    <p className="text-lg">{campaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>타겟 콘텐츠 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">인플루언서 카테고리</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.targetContent.influencerCategories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">타겟 연령층</label>
                    <p className="text-lg">{campaign.targetContent.targetAge}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">USP 중요도</label>
                    <p className="text-lg">{campaign.targetContent.uspImportance}/10</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">인플루언서 영향력</label>
                    <p className="text-lg">{campaign.targetContent.influencerImpact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">추가 설명</label>
                    <p className="text-lg">{campaign.targetContent.additionalDescription || '없음'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">2차 콘텐츠 활용</label>
                    <p className="text-lg">{campaign.targetContent.secondaryContentUsage ? '예' : '아니오'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="influencers" className="mt-6">
            <InfluencerManagementTab
              campaign={campaign}
              onInfluencerApproval={handleInfluencerApproval}
              onUpdateInfluencers={updateCampaignInfluencers}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="planning" className="mt-6">
            {isContentLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-lg">콘텐츠 기획안을 불러오는 중...</div>
                  <p className="text-sm text-gray-500 mt-2">데이터를 동기화하고 있습니다.</p>
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
                <div className="col-span-4">
                  <ContentPlanList
                    plans={contentPlans}
                    onSelectPlan={setSelectedPlan}
                    onCreatePlan={handleCreatePlan}
                    canCreatePlan={true}
                  />
                </div>
                <div className="col-span-8">
                  <ContentPlanDetailView
                    selectedPlan={selectedPlan}
                    showRevisionForm={false}
                    inlineComments={inlineComments}
                    onApprove={handleContentPlanApprove}
                    onRequestRevision={() => {}}
                    onSubmitRevision={(feedback: string) => {
                      if (selectedPlan) {
                        handleContentPlanRevision(selectedPlan.id, feedback);
                      }
                    }}
                    onCancelRevision={() => setJustEditedField(null)}
                    canReviewPlan={canReviewPlan}
                    hasPlanContent={hasPlanContent}
                    renderFieldWithFeedback={renderFieldWithFeedback}
                    plans={contentPlans}
                    editingField={editingField}
                    editingValue={editingValue}
                    setEditingValue={setEditingValue}
                    onStartEdit={startEditing}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                    justEditedField={justEditedField}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="production" className="mt-6">
            {isProducing || campaign.currentStage >= 3 ? (
              <BrandContentProductionTab
                campaignId={campaign.id}
                confirmedInfluencers={confirmedInfluencers}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    콘텐츠 제작
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    콘텐츠 제작 단계가 아직 시작되지 않았습니다.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  콘텐츠 검수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 검수 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminCampaignDetail;
