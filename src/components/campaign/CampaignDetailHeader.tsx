
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Send, CheckCircle, User } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignDetailHeaderProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  onFinalConfirmation: () => void;
}

const CampaignDetailHeader: React.FC<CampaignDetailHeaderProps> = ({
  campaign,
  onEdit,
  onDelete,
  onSubmit,
  onFinalConfirmation
}) => {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'revising': return 'bg-red-100 text-red-800';
      case 'revision-feedback': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'plan-review': return 'bg-indigo-100 text-indigo-800';
      case 'plan-approved': return 'bg-lime-100 text-lime-800';
      case 'producing': return 'bg-teal-100 text-teal-800';
      case 'content-review': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'live': return 'bg-rose-100 text-rose-800';
      case 'monitoring': return 'bg-cyan-100 text-cyan-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'submitted': return '제출됨';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'revising': return '제안수정요청';
      case 'revision-feedback': return '제안수정피드백';
      case 'confirmed': return '확정됨';
      case 'planning': return '콘텐츠 기획중';
      case 'plan-review': return '콘텐츠 기획중';
      case 'plan-revision': return '콘텐츠 기획중';
      case 'plan-approved': return '콘텐츠 기획중';
      case 'producing': return '제작중';
      case 'content-review': return '콘텐츠검토';
      case 'live': return '라이브';
      case 'monitoring': return '모니터링';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const getNextAction = () => {
    const stage = campaign.currentStage;
    const status = campaign.status;
    
    switch (stage) {
      case 1:
        if (status === 'creating') return '캠페인 제출 필요';
        if (status === 'recruiting') return '인플루언서 섭외 진행중';
        if (status === 'proposing') return '제안 검토 필요';
        if (status === 'confirmed') return '콘텐츠 기획 단계로 진행 가능';
        break;
      case 2:
        return '콘텐츠 기획안 작성/검토';
      case 3:
        return '콘텐츠 제작/검수';
      case 4:
        return '성과 모니터링';
    }
    return null;
  };

  // 페르소나 기반 캠페인인지 확인 (제목으로 판단)
  const isPersonaBased = campaign.title.includes('페르소나 기반');

  const isCreating = campaign.status === 'creating';
  const isConfirmed = campaign.status === 'confirmed';

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <Link to="/brand/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            캠페인 목록으로
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            {isPersonaBased && (
              <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                <User className="w-3 h-3 mr-1" />
                페르소나 기반
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(campaign.status)}>
              {getStatusText(campaign.status)}
            </Badge>
            {getNextAction() && (
              <Badge variant="outline" className="text-blue-600">
                {getNextAction()}
              </Badge>
            )}
          </div>
          {isPersonaBased && isCreating && (
            <p className="text-sm text-gray-600 mt-2">
              페르소나 분석을 통해 자동으로 생성된 캠페인입니다. 내용을 검토하고 제출해주세요.
            </p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {isCreating && (
          <>
            <Button onClick={onEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
            <Button onClick={onDelete} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
            <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              제출
            </Button>
          </>
        )}
        {isConfirmed && (
          <Button onClick={onFinalConfirmation} className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            최종 확정
          </Button>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailHeader;
