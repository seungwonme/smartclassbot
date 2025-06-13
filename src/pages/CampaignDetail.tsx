
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Send, Calendar, Users, DollarSign } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/services/campaign.service';
import { useToast } from '@/hooks/use-toast';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
                선택된 인플루언서 ({campaign.influencers.length}명)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.influencers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaign.influencers.map((influencer) => (
                    <Card key={influencer.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={influencer.profileImage}
                          alt={influencer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{influencer.name}</h4>
                          <p className="text-sm text-gray-500">{influencer.category}</p>
                          <p className="text-sm text-gray-500">
                            팔로워: {influencer.followers.toLocaleString()}명
                          </p>
                          {influencer.adFee && (
                            <p className="text-sm font-medium text-green-600">
                              광고비: {influencer.adFee.toLocaleString()}원
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">선택된 인플루언서가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
