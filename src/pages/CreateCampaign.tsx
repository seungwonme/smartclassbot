
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BrandSidebar from '@/components/BrandSidebar';
import CampaignBasicInfoStep from '@/components/campaign/CampaignBasicInfoStep';
import CampaignTargetContentStep from '@/components/campaign/CampaignTargetContentStep';
import CampaignInfluencerStep from '@/components/campaign/CampaignInfluencerStep';
import { useCampaignForm } from '@/hooks/useCampaignForm';
import { CAMPAIGN_STEPS } from '@/constants/campaign';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    isLoading,
    dataLoading,
    brandsLoaded,
    productsLoaded,
    formData,
    setFormData,
    brands,
    filteredProducts,
    recommendedInfluencers,
    personas,
    isPersonaBased,
    personaData,
    handleBudgetChange,
    handleBrandChange,
    handleProductChange,
    handlePersonaRecommendation,
    handleAIRecommendation,
    handleInfluencerToggle,
    handleSubmit,
    applyBasicInfoPersonaData,
    applyTargetContentPersonaData,
    applyInfluencerPersonaData
  } = useCampaignForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CampaignBasicInfoStep
            formData={formData}
            setFormData={setFormData}
            brands={brands}
            filteredProducts={filteredProducts}
            dataLoading={dataLoading}
            brandsLoaded={brandsLoaded}
            productsLoaded={productsLoaded}
            handleBudgetChange={handleBudgetChange}
            handleBrandChange={handleBrandChange}
            handleProductChange={handleProductChange}
            isPersonaBased={isPersonaBased}
            personaData={personaData}
            applyBasicInfoPersonaData={applyBasicInfoPersonaData}
          />
        );
      case 2:
        return (
          <CampaignTargetContentStep
            formData={formData}
            setFormData={setFormData}
            isPersonaBased={isPersonaBased}
            personaData={personaData}
            applyTargetContentPersonaData={applyTargetContentPersonaData}
          />
        );
      case 3:
        return (
          <CampaignInfluencerStep
            formData={formData}
            isLoading={isLoading}
            recommendedInfluencers={recommendedInfluencers}
            personas={personas}
            handlePersonaRecommendation={handlePersonaRecommendation}
            handleAIRecommendation={handleAIRecommendation}
            handleInfluencerToggle={handleInfluencerToggle}
            isPersonaBased={isPersonaBased}
            personaData={personaData}
            applyInfluencerPersonaData={applyInfluencerPersonaData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <BrandSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/brand/campaigns')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-bold">
            {isPersonaBased ? '페르소나 기반 캠페인 생성' : '캠페인 생성'}
          </h1>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {CAMPAIGN_STEPS.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep 
                    ? 'bg-green-600 text-white' 
                    : step.id < currentStep 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.id}
                </div>
                {step.id < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step.id < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              이전
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                className="bg-green-600 hover:bg-green-700"
                disabled={currentStep === 1 && (!formData.brandId || !formData.productId)}
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || formData.selectedInfluencers.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? '생성 중...' : '캠페인 생성'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
