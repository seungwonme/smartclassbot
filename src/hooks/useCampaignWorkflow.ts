
import { useMemo } from 'react';
import { Campaign } from '@/types/campaign';

export interface WorkflowStage {
  stage: number;
  title: string;
  description: string;
  progress: number;
}

export interface WorkflowStep {
  id: number;
  title: string;
  completed: boolean;
  current: boolean;
}

export const useCampaignWorkflow = (campaign: Campaign | undefined) => {
  const getWorkflowStage = useMemo((): WorkflowStage => {
    if (!campaign) return { stage: 1, title: '', description: '', progress: 0 };

    switch (campaign.status) {
      case 'creating':
      case 'submitted':
      case 'recruiting':
      case 'proposing':
      case 'confirmed':
        return {
          stage: 1,
          title: '캠페인 생성 완료',
          description: '인플루언서 모집 및 확정이 완료되었습니다.',
          progress: 20
        };
      case 'planning':
      case 'plan-review':
      case 'plan-revision':
        return {
          stage: 2,
          title: '콘텐츠 기획',
          description: '인플루언서들이 콘텐츠 기획안을 작성하고 검토중입니다.',
          progress: 40
        };
      case 'plan-approved':
      case 'producing':
        return {
          stage: 3,
          title: '콘텐츠 제작',
          description: '인플루언서들이 콘텐츠를 제작하고 업로드하고 있습니다.',
          progress: 60
        };
      case 'content-review':
      case 'content-revision':
        return {
          stage: 4,
          title: '콘텐츠 검수',
          description: '제작된 콘텐츠를 검토하고 승인하고 있습니다.',
          progress: 80
        };
      case 'content-approved':
      case 'live':
      case 'monitoring':
      case 'completed':
        return {
          stage: 5,
          title: '성과 모니터링',
          description: '콘텐츠가 라이브되어 성과를 모니터링하고 있습니다.',
          progress: 100
        };
      default:
        return {
          stage: 1,
          title: '캠페인 진행중',
          description: '캠페인이 진행중입니다.',
          progress: 20
        };
    }
  }, [campaign]);

  const getWorkflowSteps = useMemo((): WorkflowStep[] => {
    const currentStage = getWorkflowStage.stage;
    
    return [
      { id: 1, title: '캠페인 생성', completed: currentStage > 1, current: currentStage === 1 },
      { id: 2, title: '콘텐츠 기획', completed: currentStage > 2, current: currentStage === 2 },
      { id: 3, title: '콘텐츠 제작', completed: currentStage > 3, current: currentStage === 3 },
      { id: 4, title: '콘텐츠 검수', completed: currentStage > 4, current: currentStage === 4 },
      { id: 5, title: '성과 모니터링', completed: currentStage > 5, current: currentStage === 5 }
    ];
  }, [getWorkflowStage.stage]);

  const isTabEnabled = (tabName: string): boolean => {
    const currentStage = getWorkflowStage.stage;
    
    switch (tabName) {
      case 'content-plans':
        return currentStage >= 2;
      case 'content-production':
        return currentStage >= 3;
      case 'content-review':
        return currentStage >= 4;
      default:
        return true;
    }
  };

  const getDefaultTab = (): string => {
    const currentStage = getWorkflowStage.stage;
    
    if (currentStage === 2) return 'content-plans';
    if (currentStage === 3) return 'content-production';
    if (currentStage >= 4) return 'content-review';
    
    return 'content-plans';
  };

  return {
    workflowStage: getWorkflowStage,
    workflowSteps: getWorkflowSteps,
    isTabEnabled,
    getDefaultTab
  };
};
