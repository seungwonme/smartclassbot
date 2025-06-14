
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileImage, FileVideo, X } from 'lucide-react';
import { ContentSubmission, ContentFile } from '@/types/contentSubmission';
import { useToast } from '@/hooks/use-toast';

interface ContentUploadFormProps {
  influencer: {
    id: string;
    name: string;
    category: string;
  };
  campaignId: string;
  contentType: 'image' | 'video';
  existingSubmission?: ContentSubmission;
  onSubmit: (submissionData: Partial<ContentSubmission>) => void;
  onCancel: () => void;
}

const ContentUploadForm: React.FC<ContentUploadFormProps> = ({
  influencer,
  campaignId,
  contentType,
  existingSubmission,
  onSubmit,
  onCancel
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // 파일 타입 검증
    const validFiles = selectedFiles.filter(file => {
      if (contentType === 'image') {
        return file.type.startsWith('image/');
      } else {
        return file.type.startsWith('video/');
      }
    });

    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "파일 형식 오류",
        description: `${contentType === 'image' ? '이미지' : '영상'} 파일만 업로드 가능합니다.`,
        variant: "destructive"
      });
    }

    setFiles(validFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "파일을 선택해주세요",
        variant: "destructive"
      });
      return;
    }

    try {
      // 파일을 base64로 변환 (실제로는 파일 업로드 서비스 사용)
      const contentFiles: ContentFile[] = await Promise.all(
        files.map(async (file, index) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          return {
            id: `file_${Date.now()}_${index}`,
            name: file.name,
            url: base64,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };
        })
      );

      const submissionData: Partial<ContentSubmission> = {
        id: existingSubmission?.id || `submission_${Date.now()}`,
        campaignId,
        influencerId: influencer.id,
        influencerName: influencer.name,
        contentType,
        status: 'draft',
        contentFiles,
        revisions: existingSubmission?.revisions || [],
        currentRevisionNumber: existingSubmission?.currentRevisionNumber || 0
      };

      onSubmit(submissionData);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      toast({
        title: "업로드 실패",
        variant: "destructive"
      });
    }
  };

  const acceptFileTypes = contentType === 'image' 
    ? 'image/jpeg,image/png,image/gif,image/webp'
    : 'video/mp4,video/avi,video/mov,video/wmv';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {contentType === 'image' ? (
            <FileImage className="w-5 h-5" />
          ) : (
            <FileVideo className="w-5 h-5" />
          )}
          콘텐츠 업로드 - {influencer.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="content-files">
              {contentType === 'image' ? '이미지 파일' : '영상 파일'} 업로드
            </Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label 
                    htmlFor="content-files" 
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    파일 선택
                  </Label>
                  <input
                    id="content-files"
                    type="file"
                    multiple
                    accept={acceptFileTypes}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {contentType === 'image' 
                    ? 'JPEG, PNG, GIF, WebP 파일을 업로드하세요'
                    : 'MP4, AVI, MOV, WMV 파일을 업로드하세요'}
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <Label>선택된 파일</Label>
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {contentType === 'image' ? (
                        <FileImage className="w-4 h-4" />
                      ) : (
                        <FileVideo className="w-4 h-4" />
                      )}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={files.length === 0}>
              <Upload className="w-4 h-4 mr-2" />
              콘텐츠 제출
            </Button>
            <Button variant="outline" onClick={onCancel}>
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentUploadForm;
