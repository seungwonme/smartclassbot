import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';
import PersonaSelectionControls from './PersonaSelectionControls';
import ReportPreview from './ReportPreview';
import PersonaGenerationPanel from './PersonaGenerationPanel';
import SavedPersonasList from './SavedPersonasList';
import { storageService } from '@/services/storage.service';
import PersonaDetailModal from './PersonaDetailModal';

interface PersonaGeneratorProps {
  selectedBrand: string;
  selectedProduct: string;
  brands: BrandType[];
  products: ProductType[];
  savedReports: any[];
  onPersonaGenerated: (personaData: any) => void;
  savedPersonas: any[];
  onBrandChange?: (brandId: string) => void;
  onProductChange?: (productId: string) => void;
}

const PersonaGenerator: React.FC<PersonaGeneratorProps> = ({
  selectedBrand,
  selectedProduct,
  brands,
  products,
  savedReports: initialSavedReports,
  onPersonaGenerated,
  savedPersonas: initialSavedPersonas,
  onBrandChange,
  onProductChange
}) => {
  const { toast } = useToast();
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [savedReports, setSavedReports] = useState(initialSavedReports);
  const [savedPersonas, setSavedPersonas] = useState(initialSavedPersonas);
  const [selectedPersonaDetail, setSelectedPersonaDetail] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Props로 받은 데이터 동기화
  useEffect(() => {
    console.log('🔄 PersonaGenerator: savedReports props 업데이트됨:', initialSavedReports.length);
    setSavedReports(initialSavedReports);
  }, [initialSavedReports]);

  useEffect(() => {
    console.log('🔄 PersonaGenerator: savedPersonas props 업데이트됨:', initialSavedPersonas.length);
    setSavedPersonas(initialSavedPersonas);
  }, [initialSavedPersonas]);

  // 선택된 리포트가 삭제된 경우 선택 해제
  useEffect(() => {
    if (selectedReport && !savedReports.find(report => report.id === selectedReport)) {
      console.log('⚠️ 선택된 리포트가 삭제됨 - 선택 해제:', selectedReport);
      setSelectedReport('');
    }
  }, [savedReports, selectedReport]);

  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  // 개선된 리포트 필터링 로직 - ID와 이름 매칭 모두 지원
  const filteredReports = savedReports.filter(report => {
    // ID 기반 매칭 (새로운 형식)
    const idMatch = report.brandId === selectedBrand && report.productId === selectedProduct;
    
    // 이름 기반 매칭 (기존 데이터 호환성)
    const nameMatch = selectedBrandData && selectedProductData && 
      report.brandName === selectedBrandData.name && report.productName === selectedProductData.name;
    
    console.log('🔍 리포트 필터링 체크:', {
      reportId: report.id,
      reportName: report.name,
      reportBrandId: report.brandId,
      reportProductId: report.productId,
      reportBrandName: report.brandName,
      reportProductName: report.productName,
      selectedBrand,
      selectedProduct,
      selectedBrandName: selectedBrandData?.name,
      selectedProductName: selectedProductData?.name,
      idMatch,
      nameMatch,
      finalMatch: idMatch || nameMatch
    });
    
    return idMatch || nameMatch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log('📊 PersonaGenerator 필터링 결과:', {
    totalReports: savedReports.length,
    filteredReports: filteredReports.length,
    selectedBrand,
    selectedProduct,
    selectedBrandName: selectedBrandData?.name,
    selectedProductName: selectedProductData?.name
  });

  // 필터링된 리포트가 있는데 선택된 리포트가 없으면 첫 번째 리포트 자동 선택
  useEffect(() => {
    if (filteredReports.length > 0 && !selectedReport) {
      const firstReport = filteredReports[0];
      console.log('🎯 첫 번째 리포트 자동 선택:', firstReport.name);
      setSelectedReport(firstReport.id);
    }
  }, [filteredReports, selectedReport]);

  const selectedReportData = filteredReports.find(r => r.id === selectedReport);

  // Check if report is recent (within last 30 days) - FIXED
  const isRecentReport = (reportDate: string) => {
    const reportTime = new Date(reportDate).getTime();
    const thirtyDaysAgo = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
    return reportTime > thirtyDaysAgo;
  };

  const handleGeneratePersona = async () => {
    if (!selectedBrand || !selectedProduct) {
      toast({
        title: "브랜드와 제품을 선택해주세요",
        description: "페르소나 생성을 위해 브랜드와 제품을 모두 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedReport) {
      toast({
        title: "시장조사 보고서를 선택해주세요",
        description: "페르소나 생성을 위해 시장조사 보고서를 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);
    setGenerationCompleted(false);

    // 시뮬레이션: AI 페르소나 생성 과정
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerateProgress(i);
    }

    const personaData = {
      id: `persona_${Date.now()}`,
      name: "리우 샤오메이",
      brandId: selectedBrand,
      productId: selectedProduct,
      reportId: selectedReport,
      brandName: selectedBrandData?.name,
      productName: selectedProductData?.name,
      demographics: {
        age: "25-30세",
        gender: "여성",
        location: "상하이, 베이징",
        income: "중상위층"
      },
      platforms: ["샤오홍슈", "도우인"],
      interests: ["뷰티", "라이프스타일", "건강"],
      description: `${selectedReportData?.name} 기반으로 생성된 타겟 페르소나`,
      confidence: 92,
      completedAt: new Date().toISOString()
    };

    setCurrentPersona(personaData);
    setGenerationCompleted(true);
    setIsGenerating(false);
    
    toast({
      title: "AI 페르소나 생성 완료",
      description: "선택된 시장조사 보고서 기반 소비자 페르소나가 생성되었습니다.",
    });
  };

  const handleSavePersona = (personaData: any) => {
    try {
      storageService.addPersona(personaData);
      const updatedPersonas = storageService.getPersonas();
      setSavedPersonas(updatedPersonas);
      
      onPersonaGenerated(personaData);
      toast({
        title: "페르소나 저장 완료",
        description: "인플루언서 매칭을 진행할 수 있습니다.",
      });
    } catch (error) {
      console.error('페르소나 저장 실패:', error);
      toast({
        title: "저장 실패",
        description: "페르소나 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handlePersonaDetail = (persona: any) => {
    setSelectedPersonaDetail(persona);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPersonaDetail(null);
  };

  const handleStartMatchingFromDetail = (personaId: string) => {
    // 인플루언서 매칭 탭으로 이동하는 로직을 상위 컴포넌트에 위임
    // 여기서는 단순히 토스트 메시지만 표시
    toast({
      title: "인플루언서 매칭",
      description: "인플루언서 매칭 탭으로 이동하여 매칭을 진행해주세요.",
    });
  };

  return (
    <div className="space-y-6">
      <PersonaSelectionControls
        selectedBrand={selectedBrand}
        selectedProduct={selectedProduct}
        selectedReport={selectedReport}
        brands={brands}
        products={products}
        filteredReports={filteredReports}
        onReportChange={setSelectedReport}
        onBrandChange={onBrandChange}
        onProductChange={onProductChange}
        isRecentReport={isRecentReport}
      />

      <ReportPreview
        selectedReportData={selectedReportData}
        isRecentReport={isRecentReport}
      />

      <PersonaGenerationPanel
        isGenerating={isGenerating}
        generateProgress={generateProgress}
        generationCompleted={generationCompleted}
        currentPersona={currentPersona}
        selectedBrand={selectedBrand}
        selectedProduct={selectedProduct}
        selectedReport={selectedReport}
        onGeneratePersona={handleGeneratePersona}
        onSavePersona={handleSavePersona}
      />

      <SavedPersonasList 
        savedPersonas={savedPersonas} 
        onPersonaDetail={handlePersonaDetail}
      />

      <PersonaDetailModal
        persona={selectedPersonaDetail}
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        onStartMatching={handleStartMatchingFromDetail}
      />
    </div>
  );
};

export default PersonaGenerator;
