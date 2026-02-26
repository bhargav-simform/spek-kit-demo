// LocalStorage service for album and photo metadata

import type { Album, Photo } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  // Album operations
  getAlbums(): Album[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALBUMS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading albums from localStorage:', error);
      return [];
    }
  }

  saveAlbums(albums: Album[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
    } catch (error) {
      console.error('Error saving albums to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some albums to free up space.');
      }
      throw error;
    }
  }

  // Photo metadata operations
  getPhotosMetadata(): Photo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading photo metadata from localStorage:', error);
      return [];
    }
  }

  savePhotosMetadata(photos: Photo[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (error) {
      console.error('Error saving photo metadata to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some photos to free up space.');
      }
      throw error;
    }
  }

  // Clear all data (for testing/reset)
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.ALBUMS);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
  }
}

export const storageService = new StorageService();
