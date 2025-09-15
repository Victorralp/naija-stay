import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

const HotelGallery = ({ images, hotelName }: HotelGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeGallery();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div 
        className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden cursor-pointer shadow-lg"
        onClick={() => openGallery(0)}
      >
        <img
          src={images[0]}
          alt={`${hotelName} - Main view`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <Button 
            variant="secondary" 
            className="m-4"
            onClick={(e) => {
              e.stopPropagation();
              openGallery(0);
            }}
          >
            View Gallery ({images.length} photos)
          </Button>
        </div>
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div 
              key={index}
              className="relative h-24 rounded-lg overflow-hidden cursor-pointer shadow hover:shadow-md transition-shadow duration-300"
              onClick={() => openGallery(index + 1)}
            >
              <img
                src={image}
                alt={`${hotelName} - View ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                loading="lazy"
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{images.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Gallery modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">Open Gallery</Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] p-0 bg-black border-0 rounded-lg overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-[70vh]">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={closeGallery}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 z-10 bg-black/50 text-white hover:bg-black/70 transform -translate-y-1/2"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 z-10 bg-black/50 text-white hover:bg-black/70 transform -translate-y-1/2"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Current image */}
            <img
              src={images[currentImageIndex]}
              alt={`${hotelName} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelGallery;