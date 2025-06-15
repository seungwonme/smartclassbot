import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Users, DollarSign, FileText, Video, Edit, Plus, Send, Save } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import CampaignWorkflowSteps from '@/components/CampaignWorkflowSteps';
import InfluencerManagementTab from '@/components/campaign/InfluencerManagementTab';
import ContentPlanForm from '@/components/content/ContentPlanForm';
import ContentRevisionTimeline from '@/components/content/ContentRevisionTimeline';
import RevisionRequestForm from '@/components/content/RevisionRequestForm';
import { ContentPlanDetail } from '@/types/content';
import { contentService } from '@/services/content.service';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';

const AdminCampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    campaign,
    isLoading,
    activeTab,
    setActiveTab,
    handleInfluencerApproval,
    updateCampaignInfluencers,
    toast
  } = useCampaignDetail();

  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanDetail | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showRevisionFeedbackForm, setShowRevisionFeedbackForm] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingPlanData, setPendingPlanData] = useState<Partial<ContentPlanDetail> | null>(null);
  const [isEditingRevision, setIsEditingRevision] = useState(false); // 수정 요청 편집 상태

  React.useEffect(() => {
    const loadContentPlans = async () => {
      if (!campaign?.id) return;

      try {
        setIsContentLoading(true);
        console.log('=== 시스템 관리자 - 콘텐츠 기획안 로딩 시작 ===');
        console.log('캠페인 ID:', campaign.id);
        
        // 디버깅 정보 먼저 출력
        await contentService.debugContentPlanStorage();
        
        const plans = await contentService.getContentPlans(campaign.id);
        console.log('=== 로딩된 기획안들 ===');
        plans.forEach(plan => {
          console.log(`기획안 ID: ${plan.id}`);
          console.log(`인플루언서: ${plan.influencerName}`);
          console.log(`상태: ${plan.status}`);
          console.log(`수정 요청 개수: ${plan.revisions?.length || 0}`);
          if (plan.revisions && plan.revisions.length > 0) {
            console.log('수정 요청 내역:');
            plan.revisions.forEach(revision => {
              console.log(`  - ${revision.revisionNumber}차: ${revision.feedback} (상태: ${revision.status})`);
            });
          }
        });
        
        setContentPlans(plans);
        console.log('=== 시스템 관리자 기획안 로딩 완료 ===');
        
      } catch (error) {
        console.error('콘텐츠 기획안 로딩 실패:', error);
        toast({
          title: "기획안 로딩 실패",
          description: "콘텐츠 기획안을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      } finally {
        setIsContentLoading(false);
      }
    };

    loadContentPlans();
  }, [campaign?.id, toast]);

  // 탭 변경 시 데이터 리로드
  React.useEffect(() => {
    if (activeTab === 'planning' && campaign?.id) {
      const reloadPlans = async () => {
        console.log('🔄 탭 변경 - 기획안 재로딩');
        try {
          const plans = await contentService.getContentPlans(campaign.id);
          setContentPlans(plans);
        } catch (error) {
          console.error('재로딩 실패:', error);
        }
      };
      reloadPlans();
    }
  }, [activeTab, campaign?.id]);

  const getStatusColor = (status: any) => {
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
      case 'producing': return 'bg-violet-100 text-violet-800';
      case 'content-review': return 'bg-purple-100 text-purple-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      // 콘텐츠 기획 상태 (통일된 상태값)
      case 'waiting': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'revision-request': return 'bg-orange-100 text-orange-800';
      case 'revision-feedback': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: any) => {
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
      case 'content-review': return '콘텐츠검수';
      case 'live': return '라이브';
      case 'monitoring': return '모니터링';
      case 'completed': return '완료됨';
      // 콘텐츠 기획 상태 (통일된 상태값)
      case 'waiting': return '기획 대기중';
      case 'draft': return '기획초안';
      case 'revision-request': return '기획수정중';
      case 'revision-feedback': return '기획수정중';
      case 'approved': return '기획완료';
      default: return status;
    }
  };

  const handleCreateContentPlan = async (planData: Partial<ContentPlanDetail>) => {
    if (!campaign || !id || !selectedInfluencer) return;

    const { contentType } = planData;
    if (!contentType) return;

    try {
      console.log('=== 시스템 관리자 기획안 생성/수정 시작 ===');
      console.log('선택된 인플루언서:', selectedInfluencer.name);
      console.log('콘텐츠 타입:', contentType);

      await contentService.createContentPlan(id, {
        campaignId: id,
        influencerId: selectedInfluencer.id,
        influencerName: selectedInfluencer.name,
        contentType,
        status: 'draft',
        planData: planData.planData!,
        revisions: planData.revisions || [],
        currentRevisionNumber: planData.currentRevisionNumber || 0
      });

      // 기획안 목록 재로딩
      const updatedPlans = await contentService.getContentPlans(id);
      setContentPlans(updatedPlans);
      
      // UI 상태 초기화
      setSelectedPlan(null);
      setShowCreateForm(false);
      setSelectedInfluencer(null);

      console.log('=== 시스템 관리자 기획안 생성/수정 완료 ===');

      toast({
        title: "기획안 저장 완료",
        description: `${selectedInfluencer.name}의 콘텐츠 기획안이 저장되었습니다.`
      });
    } catch (error) {
      console.error('기획안 저장 실패:', error);
      toast({
        title: "저장 실패",
        description: "기획안 저장에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 새로운 기획안 수정 처리 함수 (저장 단계)
  const handleSavePlanChanges = async () => {
    if (!selectedPlan || !pendingPlanData || !campaign) return;

    try {
      console.log('=== 시스템 관리자 기획안 수정 저장 ===');
      console.log('기획안 ID:', selectedPlan.id);
      console.log('수정 데이터:', pendingPlanData);

      // 수정 요청이 있는지 확인
      const hasPendingRevision = selectedPlan?.revisions?.some(
        revision => revision.status === 'pending'
      );

      console.log('수정 요청 대기 중:', hasPendingRevision);

      // 수정 요청 편집 모드에서는 revision 상태를 변경하지 않고 기획안 데이터만 업데이트
      const updateData = {
        ...pendingPlanData,
        updatedAt: new Date().toISOString()
      };

      // revision 관련 필드 제거 (수정 요청 편집 모드에서는 변경하지 않음)
      delete updateData.status;
      delete updateData.revisions;

      await contentService.updateContentPlan(campaign.id, selectedPlan.id, updateData);

      const updatedPlans = await contentService.getContentPlans(campaign.id);
      setContentPlans(updatedPlans);

      const updatedPlan = updatedPlans.find(p => p.id === selectedPlan.id);
      if (updatedPlan) {
        setSelectedPlan(updatedPlan);
      }

      // 저장 후 상태 업데이트
      setHasUnsavedChanges(false);
      setPendingPlanData(null);
      
      // 수정 요청이 있었던 경우에만 피드백 섹션 활성화
      if (hasPendingRevision) {
        console.log('🔄 수정 요청 완료 - 피드백 섹션 활성화');
        setShowRevisionFeedbackForm(true);
      }

      console.log('=== 시스템 관리자 기획안 수정 저장 완료 ===');

      toast({
        title: "기획안 수정 저장 완료",
        description: hasPendingRevision ? 
          "콘텐츠 기획안 수정이 저장되었습니다. 아래에서 피드백을 작성해주세요." :
          "콘텐츠 기획안이 저장되었습니다."
      });
    } catch (error) {
      console.error('기획안 수정 저장 실패:', error);
      toast({
        title: "저장 실패",
        description: "기획안 수정 저장에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 기획안 데이터 변경 감지
  const handlePlanDataChange = (planData: Partial<ContentPlanDetail>) => {
    setPendingPlanData(planData);
    setHasUnsavedChanges(true);
  };

  // 콘텐츠 업데이트 감지 (새로 추가)
  const handleContentUpdated = () => {
    setHasUnsavedChanges(true);
  };

  const handleRevisionFeedback = async (feedback: string) => {
    if (!selectedPlan) return;

    try {
      const revisionNumber = (selectedPlan.currentRevisionNumber || 0);
      
      // 현재 pending 상태인 revision을 찾아서 완료 처리
      const updatedRevisions = selectedPlan.revisions?.map(revision => {
        if (revision.status === 'pending') {
          return {
            ...revision,
            status: 'completed' as const,
            response: feedback,
            respondedAt: new Date().toISOString(),
            respondedBy: '시스템 관리자'
          };
        }
        return revision;
      }) || [];

      const updatedPlan: ContentPlanDetail = {
        ...selectedPlan,
        status: 'revision-feedback',
        revisions: updatedRevisions,
        updatedAt: new Date().toISOString()
      };

      await contentService.updateContentPlan(selectedPlan.campaignId, selectedPlan.id, {
        status: 'revision-feedback',
        revisions: updatedRevisions,
        updatedAt: new Date().toISOString()
      });

      setContentPlans(prev => prev.map(plan => 
        plan.id === selectedPlan.id ? updatedPlan : plan
      ));

      setSelectedPlan(updatedPlan);
      setShowRevisionFeedbackForm(false);
      setRevisionFeedback('');
      setIsEditingRevision(false); // 편집 상태 해제

      toast({
        title: "수정피드백 전송 완료",
        description: "브랜드 관리자에게 수정피드백이 전송되었습니다."
      });
    } catch (error) {
      console.error('수정피드백 전송 실패:', error);
      toast({
        title: "전송 실패",
        description: "수정피드백 전송에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleEditPlan = (influencerId: string) => {
    const plan = contentPlans.find(p => p.influencerId === influencerId);
    if (plan) {
      console.log('=== 기획안 편집 시작 ===');
      console.log('선택된 기획안:', plan.id);
      console.log('인플루언서:', plan.influencerName);
      console.log('현재 상태:', plan.status);
      console.log('수정 요청 개수:', plan.revisions?.length || 0);
      
      setSelectedPlan(plan);
      setShowCreateForm(false);
      setShowRevisionForm(false);
      setShowRevisionFeedbackForm(false);
      setHasUnsavedChanges(false);
      setPendingPlanData(null);
      
      // 수정 요청이 있는 경우 편집 상태로 설정
      const hasPendingRevision = plan.revisions?.some(rev => rev.status === 'pending');
      if (hasPendingRevision || plan.status === 'revision-request') {
        setIsEditingRevision(true);
        console.log('🔄 수정 요청 편집 모드 활성화');
      } else {
        setIsEditingRevision(false);
      }
    }
  };

  const handleCreatePlan = (influencer: any) => {
    setSelectedInfluencer(influencer);
    setSelectedPlan(null);
    setShowCreateForm(true);
    setShowRevisionForm(false);
    setShowRevisionFeedbackForm(false);
    setIsEditingRevision(false);
  };

  // 수정 모드 활성화/비활성화
  const handleToggleEditMode = () => {
    if (hasUnsavedChanges) {
      // 저장되지 않은 변경사항이 있으면 확인
      if (confirm('저장되지 않은 변경사항이 있습니다. 수정 모드를 종료하시겠습니까?')) {
        setHasUnsavedChanges(false);
        setPendingPlanData(null);
        setIsEditingRevision(false);
      }
    } else {
      setIsEditingRevision(!isEditingRevision);
    }
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

  const confirmedInfluencers = campaign?.influencers.filter(inf => inf.status === 'confirmed') || [];

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                캠페인 관리로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusText(campaign.status)}
                </Badge>
                <Badge variant="outline" className="text-purple-600">
                  시스템 관리자 뷰
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <CampaignWorkflowSteps campaign={campaign!} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">📋 기본정보</TabsTrigger>
            <TabsTrigger value="influencers">👥 인플루언서 관리</TabsTrigger>
            <TabsTrigger value="planning" disabled={campaign.currentStage < 2}>💡 콘텐츠 기획</TabsTrigger>
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
                  <div className="text-lg">콘텐츠 기획안을 로딩 중...</div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                {/* 좌측: 인플루언서 목록 */}
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        확정된 인플루언서
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {confirmedInfluencers.map((influencer) => {
                          const existingPlan = contentPlans.find(plan => plan.influencerId === influencer.id);
                          const hasPendingRevision = existingPlan?.revisions?.some(rev => rev.status === 'pending');
                          const isRevisionRequest = existingPlan?.status === 'revision-request';
                          const isRevisionFeedback = existingPlan?.status === 'revision-feedback';
                          
                          return (
                            <div key={influencer.id} className="p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{influencer.name}</h4>
                                  <p className="text-sm text-gray-500">{influencer.platform}</p>
                                  {existingPlan && (
                                    <div className="mt-1 space-y-1">
                                      <Badge className={getStatusColor(existingPlan.status)}>
                                        {getStatusText(existingPlan.status)}
                                      </Badge>
                                      {(isRevisionRequest || isRevisionFeedback) && existingPlan.revisions && existingPlan.revisions.length > 0 && (
                                        <Badge className="bg-red-100 text-red-800 ml-1">
                                          {existingPlan.currentRevisionNumber}차 수정요청
                                        </Badge>
                                      )}
                                      {hasPendingRevision && (
                                        <Badge className="bg-orange-100 text-orange-800 ml-1">
                                          🔄 수정 대기
                                        </Badge>
                                      )}
                                      {existingPlan.revisions && existingPlan.revisions.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                          총 수정 요청 {existingPlan.revisions.length}회
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {existingPlan ? (
                                  <Button
                                    size="sm"
                                    variant={hasPendingRevision || isRevisionRequest ? "default" : "outline"}
                                    onClick={() => handleEditPlan(influencer.id)}
                                    className={hasPendingRevision || isRevisionRequest ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-50 hover:bg-blue-100"}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    {hasPendingRevision || isRevisionRequest ? '수정 요청 확인' : '편집'}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleCreatePlan(influencer)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    기획안 생성
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 우측: 콘텐츠 기획 상세 */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          콘텐츠 기획 상세
                        </div>
                        {selectedPlan && (
                          <div className="flex gap-2">
                            {/* 상단 수정 버튼 */}
                            {!isEditingRevision && (
                              <Button
                                variant="outline"
                                onClick={() => setIsEditingRevision(true)}
                              >
                                수정
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPlan(null);
                                setShowRevisionFeedbackForm(false);
                                setRevisionFeedback('');
                                setHasUnsavedChanges(false);
                                setPendingPlanData(null);
                                setIsEditingRevision(false);
                              }}
                            >
                              목록으로
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-auto">
                      {showCreateForm && selectedInfluencer ? (
                        <ContentPlanForm
                          influencer={selectedInfluencer}
                          campaignId={id!}
                          onSave={handleCreateContentPlan}
                          onCancel={() => {
                            setShowCreateForm(false);
                            setSelectedInfluencer(null);
                          }}
                        />
                      ) : selectedPlan ? (
                        <div className="space-y-6">
                          {/* 수정요청 히스토리 */}
                          {selectedPlan.revisions && selectedPlan.revisions.length > 0 && (
                            <div className="border-b pb-4">
                              <h3 className="text-lg font-medium mb-3">수정요청 히스토리</h3>
                              <ContentRevisionTimeline revisions={selectedPlan.revisions} />
                            </div>
                          )}

                          {/* 기획안 편집 폼 */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-medium">기획안 편집</h3>
                            </div>
                            <ContentPlanForm
                              influencer={confirmedInfluencers.find(inf => inf.id === selectedPlan.influencerId)!}
                              campaignId={id!}
                              existingPlan={selectedPlan}
                              onSave={handlePlanDataChange}
                              onCancel={() => setSelectedPlan(null)}
                              onContentUpdated={handleContentUpdated}
                              disabled={!isEditingRevision}
                              hideActionButtons={true}
                              isRevisionEditMode={true}
                            />
                          </div>

                          {/* 하단 저장, 수정 버튼 */}
                          {isEditingRevision && (
                            <div className="flex justify-end gap-2 pt-4 border-t">
                              {hasUnsavedChanges && (
                                <Button
                                  onClick={handleSavePlanChanges}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  저장
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={handleToggleEditMode}
                              >
                                수정
                              </Button>
                            </div>
                          )}

                          {/* N차 수정피드백 섹션 */}
                          {showRevisionFeedbackForm && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Send className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-800">
                                  {selectedPlan.currentRevisionNumber}차 수정피드백
                                </h4>
                              </div>
                              
                              <div className="space-y-3">
                                <Label htmlFor="revision-feedback" className="text-sm font-medium">
                                  수정피드백 내용
                                </Label>
                                <Textarea
                                  id="revision-feedback"
                                  value={revisionFeedback}
                                  onChange={(e) => setRevisionFeedback(e.target.value)}
                                  placeholder="수정사항에 대한 피드백을 작성해주세요..."
                                  rows={4}
                                  className="text-sm"
                                />
                                
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    onClick={() => handleRevisionFeedback(revisionFeedback)}
                                    disabled={!revisionFeedback.trim()}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    {selectedPlan.currentRevisionNumber}차 수정피드백 전송
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setShowRevisionFeedbackForm(false);
                                      setRevisionFeedback('');
                                    }}
                                  >
                                    취소
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <p className="mb-4">좌측에서 인플루언서를 선택하여 기획안을 생성하거나 편집하세요.</p>
                            {contentPlans.length > 0 && (
                              <div className="text-sm">
                                <p className="text-green-600">✅ 총 {contentPlans.length}개의 기획안이 로딩되었습니다.</p>
                                <button 
                                  onClick={() => contentService.debugContentPlanStorage()}
                                  className="mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                                >
                                  🔍 디버깅 정보 확인
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="production" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  콘텐츠 제작
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 제작 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
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
