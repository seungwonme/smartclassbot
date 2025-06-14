import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, DollarSign, Eye, CheckCircle, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import CampaignDashboard from '@/components/campaign/CampaignDashboard';
import { Campaign, CampaignInfluencer } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';
import InfluencerEditModal from '@/components/campaign/InfluencerEditModal';
import SimilarInfluencerModal from '@/components/campaign/SimilarInfluencerModal';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [influencerFees, setInfluencerFees] = useState<{ [key: string]: number }>({});
  const [editingInfluencer, setEditingInfluencer] = useState<CampaignInfluencer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSimilarModalOpen, setIsSimilarModalOpen] = useState(false);
  const [rejectedInfluencerForSimilar, setRejectedInfluencerForSimilar] = useState<CampaignInfluencer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadCampaigns = async () => {
      console.log('=== AdminCampaigns 캠페인 로딩 시작 ===');
      try {
        const data = await campaignService.getCampaigns();
        console.log('관리자 페이지 - 로드된 캠페인 데이터:', data);
        data.forEach((campaign, index) => {
          console.log(`캠페인 ${index + 1}: "${campaign.title}" - 상태: ${campaign.status} - ID: ${campaign.id}`);
        });
        setCampaigns(data);
      } catch (error) {
        console.error('캠페인 로딩 실패:', error);
      } finally {
        setIsLoading(false);
        console.log('=== AdminCampaigns 캠페인 로딩 완료 ===');
      }
    };

    loadCampaigns();
  }, []);

  const handleCampaignClick = (campaignId: string) => {
    console.log('Admin - Campaign clicked:', campaignId);
    // Navigate to campaign detail page
    window.location.href = `/admin/campaigns/${campaignId}`;
  };

  const handleCampaignDelete = async (campaignId: string, campaignTitle: string) => {
    if (!confirm(`정말로 "${campaignTitle}" 캠페인을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      console.log('=== 시스템 관리자 캠페인 삭제 시작 ===');
      console.log('삭제할 캠페인 ID:', campaignId);
      console.log('삭제할 캠페인 제목:', campaignTitle);
      
      await campaignService.deleteCampaign(campaignId);
      
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      
      console.log('=== 시스템 관리자 캠페인 삭제 완료 ===');
      
      toast({
        title: "캠페인 삭제 완료",
        description: `"${campaignTitle}" 캠페인이 성공적으로 삭제되었습니다.`
      });
    } catch (error) {
      console.error('=== 캠페인 삭제 실패 ===', error);
      toast({
        title: "삭제 실패",
        description: "캠페인 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleCampaignReceive = async (campaignId: string) => {
    console.log('=== 캠페인 수령 프로세스 시작 ===');
    console.log('캠페인 수령 시작:', campaignId);
    try {
      const currentCampaign = campaigns.find(c => c.id === campaignId);
      console.log('현재 캠페인 상태:', currentCampaign?.status);
      
      await campaignService.updateCampaign(campaignId, { status: 'recruiting' });
      setCampaigns(prev => 
        prev.map(c => c.id === campaignId ? { ...c, status: 'recruiting' as const } : c)
      );
      console.log('캠페인 상태 변경 완료: submitted → recruiting');
      console.log('=== 캠페인 수령 프로세스 완료 ===');
      toast({
        title: "캠페인 수령 완료",
        description: "캠페인 상태가 '섭외중'으로 변경되었습니다."
      });
    } catch (error) {
      console.error('=== 캠페인 수령 실패 ===', error);
      toast({
        title: "처리 실패",
        description: "캠페인 수령에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleCampaignManage = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'revising': return 'bg-red-100 text-red-800';
      case 'revision-feedback': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
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
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  // 활성 상태의 인플루언서만 카운트 (거절된 인플루언서 제외)
  const getActiveInfluencersCount = (influencers: Campaign['influencers']) => {
    return influencers.filter(inf => 
      inf.status !== 'brand-rejected' && 
      inf.status !== 'admin-rejected' && 
      inf.status !== 'rejected'
    ).length;
  };

  const handleInfluencerFeeChange = (influencerId: string, fee: number) => {
    setInfluencerFees(prev => ({ ...prev, [influencerId]: fee }));
  };

  const handleInfluencerConfirm = (influencerId: string) => {
    if (!selectedCampaign) return;
    
    const fee = influencerFees[influencerId];
    if (!fee) {
      toast({
        title: "광고비를 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    const updatedInfluencers = selectedCampaign.influencers.map(inf => 
      inf.id === influencerId 
        ? { ...inf, status: 'accepted' as const, adFee: fee }
        : inf
    );

    setSelectedCampaign(prev => prev ? { ...prev, influencers: updatedInfluencers } : null);
    
    toast({
      title: "섭외 완료",
      description: "인플루언서 섭외가 완료되었습니다."
    });
  };

  const handleInfluencerReject = (influencerId: string) => {
    if (!selectedCampaign) return;

    const updatedInfluencers = selectedCampaign.influencers.map(inf => 
      inf.id === influencerId 
        ? { ...inf, status: 'admin-rejected' as const }
        : inf
    );

    setSelectedCampaign(prev => prev ? { ...prev, influencers: updatedInfluencers } : null);
    
    toast({
      title: "섭외 거절",
      description: "인플루언서가 거절되었습니다."
    });
  };

  const handleAddSimilarInfluencer = (rejectedInfluencerId: string) => {
    if (!selectedCampaign) return;
    
    const rejectedInfluencer = selectedCampaign.influencers.find(inf => inf.id === rejectedInfluencerId);
    if (rejectedInfluencer) {
      setRejectedInfluencerForSimilar(rejectedInfluencer);
      setIsSimilarModalOpen(true);
    }
  };

  const handleAddSimilarInfluencers = async (newInfluencers: CampaignInfluencer[]) => {
    if (!selectedCampaign) return;

    try {
      const updatedInfluencers = [...selectedCampaign.influencers, ...newInfluencers];
      
      await campaignService.updateCampaign(selectedCampaign.id, {
        influencers: updatedInfluencers
      });

      setSelectedCampaign(prev => prev ? { ...prev, influencers: updatedInfluencers } : null);
      
      // Also update the main campaigns list
      setCampaigns(prev => 
        prev.map(c => c.id === selectedCampaign.id ? { ...c, influencers: updatedInfluencers } : c)
      );
      
      toast({
        title: "유사 인플루언서 추가 완료",
        description: `${newInfluencers.length}명의 인플루언서가 추가되었습니다.`
      });
    } catch (error) {
      toast({
        title: "추가 실패",
        description: "유사 인플루언서 추가에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const calculateQuote = () => {
    if (!selectedCampaign) return { subtotal: 0, agencyFee: 0, vat: 0, total: 0 };
    
    const subtotal = selectedCampaign.influencers
      .filter(inf => (inf.status === 'accepted' || inf.status === 'confirmed') && inf.adFee)
      .reduce((sum, inf) => sum + (inf.adFee || 0), 0);
    
    const agencyFee = subtotal * 0.15;
    const vat = (subtotal + agencyFee) * 0.1;
    const total = subtotal + agencyFee + vat;
    
    return { subtotal, agencyFee, vat, total };
  };

  const handleProposalSubmit = async () => {
    if (!selectedCampaign) return;

    try {
      const quote = calculateQuote();
      
      // 브랜드가 거절한 인플루언서가 있는지 확인
      const hasRevisedInfluencers = selectedCampaign.influencers.some(inf => inf.status === 'brand-rejected');
      
      // 상태 결정: 수정 제안인지 최초 제안인지에 따라 다름
      const newStatus = hasRevisedInfluencers ? 'revision-feedback' as const : 'proposing' as const;
      
      console.log('=== 제안 제출 프로세스 ===');
      console.log('브랜드 거절 인플루언서 존재:', hasRevisedInfluencers);
      console.log('새로운 캠페인 상태:', newStatus);
      
      await campaignService.updateCampaign(selectedCampaign.id, {
        status: newStatus,
        influencers: selectedCampaign.influencers,
        quote
      });

      setCampaigns(prev => 
        prev.map(c => c.id === selectedCampaign.id ? { ...selectedCampaign, status: newStatus } : c)
      );

      toast({
        title: hasRevisedInfluencers ? "수정 제안 완료" : "제안 완료",
        description: hasRevisedInfluencers 
          ? "브랜드 관리자에게 수정된 섭외 결과를 재제안했습니다."
          : "브랜드 관리자에게 섭외 결과를 제안했습니다."
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "제안 실패",
        description: "제안 전송에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleInfluencerEdit = (influencer: CampaignInfluencer) => {
    setEditingInfluencer(influencer);
    setIsEditModalOpen(true);
  };

  const handleSaveInfluencerEdit = async (influencer: CampaignInfluencer, editData: any) => {
    if (!selectedCampaign) return;

    const updatedInfluencers = selectedCampaign.influencers.map(inf => 
      inf.id === influencer.id 
        ? { 
            ...inf, 
            adFee: editData.adFee ? parseInt(editData.adFee.replace(/,/g, '')) : undefined,
            region: editData.region,
            category: editData.category
          }
        : inf
    );

    try {
      await campaignService.updateCampaign(selectedCampaign.id, {
        influencers: updatedInfluencers
      });

      setSelectedCampaign(prev => prev ? { ...prev, influencers: updatedInfluencers } : null);
      
      // Also update the main campaigns list
      setCampaigns(prev => 
        prev.map(c => c.id === selectedCampaign.id ? { ...c, influencers: updatedInfluencers } : c)
      );
      
      toast({
        title: "인플루언서 정보 수정 완료",
        description: "인플루언서 정보가 성공적으로 수정되었습니다."
      });
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "인플루언서 정보 수정에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  const quote = selectedCampaign ? calculateQuote() : { subtotal: 0, agencyFee: 0, vat: 0, total: 0 };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">캠페인 관리</h1>
        </div>

        <CampaignDashboard
          campaigns={campaigns}
          userType="admin"
          onCampaignClick={handleCampaignClick}
          onCampaignDelete={handleCampaignDelete}
          onCampaignReceive={handleCampaignReceive}
          onCampaignManage={handleCampaignManage}
        />

        {/* 기존 모달들 유지 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCampaign?.title} - 인플루언서 섭외</DialogTitle>
            </DialogHeader>
            
            {selectedCampaign && (
              <div className="space-y-6">
                                
                <Card>
                  <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>브랜드</Label>
                        <p className="text-sm font-medium">{selectedCampaign.brandName}</p>
                      </div>
                      <div>
                        <Label>제품</Label>
                        <p className="text-sm font-medium">{selectedCampaign.productName}</p>
                      </div>
                      <div>
                        <Label>예산</Label>
                        <p className="text-sm font-medium">{selectedCampaign.budget.toLocaleString()}원</p>
                      </div>
                      <div>
                        <Label>광고 유형</Label>
                        <p className="text-sm font-medium">{selectedCampaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>인플루언서 섭외 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCampaign.influencers.map((influencer) => (
                        <Card key={influencer.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={influencer.profileImage}
                                alt={influencer.name}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <h4 className="font-medium">{influencer.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {influencer.followers.toLocaleString()}명 팔로워 • {influencer.category}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {influencer.status === 'pending' && (
                                <>
                                  <Input
                                    type="number"
                                    placeholder="광고비 (원)"
                                    className="w-32"
                                    value={influencerFees[influencer.id] || ''}
                                    onChange={(e) => handleInfluencerFeeChange(influencer.id, parseInt(e.target.value) || 0)}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleInfluencerConfirm(influencer.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    확인
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleInfluencerReject(influencer.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    거절
                                  </Button>
                                </>
                              )}
                              {(influencer.status === 'accepted' || influencer.status === 'confirmed') && (
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-100 text-green-800">
                                    {influencer.status === 'accepted' ? '수락됨' : '승인됨'}
                                  </Badge>
                                  <span className="text-sm font-medium text-green-600">
                                    {influencer.adFee?.toLocaleString() || 0}원
                                  </span>
                                  {influencer.status === 'accepted' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleInfluencerEdit(influencer)}
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      수정
                                    </Button>
                                  )}
                                </div>
                              )}
                              {influencer.status === 'admin-rejected' && (
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-red-100 text-red-800">시스템 거절</Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddSimilarInfluencer(influencer.id)}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    유사 인플루언서 추가
                                  </Button>
                                </div>
                              )}
                              {influencer.status === 'brand-rejected' && (
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-orange-100 text-orange-800">브랜드 거절</Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddSimilarInfluencer(influencer.id)}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    유사 인플루언서 추가
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>견적서</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>인플루언서 광고비 소계</span>
                        <span className="font-medium">
                          {calculateQuote().subtotal.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>대행료 (15%)</span>
                        <span className="font-medium">
                          {calculateQuote().agencyFee.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (10%)</span>
                        <span className="font-medium">
                          {calculateQuote().vat.toLocaleString()}원
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>총 합계</span>
                        <span className="text-green-600">
                          {calculateQuote().total.toLocaleString()}원
                        </span>
                      </div>
                      
                      {/* 승인된 인플루언서 목록 표시 */}
                      {selectedCampaign.influencers.filter(inf => inf.status === 'accepted' || inf.status === 'confirmed').length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">승인된 인플루언서:</h4>
                          <div className="space-y-1">
                            {selectedCampaign.influencers
                              .filter(inf => inf.status === 'accepted' || inf.status === 'confirmed')
                              .map((influencer) => (
                                <div key={influencer.id} className="flex justify-between text-sm">
                                  <span>{influencer.name}</span>
                                  <span className="text-green-600">
                                    {influencer.adFee?.toLocaleString() || 0}원
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleProposalSubmit}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={selectedCampaign.influencers.filter(inf => inf.status === 'accepted').length === 0}
                  >
                    제안 제출하기
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <InfluencerEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          influencer={editingInfluencer}
          onSave={handleSaveInfluencerEdit}
        />

        <SimilarInfluencerModal
          isOpen={isSimilarModalOpen}
          onClose={() => setIsSimilarModalOpen(false)}
          rejectedInfluencer={rejectedInfluencerForSimilar}
          onAddInfluencers={handleAddSimilarInfluencers}
        />
      </div>
    </div>
  );
};

export default AdminCampaigns;
