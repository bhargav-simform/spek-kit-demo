// Application constants

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const THUMBNAIL_MAX_WIDTH = 300;
export const THUMBNAIL_MAX_HEIGHT = 300;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const STORAGE_KEYS = {
  ALBUMS: 'photo-albums',
  PHOTOS: 'photo-metadata',
};

export const INDEXEDDB_CONFIG = {
  NAME: 'PhotoAlbumDB',
  VERSION: 1,
  STORES: {
    IMAGES: 'images',
    THUMBNAILS: 'thumbnails',
  },
};
