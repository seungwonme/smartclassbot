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
  const [showRevisionFeedback, setShowRevisionFeedback] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!campaignId) return;
      
      try {
        console.log('=== 데이터 로딩 시작 ===');
        console.log('캠페인 ID:', campaignId);
        
        const campaignData = await campaignService.getCampaignById(campaignId);
        if (campaignData) {
          setCampaign(campaignData);
          
          console.log('=== 캠페인 데이터 로딩 ===');
          console.log('원본 contentPlans:', campaignData.contentPlans);
          console.log('contentPlans 배열 길이:', campaignData.contentPlans?.length || 0);
          
          const plans: ContentPlanDetail[] = campaignData.contentPlans?.map(plan => {
            console.log('=== 기획안 복원 처리 ===');
            console.log('기획안 ID:', plan.id);
            console.log('인플루언서:', plan.influencerName);
            console.log('상태:', plan.status);
            console.log('수정 이력 수:', plan.revisions?.length || 0);
            console.log('수정 이력 상세:', plan.revisions);
            
            // 브랜드에서 온 pending 수정요청 특별 확인
            const pendingBrandRevisions = plan.revisions?.filter(r => 
              r.requestedBy === 'brand' && r.status === 'pending'
            ) || [];
            console.log('대기중인 브랜드 수정요청:', pendingBrandRevisions);
            
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
            
            // status를 올바른 타입으로 매핑
            let status: 'draft' | 'revision' | 'approved' = 'draft';
            if (plan.status === 'revision' || plan.status === 'approved') {
              status = plan.status;
            }
            
            // 브랜드 수정요청이 있으면 상태를 revision으로 강제 설정
            if (pendingBrandRevisions.length > 0) {
              status = 'revision';
              console.log('브랜드 수정요청 감지로 상태를 revision으로 변경');
            }
            
            const detailPlan: ContentPlanDetail = {
              id: plan.id,
              campaignId: plan.campaignId,
              influencerId: plan.influencerId,
              influencerName: plan.influencerName,
              contentType: plan.contentType,
              status: status,
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
            console.log(`- ${plan.influencerName}: ${plan.contentType}, 상태: ${plan.status}`);
            console.log(`  수정 이력 수: ${plan.revisions.length}개`);
            plan.revisions.forEach((revision, idx) => {
              console.log(`    수정 ${idx + 1}: ${revision.revisionNumber}차 ${revision.requestedBy} ${revision.status} (${revision.requestedAt})`);
            });
          });
          
          // 김소여와 이민지의 상태 특별 확인
          const kimSoyeo = plans.find(p => p.influencerName.includes('김소여') || p.influencerName.includes('김소영'));
          const leeMinji = plans.find(p => p.influencerName.includes('이민지'));
          
          console.log('=== 특정 인플루언서 상태 확인 ===');
          if (kimSoyeo) {
            console.log('김소여/김소영 기획안 상태:', kimSoyeo.status);
            console.log('김소여/김소영 수정 이력:', kimSoyeo.revisions);
            
            // 가장 최근 수정요청 확인
            const latestRevision = kimSoyeo.revisions[kimSoyeo.revisions.length - 1];
            if (latestRevision) {
              console.log('김소여/김소영 최근 수정요청:', {
                revisionNumber: latestRevision.revisionNumber,
                requestedBy: latestRevision.requestedBy,
                status: latestRevision.status,
                requestedAt: latestRevision.requestedAt
              });
            }
          }
          if (leeMinji) {
            console.log('이민지 기획안 상태:', leeMinji.status);
            console.log('이민지 수정 이력:', leeMinji.revisions);
          }
          
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
    setShowRevisionFeedback(false); // 항상 false로 초기화
  };

  const handleEditPlan = (influencer: any) => {
    console.log('=== 기획안 수정 시작 ===');
    
    const existingPlan = contentPlans.find(p => p.influencerId === influencer.id);
    console.log('수정할 기획안:', existingPlan);
    
    setSelectedInfluencerForWork(influencer);
    setEditingPlan(existingPlan || null);
    setWorkMode('edit');
    setShowRevisionFeedback(false); // 항상 false로 초기화 - 저장 후에만 나타나도록
  };

  const handleViewRevisionRequest = (influencer: any) => {
    const existingPlan = contentPlans.find(p => p.influencerId === influencer.id);
    setSelectedInfluencerForWork(influencer);
    setEditingPlan(existingPlan || null);
    setWorkMode('revision');
    setShowRevisionFeedback(true); // 수정요청 보기에서는 바로 true
  };

  const handleContentUpdated = () => {
    console.log('=== 콘텐츠 수정됨 - 피드백 섹션 활성화 ===');
    if (editingPlan && editingPlan.revisions.some(r => r.status === 'pending' && r.requestedBy === 'brand')) {
      setShowRevisionFeedback(true);
    }
  };

  // 상태 표시 텍스트 통일
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '기획초안';
      case 'revision':
        return '기획수정중';
      case 'approved':
        return '기획완료';
      default:
        return status;
    }
  };

  const handleSavePlan = async (planData: Partial<ContentPlanDetail>) => {
    try {
      console.log('=== 콘텐츠 기획안 저장 시작 ===');
      console.log('저장할 기획안 데이터:', planData);
      console.log('편집 중인 기획안:', editingPlan);
      
      // 기획안 상태 결정: 새 기획안은 기획초안, 수정중인 기획안은 기획수정중
      let planStatus: 'draft' | 'revision' | 'approved' = 'draft';
      if (editingPlan && editingPlan.status === 'revision') {
        planStatus = 'revision';
      }
      
      const newPlan: ContentPlanDetail = {
        id: editingPlan?.id || `plan_${Date.now()}`,
        campaignId: campaignId!,
        influencerId: planData.influencerId!,
        influencerName: planData.influencerName!,
        contentType: planData.contentType!,
        status: planStatus,
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
      
      console.log('=== 콘텐츠 기획안 저장 완료 ===');
      
      toast({
        title: "콘텐츠 기획이 저장되었습니다",
        description: `상태: ${getStatusText(planStatus)}`
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
      // pending 상태의 가장 최근 revision 찾기
      const pendingRevision = editingPlan.revisions
        .filter(r => r.status === 'pending' && r.requestedBy === 'brand')
        .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];

      if (!pendingRevision) {
        toast({
          title: "처리할 수정 요청이 없습니다",
          variant: "destructive"
        });
        return;
      }

      console.log('=== 수정 피드백 처리 시작 ===');
      console.log('처리할 revision:', pendingRevision);
      console.log('revision number:', pendingRevision.revisionNumber);
      console.log('인플루언서:', editingPlan.influencerName);
      console.log('현재 기획안 상태:', editingPlan.status);

      // pending revision을 completed로 업데이트
      const updatedPlans = contentPlans.map(plan => {
        if (plan.id === editingPlan.id) {
          const updatedRevisions = plan.revisions.map(revision => {
            if (revision.id === pendingRevision.id) {
              return {
                ...revision,
                status: 'completed' as const,
                response: feedback,
                respondedAt: new Date().toISOString(),
                respondedBy: '시스템 관리자'
              };
            }
            return revision;
          });

          const updatedPlan = {
            ...plan,
            revisions: updatedRevisions,
            currentRevisionNumber: updatedRevisions.filter(r => r.status === 'completed').length,
            status: 'revision' as const,
            updatedAt: new Date().toISOString()
          };

          console.log('업데이트된 기획안:', updatedPlan);
          console.log('새로운 상태:', updatedPlan.status);
          console.log('완료된 수정 수:', updatedPlan.currentRevisionNumber);

          return updatedPlan;
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

      console.log('=== 수정 피드백 처리 완료 ===');
      console.log('최종 상태 확인:');
      const updatedPlan = updatedPlans.find(p => p.id === editingPlan.id);
      if (updatedPlan) {
        console.log(`${updatedPlan.influencerName} 최종 상태: ${updatedPlan.status}`);
        console.log(`완료된 수정 이력: ${updatedPlan.currentRevisionNumber}차`);
      }

      toast({
        title: "수정 피드백 완료",
        description: `${pendingRevision.revisionNumber}차 수정에 대한 피드백이 완료되었습니다.`
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
    setShowRevisionFeedback(false);
  };

  const getRevisionRequestCount = () => {
    console.log('=== 수정요청 수 계산 ===');
    const revisionPlans = contentPlans.filter(plan => {
      const hasPendingBrandRevision = plan.revisions.some(r => 
        r.requestedBy === 'brand' && r.status === 'pending'
      );
      const isRevisionStatus = plan.status === 'revision';
      
      console.log(`${plan.influencerName}: status=${plan.status}, hasPendingBrandRevision=${hasPendingBrandRevision}`);
      
      return isRevisionStatus || hasPendingBrandRevision;
    });
    
    console.log('수정요청 대상 기획안들:', revisionPlans.map(p => p.influencerName));
    console.log('총 수정요청 수:', revisionPlans.length);
    
    return revisionPlans.length;
  };

  // 수정 이력 표시 개선 - 현재 진행중인 수정 차수 반환
  const getCurrentRevisionNumber = (plan: ContentPlanDetail) => {
    const pendingBrandRevisions = plan.revisions.filter(r => 
      r.requestedBy === 'brand' && r.status === 'pending'
    );
    return pendingBrandRevisions.length > 0 ? pendingBrandRevisions[0].revisionNumber : null;
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

    const hasPendingRevision = editingPlan && editingPlan.revisions.some(r => r.status === 'pending' && r.requestedBy === 'brand');

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span>콘텐츠 기획 - {selectedInfluencerForWork.name}</span>
                <Badge variant="outline">{selectedInfluencerForWork.category}</Badge>
                {editingPlan && (
                  <Badge className={
                    editingPlan.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                    editingPlan.status === 'revision' ? 'bg-orange-100 text-orange-800' :
                    editingPlan.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {getStatusText(editingPlan.status)}
                  </Badge>
                )}
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
            {/* 상단: 수정 이력 */}
            {editingPlan && editingPlan.revisions && editingPlan.revisions.length > 0 && (
              <div>
                <ContentRevisionTimeline revisions={editingPlan.revisions} />
              </div>
            )}
            
            {/* 중단: 기획 내용 */}
            <div>
              <ContentPlanForm
                influencer={selectedInfluencerForWork}
                campaignId={campaign!.id}
                existingPlan={editingPlan || undefined}
                onSave={handleSavePlan}
                onCancel={handleBackToIdle}
                onContentUpdated={handleContentUpdated}
              />
            </div>
            
            {/* 하단: 수정 피드백 섹션 - showRevisionFeedback 상태에 따라 표시 */}
            {showRevisionFeedback && hasPendingRevision && (
              <div className="border-t pt-6">
                {(() => {
                  // 가장 최근 pending revision의 번호를 찾아서 사용
                  const pendingRevision = editingPlan!.revisions
                    .filter(r => r.status === 'pending' && r.requestedBy === 'brand')
                    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];
                  
                  const revisionNumber = pendingRevision ? pendingRevision.revisionNumber : 1;
                  
                  return (
                    <RevisionRequestForm
                      revisionNumber={revisionNumber}
                      onSubmit={handleRevisionFeedback}
                      onCancel={handleBackToIdle}
                      requestType="admin-feedback"
                    />
                  );
                })()}
              </div>
            )}
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
                <Badge className="bg-blue-100 text-blue-800">
                  콘텐츠 기획중
                </Badge>
                {revisionRequestCount > 0 && (
                  <Badge className="bg-orange-100 text-orange-800">
                    수정요청 {revisionRequestCount}건
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 좌측: 인플루언서 목록 */}
          <div className="col-span-4">
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
                      existingPlan.revisions.some(r => r.requestedBy === 'brand' && r.status === 'pending')
                    );
                    const currentRevisionNumber = existingPlan ? getCurrentRevisionNumber(existingPlan) : null;
                    const isSelected = selectedInfluencerForWork?.id === influencer.id;
                    
                    return (
                      <div 
                        key={influencer.id} 
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{influencer.name}</p>
                          <p className="text-sm text-gray-500 truncate">{influencer.category}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {existingPlan && (
                              <Badge variant="outline" className={`text-xs ${
                                existingPlan.status === 'draft' ? 'bg-blue-50 text-blue-700' :
                                existingPlan.status === 'revision' ? 'bg-orange-50 text-orange-700' :
                                existingPlan.status === 'approved' ? 'bg-green-50 text-green-700' :
                                'bg-gray-50 text-gray-700'
                              }`}>
                                {getStatusText(existingPlan.status)}
                              </Badge>
                            )}
                            {hasRevisionRequest && currentRevisionNumber && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                {currentRevisionNumber}차 수정요청
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
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
          </div>

          {/* 우측: 작업 영역 */}
          <div className="col-span-8">
            {renderWorkArea()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentPlanning;
