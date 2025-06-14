
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignWorkflowStepsProps {
  campaign: Campaign;
}

const CampaignWorkflowSteps = ({ campaign }: CampaignWorkflowStepsProps) => {
  const steps = [
    { id: 1, title: '캠페인 생성', icon: CheckCircle },
    { id: 2, title: '콘텐츠 기획', icon: Clock },
    { id: 3, title: '콘텐츠 제작', icon: Clock },
    { id: 4, title: '콘텐츠 검수', icon: Clock },
    { id: 5, title: '성과 모니터링', icon: Clock },
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < campaign.currentStage) return 'completed';
    if (stepId === campaign.currentStage) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'current': return 'bg-blue-600 text-white';
      case 'pending': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getConnectorColor = (stepId: number) => {
    return stepId < campaign.currentStage ? 'bg-green-600' : 'bg-gray-200';
  };

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(status)}`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : status === 'current' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-center font-medium">{step.title}</span>
                {status === 'current' && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    진행중
                  </Badge>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${getConnectorColor(step.id)}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignWorkflowSteps;
