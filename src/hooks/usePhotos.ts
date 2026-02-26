// Custom hook for photo operations

import { useState, useCallback } from 'react';
import type { Photo } from '../types';
import { storageService } from '../services/storageService';
import { imageService } from '../services/imageService';
import { fileService } from '../services/fileService';

export function usePhotos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPhotosByAlbum = useCallback((albumId: string): Photo[] => {
    const allPhotos = storageService.getPhotosMetadata();
    return allPhotos.filter((photo) => photo.albumId === albumId);
  }, []);

  const getPhoto = useCallback((id: string): Photo | undefined => {
    const allPhotos = storageService.getPhotosMetadata();
    return allPhotos.find((photo) => photo.id === id);
  }, []);

  const addPhotos = useCallback(async (albumId: string, files: File[]) => {
    setLoading(true);
    setError(null);
    const addedPhotoIds: string[] = [];

    try {
      // Get current album and photos
      const albums = storageService.getAlbums();
      const album = albums.find((a) => a.id === albumId);
      if (!album) {
        throw new Error('Album not found');
      }

      const allPhotos = storageService.getPhotosMetadata();

      // Process each file
      for (const file of files) {
        // Validate file
        const validation = fileService.validateFile(file);
        if (!validation.valid) {
          console.error(`Skipping ${file.name}: ${validation.error}`);
          continue;
        }

        try {
          // Generate photo ID
          const photoId = crypto.randomUUID();

          // Get image dimensions
          const dimensions = await fileService.getImageDimensions(file);

          // Generate thumbnail
          const thumbnail = await fileService.generateThumbnail(file);

          // Store full image and thumbnail in IndexedDB
          await imageService.saveImage(photoId, file);
          await imageService.saveThumbnail(photoId, thumbnail);

          // Create photo metadata
          const photo: Photo = {
            id: photoId,
            albumId,
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: Date.now(),
            dimensions,
          };

          allPhotos.push(photo);
          addedPhotoIds.push(photoId);
        } catch (err) {
          console.error(`Error processing ${file.name}:`, err);
        }
      }

      // Update photo metadata in localStorage
      storageService.savePhotosMetadata(allPhotos);

      // Update album's photoIds
      album.photoIds = [...album.photoIds, ...addedPhotoIds];
      storageService.saveAlbums(albums);

      return addedPhotoIds;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add photos';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      // Get photo metadata
      const allPhotos = storageService.getPhotosMetadata();
      const photo = allPhotos.find((p) => p.id === photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      // Delete from IndexedDB
      await imageService.deleteImage(photoId);

      // Remove from photo metadata
      const updatedPhotos = allPhotos.filter((p) => p.id !== photoId);
      storageService.savePhotosMetadata(updatedPhotos);

      // Remove from album's photoIds
      const albums = storageService.getAlbums();
      const album = albums.find((a) => a.id === photo.albumId);
      if (album) {
        album.photoIds = album.photoIds.filter((id) => id !== photoId);
        storageService.saveAlbums(albums);
      }

      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete photo';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const getPhotoThumbnail = useCallback(async (photoId: string): Promise<string | null> => {
    try {
      const blob = await imageService.getThumbnail(photoId);
      if (!blob) return null;
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error loading thumbnail:', err);
      return null;
    }
  }, []);

  const getPhotoFull = useCallback(async (photoId: string): Promise<string | null> => {
    try {
      const blob = await imageService.getImage(photoId);
      if (!blob) return null;
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error loading full image:', err);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    getPhotosByAlbum,
    getPhoto,
    addPhotos,
    deletePhoto,
    getPhotoThumbnail,
    getPhotoFull,
  };
}
