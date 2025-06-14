
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ContentPlanDetail, ImagePlanData, VideoPlanData } from '@/types/content';
import { downloadFile } from '@/utils/fileUtils';
import { useToast } from '@/hooks/use-toast';

interface PlanDataRendererProps {
  plan: ContentPlanDetail;
  renderFieldWithFeedback: (
    plan: ContentPlanDetail,
    fieldName: string,
    fieldLabel: string,
    content: React.ReactNode,
    canAddFeedback?: boolean
  ) => React.ReactNode;
}

const PlanDataRenderer: React.FC<PlanDataRendererProps> = ({ plan, renderFieldWithFeedback }) => {
  const { toast } = useToast();

  const handleDownloadImage = async (imageData: string, index: number) => {
    try {
      const fileName = `reference_image_${index + 1}.png`;
      downloadFile(imageData, fileName, 'image/png');
      toast({
        title: "이미지 다운로드 완료",
        description: `${fileName} 파일이 다운로드되었습니다.`
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "이미지를 다운로드할 수 없습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadScenarioFile = async (file: { name: string; data: string; type: string }) => {
    try {
      downloadFile(file.data, file.name, file.type);
      toast({
        title: "파일 다운로드 완료",
        description: `${file.name} 파일이 다운로드되었습니다.`
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "파일을 다운로드할 수 없습니다.",
        variant: "destructive"
      });
    }
  };

  console.log('Rendering plan data for:', plan.influencerName, plan.planData);
  
  if (plan.contentType === 'image') {
    const imageData = plan.planData as ImagePlanData;
    return (
      <div className="space-y-4">
        {renderFieldWithFeedback(
          plan,
          'postTitle',
          '포스팅 제목',
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{imageData.postTitle || '제목이 입력되지 않았습니다.'}</p>
        )}
        
        {renderFieldWithFeedback(
          plan,
          'thumbnailTitle',
          '썸네일 제목',
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{imageData.thumbnailTitle || '썸네일 제목이 입력되지 않았습니다.'}</p>
        )}
        
        {renderFieldWithFeedback(
          plan,
          'referenceImages',
          '참고 이미지',
          imageData.referenceImages && imageData.referenceImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {imageData.referenceImages.map((image, index) => (
                <div key={index} className="relative border rounded p-2">
                  <img src={image} alt={`Reference ${index + 1}`} className="w-full h-20 object-cover rounded mb-2" />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-1 right-1 text-xs px-2 py-1 h-6"
                    onClick={() => handleDownloadImage(image, index)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">참고 이미지가 업로드되지 않았습니다.</p>
          )
        )}
        
        {renderFieldWithFeedback(
          plan,
          'script',
          '스크립트',
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{imageData.script || '스크립트가 입력되지 않았습니다.'}</p>
        )}
        
        {renderFieldWithFeedback(
          plan,
          'hashtags',
          '해시태그',
          imageData.hashtags && imageData.hashtags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {imageData.hashtags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">해시태그가 입력되지 않았습니다.</p>
          )
        )}
      </div>
    );
  } else {
    const videoData = plan.planData as VideoPlanData;
    return (
      <div className="space-y-4">
        {renderFieldWithFeedback(
          plan,
          'postTitle',
          '포스팅 제목',
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{videoData.postTitle || '제목이 입력되지 않았습니다.'}</p>
        )}
        
        {renderFieldWithFeedback(
          plan,
          'scenario',
          '시나리오',
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{videoData.scenario || '시나리오가 입력되지 않았습니다.'}</p>
        )}
        
        {renderFieldWithFeedback(
          plan,
          'scenarioFiles',
          '시나리오 파일',
          videoData.scenarioFiles && videoData.scenarioFiles.length > 0 ? (
            <div className="space-y-2 mt-2">
              {videoData.scenarioFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => handleDownloadScenarioFile(file)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">시나리오 파일이 업로드되지 않았습니다.</p>
          )
        )}
        
        {renderFieldWithFeedback(
          plan,
          'script',
          '스크립트',
          <p className="text-sm mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{videoData.script || '스크립트가 입력되지 않았습니다.'}</p>
        )}
        
        {renderFieldWithFeedback(
          plan,
          'hashtags',
          '해시태그',
          videoData.hashtags && videoData.hashtags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {videoData.hashtags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-500">해시태그가 입력되지 않았습니다.</p>
          )
        )}
      </div>
    );
  }
};

export default PlanDataRenderer;
