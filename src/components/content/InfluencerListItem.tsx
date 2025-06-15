
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { CampaignInfluencer, ContentSubmission } from '@/types/campaign';
import { calculateScheduleStatus } from '@/utils/scheduleUtils';

interface InfluencerListItemProps {
  influencer: CampaignInfluencer;
  submission?: ContentSubmission;
  isSelected: boolean;
  onClick: () => void;
}

const InfluencerListItem: React.FC<InfluencerListItemProps> = ({
  influencer,
  submission,
  isSelected,
  onClick
}) => {
  const getScheduleInfo = () => {
    if (!influencer.productionStartDate || !influencer.productionDeadline) return null;
    
    const hasContentSubmission = submission && ['submitted', 'approved'].includes(submission.status);
    return calculateScheduleStatus(
      influencer.productionStartDate,
      influencer.productionDeadline,
      false,
      !!hasContentSubmission
    );
  };

  const scheduleInfo = getScheduleInfo();

  const getStatusBadge = () => {
    if (!scheduleInfo) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          일정 미설정
        </Badge>
      );
    }

    const statusConfig = {
      'deadline-exceeded': {
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="w-3 h-3 mr-1" />,
        text: '마감초과'
      },
      'production-in-progress': {
        className: scheduleInfo.isUrgent ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-blue-100 text-blue-800 border-blue-200',
        icon: scheduleInfo.isUrgent ? <AlertTriangle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />,
        text: '제작중'
      },
      'production-waiting': {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Calendar className="w-3 h-3 mr-1" />,
        text: '제작대기'
      },
      'content-review': {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        text: '검수중'
      }
    };

    const config = statusConfig[scheduleInfo.status];
    return (
      <Badge className={config.className}>
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-900">{influencer.name}</h4>
            <p className="text-xs text-gray-500">{influencer.platform}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        {getStatusBadge()}
      </div>
    </div>
  );
};

export default InfluencerListItem;
