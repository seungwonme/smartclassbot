import { Settlement, SettlementStatus, TaxInvoice, PaymentInfo, SettlementSummary } from '@/types/settlement';
import { storageService } from './storage.service';
import { campaignService } from './campaign.service';

const STORAGE_KEY = 'lovable_settlements';

export const settlementService = {
  getSettlements: async (): Promise<Settlement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const data = localStorage.getItem(STORAGE_KEY);
          const settlements = data ? JSON.parse(data) : [];
          console.log('정산 데이터 로드:', settlements.length, '개');
          resolve(settlements);
        } catch (error) {
          console.error('정산 데이터 로드 실패:', error);
          resolve([]);
        }
      }, 300);
    });
  },

  getSettlementsByCampaign: async (campaignId: string): Promise<Settlement | null> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const settlements = await settlementService.getSettlements();
        const settlement = settlements.find(s => s.campaignId === campaignId);
        resolve(settlement || null);
      }, 200);
    });
  },

  getSettlementsByBrand: async (brandId: string): Promise<Settlement[]> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const settlements = await settlementService.getSettlements();
        const brandSettlements = settlements.filter(s => s.brandId === brandId);
        resolve(brandSettlements);
      }, 200);
    });
  },

  createSettlement: async (campaignId: string): Promise<Settlement> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          console.log('정산 생성 시작:', campaignId);
          
          // 캠페인 정보 조회
          const campaign = await campaignService.getCampaignById(campaignId);
          if (!campaign) {
            throw new Error('캠페인을 찾을 수 없습니다');
          }

          // 인플루언서 광고비 합계 계산
          const totalAmount = campaign.influencers
            .filter(inf => inf.status === 'confirmed')
            .reduce((sum, inf) => sum + (inf.adFee || 0), 0);

          const newSettlement: Settlement = {
            id: `settlement_${Date.now()}`,
            campaignId: campaign.id,
            brandId: campaign.brandId,
            brandName: campaign.brandName,
            amount: totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const settlements = await settlementService.getSettlements();
          settlements.push(newSettlement);
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(settlements));
          console.log('정산 생성 완료:', newSettlement.id);
          
          resolve(newSettlement);
        } catch (error) {
          console.error('정산 생성 실패:', error);
          reject(error);
        }
      }, 500);
    });
  },

  updateSettlementStatus: async (settlementId: string, status: SettlementStatus): Promise<Settlement> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const settlements = await settlementService.getSettlements();
          const index = settlements.findIndex(s => s.id === settlementId);
          
          if (index === -1) {
            throw new Error('정산 정보를 찾을 수 없습니다');
          }

          settlements[index] = {
            ...settlements[index],
            status,
            updatedAt: new Date().toISOString()
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(settlements));
          console.log('정산 상태 업데이트:', settlementId, '→', status);
          
          resolve(settlements[index]);
        } catch (error) {
          console.error('정산 상태 업데이트 실패:', error);
          reject(error);
        }
      }, 300);
    });
  },

  requestTaxInvoice: async (settlementId: string, businessInfo: any): Promise<TaxInvoice> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const settlements = await settlementService.getSettlements();
          const settlement = settlements.find(s => s.id === settlementId);
          
          if (!settlement) {
            throw new Error('정산 정보를 찾을 수 없습니다');
          }

          const taxInvoice: TaxInvoice = {
            id: `invoice_${Date.now()}`,
            settlementId,
            status: 'requested',
            requestedAt: new Date().toISOString(),
            businessInfo
          };

          const index = settlements.findIndex(s => s.id === settlementId);
          settlements[index] = {
            ...settlement,
            status: 'invoice-requested',
            taxInvoice,
            updatedAt: new Date().toISOString()
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(settlements));
          console.log('세금계산서 발행 요청:', taxInvoice.id);
          
          resolve(taxInvoice);
        } catch (error) {
          console.error('세금계산서 요청 실패:', error);
          reject(error);
        }
      }, 500);
    });
  },

  processPayment: async (settlementId: string, paymentInfo: Partial<PaymentInfo>): Promise<PaymentInfo> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const settlements = await settlementService.getSettlements();
          const settlement = settlements.find(s => s.id === settlementId);
          
          if (!settlement) {
            throw new Error('정산 정보를 찾을 수 없습니다');
          }

          const payment: PaymentInfo = {
            id: `payment_${Date.now()}`,
            settlementId,
            method: paymentInfo.method || 'card',
            amount: settlement.amount,
            status: 'processing',
            createdAt: new Date().toISOString(),
            ...paymentInfo
          };

          const index = settlements.findIndex(s => s.id === settlementId);
          settlements[index] = {
            ...settlement,
            status: 'payment-processing',
            payment,
            updatedAt: new Date().toISOString()
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(settlements));
          console.log('결제 처리 시작:', payment.id);
          
          resolve(payment);
        } catch (error) {
          console.error('결제 처리 실패:', error);
          reject(error);
        }
      }, 500);
    });
  },

  completeSettlement: async (settlementId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const settlements = await settlementService.getSettlements();
          const settlement = settlements.find(s => s.id === settlementId);
          
          if (!settlement) {
            throw new Error('정산 정보를 찾을 수 없습니다');
          }

          // 정산 완료 처리
          const index = settlements.findIndex(s => s.id === settlementId);
          settlements[index] = {
            ...settlement,
            status: 'completed',
            updatedAt: new Date().toISOString()
          };

          if (settlement.payment) {
            settlements[index].payment = {
              ...settlement.payment,
              status: 'completed',
              paidAt: new Date().toISOString()
            };
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(settlements));

          // 캠페인 상태를 planning으로 업데이트
          await campaignService.updateCampaign(settlement.campaignId, {
            status: 'planning',
            currentStage: 2
          });

          console.log('정산 완료 처리:', settlementId);
          resolve();
        } catch (error) {
          console.error('정산 완료 처리 실패:', error);
          reject(error);
        }
      }, 500);
    });
  },

  getSettlementSummary: async (brandId?: string): Promise<SettlementSummary> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const settlements = await settlementService.getSettlements();
        const filteredSettlements = brandId 
          ? settlements.filter(s => s.brandId === brandId)
          : settlements;

        // 세금계산서 발행 대기 상태들
        const taxInvoicePendingStatuses = ['invoice-approved', 'invoice-issued'];
        const taxInvoicePendingSettlements = filteredSettlements.filter(s => 
          taxInvoicePendingStatuses.includes(s.status)
        );

        const summary: SettlementSummary = {
          totalAmount: filteredSettlements.reduce((sum, s) => sum + s.amount, 0),
          pendingCount: filteredSettlements.filter(s => s.status === 'pending').length,
          completedCount: filteredSettlements.filter(s => s.status === 'completed').length,
          taxInvoicePendingCount: taxInvoicePendingSettlements.length,
          taxInvoicePendingAmount: taxInvoicePendingSettlements.reduce((sum, s) => sum + s.amount, 0),
          pendingAmount: filteredSettlements
            .filter(s => ['pending', 'invoice-requested', 'payment-processing'].includes(s.status))
            .reduce((sum, s) => sum + s.amount, 0)
        };

        resolve(summary);
      }, 300);
    });
  }
};
