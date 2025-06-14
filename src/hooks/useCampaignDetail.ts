
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Campaign, CampaignInfluencer } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';

export const useCampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const loadCampaign = async () => {
      if (!id) return;
      
      try {
        const data = await campaignService.getCampaignById(id);
        if (data) {
          const updatedCampaign = {
            ...data,
            currentStage: data.currentStage || 1,
            contentPlans: data.contentPlans || [],
            contentProductions: data.contentProductions || []
          };
          setCampaign(updatedCampaign);
          
          if (updatedCampaign.currentStage >= 2) setActiveTab('planning');
          if (updatedCampaign.currentStage >= 3) setActiveTab('content');
          if (updatedCampaign.currentStage >= 4) setActiveTab('performance');
        }
      } catch (error) {
        console.error('캠페인 로딩 실패:', error);
        toast({
          title: "캠페인을 불러올 수 없습니다",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [id, toast]);

  const handleEdit = () => {
    navigate(`/brand/campaigns/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!campaign || campaign.status !== 'creating') return;
    
    if (confirm('정말로 이 캠페인을 삭제하시겠습니까?')) {
      try {
        await campaignService.deleteCampaign(campaign.id);
        toast({
          title: "캠페인이 삭제되었습니다"
        });
        navigate('/brand/campaigns');
      } catch (error) {
        toast({
          title: "삭제 실패",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!campaign || campaign.status !== 'creating') return;
    
    try {
      await campaignService.updateCampaign(campaign.id, { status: 'recruiting' });
      setCampaign(prev => prev ? { ...prev, status: 'recruiting' } : null);
      toast({
        title: "캠페인이 제출되었습니다",
        description: "시스템 관리자가 검토 후 인플루언서 섭외를 진행합니다."
      });
    } catch (error) {
      toast({
        title: "제출 실패",
        variant: "destructive"
      });
    }
  };

  const handleInfluencerApproval = async (influencerId: string, approved: boolean) => {
    if (!campaign) return;
    
    try {
      console.log('=== 인플루언서 승인/거절 처리 시작 ===');
      console.log('인플루언서 ID:', influencerId);
      console.log('승인 여부:', approved);
      console.log('현재 캠페인 상태:', campaign.status);
      
      const updatedInfluencers = campaign.influencers.map(inf => {
        if (inf.id === influencerId) {
          console.log('처리할 인플루언서:', inf);
          console.log('기존 광고비:', inf.adFee);
          
          // 광고비 정보를 명시적으로 유지하면서 상태만 변경
          const updatedInfluencer = { 
            ...inf, 
            status: approved ? 'confirmed' as const : 'brand-rejected' as const,
            // 광고비 정보를 명시적으로 유지
            adFee: inf.adFee || 0
          };
          
          console.log('업데이트된 인플루언서:', updatedInfluencer);
          console.log('유지된 광고비:', updatedInfluencer.adFee);
          
          return updatedInfluencer;
        }
        return inf;
      });

      const updatedCampaign = { ...campaign, influencers: updatedInfluencers };
      
      // 브랜드 관리자가 거절한 인플루언서가 있는 경우 상태를 'revising'으로 변경
      const hasBrandRejected = updatedInfluencers.some(inf => inf.status === 'brand-rejected');
      let newStatus = campaign.status;
      
      if (hasBrandRejected) {
        newStatus = 'revising';
        console.log('브랜드 관리자가 거절한 인플루언서가 있어 상태를 revising으로 변경');
      } else {
        const allDecided = updatedInfluencers.every(inf => inf.status === 'confirmed' || inf.status === 'brand-rejected');
        if (allDecided) {
          newStatus = 'confirmed';
          console.log('모든 인플루언서가 결정되어 상태를 confirmed로 변경');
        }
      }

      console.log('최종 업데이트할 인플루언서 목록:', updatedInfluencers);
      console.log('각 인플루언서의 광고비 정보:');
      updatedInfluencers.forEach(inf => {
        console.log(`- ${inf.name}: ${inf.adFee}원 (상태: ${inf.status})`);
      });

      await campaignService.updateCampaign(campaign.id, {
        influencers: updatedInfluencers,
        status: newStatus
      });

      setCampaign({ ...updatedCampaign, status: newStatus });
      
      console.log('=== 인플루언서 승인/거절 처리 완료 ===');
      
      toast({
        title: approved ? "인플루언서 승인" : "인플루언서 거절",
        description: approved ? "인플루언서가 승인되었습니다." : "제안 수정 요청이 전송되었습니다."
      });
    } catch (error) {
      console.error('인플루언서 승인/거절 처리 실패:', error);
      toast({
        title: "처리 실패",
        variant: "destructive"
      });
    }
  };

  const handleFinalConfirmation = async () => {
    if (!campaign) return;
    
    try {
      await campaignService.updateCampaign(campaign.id, { status: 'completed' });
      setCampaign(prev => prev ? { ...prev, status: 'completed' } : null);
      
      toast({
        title: "캠페인 확정 완료",
        description: "캠페인이 최종 확정되었습니다."
      });
    } catch (error) {
      toast({
        title: "확정 실패",
        variant: "destructive"
      });
    }
  };

  const updateCampaignInfluencers = async (updatedInfluencers: CampaignInfluencer[]) => {
    if (!campaign) return;

    try {
      await campaignService.updateCampaign(campaign.id, {
        influencers: updatedInfluencers
      });

      setCampaign(prev => prev ? { ...prev, influencers: updatedInfluencers } : null);
    } catch (error) {
      throw error;
    }
  };

  return {
    campaign,
    setCampaign,
    isLoading,
    activeTab,
    setActiveTab,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleInfluencerApproval,
    handleFinalConfirmation,
    updateCampaignInfluencers,
    toast
  };
};
