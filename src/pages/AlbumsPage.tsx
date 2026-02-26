import { useAlbums } from '../hooks/useAlbums';
import AlbumGrid from '../components/AlbumGrid';
import EmptyState from '../components/EmptyState';
import CreateAlbumModal from '../components/CreateAlbumModal';
import { useState } from 'react';
import './AlbumsPage.css';

export default function AlbumsPage() {
  const { albums, loading, createAlbum, deleteAlbum, reorderAlbums } = useAlbums();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateAlbum = async (name: string, date: string) => {
    try {
      await createAlbum({ name, date });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create album:', error);
    }
  };

  if (loading) {
    return (
      <div className="albums-page">
        <div className="loading">Loading albums...</div>
      </div>
    );
  }

  return (
    <div className="albums-page">
      <header className="page-header">
        <h1>Photo Albums</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Album
        </button>
      </header>

      {albums.length === 0 ? (
        <EmptyState
          message="No albums yet"
          description="Create your first album to start organizing photos"
          actionLabel="Create Album"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <AlbumGrid
          albums={albums}
          onDeleteAlbum={deleteAlbum}
          onReorderAlbums={reorderAlbums}
        />
      )}

      {showCreateModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAlbum}
        />
      )}
    </div>
  );
}
