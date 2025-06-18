
export interface Settlement {
  id: string;
  campaignId: string;
  brandId: string;
  brandName: string;
  amount: number;
  status: SettlementStatus;
  taxInvoice?: TaxInvoice;
  payment?: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}

export type SettlementStatus = 
  | 'pending'           // 정산 대기
  | 'invoice-requested' // 세금계산서 발행 요청
  | 'invoice-approved'  // 세금계산서 승인
  | 'invoice-issued'    // 세금계산서 발행 완료
  | 'payment-processing'// 결제 처리 중
  | 'completed'         // 정산 완료
  | 'failed';           // 정산 실패

export interface TaxInvoice {
  id: string;
  settlementId: string;
  invoiceNumber?: string;
  issueDate?: string;
  status: TaxInvoiceStatus;
  requestedAt: string;
  approvedAt?: string;
  issuedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  businessInfo: BusinessInfo;
}

export type TaxInvoiceStatus = 
  | 'requested'  // 발행 요청
  | 'approved'   // 승인
  | 'issued'     // 발행 완료
  | 'rejected';  // 거절

export interface BusinessInfo {
  companyName: string;
  businessNumber: string;
  representative: string;
  address: string;
  email: string;
  phone: string;
}

export interface PaymentInfo {
  id: string;
  settlementId: string;
  portonePaymentId?: string;
  method: 'card' | 'bank_transfer' | 'virtual_account';
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
}

export type PaymentStatus = 
  | 'pending'     // 결제 대기
  | 'processing'  // 결제 처리 중
  | 'completed'   // 결제 완료
  | 'failed'      // 결제 실패
  | 'cancelled';  // 결제 취소

export interface SettlementSummary {
  totalAmount: number;
  pendingCount: number;
  completedCount: number;
  monthlyRevenue: number;
  pendingAmount: number;
}
