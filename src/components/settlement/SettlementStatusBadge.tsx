
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SettlementStatus } from '@/types/settlement';

interface SettlementStatusBadgeProps {
  status: SettlementStatus;
}

const SettlementStatusBadge: React.FC<SettlementStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: SettlementStatus) => {
    switch (status) {
      case 'pending':
        return { label: '정산 대기', variant: 'secondary' as const };
      case 'invoice-requested':
        return { label: '세금계산서 요청', variant: 'outline' as const };
      case 'invoice-approved':
        return { label: '세금계산서 승인', variant: 'outline' as const };
      case 'invoice-issued':
        return { label: '세금계산서 발행', variant: 'outline' as const };
      case 'payment-processing':
        return { label: '결제 처리중', variant: 'default' as const };
      case 'completed':
        return { label: '정산 완료', variant: 'default' as const };
      case 'failed':
        return { label: '정산 실패', variant: 'destructive' as const };
      default:
        return { label: '알 수 없음', variant: 'secondary' as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge variant={variant} className="whitespace-nowrap">
      {label}
    </Badge>
  );
};

export default SettlementStatusBadge;
