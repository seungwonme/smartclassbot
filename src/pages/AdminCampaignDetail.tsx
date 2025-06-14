
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Users, DollarSign, FileText, Video, Edit, Plus } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import CampaignWorkflowSteps from '@/components/CampaignWorkflowSteps';
import InfluencerManagementTab from '@/components/campaign/InfluencerManagementTab';
import ContentPlanList from '@/components/content/ContentPlanList';
import ContentPlanForm from '@/components/content/ContentPlanForm';
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
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      default: return status;
    }
  };

  const handleCreateContentPlan = async (planData: Partial<ContentPlanDetail>) => {
    if (!campaign || !id || !selectedInfluencer) return;

    const { contentType } = planData;
    if (!contentType) return;

    try {
      const newPlan: ContentPlanDetail = {
        id: `plan_${Date.now()}_${selectedInfluencer.id}`,
        campaignId: id,
        influencerId: selectedInfluencer.id,
        influencerName: selectedInfluencer.name,
        contentType,
        status: 'draft',
        planData: contentType === 'image' ? {
          postTitle: (planData.planData as any)?.postTitle || '',
          thumbnailTitle: (planData.planData as any)?.thumbnailTitle || '',
          referenceImages: (planData.planData as any)?.referenceImages || [],
          script: (planData.planData as any)?.script || '',
          hashtags: (planData.planData as any)?.hashtags || []
        } : {
          postTitle: (planData.planData as any)?.postTitle || '',
          scenario: (planData.planData as any)?.scenario || '',
          scenarioFiles: (planData.planData as any)?.scenarioFiles || [],
          script: (planData.planData as any)?.script || '',
          hashtags: (planData.planData as any)?.hashtags || []
        },
        revisions: [],
        currentRevisionNumber: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setContentPlans(prev => [...prev, newPlan]);
      setShowCreateForm(false);
      setSelectedInfluencer(null);

      toast({
        title: "콘텐츠 기획안 생성 완료",
        description: `${selectedInfluencer.name}의 ${contentType === 'image' ? '이미지' : '동영상'} 기획안이 생성되었습니다.`
      });
    } catch (error) {
      console.error('콘텐츠 기획안 생성 실패:', error);
      toast({
        title: "생성 실패",
        description: "콘텐츠 기획안 생성에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handlePlanUpdate = async (planId: string, updates: any) => {
    if (!id) return;

    try {
      const updatedPlan = await contentService.updateContentPlan(id, planId, updates);
      setContentPlans(prev => prev.map(plan => 
        plan.id === planId ? updatedPlan : plan
      ));

      toast({
        title: "기획안 수정 완료",
        description: "콘텐츠 기획안이 수정되었습니다."
      });
    } catch (error) {
      console.error('기획안 수정 실패:', error);
      toast({
        title: "수정 실패",
        description: "기획안 수정에 실패했습니다.",
        variant: "destructive"
      });
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

  const confirmedInfluencers = campaign.influencers.filter(inf => inf.status === 'confirmed');

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

        <CampaignWorkflowSteps campaign={campaign} />

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
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
                        
                        return (
                          <div key={influencer.id} className="p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{influencer.name}</h4>
                                <p className="text-sm text-gray-500">{influencer.platform}</p>
                              </div>
                              {existingPlan ? (
                                <Badge className={
                                  existingPlan.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                  (existingPlan.status === 'revision-requested' || existingPlan.status === 'revision-feedback') ? 'bg-orange-100 text-orange-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {existingPlan.status === 'draft' ? '기획초안' :
                                   (existingPlan.status === 'revision-requested' || existingPlan.status === 'revision-feedback') ? '기획수정중' : '기획완료'}
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInfluencer(influencer);
                                    setShowCreateForm(true);
                                  }}
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
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      콘텐츠 기획 상세
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
                    ) : contentPlans.length > 0 ? (
                      <ContentPlanList
                        plans={contentPlans}
                        onPlanUpdate={handlePlanUpdate}
                        userType="admin"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">콘텐츠 기획안이 없습니다</h3>
                        <p className="text-gray-500">인플루언서를 선택하여 기획안을 생성하세요.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
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
