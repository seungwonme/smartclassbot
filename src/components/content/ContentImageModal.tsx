
import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentFile } from '@/types/content';

interface ContentImageModalProps {
  images: ContentFile[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ContentImageModal: React.FC<ContentImageModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}) => {
  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95"
        onKeyDown={handleKeyDown}
      >
        <div className="relative flex items-center justify-center h-full">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </DialogClose>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-10 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-10 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.name}
            className="max-w-full max-h-full object-contain"
          />

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
            {currentImage.name}
            {images.length > 1 && (
              <span className="ml-2">
                ({currentIndex + 1} / {images.length})
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentImageModal;
