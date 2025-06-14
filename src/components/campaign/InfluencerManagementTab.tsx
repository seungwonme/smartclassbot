
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Check, X, Eye, Edit, Trash2, Users, MessageCircle, Heart, Share2 } from 'lucide-react';
import InfluencerDetailModal from '@/components/InfluencerDetailModal';
import XiaohongshuInfluencerDetailModal from '@/components/XiaohongshuInfluencerDetailModal';
import InfluencerEditModal from '@/components/campaign/InfluencerEditModal';
import SimilarInfluencerModal from '@/components/campaign/SimilarInfluencerModal';
import { Campaign, CampaignInfluencer } from '@/types/campaign';

interface InfluencerManagementTabProps {
  campaign: Campaign;
  onInfluencerApproval: (influencerId: string, approved: boolean) => void;
  onUpdateInfluencers: (influencers: CampaignInfluencer[]) => Promise<void>;
  toast: any;
}

const InfluencerManagementTab: React.FC<InfluencerManagementTabProps> = ({
  campaign,
  onInfluencerApproval,
  onUpdateInfluencers,
  toast
}) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<CampaignInfluencer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<CampaignInfluencer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [similarInfluencerId, setSimilarInfluencerId] = useState<string | null>(null);
  const [isSimilarModalOpen, setIsSimilarModalOpen] = useState(false);
  const [influencerToDelete, setInfluencerToDelete] = useState<string | null>(null);

  const handleDetailView = (influencer: CampaignInfluencer) => {
    setSelectedInfluencer(influencer);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInfluencer(null);
  };

  const handleEdit = (influencer: CampaignInfluencer) => {
    setEditingInfluencer(influencer);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingInfluencer(null);
  };

  const handleSaveEdit = async (updatedInfluencer: CampaignInfluencer) => {
    try {
      const updatedInfluencers = campaign.influencers.map(inf => 
        inf.id === updatedInfluencer.id ? updatedInfluencer : inf
      );
      
      await onUpdateInfluencers(updatedInfluencers);
      
      toast({
        title: "인플루언서 정보 수정 완료",
        description: "인플루언서 정보가 성공적으로 수정되었습니다."
      });
      
      handleCloseEditModal();
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "인플루언서 정보 수정에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleViewSimilar = (influencerId: string) => {
    setSimilarInfluencerId(influencerId);
    setIsSimilarModalOpen(true);
  };

  const handleCloseSimilarModal = () => {
    setIsSimilarModalOpen(false);
    setSimilarInfluencerId(null);
  };

  const handleAddSimilarInfluencer = async (newInfluencer: CampaignInfluencer) => {
    try {
      const updatedInfluencers = [...campaign.influencers, newInfluencer];
      await onUpdateInfluencers(updatedInfluencers);
      
      toast({
        title: "인플루언서 추가 완료",
        description: "유사한 인플루언서가 성공적으로 추가되었습니다."
      });
      
      handleCloseSimilarModal();
    } catch (error) {
      toast({
        title: "추가 실패",
        description: "인플루언서 추가에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInfluencer = async (influencerId: string) => {
    try {
      const updatedInfluencers = campaign.influencers.filter(inf => inf.id !== influencerId);
      await onUpdateInfluencers(updatedInfluencers);
      
      toast({
        title: "인플루언서 삭제 완료",
        description: "인플루언서가 성공적으로 삭제되었습니다."
      });
      
      setInfluencerToDelete(null);
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "인플루언서 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: CampaignInfluencer['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: CampaignInfluencer['status']) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'accepted': return '수락됨';
      case 'confirmed': return '승인됨';
      case 'rejected': return '거절됨';
      default: return status;
    }
  };

  const canManageInfluencers = campaign.status === 'creating' || campaign.status === 'recruiting';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">선택된 인플루언서 ({campaign.influencers.length}명)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaign.influencers.map((influencer) => (
          <Card key={influencer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={influencer.profileImage}
                  alt={influencer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-sm">{influencer.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">@{influencer.name}</p>
                </div>
                <Badge className={getStatusColor(influencer.status)}>
                  {getStatusText(influencer.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">팔로워</span>
                  <span className="font-medium">{influencer.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">참여율</span>
                  <span className="font-medium">{influencer.engagementRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">협찬료</span>
                  <span className="font-medium">{influencer.adFee?.toLocaleString() || 0}원</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      0
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      0
                    </div>
                    <div className="flex items-center">
                      <Share2 className="w-3 h-3 mr-1" />
                      0
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {influencer.category}
                  </Badge>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDetailView(influencer)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    상세보기
                  </Button>
                  
                  {canManageInfluencers && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(influencer)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInfluencerToDelete(influencer.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>

                {campaign.status === 'proposing' && influencer.status === 'pending' && (
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => onInfluencerApproval(influencer.id, true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onInfluencerApproval(influencer.id, false)}
                      className="flex-1"
                    >
                      <X className="w-3 h-3 mr-1" />
                      거절
                    </Button>
                  </div>
                )}

                {canManageInfluencers && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewSimilar(influencer.id)}
                    className="w-full mt-2"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    유사 인플루언서 보기
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaign.influencers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          선택된 인플루언서가 없습니다.
        </div>
      )}

      {/* 인플루언서 상세보기 모달 */}
      {selectedInfluencer && (
        selectedInfluencer.platform === 'xiaohongshu' ? (
          <XiaohongshuInfluencerDetailModal
            influencer={{
              ...selectedInfluencer,
              nickname: selectedInfluencer.name,
              category: [selectedInfluencer.category]
            }}
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
          />
        ) : (
          <InfluencerDetailModal
            influencer={{
              ...selectedInfluencer,
              nickname: selectedInfluencer.name,
              category: [selectedInfluencer.category]
            }}
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
          />
        )
      )}

      {/* 인플루언서 수정 모달 */}
      {editingInfluencer && (
        <InfluencerEditModal
          influencer={editingInfluencer}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}

      {/* 유사 인플루언서 모달 */}
      {similarInfluencerId && (
        <SimilarInfluencerModal
          influencerId={similarInfluencerId}
          isOpen={isSimilarModalOpen}
          onClose={handleCloseSimilarModal}
          onAddInfluencer={handleAddSimilarInfluencer}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!influencerToDelete} onOpenChange={() => setInfluencerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>인플루언서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 인플루언서를 캠페인에서 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => influencerToDelete && handleDeleteInfluencer(influencerToDelete)}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InfluencerManagementTab;
