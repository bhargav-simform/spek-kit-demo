import { useState } from 'react';
import type { Photo } from '../types';
import PhotoTile from './PhotoTile';
import Lightbox from './Lightbox';
import './PhotoGrid.css';

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => Promise<void>;
}

export default function PhotoGrid({ photos, onDeletePhoto }: PhotoGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            onClick={() => handlePhotoClick(index)}
            onDelete={onDeletePhoto}
          />
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <Lightbox
          photo={photos[selectedPhotoIndex]}
          onClose={handleCloseLightbox}
          onNext={selectedPhotoIndex < photos.length - 1 ? handleNextPhoto : undefined}
          onPrev={selectedPhotoIndex > 0 ? handlePrevPhoto : undefined}
        />
      )}
    </>
  );
}
