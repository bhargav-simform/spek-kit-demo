// IndexedDB service for storing image blobs

import { INDEXEDDB_CONFIG } from '../utils/constants';

class ImageService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        INDEXEDDB_CONFIG.NAME,
        INDEXEDDB_CONFIG.VERSION
      );

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.IMAGES)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.IMAGES);
        }

        if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.STORES.THUMBNAILS)) {
          db.createObjectStore(INDEXEDDB_CONFIG.STORES.THUMBNAILS);
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  async saveImage(id: string, blob: Blob): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [INDEXEDDB_CONFIG.STORES.IMAGES],
        'readwrite'
      );
      const store = transaction.objectStore(INDEXEDDB_CONFIG.STORES.IMAGES);
      const request = store.put(blob, id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveThumbnail(id: string, blob: Blob): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [INDEXEDDB_CONFIG.STORES.THUMBNAILS],
        'readwrite'
      );
      const store = transaction.objectStore(INDEXEDDB_CONFIG.STORES.THUMBNAILS);
      const request = store.put(blob, id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<Blob | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [INDEXEDDB_CONFIG.STORES.IMAGES],
        'readonly'
      );
      const store = transaction.objectStore(INDEXEDDB_CONFIG.STORES.IMAGES);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getThumbnail(id: string): Promise<Blob | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [INDEXEDDB_CONFIG.STORES.THUMBNAILS],
        'readonly'
      );
      const store = transaction.objectStore(INDEXEDDB_CONFIG.STORES.THUMBNAILS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.ensureDB();
    
    // Delete from both stores
    const imagePromise = new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        [INDEXEDDB_CONFIG.STORES.IMAGES],
        'readwrite'
      );
      const store = transaction.objectStore(INDEXEDDB_CONFIG.STORES.IMAGES);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    const thumbnailPromise = new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        [INDEXEDDB_CONFIG.STORES.THUMBNAILS],
        'readwrite'
      );
      const store = transaction.objectStore(INDEXEDDB_CONFIG.STORES.THUMBNAILS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    await Promise.all([imagePromise, thumbnailPromise]);
  }

  async deleteImagesByIds(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.deleteImage(id)));
  }
}

export const imageService = new ImageService();
