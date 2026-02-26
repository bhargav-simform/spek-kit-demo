import { useState } from 'react';
import { getTodayISO } from '../utils/dateUtils';
import './CreateAlbumModal.css';

interface CreateAlbumModalProps {
  onClose: () => void;
  onCreate: (name: string, date: string) => void;
}

export default function CreateAlbumModal({
  onClose,
  onCreate,
}: CreateAlbumModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayISO());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name, date);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Album</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="album-name">Album Name (optional)</label>
            <input
              id="album-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Vacation 2026"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="album-date">Date *</label>
            <input
              id="album-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Album
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
