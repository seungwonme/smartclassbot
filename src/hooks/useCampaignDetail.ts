
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Campaign, CampaignInfluencer } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';

export const useCampaignDetail = (campaignId?: string) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  const targetId = campaignId || id;

  useEffect(() => {
    const loadCampaign = async () => {
      if (!targetId) return;
      
      try {
        const data = await campaignService.getCampaignById(targetId);
        if (data) {
          const updatedCampaign = {
            ...data,
            currentStage: data.currentStage || 1,
            contentPlans: data.contentPlans || []
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
  }, [targetId, toast]);

  const handleEdit = () => {
    navigate(`/brand/campaigns/edit/${targetId}`);
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
      console.log('=== 브랜드에서 캠페인 제출 ===');
      console.log('캠페인 ID:', campaign.id);
      console.log('현재 상태:', campaign.status);
      
      await campaignService.updateCampaign(campaign.id, { status: 'submitted' });
      setCampaign(prev => prev ? { ...prev, status: 'submitted' } : null);
      
      console.log('캠페인 상태를 submitted로 변경 완료');
      
      toast({
        title: "캠페인이 제출되었습니다",
        description: "시스템 관리자가 검토 후 인플루언서 섭외를 진행합니다."
      });
    } catch (error) {
      console.error('캠페인 제출 실패:', error);
      toast({
        title: "제출 실패",
        variant: "destructive"
      });
    }
  };

  const handleInfluencerApproval = async (influencerId: string, approved: boolean) => {
    if (!campaign) return;
    
    try {
      console.log('=== 브랜드 관리자 인플루언서 승인/거절 처리 시작 ===');
      console.log('인플루언서 ID:', influencerId);
      console.log('승인 여부:', approved);
      console.log('현재 캠페인 상태:', campaign.status);
      console.log('현재 인플루언서 목록:');
      campaign.influencers.forEach(inf => {
        console.log(`- ${inf.name} (ID: ${inf.id}): 상태=${inf.status}, 광고비=${inf.adFee}원`);
      });
      
      const originalInfluencer = campaign.influencers.find(inf => inf.id === influencerId);
      if (!originalInfluencer) {
        console.error('인플루언서를 찾을 수 없음:', influencerId);
        return;
      }
      
      console.log('=== 처리할 인플루언서 상세 정보 ===');
      console.log('인플루언서 이름:', originalInfluencer.name);
      console.log('현재 상태:', originalInfluencer.status);
      console.log('시스템 관리자가 설정한 광고비:', originalInfluencer.adFee);
      console.log('광고비 타입:', typeof originalInfluencer.adFee);
      
      const updatedInfluencers = campaign.influencers.map(inf => {
        if (inf.id === influencerId) {
          console.log('=== 인플루언서 상태 업데이트 ===');
          console.log('업데이트 전 광고비:', inf.adFee);
          
          const updatedInfluencer = { 
            ...inf, 
            status: approved ? 'confirmed' as const : 'brand-rejected' as const
          };
          
          console.log('업데이트 후 광고비:', updatedInfluencer.adFee);
          console.log('업데이트 후 상태:', updatedInfluencer.status);
          console.log('전체 업데이트된 인플루언서 객체:', updatedInfluencer);
          
          return updatedInfluencer;
        }
        return inf;
      });

      console.log('=== 최종 업데이트될 인플루언서 목록 ===');
      updatedInfluencers.forEach(inf => {
        console.log(`- ${inf.name}: 상태=${inf.status}, 광고비=${inf.adFee}원`);
      });

      const hasBrandRejected = updatedInfluencers.some(inf => inf.status === 'brand-rejected');
      const confirmedInfluencers = updatedInfluencers.filter(inf => inf.status === 'confirmed');
      const allActiveInfluencersConfirmed = updatedInfluencers
        .filter(inf => inf.status !== 'brand-rejected' && inf.status !== 'admin-rejected' && inf.status !== 'rejected')
        .every(inf => inf.status === 'confirmed');
      
      let newStatus = campaign.status;
      
      if (hasBrandRejected) {
        newStatus = 'revising';
        console.log('브랜드 관리자가 거절한 인플루언서가 있어 상태를 revising으로 변경');
      } else if (allActiveInfluencersConfirmed && confirmedInfluencers.length > 0) {
        newStatus = 'confirmed';
        console.log('모든 활성 인플루언서가 승인되어 상태를 confirmed로 자동 변경');
      }

      console.log('=== 데이터베이스 업데이트 시작 ===');
      await campaignService.updateCampaign(campaign.id, {
        influencers: updatedInfluencers,
        status: newStatus
      });

      setCampaign(prev => prev ? { 
        ...prev, 
        influencers: updatedInfluencers, 
        status: newStatus 
      } : null);
      
      console.log('=== 브랜드 관리자 승인/거절 처리 완료 ===');
      console.log('최종 저장된 상태:', newStatus);
      
      if (newStatus === 'confirmed') {
        toast({
          title: "캠페인 확정 완료",
          description: "모든 인플루언서가 승인되어 캠페인이 확정되었습니다. 캠페인 진행 동의를 확인해주세요."
        });
      } else {
        toast({
          title: approved ? "인플루언서 승인" : "인플루언서 거절",
          description: approved ? "인플루언서가 승인되었습니다." : "제안 수정 요청이 전송되었습니다."
        });
      }
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
      await campaignService.updateCampaign(campaign.id, { 
        status: 'planning',
        currentStage: 2
      });
      setCampaign(prev => prev ? { 
        ...prev, 
        status: 'planning',
        currentStage: 2
      } : null);
      
      toast({
        title: "캠페인 확정 완료",
        description: "캠페인이 콘텐츠 기획 단계로 진행됩니다."
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
    data: campaign,
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
