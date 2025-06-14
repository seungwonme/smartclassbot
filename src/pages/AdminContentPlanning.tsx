import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, Edit, MessageSquare, ArrowRight } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import ContentPlanForm from '@/components/content/ContentPlanForm';
import ContentRevisionTimeline from '@/components/content/ContentRevisionTimeline';
import RevisionRequestForm from '@/components/content/RevisionRequestForm';
import { Campaign } from '@/types/campaign';
import { ContentPlanDetail } from '@/types/content';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';

type WorkMode = 'idle' | 'create' | 'edit' | 'revision';

const AdminContentPlanning = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workMode, setWorkMode] = useState<WorkMode>('idle');
  const [selectedInfluencerForWork, setSelectedInfluencerForWork] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<ContentPlanDetail | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!campaignId) return;
      
      try {
        const campaignData = await campaignService.getCampaignById(campaignId);
        if (campaignData) {
          setCampaign(campaignData);
          
          console.log('=== 캠페인 데이터 로딩 ===');
          console.log('원본 contentPlans:', campaignData.contentPlans);
          
          const plans: ContentPlanDetail[] = campaignData.contentPlans?.map(plan => {
            console.log('=== 기획안 복원 처리 ===');
            console.log('기획안 ID:', plan.id);
            console.log('planDocument 원본:', plan.planDocument);
            
            let planData;
            try {
              // planDocument가 문자열이면 파싱, 객체면 그대로 사용
              planData = typeof plan.planDocument === 'string' 
                ? JSON.parse(plan.planDocument) 
                : plan.planDocument;
              console.log('파싱된 planData:', planData);
            } catch (error) {
              console.error('planDocument 파싱 실패:', error);
              // 기본값 설정
              planData = plan.contentType === 'image' ? {
                postTitle: '',
                thumbnailTitle: '',
                referenceImages: [],
                script: '',
                hashtags: []
              } : {
                postTitle: '',
                scenario: '',
                scenarioFiles: [],
                script: '',
                hashtags: []
              };
            }
            
            const detailPlan: ContentPlanDetail = {
              id: plan.id,
              campaignId: plan.campaignId,
              influencerId: plan.influencerId,
              influencerName: plan.influencerName,
              contentType: plan.contentType,
              status: plan.status,
              planData: planData,
              revisions: plan.revisions || [],
              currentRevisionNumber: plan.revisions?.length || 0,
              createdAt: plan.createdAt,
              updatedAt: plan.updatedAt
            };
            
            console.log('최종 변환된 기획안:', detailPlan);
            return detailPlan;
          }) || [];
          
          console.log('=== 최종 contentPlans 목록 ===');
          console.log('총 기획안 수:', plans.length);
          plans.forEach(plan => {
            console.log(`- ${plan.influencerName}: ${plan.contentType}, 데이터:`, plan.planData);
          });
          
          setContentPlans(plans);
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        toast({
          title: "데이터를 불러올 수 없습니다",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [campaignId, toast]);

  const handleCreatePlan = (influencer: any) => {
    console.log('=== 새 기획안 작성 시작 ===');
    console.log('선택된 인플루언서:', influencer);
    setSelectedInfluencerForWork(influencer);
    setEditingPlan(null);
    setWorkMode('create');
  };

  const handleEditPlan = (influencer: any) => {
    console.log('=== 기획안 수정 시작 ===');
    
    const existingPlan = contentPlans.find(p => p.influencerId === influencer.id);
    console.log('수정할 기획안:', existingPlan);
    
    setSelectedInfluencerForWork(influencer);
    setEditingPlan(existingPlan || null);
    setWorkMode('edit');
  };

  const handleViewRevisionRequest = (influencer: any) => {
    const existingPlan = contentPlans.find(p => p.influencerId === influencer.id);
    setSelectedInfluencerForWork(influencer);
    setEditingPlan(existingPlan || null);
    setWorkMode('revision');
  };

  const handleSavePlan = async (planData: Partial<ContentPlanDetail>) => {
    try {
      console.log('=== 콘텐츠 기획안 저장 시작 ===');
      console.log('저장할 기획안 데이터:', planData);
      console.log('편집 중인 기획안:', editingPlan);
      
      const newPlan: ContentPlanDetail = {
        id: editingPlan?.id || `plan_${Date.now()}`,
        campaignId: campaignId!,
        influencerId: planData.influencerId!,
        influencerName: planData.influencerName!,
        contentType: planData.contentType!,
        status: 'draft',
        planData: planData.planData!,
        revisions: editingPlan?.revisions || [],
        currentRevisionNumber: editingPlan?.currentRevisionNumber || 0,
        createdAt: editingPlan?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('생성된 기획안:', newPlan);
      console.log('저장할 planData:', newPlan.planData);

      const updatedPlans = editingPlan 
        ? contentPlans.map(p => p.id === editingPlan.id ? newPlan : p)
        : [...contentPlans, newPlan];

      console.log('=== 데이터베이스 저장 준비 ===');
      const updatedContentPlans = updatedPlans.map(plan => {
        const planDocument = JSON.stringify(plan.planData);
        console.log(`기획안 ${plan.id} planDocument:`, planDocument);
        
        return {
          id: plan.id,
          campaignId: plan.campaignId,
          influencerId: plan.influencerId,
          influencerName: plan.influencerName,
          contentType: plan.contentType,
          status: plan.status,
          planDocument: planDocument,
          revisions: plan.revisions,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt
        };
      });

      console.log('데이터베이스에 저장할 contentPlans:', updatedContentPlans);

      await campaignService.updateCampaign(campaignId!, {
        contentPlans: updatedContentPlans
      });

      setContentPlans(updatedPlans);
      
      setWorkMode('idle');
      setSelectedInfluencerForWork(null);
      setEditingPlan(null);
      
      console.log('=== 콘텐츠 기획안 저장 완료 ===');
      
      toast({
        title: "콘텐츠 기획이 저장되었습니다"
      });
    } catch (error) {
      console.error('기획안 저장 실패:', error);
      toast({
        title: "저장 실패",
        variant: "destructive"
      });
    }
  };

  const handleRevisionFeedback = async (feedback: string) => {
    if (!editingPlan) return;

    try {
      const newRevision = {
        id: `revision_${Date.now()}`,
        revisionNumber: (editingPlan.currentRevisionNumber || 0) + 1,
        feedback,
        requestedBy: 'admin' as const,
        requestedByName: '시스템 관리자',
        requestedAt: new Date().toISOString(),
        status: 'completed' as const,
        response: feedback,
        respondedAt: new Date().toISOString(),
        respondedBy: '시스템 관리자'
      };

      const updatedPlans = contentPlans.map(plan => {
        if (plan.id === editingPlan.id) {
          return {
            ...plan,
            revisions: [...plan.revisions, newRevision],
            currentRevisionNumber: newRevision.revisionNumber,
            status: 'submitted' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return plan;
      });

      const updatedContentPlans = updatedPlans.map(plan => ({
        id: plan.id,
        campaignId: plan.campaignId,
        influencerId: plan.influencerId,
        influencerName: plan.influencerName,
        contentType: plan.contentType,
        status: plan.status,
        planDocument: JSON.stringify(plan.planData),
        revisions: plan.revisions,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      }));

      await campaignService.updateCampaign(campaignId!, {
        contentPlans: updatedContentPlans
      });

      setContentPlans(updatedPlans);
      
      setWorkMode('idle');
      setSelectedInfluencerForWork(null);
      setEditingPlan(null);

      toast({
        title: "수정 피드백 전송 완료",
        description: "브랜드 관리자에게 수정 피드백이 전송되었습니다."
      });
    } catch (error) {
      console.error('수정 피드백 전송 실패:', error);
      toast({
        title: "전송 실패",
        variant: "destructive"
      });
    }
  };

  const handleBackToIdle = () => {
    setWorkMode('idle');
    setSelectedInfluencerForWork(null);
    setEditingPlan(null);
  };

  const getRevisionRequestCount = () => {
    return contentPlans.filter(plan => 
      plan.status === 'revision' || 
      (plan.revisions.length > 0 && plan.revisions[plan.revisions.length - 1].requestedBy === 'brand')
    ).length;
  };

  const renderWorkArea = () => {
    if (workMode === 'idle' || !selectedInfluencerForWork) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">좌측에서 인플루언서를 선택하여 콘텐츠 기획을 시작하세요.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span>콘텐츠 기획 - {selectedInfluencerForWork.name}</span>
                <Badge variant="outline">{selectedInfluencerForWork.category}</Badge>
              </div>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleBackToIdle}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              작업 완료
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 수정 이력 표시 */}
            {editingPlan && editingPlan.revisions && editingPlan.revisions.length > 0 && (
              <div className="border-b pb-6">
                <ContentRevisionTimeline revisions={editingPlan.revisions} />
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 기획안 폼 */}
              <div className="lg:col-span-1">
                <ContentPlanForm
                  influencer={selectedInfluencerForWork}
                  campaignId={campaign!.id}
                  existingPlan={editingPlan || undefined}
                  onSave={handleSavePlan}
                  onCancel={handleBackToIdle}
                />
              </div>
              
              {/* 수정 피드백 폼 */}
              {workMode === 'revision' && editingPlan && editingPlan.revisions && editingPlan.revisions.length > 0 && 
               editingPlan.revisions.some(rev => rev.requestedBy === 'brand' && rev.status !== 'completed') && (
                <div className="lg:col-span-1">
                  <RevisionRequestForm
                    revisionNumber={(editingPlan.currentRevisionNumber || 0) + 1}
                    onSubmit={handleRevisionFeedback}
                    onCancel={handleBackToIdle}
                    requestType="admin-feedback"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
  const revisionRequestCount = getRevisionRequestCount();

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin/campaigns')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              캠페인 목록으로
            </Button>
            <div>
              <h1 className="text-3xl font-bold">콘텐츠 기획</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">{campaign.title}</p>
                {revisionRequestCount > 0 && (
                  <Badge className="bg-orange-100 text-orange-800">
                    수정요청 {revisionRequestCount}건
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 좌측: 인플루언서 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                확정 인플루언서 ({confirmedInfluencers.length}명)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confirmedInfluencers.map((influencer) => {
                  const existingPlan = contentPlans.find(p => p.influencerId === influencer.id);
                  const hasRevisionRequest = existingPlan && (
                    existingPlan.status === 'revision' || 
                    (existingPlan.revisions.length > 0 && existingPlan.revisions[existingPlan.revisions.length - 1].requestedBy === 'brand')
                  );
                  const isSelected = selectedInfluencerForWork?.id === influencer.id;
                  
                  return (
                    <div 
                      key={influencer.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{influencer.name}</p>
                        <p className="text-sm text-gray-500">{influencer.category}</p>
                        <div className="flex gap-1 mt-1">
                          {existingPlan && (
                            <Badge variant="outline">
                              기획완료
                            </Badge>
                          )}
                          {hasRevisionRequest && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              수정요청
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => existingPlan ? handleEditPlan(influencer) : handleCreatePlan(influencer)}
                          variant={existingPlan ? "outline" : "default"}
                        >
                          {existingPlan ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </Button>
                        {hasRevisionRequest && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewRevisionRequest(influencer)}
                            className="bg-orange-50"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        )}
                        {isSelected && workMode !== 'idle' && (
                          <div className="flex items-center ml-2">
                            <ArrowRight className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 우측: 작업 영역 */}
          <div>
            {renderWorkArea()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentPlanning;
