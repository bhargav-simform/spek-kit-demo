import { useState } from 'react';
import type { Album } from '../types';
import AlbumCard from './AlbumCard';
import './AlbumGrid.css';

interface AlbumGridProps {
  albums: Album[];
  onDeleteAlbum: (id: string) => Promise<void>;
  onReorderAlbums: (newOrder: Album[]) => void;
}

export default function AlbumGrid({
  albums,
  onDeleteAlbum,
  onReorderAlbums,
}: AlbumGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIdx) {
      setDraggedIndex(null);
      setDropIndex(null);
      return;
    }

    const newAlbums = [...albums];
    const [draggedAlbum] = newAlbums.splice(draggedIndex, 1);
    newAlbums.splice(dropIdx, 0, draggedAlbum);

    onReorderAlbums(newAlbums);
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndex(null);
  };

  return (
    <div className="album-grid">
      {albums.map((album, index) => (
        <div
          key={album.id}
          className={`album-grid-item ${
            draggedIndex === index ? 'dragging' : ''
          } ${dropIndex === index ? 'drop-target' : ''}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <AlbumCard album={album} onDelete={onDeleteAlbum} />
        </div>
      ))}
    </div>
  );
}
