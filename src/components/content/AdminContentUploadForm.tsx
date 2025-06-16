
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video } from 'lucide-react';
import { ContentFile } from '@/types/content';

interface AdminContentUploadFormProps {
  onFilesChange: (files: ContentFile[]) => void;
  contentType: 'image' | 'video';
}

const AdminContentUploadForm: React.FC<AdminContentUploadFormProps> = ({
  onFilesChange,
  contentType
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<ContentFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: ContentFile[] = [];
    
    Array.from(files).forEach((file) => {
      // 파일 타입 검증
      const isValidType = contentType === 'image' 
        ? file.type.startsWith('image/')
        : file.type.startsWith('video/');
      
      if (!isValidType) {
        alert(`${contentType === 'image' ? '이미지' : '영상'} 파일만 업로드 가능합니다.`);
        return;
      }

      // 파일 크기 제한 (이미지: 10MB, 영상: 100MB)
      const maxSize = contentType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`파일 크기는 ${contentType === 'image' ? '10MB' : '100MB'} 이하여야 합니다.`);
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const contentFile: ContentFile = {
        id: `file_${Date.now()}_${Math.random()}`,
        name: file.name,
        url: fileUrl,
        type: contentType,
        size: file.size
      };

      newFiles.push(contentFile);
    });

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        수정된 {contentType === 'image' ? '이미지' : '영상'} 업로드
      </Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          {contentType === 'image' ? '이미지' : '영상'} 파일을 드래그하거나 클릭하여 업로드
        </p>
        <input
          type="file"
          multiple
          accept={contentType === 'image' ? 'image/*' : 'video/*'}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          파일 선택
        </Button>
      </div>

      {/* 업로드된 파일 미리보기 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">업로드된 파일</Label>
          <div className="grid grid-cols-2 gap-4">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="relative">
                <CardContent className="p-3">
                  <div className="relative">
                    {file.type === 'image' ? (
                      <div className="aspect-video relative">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute top-1 left-1 bg-white/80 rounded p-1">
                          <Image className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video relative">
                        <video
                          src={file.url}
                          className="w-full h-full object-cover rounded"
                          controls
                          preload="metadata"
                        />
                        <div className="absolute top-1 left-1 bg-white/80 rounded p-1">
                          <Video className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentUploadForm;
