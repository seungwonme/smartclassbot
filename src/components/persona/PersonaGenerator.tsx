
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Brand as BrandType, Product as ProductType } from '@/types/brand';
import PersonaSelectionControls from './PersonaSelectionControls';
import ReportPreview from './ReportPreview';
import PersonaGenerationPanel from './PersonaGenerationPanel';
import SavedPersonasList from './SavedPersonasList';

interface PersonaGeneratorProps {
  selectedBrand: string;
  selectedProduct: string;
  brands: BrandType[];
  products: ProductType[];
  savedReports: any[];
  onPersonaGenerated: (personaData: any) => void;
  savedPersonas: any[];
}

const PersonaGenerator: React.FC<PersonaGeneratorProps> = ({
  selectedBrand,
  selectedProduct,
  brands,
  products,
  savedReports,
  onPersonaGenerated,
  savedPersonas
}) => {
  const { toast } = useToast();
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<string>('');

  const selectedBrandData = brands.find(b => b.id === selectedBrand);
  const selectedProductData = products.find(p => p.id === selectedProduct);

  // Filter reports based on selected brand and product
  const filteredReports = savedReports.filter(report => 
    report.brandId === selectedBrand && report.productId === selectedProduct
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const selectedReportData = filteredReports.find(r => r.id === selectedReport);

  // Check if report is recent (within last 30 days)
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
      reportName: selectedReportData?.name,
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
    onPersonaGenerated(personaData);
    toast({
      title: "페르소나 저장 완료",
      description: "인플루언서 매칭을 진행할 수 있습니다.",
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

      <SavedPersonasList savedPersonas={savedPersonas} />
    </div>
  );
};

export default PersonaGenerator;
