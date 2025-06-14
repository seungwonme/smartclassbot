
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, FileText, Clock, Users, CheckCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import ContentPlanList from '@/components/content/ContentPlanList';
import ContentPlanForm from '@/components/content/ContentPlanForm';
import ProductionScheduleModal from '@/components/content/ProductionScheduleModal';
import { Campaign } from '@/types/campaign';
import { ContentPlanDetail } from '@/types/content';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { contentService } from '@/services/content.service';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';

const AdminContentPlanning = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { toast } = useToast();
  const { data: campaign, isLoading: campaignLoading } = useCampaignDetail(campaignId);
  
  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  console.log('=== AdminContentPlanning 렌더링 시작 ===');
  console.log('URL params:', { campaignId });
  console.log('추출된 캠페인 ID:', campaignId);
  console.log('현재 URL:', window.location.pathname);

  console.log('=== AdminContentPlanning 데이터 상태 ===');
  console.log('캠페인 로딩중:', campaignLoading);
  console.log('캠페인 데이터:', campaign);
  console.log('콘텐츠 기획안 개수:', contentPlans.length);
  console.log('캠페인 에러:', null);

  useEffect(() => {
    const loadContentPlans = async () => {
      if (!campaignId) return;
      
      try {
        const plans = await contentService.getContentPlans(campaignId);
        setContentPlans(plans);
      } catch (error) {
        console.error('콘텐츠 기획안 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContentPlans();
  }, [campaignId]);

  const getStageInfo = (status: Campaign['status']) => {
    console.log('=== getStageInfo 호출 ===');
    console.log('캠페인 상태:', status);
    
    switch (status) {
      case 'planning':
        return { stage: 2, title: '콘텐츠 기획', description: '인플루언서별 콘텐츠 기획안을 작성하고 검토합니다.' };
      case 'plan-review':
        return { stage: 2, title: '기획 검토', description: '브랜드 관리자의 기획안 검토가 진행중입니다.' };
      case 'plan-approved':
        return { stage: 2, title: '기획 승인완료', description: '모든 기획안이 승인되었습니다. 제작 일정을 설정하세요.' };
      case 'producing':
        return { stage: 3, title: '콘텐츠 제작', description: '콘텐츠 제작이 진행중입니다.' };
      case 'content-review':
        return { stage: 3, title: '콘텐츠 검수', description: '제작된 콘텐츠의 검수가 진행중입니다.' };
      default:
        return { stage: 3, title: '콘텐츠 제작', description: '콘텐츠 제작 단계입니다.' };
    }
  };

  const handleCreateContentPlan = async (influencerId: string, contentType: 'image' | 'video') => {
    if (!campaign || !campaignId) return;

    const influencer = campaign.influencers.find(inf => inf.id === influencerId);
    if (!influencer) return;

    try {
      const newPlan: ContentPlanDetail = {
        id: `plan_${Date.now()}_${influencerId}`,
        campaignId,
        influencerId,
        influencerName: influencer.name,
        contentType,
        status: 'draft',
        planData: contentType === 'image' ? {
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
        },
        revisions: [],
        currentRevisionNumber: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 캠페인의 contentPlans 배열에 추가
      const updatedContentPlans = [...(campaign.contentPlans || []), newPlan];
      
      await campaignService.updateCampaign(campaignId, {
        contentPlans: updatedContentPlans
      });

      setContentPlans(prev => [...prev, newPlan]);
      setShowCreateForm(false);
      setSelectedInfluencerId(null);

      toast({
        title: "콘텐츠 기획안 생성 완료",
        description: `${influencer.name}의 ${contentType === 'image' ? '이미지' : '동영상'} 기획안이 생성되었습니다.`
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
    if (!campaignId) return;

    try {
      const updatedPlan = await contentService.updateContentPlan(campaignId, planId, updates);
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

  const handleSetProductionSchedule = async (scheduleData: any) => {
    if (!campaign || !campaignId) return;

    try {
      await campaignService.updateCampaign(campaignId, {
        status: 'producing',
        currentStage: 3,
        productionSchedule: scheduleData
      });

      toast({
        title: "제작 일정 설정 완료",
        description: "콘텐츠 제작 단계로 전환되었습니다."
      });

      // 페이지 새로고침으로 최신 상태 반영
      window.location.reload();
    } catch (error) {
      console.error('제작 일정 설정 실패:', error);
      toast({
        title: "설정 실패",
        description: "제작 일정 설정에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  if (campaignLoading || isLoading) {
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

  const stageInfo = getStageInfo(campaign.status);
  const confirmedInfluencers = campaign.influencers.filter(inf => inf.status === 'confirmed');
  const allPlansApproved = contentPlans.length > 0 && contentPlans.every(plan => plan.status === 'approved');

  console.log('=== 최종 렌더링 정보 ===');
  console.log('스테이지 정보:', stageInfo);
  console.log('캠페인 제목:', campaign.title);
  console.log('인플루언서 수:', confirmedInfluencers.length);

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link to={`/admin/campaigns/${campaignId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                캠페인 상세로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800">
                  {stageInfo.title}
                </Badge>
                <Badge variant="outline" className="text-purple-600">
                  시스템 관리자
                </Badge>
              </div>
            </div>
          </div>
          
          {campaign.status === 'plan-approved' && (
            <Button 
              onClick={() => setShowScheduleModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Clock className="w-4 h-4 mr-2" />
              제작 일정 설정
            </Button>
          )}
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                현재 진행 단계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">{stageInfo.title}</p>
                  <p className="text-sm text-gray-600">{stageInfo.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">캠페인 ID</div>
                  <div className="font-mono text-sm">{campaignId}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">📝 콘텐츠 기획</TabsTrigger>
            <TabsTrigger value="upload">📤 콘텐츠 업로드</TabsTrigger>
            <TabsTrigger value="review">🔍 콘텐츠 검수</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    콘텐츠 기획안 관리
                  </div>
                  <div className="flex gap-2">
                    {confirmedInfluencers.map(influencer => {
                      const existingPlan = contentPlans.find(plan => plan.influencerId === influencer.id);
                      if (existingPlan) return null;
                      
                      return (
                        <Button
                          key={influencer.id}
                          size="sm"
                          onClick={() => {
                            setSelectedInfluencerId(influencer.id);
                            setShowCreateForm(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {influencer.name} 기획안 생성
                        </Button>
                      );
                    })}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contentPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 콘텐츠 기획안이 없습니다</h3>
                    <p className="text-gray-500 mb-4">인플루언서가 콘텐츠 기획안을 제출할 때까지 기다리거나 직접 생성하세요.</p>
                    <p className="text-sm text-gray-400">
                      참고: 캠페인이 '기획' 단계에 있어야 인플루언서가 기획안을 작성할 수 있습니다.
                    </p>
                  </div>
                ) : (
                  <>
                    <ContentPlanList
                      plans={contentPlans}
                      onPlanUpdate={handlePlanUpdate}
                      userType="admin"
                    />
                    {allPlansApproved && campaign.status === 'planning' && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <h4 className="font-medium text-green-800">모든 기획안이 승인되었습니다</h4>
                            <p className="text-sm text-green-600">제작 일정을 설정하여 다음 단계로 진행하세요.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 업로드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 업로드 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 검수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 검수 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showCreateForm && selectedInfluencerId && (
          <ContentPlanForm
            campaignId={campaignId!}
            influencerId={selectedInfluencerId}
            influencerName={confirmedInfluencers.find(inf => inf.id === selectedInfluencerId)?.name || ''}
            onClose={() => {
              setShowCreateForm(false);
              setSelectedInfluencerId(null);
            }}
            onSave={handleCreateContentPlan}
          />
        )}

        <ProductionScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          campaign={campaign}
          contentPlans={contentPlans}
          onSave={handleSetProductionSchedule}
        />
      </div>
    </div>
  );
};

export default AdminContentPlanning;
