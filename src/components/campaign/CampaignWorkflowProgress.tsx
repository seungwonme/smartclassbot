
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle } from 'lucide-react';
import { WorkflowStage, WorkflowStep } from '@/hooks/useCampaignWorkflow';
import { Campaign } from '@/types/campaign';

interface CampaignWorkflowProgressProps {
  campaign: Campaign;
  workflowStage: WorkflowStage;
  workflowSteps: WorkflowStep[];
  contentPlansCount: number;
  contentSubmissionsCount: number;
}

const CampaignWorkflowProgress: React.FC<CampaignWorkflowProgressProps> = ({
  campaign,
  workflowStage,
  workflowSteps,
  contentPlansCount,
  contentSubmissionsCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          캠페인 진행 단계
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 진행률 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>전체 진행률</span>
              <span>{workflowStage.progress}%</span>
            </div>
            <Progress value={workflowStage.progress} className="h-2" />
          </div>

          {/* 5단계 워크플로우 */}
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step.completed 
                      ? 'bg-green-600 text-white' 
                      : step.current 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`text-xs mt-2 text-center font-medium ${
                    step.current ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                  {step.current && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      진행중
                    </Badge>
                  )}
                </div>
                
                {index < workflowSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 transition-colors ${
                    step.completed ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* 현재 단계 설명 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">{workflowStage.title}</h3>
            <p className="text-sm text-blue-700 mt-1">{workflowStage.description}</p>
          </div>
          
          {/* 디버그 정보 */}
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
            <p><strong>디버그 정보:</strong></p>
            <p>캠페인 ID: {campaign.id}</p>
            <p>캠페인 상태: {campaign.status}</p>
            <p>콘텐츠 기획안: {contentPlansCount}개</p>
            <p>콘텐츠 제출물: {contentSubmissionsCount}개</p>
            <p>인플루언서: {campaign.influencers?.length || 0}명</p>
            <p>현재 단계: {workflowStage.stage}/5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignWorkflowProgress;
