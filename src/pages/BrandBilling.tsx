import React, { useState, useEffect } from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settlement, SettlementSummary } from '@/types/settlement';
import { settlementService } from '@/services/settlement.service';
import { campaignService } from '@/services/campaign.service';
import SettlementSummaryCards from '@/components/settlement/SettlementSummaryCards';
import SettlementStatusBadge from '@/components/settlement/SettlementStatusBadge';
import TaxInvoiceRequestModal from '@/components/settlement/TaxInvoiceRequestModal';
import { CreditCard, FileText, Calendar, DollarSign } from 'lucide-react';

const BrandBilling = () => {
  const { toast } = useToast();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('브랜드 정산 데이터 로딩 시작');
      
      const [settlementsData, summaryData] = await Promise.all([
        settlementService.getSettlements(),
        settlementService.getSettlementSummary()
      ]);
      
      setSettlements(settlementsData);
      setSummary(summaryData);
      console.log('브랜드 정산 데이터 로딩 완료:', settlementsData.length, '건');
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      toast({
        title: "데이터 로딩 실패",
        description: "정산 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaxInvoiceRequest = async (settlementId: string, businessInfo: any) => {
    try {
      await settlementService.requestTaxInvoice(settlementId, businessInfo);
      toast({
        title: "세금계산서 요청 완료",
        description: "관리자 검토 후 세금계산서가 발행됩니다."
      });
      loadData();
    } catch (error) {
      console.error('세금계산서 요청 실패:', error);
      throw error;
    }
  };

  const handlePayment = async (settlementId: string) => {
    try {
      // 실제 구현에서는 포트원 결제 페이지로 이동
      console.log('포트원 결제 시작:', settlementId);
      
      // 결제 처리 시뮬레이션
      await settlementService.processPayment(settlementId, {
        method: 'card',
        portonePaymentId: `portone_${Date.now()}`
      });
      
      // 결제 완료 시뮬레이션 (실제로는 웹훅으로 처리)
      setTimeout(async () => {
        await settlementService.completeSettlement(settlementId);
        toast({
          title: "결제 완료",
          description: "정산이 완료되어 캠페인이 다음 단계로 진행됩니다."
        });
        loadData();
      }, 2000);
      
      toast({
        title: "결제 처리 중",
        description: "결제가 처리되고 있습니다."
      });
      
      loadData();
    } catch (error) {
      console.error('결제 처리 실패:', error);
      toast({
        title: "결제 실패",
        description: "결제 처리에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const filteredSettlements = settlements.filter(settlement => {
    switch (activeTab) {
      case 'pending':
        return ['pending', 'invoice-requested', 'invoice-approved'].includes(settlement.status);
      case 'processing':
        return ['payment-processing'].includes(settlement.status);
      case 'completed':
        return ['completed'].includes(settlement.status);
      default:
        return true;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <BrandSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <SettlementSummaryCards summary={{} as SettlementSummary} isLoading={true} />
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">정산 관리</h1>
              <p className="text-muted-foreground mt-2">
                캠페인 정산 현황을 확인하고 결제를 진행하세요.
              </p>
            </div>

            {summary && <SettlementSummaryCards summary={summary} />}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">정산 대기</TabsTrigger>
                <TabsTrigger value="processing">결제 처리중</TabsTrigger>
                <TabsTrigger value="completed">완료</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {activeTab === 'pending' && '정산 대기 목록'}
                      {activeTab === 'processing' && '결제 처리중 목록'}
                      {activeTab === 'completed' && '정산 완료 목록'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredSettlements.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {activeTab === 'pending' && '정산 대기중인 캠페인이 없습니다.'}
                          {activeTab === 'processing' && '결제 처리중인 캠페인이 없습니다.'}
                          {activeTab === 'completed' && '완료된 정산이 없습니다.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredSettlements.map((settlement) => (
                          <Card key={settlement.id} className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <h3 className="font-semibold">{settlement.brandName}</h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>캠페인 ID: {settlement.campaignId}</span>
                                    <span>생성일: {formatDate(settlement.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <SettlementStatusBadge status={settlement.status} />
                                    <span className="font-semibold text-lg">
                                      {formatCurrency(settlement.amount)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  {settlement.status === 'pending' && (
                                    <TaxInvoiceRequestModal
                                      settlementId={settlement.id}
                                      onRequestSubmitted={(businessInfo) => 
                                        handleTaxInvoiceRequest(settlement.id, businessInfo)
                                      }
                                    />
                                  )}
                                  
                                  {settlement.status === 'invoice-issued' && (
                                    <Button
                                      onClick={() => handlePayment(settlement.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CreditCard className="w-4 h-4 mr-2" />
                                      결제하기
                                    </Button>
                                  )}
                                  
                                  {settlement.taxInvoice && (
                                    <Button variant="outline" size="sm">
                                      <FileText className="w-4 h-4 mr-2" />
                                      세금계산서 보기
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {settlement.taxInvoice && (
                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                  <h4 className="font-medium text-sm mb-2">세금계산서 정보</h4>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <span>회사명: {settlement.taxInvoice.businessInfo.companyName}</span>
                                    <span>사업자번호: {settlement.taxInvoice.businessInfo.businessNumber}</span>
                                    <span>요청일: {formatDate(settlement.taxInvoice.requestedAt)}</span>
                                    <span>상태: {settlement.taxInvoice.status}</span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBilling;
