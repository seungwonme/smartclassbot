
import React, { useState } from 'react';
import { Campaign, CampaignInfluencer } from '@/types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Eye, Edit, CheckCircle, XCircle, Plus } from 'lucide-react';
import InfluencerDetailModal from '@/components/InfluencerDetailModal';
import XiaohongshuInfluencerDetailModal from '@/components/XiaohongshuInfluencerDetailModal';
import InfluencerEditModal from './InfluencerEditModal';
import SimilarInfluencerModal from './SimilarInfluencerModal';

interface InfluencerManagementTabProps {
  campaign: Campaign;
  onInfluencerApproval: (influencerId: string, approved: boolean) => Promise<void>;
  onUpdateInfluencers: (updatedInfluencers: CampaignInfluencer[]) => Promise<void>;
  toast: any;
}

const InfluencerManagementTab: React.FC<InfluencerManagementTabProps> = ({
  campaign,
  onInfluencerApproval,
  onUpdateInfluencers,
  toast
}) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<CampaignInfluencer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSimilarModalOpen, setIsSimilarModalOpen] = useState(false);
  const [rejectedInfluencerForSimilar, setRejectedInfluencerForSimilar] = useState<CampaignInfluencer | null>(null);

  const isProposing = campaign.status === 'proposing';

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handleViewInfluencerDetail = (influencer: any) => {
    const influencerWithPlatform = {
      ...influencer,
      nickname: influencer.name || influencer.nickname || 'Unknown',
      platform: influencer.platform || 'douyin',
      region: influencer.region || '서울',
      category: Array.isArray(influencer.category) ? influencer.category : [influencer.category || '뷰티']
    };
    
    setSelectedInfluencer(influencerWithPlatform);
    setIsDetailModalOpen(true);
  };

  const handleEditInfluencer = (influencer: CampaignInfluencer) => {
    setEditingInfluencer(influencer);
    setIsEditModalOpen(true);
  };

  const handleSaveInfluencerEdit = async (influencer: CampaignInfluencer, editData: any) => {
    const updatedInfluencers = campaign.influencers.map(inf => 
      inf.id === influencer.id 
        ? { 
            ...inf, 
            adFee: editData.adFee ? parseInt(editData.adFee.replace(/,/g, '')) : undefined,
            region: editData.region,
            category: editData.category
          }
        : inf
    );

    await onUpdateInfluencers(updatedInfluencers);
    
    toast({
      title: "인플루언서 정보 수정 완료",
      description: "인플루언서 정보가 성공적으로 수정되었습니다."
    });
  };

  const handleShowSimilarInfluencers = (rejectedInfluencer: CampaignInfluencer) => {
    setRejectedInfluencerForSimilar(rejectedInfluencer);
    setIsSimilarModalOpen(true);
  };

  const handleAddSimilarInfluencers = async (newInfluencers: CampaignInfluencer[]) => {
    const updatedInfluencers = [...campaign.influencers, ...newInfluencers];
    await onUpdateInfluencers(updatedInfluencers);
    
    toast({
      title: "유사 인플루언서 추가 완료",
      description: `${newInfluencers.length}명의 인플루언서가 추가되었습니다.`
    });
  };

  return (
    <>
      <Card>
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
                    <TableHead className="text-center">광고비</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-center w-32">관리</TableHead>
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
                        {influencer.adFee ? (
                          <span className="text-green-600 font-medium">
                            {influencer.adFee.toLocaleString()}원
                          </span>
                        ) : (
                          <span className="text-gray-400">미정</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <Badge 
                            variant={influencer.status === 'confirmed' ? 'default' : 'outline'}
                            className={
                              influencer.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              influencer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {influencer.status === 'confirmed' ? '확정' :
                             influencer.status === 'rejected' ? '거절' : '대기'}
                          </Badge>
                          {influencer.status === 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShowSimilarInfluencers(influencer)}
                              className="text-xs px-2 py-1 h-6 text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              유사 인플루언서 추가
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewInfluencerDetail(influencer)}
                            className="p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {influencer.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditInfluencer(influencer)}
                              className="p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">선택된 인플루언서가 없습니다.</p>
          )}

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
                          onClick={() => onInfluencerApproval(influencer.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onInfluencerApproval(influencer.id, false)}
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

      {/* 인플루언서 상세보기 모달 */}
      {selectedInfluencer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">인플루언서 상세보기</h2>
                </div>
                <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6">
              {selectedInfluencer.platform === 'xiaohongshu' ? (
                <XiaohongshuInfluencerDetailModal influencer={selectedInfluencer} />
              ) : (
                <InfluencerDetailModal influencer={selectedInfluencer} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 인플루언서 수정 모달 */}
      <InfluencerEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        influencer={editingInfluencer}
        onSave={handleSaveInfluencerEdit}
      />

      {/* 유사 인플루언서 추천 모달 */}
      <SimilarInfluencerModal
        isOpen={isSimilarModalOpen}
        onClose={() => setIsSimilarModalOpen(false)}
        rejectedInfluencer={rejectedInfluencerForSimilar}
        onAddInfluencers={handleAddSimilarInfluencers}
      />
    </>
  );
};

export default InfluencerManagementTab;
