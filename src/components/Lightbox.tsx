import { useState, useEffect } from 'react';
import type { Photo } from '../types';
import { usePhotos } from '../hooks/usePhotos';
import './Lightbox.css';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function Lightbox({ photo, onClose, onNext, onPrev }: LightboxProps) {
  const { getPhotoFull } = usePhotos();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setImageUrl(null);

    getPhotoFull(photo.id).then((url) => {
      if (mounted) {
        setImageUrl(url);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <button className="lightbox-close" onClick={onClose}>
        ×
      </button>

      {onPrev && (
        <button className="lightbox-nav lightbox-prev" onClick={onPrev}>
          ‹
        </button>
      )}

      {onNext && (
        <button className="lightbox-nav lightbox-next" onClick={onNext}>
          ›
        </button>
      )}

      <div className="lightbox-content">
        {loading ? (
          <div className="lightbox-loading">Loading...</div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={photo.fileName} />
        ) : (
          <div className="lightbox-error">Failed to load image</div>
        )}
      </div>

      <div className="lightbox-info">
        <span className="lightbox-filename">{photo.fileName}</span>
        {photo.dimensions && (
          <span className="lightbox-dimensions">
            {photo.dimensions.width} × {photo.dimensions.height}
          </span>
        )}
      </div>
    </div>
  );
}
