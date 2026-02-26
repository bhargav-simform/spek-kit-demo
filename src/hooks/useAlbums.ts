// Custom hook for album operations

import { useState, useEffect, useCallback } from 'react';
import type { Album, CreateAlbumInput } from '../types';
import { storageService } from '../services/storageService';
import { imageService } from '../services/imageService';
import { getTodayISO } from '../utils/dateUtils';

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load albums on mount
  useEffect(() => {
    try {
      const loadedAlbums = storageService.getAlbums();
      // Sort by customOrder if available, otherwise by date
      const sorted = loadedAlbums.sort((a, b) => {
        if (a.customOrder !== b.customOrder) {
          return a.customOrder - b.customOrder;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setAlbums(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAlbums = useCallback(() => {
    try {
      const loadedAlbums = storageService.getAlbums();
      const sorted = loadedAlbums.sort((a, b) => {
        if (a.customOrder !== b.customOrder) {
          return a.customOrder - b.customOrder;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setAlbums(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh albums');
    }
  }, []);

  const getAlbum = useCallback((id: string): Album | undefined => {
    return albums.find((album) => album.id === id);
  }, [albums]);

  const createAlbum = useCallback((input: CreateAlbumInput) => {
    try {
      const newAlbum: Album = {
        id: crypto.randomUUID(),
        name: input.name || '',
        date: input.date || getTodayISO(),
        createdAt: Date.now(),
        customOrder: albums.length,
        photoIds: [],
      };

      const updatedAlbums = [...albums, newAlbum];
      storageService.saveAlbums(updatedAlbums);
      setAlbums(updatedAlbums);
      setError(null);
      return newAlbum;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create album';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [albums]);

  const updateAlbum = useCallback((id: string, updates: Partial<Album>) => {
    try {
      const updatedAlbums = albums.map((album) =>
        album.id === id ? { ...album, ...updates } : album
      );
      storageService.saveAlbums(updatedAlbums);
      setAlbums(updatedAlbums);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update album';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [albums]);

  const deleteAlbum = useCallback(async (id: string) => {
    try {
      const album = albums.find((a) => a.id === id);
      if (!album) {
        throw new Error('Album not found');
      }

      // Delete all photos in the album from IndexedDB
      if (album.photoIds.length > 0) {
        await imageService.deleteImagesByIds(album.photoIds);

        // Remove photo metadata
        const allPhotos = storageService.getPhotosMetadata();
        const updatedPhotos = allPhotos.filter(
          (photo) => photo.albumId !== id
        );
        storageService.savePhotosMetadata(updatedPhotos);
      }

      // Remove album
      const updatedAlbums = albums.filter((album) => album.id !== id);
      storageService.saveAlbums(updatedAlbums);
      setAlbums(updatedAlbums);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete album';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [albums]);

  const reorderAlbums = useCallback((newOrder: Album[]) => {
    try {
      // Update customOrder for all albums
      const updatedAlbums = newOrder.map((album, index) => ({
        ...album,
        customOrder: index,
      }));
      storageService.saveAlbums(updatedAlbums);
      setAlbums(updatedAlbums);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reorder albums';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  return {
    albums,
    loading,
    error,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    reorderAlbums,
    refreshAlbums,
  };
}
