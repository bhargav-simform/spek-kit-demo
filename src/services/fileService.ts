// File validation and processing service

import type { PhotoDimensions } from '../types';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  THUMBNAIL_MAX_WIDTH,
  THUMBNAIL_MAX_HEIGHT,
} from '../utils/constants';

class FileService {
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: JPEG, PNG, GIF, WebP`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    return { valid: true };
  }

  async generateThumbnail(
    file: File,
    maxWidth: number = THUMBNAIL_MAX_WIDTH,
    maxHeight: number = THUMBNAIL_MAX_HEIGHT
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate thumbnail dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail blob'));
            }
          },
          'image/jpeg',
          0.85 // Quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Load image
      img.src = URL.createObjectURL(file);
    });
  }

  async getImageDimensions(file: File): Promise<PhotoDimensions> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const fileService = new FileService();
