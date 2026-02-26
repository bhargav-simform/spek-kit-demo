// Type definitions for Photo Album Organizer

export interface PhotoDimensions {
  width: number;
  height: number;
}

export interface Photo {
  id: string;
  albumId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
  dimensions?: PhotoDimensions;
}

export interface Album {
  id: string;
  name: string;
  date: string; // ISO 8601 format
  createdAt: number;
  customOrder: number;
  photoIds: string[];
}

export interface CreateAlbumInput {
  name?: string;
  date?: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}
