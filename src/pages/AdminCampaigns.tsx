
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, DollarSign, Eye, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Campaign, CampaignInfluencer } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error('캠페인 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return '생성중';
      case 'recruiting': return '섭외중';
      case 'proposing': return '제안중';
      case 'approved': return '승인됨';
      case 'rejected': return '거절됨';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const handleCampaignReceive = async (campaignId: string) => {
    try {
      await campaignService.updateCampaign(campaignId, { status: 'recruiting' });
      setCampaigns(prev => 
        prev.map(c => c.id === campaignId ? { ...c, status: 'recruiting' as const } : c)
      );
      toast({
        title: "캠페인 수령 완료",
        description: "캠페인 상태가 '섭외중'으로 변경되었습니다."
      });
    } catch (error) {
      toast({
        title: "처리 실패",
        description: "캠페인 수령에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleInfluencerStatusUpdate = (influencerId: string, status: 'accepted' | 'rejected', adFee?: number) => {
    if (!selectedCampaign) return;

    const updatedInfluencers = selectedCampaign.influencers.map(inf => 
      inf.id === influencerId 
        ? { ...inf, status, adFee }
        : inf
    );

    setSelectedCampaign(prev => prev ? { ...prev, influencers: updatedInfluencers } : null);
  };

  const handleProposalSubmit = async () => {
    if (!selectedCampaign) return;

    try {
      await campaignService.updateCampaign(selectedCampaign.id, {
        status: 'proposing',
        influencers: selectedCampaign.influencers
      });

      setCampaigns(prev => 
        prev.map(c => c.id === selectedCampaign.id ? selectedCampaign : c)
      );

      toast({
        title: "제안 완료",
        description: "브랜드 관리자에게 섭외 결과를 제안했습니다."
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

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">캠페인 관리</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <Badge className={getStatusColor(campaign.status)}>
                    {getStatusText(campaign.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    예산: {campaign.budget.toLocaleString()}원
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    {campaign.campaignStartDate} ~ {campaign.campaignEndDate}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    인플루언서: {campaign.influencers.length}명
                  </div>
                  <div className="flex justify-between mt-4">
                    {campaign.status === 'creating' && (
                      <Button
                        onClick={() => handleCampaignReceive(campaign.id)}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                      >
                        캠페인 수령
                      </Button>
                    )}
                    {(campaign.status === 'recruiting' || campaign.status === 'proposing') && (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedCampaign(campaign)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            섭외 관리
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{selectedCampaign?.title} - 인플루언서 섭외</DialogTitle>
                          </DialogHeader>
                          
                          {selectedCampaign && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>브랜드</Label>
                                  <p className="text-sm">{selectedCampaign.brandName}</p>
                                </div>
                                <div>
                                  <Label>제품</Label>
                                  <p className="text-sm">{selectedCampaign.productName}</p>
                                </div>
                                <div>
                                  <Label>예산</Label>
                                  <p className="text-sm">{selectedCampaign.budget.toLocaleString()}원</p>
                                </div>
                                <div>
                                  <Label>광고 유형</Label>
                                  <p className="text-sm">{selectedCampaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</p>
                                </div>
                              </div>

                              <div>
                                <Label>인플루언서 섭외 현황</Label>
                                <div className="space-y-4 mt-2">
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
                                              {influencer.followers.toLocaleString()}명 팔로워
                                            </p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          {influencer.status === 'pending' && (
                                            <>
                                              <Input
                                                type="number"
                                                placeholder="광고비"
                                                className="w-24"
                                                onChange={(e) => {
                                                  const adFee = parseInt(e.target.value);
                                                  handleInfluencerStatusUpdate(influencer.id, 'accepted', adFee);
                                                }}
                                              />
                                              <Button
                                                size="sm"
                                                onClick={() => handleInfluencerStatusUpdate(influencer.id, 'accepted')}
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <CheckCircle className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleInfluencerStatusUpdate(influencer.id, 'rejected')}
                                              >
                                                <XCircle className="w-4 h-4" />
                                              </Button>
                                            </>
                                          )}
                                          {influencer.status === 'accepted' && (
                                            <div className="flex items-center space-x-2">
                                              <Badge className="bg-green-100 text-green-800">승인</Badge>
                                              {influencer.adFee && (
                                                <span className="text-sm">{influencer.adFee.toLocaleString()}원</span>
                                              )}
                                            </div>
                                          )}
                                          {influencer.status === 'rejected' && (
                                            <Badge className="bg-red-100 text-red-800">거절</Badge>
                                          )}
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  onClick={handleProposalSubmit}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  브랜드에 제안하기
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">진행 중인 캠페인이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampaigns;
