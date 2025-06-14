
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, Download } from 'lucide-react';
import { ImagePlanData } from '@/types/content';
import { downloadFile } from '@/utils/fileUtils';
import { useToast } from '@/hooks/use-toast';

interface ImagePlanFormProps {
  imageData: ImagePlanData;
  onUpdate: (data: Partial<ImagePlanData>) => void;
}

const ImagePlanForm: React.FC<ImagePlanFormProps> = ({ imageData, onUpdate }) => {
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onUpdate({
            referenceImages: [...imageData.referenceImages, result]
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    onUpdate({
      referenceImages: imageData.referenceImages.filter((_, i) => i !== index)
    });
  };

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

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="postTitle">포스팅 제목</Label>
        <Input
          id="postTitle"
          value={imageData.postTitle}
          onChange={(e) => {
            console.log('이미지 포스팅 제목 변경:', e.target.value);
            onUpdate({ postTitle: e.target.value });
          }}
          placeholder="포스팅 제목을 입력하세요"
        />
      </div>

      <div>
        <Label htmlFor="thumbnailTitle">썸네일 제목</Label>
        <Input
          id="thumbnailTitle"
          value={imageData.thumbnailTitle}
          onChange={(e) => onUpdate({ thumbnailTitle: e.target.value })}
          placeholder="썸네일 제목을 입력하세요"
        />
      </div>

      <div>
        <Label>Reference 이미지</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="reference-images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
              </div>
              <input
                id="reference-images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          {imageData.referenceImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imageData.referenceImages.map((image, index) => (
                <div key={index} className="relative border rounded p-2">
                  <img src={image} alt={`Reference ${index + 1}`} className="w-full h-20 object-cover rounded mb-2" />
                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() => handleDownloadImage(image, index)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="script">스크립트</Label>
        <Textarea
          id="script"
          value={imageData.script}
          onChange={(e) => onUpdate({ script: e.target.value })}
          placeholder="콘텐츠 스크립트를 입력하세요"
          rows={6}
        />
      </div>
    </div>
  );
};

export default ImagePlanForm;
