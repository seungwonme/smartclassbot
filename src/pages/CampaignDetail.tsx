
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Send, Calendar, Users, DollarSign, CheckCircle, XCircle, ExternalLink, Eye } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InfluencerDetailModal from '@/components/InfluencerDetailModal';
import XiaohongshuInfluencerDetailModal from '@/components/XiaohongshuInfluencerDetailModal';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!id) return;
      
      try {
        const data = await campaignService.getCampaignById(id);
        setCampaign(data);
      } catch (error) {
        console.error('캠페인 로딩 실패:', error);
        toast({
          title: "캠페인을 불러올 수 없습니다",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [id, toast]);

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

  const handleEdit = () => {
    navigate(`/brand/campaigns/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!campaign || campaign.status !== 'creating') return;
    
    if (confirm('정말로 이 캠페인을 삭제하시겠습니까?')) {
      try {
        await campaignService.deleteCampaign(campaign.id);
        toast({
          title: "캠페인이 삭제되었습니다"
        });
        navigate('/brand/campaigns');
      } catch (error) {
        toast({
          title: "삭제 실패",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!campaign || campaign.status !== 'creating') return;
    
    try {
      await campaignService.updateCampaign(campaign.id, { status: 'recruiting' });
      setCampaign(prev => prev ? { ...prev, status: 'recruiting' } : null);
      toast({
        title: "캠페인이 제출되었습니다",
        description: "시스템 관리자가 검토 후 인플루언서 섭외를 진행합니다."
      });
    } catch (error) {
      toast({
        title: "제출 실패",
        variant: "destructive"
      });
    }
  };

  const handleInfluencerApproval = async (influencerId: string, approved: boolean) => {
    if (!campaign) return;
    
    try {
      const updatedInfluencers = campaign.influencers.map(inf => 
        inf.id === influencerId 
          ? { ...inf, status: approved ? 'approved' as const : 'rejected' as const }
          : inf
      );

      const updatedCampaign = { ...campaign, influencers: updatedInfluencers };
      
      // 모든 인플루언서에 대한 결정이 완료되었는지 확인
      const allDecided = updatedInfluencers.every(inf => inf.status === 'approved' || inf.status === 'rejected');
      const hasRejected = updatedInfluencers.some(inf => inf.status === 'rejected');
      
      let newStatus = campaign.status;
      if (allDecided) {
        if (hasRejected) {
          newStatus = 'recruiting'; // 거절된 인플루언서가 있으면 다시 섭외중으로
        } else {
          newStatus = 'approved'; // 모든 인플루언서가 승인되면 승인완료
        }
      }

      await campaignService.updateCampaign(campaign.id, {
        influencers: updatedInfluencers,
        status: newStatus
      });

      setCampaign({ ...updatedCampaign, status: newStatus });
      
      toast({
        title: approved ? "인플루언서 승인" : "인플루언서 거절",
        description: approved ? "인플루언서가 승인되었습니다." : "인플루언서가 거절되었습니다."
      });
    } catch (error) {
      toast({
        title: "처리 실패",
        variant: "destructive"
      });
    }
  };

  const handleFinalConfirmation = async () => {
    if (!campaign) return;
    
    try {
      await campaignService.updateCampaign(campaign.id, { status: 'completed' });
      setCampaign(prev => prev ? { ...prev, status: 'completed' } : null);
      
      toast({
        title: "캠페인 확정 완료",
        description: "캠페인이 최종 확정되었습니다."
      });
    } catch (error) {
      toast({
        title: "확정 실패",
        variant: "destructive"
      });
    }
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handleViewPlatformPage = (influencer: any) => {
    // 플랫폼별 URL 생성 로직
    let platformUrl = '';
    
    if (influencer.platform === 'douyin') {
      platformUrl = `https://www.douyin.com/user/${influencer.id}`;
    } else if (influencer.platform === 'xiaohongshu') {
      platformUrl = `https://www.xiaohongshu.com/user/profile/${influencer.id}`;
    }
    
    if (platformUrl) {
      window.open(platformUrl, '_blank');
    }
  };

  const handleViewInfluencerDetail = (influencer: any) => {
    // 인플루언서 상세 정보에 플랫폼 정보 추가하고 데이터 구조 맞춤
    const influencerWithPlatform = {
      ...influencer,
      nickname: influencer.name || influencer.nickname || 'Unknown', // name을 nickname으로 매핑
      platform: influencer.platform || 'douyin', // 기본값 설정
      region: influencer.region || '서울',
      category: Array.isArray(influencer.category) ? influencer.category : [influencer.category || '뷰티']
    };
    
    setSelectedInfluencer(influencerWithPlatform);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen w-full">
        <BrandSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">캠페인을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const isCreating = campaign.status === 'creating';
  const isProposing = campaign.status === 'proposing';
  const isApproved = campaign.status === 'approved';

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/brand/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                캠페인 목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusText(campaign.status)}
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isCreating && (
              <>
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  제출
                </Button>
              </>
            )}
            {isApproved && (
              <Button onClick={handleFinalConfirmation} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                최종 확정
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">브랜드</label>
                <p className="text-lg">{campaign.brandName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">제품</label>
                <p className="text-lg">{campaign.productName}</p>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                <div>
                  <label className="text-sm font-medium text-gray-500">예산</label>
                  <p className="text-lg">{campaign.budget.toLocaleString()}원</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                <div>
                  <label className="text-sm font-medium text-gray-500">캠페인 기간</label>
                  <p className="text-lg">{campaign.campaignStartDate} ~ {campaign.campaignEndDate}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">제안 마감일</label>
                <p className="text-lg">{campaign.proposalDeadline}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">광고 유형</label>
                <p className="text-lg">{campaign.adType === 'branding' ? '브랜딩' : '라이브커머스'}</p>
              </div>
            </CardContent>
          </Card>

          {/* 타겟 콘텐츠 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>타겟 콘텐츠 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">인플루언서 카테고리</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {campaign.targetContent.influencerCategories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">타겟 연령층</label>
                <p className="text-lg">{campaign.targetContent.targetAge}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">USP 중요도</label>
                <p className="text-lg">{campaign.targetContent.uspImportance}/10</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">인플루언서 영향력</label>
                <p className="text-lg">{campaign.targetContent.influencerImpact}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">추가 설명</label>
                <p className="text-lg">{campaign.targetContent.additionalDescription || '없음'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">2차 콘텐츠 활용</label>
                <p className="text-lg">{campaign.targetContent.secondaryContentUsage ? '예' : '아니오'}</p>
              </div>
            </CardContent>
          </Card>

          {/* 인플루언서 정보 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                인플루언서 목록 ({campaign.influencers.length}명)
                {isProposing && (
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">승인 대기</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.influencers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">프로필</TableHead>
                        <TableHead>닉네임</TableHead>
                        <TableHead className="text-center">플랫폼</TableHead>
                        <TableHead className="text-center">팔로워 수</TableHead>
                        <TableHead className="text-center">참여율</TableHead>
                        <TableHead className="text-center">지역</TableHead>
                        <TableHead className="text-center">카테고리</TableHead>
                        <TableHead className="text-center w-20">상세보기</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaign.influencers.map((influencer) => (
                        <TableRow key={influencer.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={influencer.profileImage} />
                              <AvatarFallback>
                                {influencer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-600 font-medium cursor-pointer hover:underline">
                              {influencer.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <img 
                                src={influencer.platform === 'xiaohongshu' ? 
                                  "/lovable-uploads/e703f951-a663-4cec-a5ed-9321f609d145.png" : 
                                  "/lovable-uploads/ab4c4633-b725-4dea-955a-ec1a22cc8837.png"
                                } 
                                alt={influencer.platform === 'xiaohongshu' ? "샤오홍슈" : "도우인"} 
                                className="w-6 h-6 rounded"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{formatFollowers(influencer.followers)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <span className="text-green-600 mr-1">↑</span>
                              {influencer.engagementRate}%
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{influencer.region || '서울'}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-wrap gap-1 justify-center">
                              <Badge variant="outline" className="text-xs">
                                {influencer.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewInfluencerDetail(influencer)}
                              className="p-2"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500">선택된 인플루언서가 없습니다.</p>
              )}

              {/* 승인/거절 버튼 섹션 (제안중 상태일 때만 표시) */}
              {isProposing && campaign.influencers.some(inf => inf.status === 'accepted') && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-4">인플루언서 승인 관리</h3>
                  <div className="space-y-3">
                    {campaign.influencers
                      .filter(inf => inf.status === 'accepted')
                      .map((influencer) => (
                        <div key={influencer.id} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={influencer.profileImage} />
                              <AvatarFallback>
                                {influencer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{influencer.name}</span>
                            {influencer.adFee && (
                              <span className="text-sm text-green-600">
                                {influencer.adFee.toLocaleString()}원
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleInfluencerApproval(influencer.id, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              승인
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleInfluencerApproval(influencer.id, false)}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              거절
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 인플루언서 상세보기 모달 */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                인플루언서 상세보기
              </DialogTitle>
            </DialogHeader>
            {selectedInfluencer && (
              selectedInfluencer.platform === 'xiaohongshu' ? (
                <XiaohongshuInfluencerDetailModal influencer={selectedInfluencer} />
              ) : (
                <InfluencerDetailModal influencer={selectedInfluencer} />
              )
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CampaignDetail;
