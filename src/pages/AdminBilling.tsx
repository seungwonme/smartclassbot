
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Settlement, SettlementSummary } from '@/types/settlement';
import { settlementService } from '@/services/settlement.service';
import SettlementSummaryCards from '@/components/settlement/SettlementSummaryCards';
import SettlementStatusBadge from '@/components/settlement/SettlementStatusBadge';
import { Check, X, Search, FileText, DollarSign, Users } from 'lucide-react';

const AdminBilling = () => {
  const { toast } = useToast();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('관리자 정산 데이터 로딩 시작');
      
      const [settlementsData, summaryData] = await Promise.all([
        settlementService.getSettlements(),
        settlementService.getSettlementSummary()
      ]);
      
      setSettlements(settlementsData);
      setSummary(summaryData);
      console.log('관리자 정산 데이터 로딩 완료:', settlementsData.length, '건');
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

  const handleTaxInvoiceApproval = async (settlementId: string, approved: boolean) => {
    try {
      const newStatus = approved ? 'invoice-approved' : 'pending';
      await settlementService.updateSettlementStatus(settlementId, newStatus);
      
      if (approved) {
        // 실제 구현에서는 세금계산서 발행 API 호출
        await settlementService.updateSettlementStatus(settlementId, 'invoice-issued');
      }
      
      toast({
        title: approved ? "세금계산서 승인" : "세금계산서 거절",
        description: approved 
          ? "세금계산서가 발행되었습니다." 
          : "세금계산서 요청이 거절되었습니다."
      });
      
      loadData();
    } catch (error) {
      console.error('세금계산서 처리 실패:', error);
      toast({
        title: "처리 실패",
        description: "세금계산서 처리에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = settlement.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.campaignId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = (() => {
      switch (activeTab) {
        case 'pending':
          return ['pending', 'invoice-requested'].includes(settlement.status);
        case 'processing':
          return ['invoice-approved', 'invoice-issued', 'payment-processing'].includes(settlement.status);
        case 'completed':
          return settlement.status === 'completed';
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesTab;
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <SettlementSummaryCards summary={{} as SettlementSummary} isLoading={true} />
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">정산 관리 (관리자)</h1>
          <p className="text-muted-foreground mt-2">
            전체 브랜드의 정산 현황을 관리하고 세금계산서를 승인하세요.
          </p>
        </div>

        {summary && <SettlementSummaryCards summary={summary} />}

        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">승인 대기</TabsTrigger>
              <TabsTrigger value="processing">처리 중</TabsTrigger>
              <TabsTrigger value="completed">완료</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="브랜드명 또는 캠페인 ID 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {activeTab === 'pending' && '승인 대기 목록'}
                {activeTab === 'processing' && '처리 중인 정산'}
                {activeTab === 'completed' && '완료된 정산'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSettlements.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? '검색 조건에 맞는 정산이 없습니다.'
                      : activeTab === 'pending' 
                        ? '승인 대기중인 정산이 없습니다.'
                        : activeTab === 'processing'
                          ? '처리 중인 정산이 없습니다.'
                          : '완료된 정산이 없습니다.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSettlements.map((settlement) => (
                    <Card key={settlement.id} className="border-l-4 border-l-blue-500">
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
                            {settlement.status === 'invoice-requested' && (
                              <>
                                <Button
                                  onClick={() => handleTaxInvoiceApproval(settlement.id, true)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  승인
                                </Button>
                                <Button
                                  onClick={() => handleTaxInvoiceApproval(settlement.id, false)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  거절
                                </Button>
                              </>
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
                            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                              <span>회사명: {settlement.taxInvoice.businessInfo.companyName}</span>
                              <span>사업자번호: {settlement.taxInvoice.businessInfo.businessNumber}</span>
                              <span>대표자: {settlement.taxInvoice.businessInfo.representative}</span>
                              <span>이메일: {settlement.taxInvoice.businessInfo.email}</span>
                              <span>연락처: {settlement.taxInvoice.businessInfo.phone}</span>
                              <span>요청일: {formatDate(settlement.taxInvoice.requestedAt)}</span>
                            </div>
                            {settlement.taxInvoice.businessInfo.address && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                주소: {settlement.taxInvoice.businessInfo.address}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {settlement.payment && (
                          <div className="mt-4 p-3 bg-blue-50 rounded">
                            <h4 className="font-medium text-sm mb-2">결제 정보</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <span>결제 방법: {settlement.payment.method}</span>
                              <span>결제 상태: {settlement.payment.status}</span>
                              {settlement.payment.paidAt && (
                                <span>결제일: {formatDate(settlement.payment.paidAt)}</span>
                              )}
                              {settlement.payment.portonePaymentId && (
                                <span>포트원 ID: {settlement.payment.portonePaymentId}</span>
                              )}
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
      </div>
    </div>
  );
};

export default AdminBilling;
