import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Send, Calendar, Users, DollarSign, CheckCircle, FileText, Video } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import CampaignWorkflowSteps from '@/components/CampaignWorkflowSteps';
import InfluencerManagementTab from '@/components/campaign/InfluencerManagementTab';
import { Campaign } from '@/types/campaign';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';

const CampaignDetail = () => {
  const {
    campaign,
    isLoading,
    activeTab,
    setActiveTab,
    handleEdit,
    handleDelete,
    handleInfluencerApproval,
    handleFinalConfirmation,
    updateCampaignInfluencers,
    toast
  } = useCampaignDetail();

  // 로컬 제출 함수 추가
  const handleSubmit = async () => {
    if (!campaign) return;
    
    try {
      console.log('캠페인 제출 시작 - 현재 상태:', campaign.status);
      
      // 캠페인을 제출됨 상태로 변경
      await updateCampaignInfluencers(campaign.id, { 
        status: 'submitted' 
      });
      
      console.log('캠페인 상태를 submitted로 변경 완료');
      
      toast({
        title: "캠페인 제출 완료",
        description: "캠페인이 성공적으로 제출되었습니다. 시스템 관리자가 검토 후 섭외를 진행합니다."
      });
      
      // 페이지 새로고침하여 최신 상태 반영
      window.location.reload();
      
    } catch (error) {
      console.error('캠페인 제출 실패:', error);
      toast({
        title: "제출 실패",
        description: "캠페인 제출에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'creating': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'recruiting': return 'bg-blue-100 text-blue-800';
      case 'proposing': return 'bg-purple-100 text-purple-800';
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
      case 'confirmed': return '확정됨';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const getNextAction = () => {
    if (!campaign) return null;
    
    const stage = campaign.currentStage;
    const status = campaign.status;
    
    switch (stage) {
      case 1:
        if (status === 'creating') return '캠페인 제출 필요';
        if (status === 'recruiting') return '인플루언서 섭외 진행중';
        if (status === 'proposing') return '제안 검토 필요';
        if (status === 'confirmed') return '콘텐츠 기획 단계로 진행 가능';
        break;
      case 2:
        return '콘텐츠 기획안 작성/검토';
      case 3:
        return '콘텐츠 제작/검수';
      case 4:
        return '성과 모니터링';
    }
    return null;
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
  const isConfirmed = campaign.status === 'confirmed';
  const nextAction = getNextAction();

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
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusText(campaign.status)}
                </Badge>
                {nextAction && (
                  <Badge variant="outline" className="text-blue-600">
                    {nextAction}
                  </Badge>
                )}
              </div>
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
            {isConfirmed && (
              <Button onClick={handleFinalConfirmation} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                최종 확정
              </Button>
            )}
          </div>
        </div>

        <CampaignWorkflowSteps campaign={campaign} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">📋 기본정보</TabsTrigger>
            <TabsTrigger value="influencers">👥 인플루언서 관리</TabsTrigger>
            <TabsTrigger value="planning" disabled={campaign.currentStage < 2}>💡 콘텐츠 기획</TabsTrigger>
            <TabsTrigger value="content" disabled={campaign.currentStage < 3}>🔍 콘텐츠 검수</TabsTrigger>
            <TabsTrigger value="performance" disabled={campaign.currentStage < 4}>📈 성과 분석</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>
          </TabsContent>

          <TabsContent value="influencers" className="mt-6">
            <InfluencerManagementTab
              campaign={campaign}
              onInfluencerApproval={handleInfluencerApproval}
              onUpdateInfluencers={updateCampaignInfluencers}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="planning" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  콘텐츠 기획
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 기획 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  콘텐츠 검수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  콘텐츠 검수 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  성과 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  성과 분석 기능이 곧 추가될 예정입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDetail;
