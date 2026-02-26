import { useParams, useNavigate } from '../utils/navigation';
import { useAlbums } from '../hooks/useAlbums';
import { usePhotos } from '../hooks/usePhotos';
import PhotoGrid from '../components/PhotoGrid';
import EmptyState from '../components/EmptyState';
import { useState, useRef } from 'react';
import { formatDate } from '../utils/dateUtils';
import './AlbumDetailPage.css';

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { getAlbum } = useAlbums();
  const { getPhotosByAlbum, addPhotos, deletePhoto } = usePhotos();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const album = getAlbum(albumId || '');
  const photos = album ? getPhotosByAlbum(album.id) : [];

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !album) return;

    setUploading(true);
    try {
      await addPhotos(album.id, files);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Trigger re-render by updating a dummy state
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload photos:', error);
      alert('Failed to upload some photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!album) {
    return (
      <div className="album-detail-page">
        <div className="error-state">Album not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Albums
        </button>
      </div>
    );
  }

  return (
    <div className="album-detail-page">
      <header className="album-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="album-info">
          <h1>{album.name || 'Untitled Album'}</h1>
          <div className="album-meta">
            <span className="album-date">{formatDate(album.date)}</span>
            <span className="album-count">{photos.length} photos</span>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddPhotos}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : '+ Add Photos'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </header>

      {photos.length === 0 ? (
        <EmptyState
          message="No photos in this album"
          description="Add photos to start building your collection"
          actionLabel="Add Photos"
          onAction={handleAddPhotos}
        />
      ) : (
        <PhotoGrid photos={photos} onDeletePhoto={deletePhoto} />
      )}
    </div>
  );
}
