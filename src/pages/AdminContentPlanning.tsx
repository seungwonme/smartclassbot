
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, Edit } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import ContentPlanForm from '@/components/content/ContentPlanForm';
import ContentPlanList from '@/components/content/ContentPlanList';
import { Campaign } from '@/types/campaign';
import { ContentPlanDetail } from '@/types/content';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminContentPlanning = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<ContentPlanDetail | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!campaignId) return;
      
      try {
        const campaignData = await campaignService.getCampaignById(campaignId);
        if (campaignData) {
          setCampaign(campaignData);
          // ContentPlan을 ContentPlanDetail로 변환하거나 빈 배열로 초기화
          const plans: ContentPlanDetail[] = campaignData.contentPlans?.map(plan => ({
            id: plan.id,
            campaignId: plan.campaignId,
            influencerId: plan.influencerId,
            influencerName: plan.influencerName,
            contentType: plan.contentType,
            status: plan.status,
            planData: plan.contentType === 'image' ? {
              postTitle: '',
              thumbnailTitle: '',
              referenceImages: [],
              script: '',
              hashtags: []
            } : {
              postTitle: '',
              scenario: '',
              script: '',
              hashtags: []
            },
            revisions: plan.revisions,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
          })) || [];
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
    setSelectedInfluencer(influencer);
    setEditingPlan(null);
    setShowForm(true);
  };

  const handleEditPlan = (plan: ContentPlanDetail) => {
    const influencer = campaign?.influencers.find(inf => inf.id === plan.influencerId);
    setSelectedInfluencer(influencer);
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleSavePlan = async (planData: Partial<ContentPlanDetail>) => {
    try {
      // 실제 구현에서는 API 호출
      const newPlan: ContentPlanDetail = {
        id: editingPlan?.id || `plan_${Date.now()}`,
        ...planData as ContentPlanDetail,
        createdAt: editingPlan?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        revisions: editingPlan?.revisions || []
      };

      if (editingPlan) {
        setContentPlans(prev => prev.map(p => p.id === editingPlan.id ? newPlan : p));
      } else {
        setContentPlans(prev => [...prev, newPlan]);
      }

      setShowForm(false);
      setSelectedInfluencer(null);
      setEditingPlan(null);
      
      toast({
        title: "콘텐츠 기획이 저장되었습니다"
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        variant: "destructive"
      });
    }
  };

  const handleViewPlan = (plan: ContentPlanDetail) => {
    // 상세보기 로직 - 현재는 편집으로 대체
    handleEditPlan(plan);
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
              <p className="text-gray-600 mt-1">{campaign.title}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 확정된 인플루언서 목록 */}
          <Card className="lg:col-span-1">
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
                  return (
                    <div key={influencer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{influencer.name}</p>
                        <p className="text-sm text-gray-500">{influencer.category}</p>
                        {existingPlan && (
                          <Badge variant="outline" className="mt-1">
                            기획완료
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCreatePlan(influencer)}
                        variant={existingPlan ? "outline" : "default"}
                      >
                        {existingPlan ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 콘텐츠 기획 목록 */}
          <div className="lg:col-span-2">
            <ContentPlanList
              plans={contentPlans}
              onEdit={handleEditPlan}
              onView={handleViewPlan}
            />
          </div>
        </div>

        {/* 콘텐츠 기획 폼 모달 */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>콘텐츠 기획</DialogTitle>
            </DialogHeader>
            {selectedInfluencer && (
              <ContentPlanForm
                influencer={selectedInfluencer}
                campaignId={campaign.id}
                existingPlan={editingPlan || undefined}
                onSave={handleSavePlan}
                onCancel={() => setShowForm(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminContentPlanning;
