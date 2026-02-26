import { useState, useEffect } from 'react';
import type { Album } from '../types';
import { usePhotos } from '../hooks/usePhotos';
import { formatDateShort } from '../utils/dateUtils';
import { useNavigate } from '../utils/navigation';
import './AlbumCard.css';

interface AlbumCardProps {
  album: Album;
  onDelete: (id: string) => Promise<void>;
}

export default function AlbumCard({ album, onDelete }: AlbumCardProps) {
  const navigate = useNavigate();
  const { getPhotoThumbnail } = usePhotos();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (album.photoIds.length > 0) {
      getPhotoThumbnail(album.photoIds[0]).then((url) => {
        if (mounted) setThumbnailUrl(url);
      });
    }

    return () => {
      mounted = false;
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album.photoIds[0]]);

  const handleClick = () => {
    navigate(`/album/${album.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      try {
        await onDelete(album.id);
      } catch (error) {
        console.error('Failed to delete album:', error);
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
    <div className="album-card" onClick={handleClick}>
      <div className="album-thumbnail">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={album.name} />
        ) : (
          <div className="thumbnail-placeholder">📷</div>
        )}
      </div>

      <div className="album-card-content">
        <h3 className="album-title">{album.name || 'Untitled Album'}</h3>
        <div className="album-details">
          <span className="album-date">{formatDateShort(album.date)}</span>
          <span className="album-photo-count">
            {album.photoIds.length} {album.photoIds.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      </div>

      <div className="album-actions">
        {showDeleteConfirm ? (
          <div className="delete-confirm">
            <button
              className="btn-delete-confirm"
              onClick={handleDelete}
              title="Confirm delete"
            >
              ✓ Delete
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
            title="Delete album"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
