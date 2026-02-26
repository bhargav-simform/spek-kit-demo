import { useState, useEffect } from 'react';
import type { Photo } from '../types';
import { usePhotos } from '../hooks/usePhotos';
import './PhotoTile.css';

interface PhotoTileProps {
  photo: Photo;
  onClick: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function PhotoTile({ photo, onClick, onDelete }: PhotoTileProps) {
  const { getPhotoThumbnail } = usePhotos();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    getPhotoThumbnail(photo.id).then((url) => {
      if (mounted) {
        setThumbnailUrl(url);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      try {
        await onDelete(photo.id);
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="photo-tile" onClick={onClick}>
      {loading ? (
        <div className="photo-loading">Loading...</div>
      ) : thumbnailUrl ? (
        <img src={thumbnailUrl} alt={photo.fileName} />
      ) : (
        <div className="photo-error">Failed to load</div>
      )}

      <div className="photo-actions">
        {showDeleteConfirm ? (
          <div className="delete-confirm">
            <button
              className="btn-delete-confirm"
              onClick={handleDelete}
              title="Confirm delete"
            >
              ✓
            </button>
            <button
              className="btn-cancel"
              onClick={handleCancelDelete}
              title="Cancel"
            >
              ✗
            </button>
          </div>
        ) : (
          <button
            className="btn-delete"
            onClick={handleDelete}
            title="Delete photo"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
