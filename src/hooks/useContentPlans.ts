
import { useState, useEffect } from 'react';
import { contentService } from '@/services/content.service';
import { ContentPlanDetail } from '@/types/content';

export const useContentPlans = (campaignId: string | undefined, activeTab: string, toast: any) => {
  const [contentPlans, setContentPlans] = useState<ContentPlanDetail[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(false);

  useEffect(() => {
    const loadContentPlans = async () => {
      if (!campaignId) return;
      
      try {
        setIsContentLoading(true);
        console.log('🎯 브랜드 관리자 - 콘텐츠 기획 로딩 시작');
        
        const debugResult = await contentService.debugContentPlanStorage();
        console.log('🔍 디버깅 결과:', debugResult);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const plans = await contentService.getContentPlans(campaignId);
        console.log('📋 로딩된 콘텐츠 기획:', plans);
        
        setContentPlans(plans);
        
        if (plans.length > 0) {
          toast({
            title: "콘텐츠 기획안 로딩 완료",
            description: `${plans.length}개의 기획안을 불러왔습니다.`
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
    };

    loadContentPlans();
  }, [campaignId, toast]);

  useEffect(() => {
    if (activeTab === 'planning' && campaignId) {
      const reloadContentPlans = async () => {
        try {
          setIsContentLoading(true);
          console.log('🔄 콘텐츠 기획 탭 활성화 - 강제 데이터 재로딩 시작');
          
          const debugResult = await contentService.debugContentPlanStorage();
          console.log('🔄 디버깅 결과:', debugResult);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const plans = await contentService.getContentPlans(campaignId);
          console.log('🔄 재로딩된 기획안:', plans.length, '개');
          
          setContentPlans(plans);
          
          if (plans.length > 0) {
            toast({
              title: "기획안 업데이트",
              description: `${plans.length}개의 기획안이 확인되었습니다.`
            });
          }
        } catch (error) {
          console.error('🔄 재로딩 실패:', error);
        } finally {
          setIsContentLoading(false);
        }
      };
      reloadContentPlans();
    }
  }, [activeTab, campaignId, toast]);

  const handleContentPlanApprove = async (planId: string) => {
    if (!campaignId) return;

    try {
      console.log('✅ 콘텐츠 기획 승인 처리 시작:', planId);
      
      await contentService.updateContentPlan(campaignId, planId, { status: 'approved' });

      // 즉시 로컬 상태 업데이트
      setContentPlans(prev => {
        const updated = prev.map(plan =>
          plan.id === planId ? { ...plan, status: 'approved' as const } : plan
        );
        console.log('🔄 로컬 상태 즉시 업데이트 완료');
        return updated;
      });

      toast({
        title: "콘텐츠 기획 승인 완료",
        description: "콘텐츠 기획안이 승인되었습니다."
      });

    } catch (error) {
      console.error('콘텐츠 기획 승인 실패:', error);
      
      // 에러 발생 시 데이터 다시 로드하여 일관성 보장
      try {
        const plans = await contentService.getContentPlans(campaignId);
        setContentPlans(plans);
      } catch (reloadError) {
        console.error('리로드 실패:', reloadError);
      }
      
      toast({
        title: "승인 실패",
        description: "콘텐츠 기획 승인에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleContentPlanRevision = async (planId: string, feedback: string) => {
    if (!campaignId) return;

    try {
      console.log('📝 콘텐츠 기획 수정 요청 처리 시작:', { planId, feedback });
      
      const targetPlan = contentPlans.find(p => p.id === planId);
      
      const revisionNumber = (targetPlan?.currentRevisionNumber || 0) + 1;
      
      const newRevision = {
        id: `revision_${Date.now()}`,
        revisionNumber,
        feedback,
        requestedBy: 'brand' as const,
        requestedByName: '브랜드 관리자',
        requestedAt: new Date().toISOString(),
        status: 'pending' as const
      };

      const updatedPlan = {
        ...targetPlan!,
        status: 'revision-request' as const,
        revisions: [...(targetPlan?.revisions || []), newRevision],
        currentRevisionNumber: revisionNumber,
        updatedAt: new Date().toISOString()
      };

      await contentService.updateContentPlan(campaignId, planId, updatedPlan);

      // 즉시 로컬 상태 업데이트
      setContentPlans(prev => {
        const updated = prev.map(plan =>
          plan.id === planId ? updatedPlan : plan
        );
        console.log('🔄 수정 요청 로컬 상태 즉시 업데이트 완료');
        return updated;
      });

      toast({
        title: "수정 요청 완료",
        description: "콘텐츠 기획 수정 요청이 전송되었습니다."
      });

    } catch (error) {
      console.error('콘텐츠 기획 수정 요청 실패:', error);
      
      // 에러 발생 시 데이터 다시 로드하여 일관성 보장
      try {
        const plans = await contentService.getContentPlans(campaignId);
        setContentPlans(plans);
      } catch (reloadError) {
        console.error('리로드 실패:', reloadError);
      }
      
      toast({
        title: "수정 요청 실패",
        description: "콘텐츠 기획 수정 요청에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  return {
    contentPlans,
    isContentLoading,
    handleContentPlanApprove,
    handleContentPlanRevision,
    // 외부에서 직접 상태를 업데이트할 수 있는 함수 추가
    updateContentPlans: setContentPlans
  };
};
