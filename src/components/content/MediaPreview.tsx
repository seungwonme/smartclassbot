
import React, { useState } from 'react';
import { Image, Video, Play } from 'lucide-react';
import { ContentFile } from '@/types/content';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ContentImageModal from './ContentImageModal';

interface MediaPreviewProps {
  files: ContentFile[];
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ files }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageFiles = files.filter(file => file.type === 'image');
  const videoFiles = files.filter(file => file.type === 'video');

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  return (
    <div>
      <h4 className="font-medium mb-3">업로드된 콘텐츠</h4>
      
      <div className="space-y-4">
        {/* 이미지 섹션 */}
        {imageFiles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4" />
              <span className="text-sm font-medium">이미지 ({imageFiles.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {imageFiles.map((file, index) => (
                <div key={file.id} className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div 
                    className="relative group"
                    onClick={() => handleImageClick(index)}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </AspectRatio>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                        <Image className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 영상 섹션 */}
        {videoFiles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">영상 ({videoFiles.length})</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {videoFiles.map((file) => (
                <div key={file.id} className="border rounded-lg overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <video 
                      src={file.url}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <p className="text-sm font-medium">{file.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 이미지 모달 */}
      <ContentImageModal
        images={imageFiles}
        currentIndex={currentImageIndex}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onNavigate={setCurrentImageIndex}
      />
    </div>
  );
};

export default MediaPreview;
