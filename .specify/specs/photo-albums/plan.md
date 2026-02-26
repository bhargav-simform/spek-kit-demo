# Implementation Plan: Photo Album Organizer

**Feature Branch**: `001-photo-albums`  
**Created**: 2026-02-26  
**Architecture**: React + Vite, LocalStorage for metadata, FileReader API for images

## Technical Architecture

### Tech Stack
- **Frontend Framework**: React 19.2.0 (already installed)
- **Build Tool**: Vite 7.3.1 (already installed)
- **Styling**: CSS Modules or vanilla CSS (no additional libraries)
- **Storage**: Browser LocalStorage for metadata, IndexedDB for image blobs
- **Drag & Drop**: react-beautiful-dnd (lightweight DnD library) OR native HTML5 Drag & Drop API
- **State Management**: React useState/useReducer + Context API (no Redux needed)
- **Image Handling**: FileReader API for reading files, createObjectURL for previews

### Data Storage Strategy

**LocalStorage** (for metadata only):
```typescript
interface Album {
  id: string;
  name: string;
  date: string; // ISO 8601 format
  createdAt: number; // timestamp
  customOrder: number; // for drag-drop reordering
  photoIds: string[]; // references to photos in IndexedDB
}

interface Photo {
  id: string;
  albumId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
  dimensions?: { width: number; height: number };
}
```

**IndexedDB** (for image binary data):
- Store actual image blobs/files
- Use photo IDs as keys
- Store both full-size and thumbnail versions

### Project Structure
```
src/
├── components/
│   ├── AlbumCard.tsx          # Album card on main page
│   ├── AlbumGrid.tsx          # Grid of albums on main page
│   ├── PhotoGrid.tsx          # Tile grid of photos within album
│   ├── PhotoTile.tsx          # Individual photo tile
│   ├── Lightbox.tsx           # Full-size photo viewer
│   ├── CreateAlbumModal.tsx   # Modal for creating new album
│   ├── EmptyState.tsx         # Empty state component (reusable)
│   └── DragDropProvider.tsx   # Drag & drop context wrapper
├── hooks/
│   ├── useLocalStorage.ts     # Hook for localStorage operations
│   ├── useIndexedDB.ts        # Hook for IndexedDB operations
│   ├── useAlbums.ts           # Hook for album CRUD operations
│   └── usePhotos.ts           # Hook for photo CRUD operations
├── services/
│   ├── storageService.ts      # LocalStorage abstraction
│   ├── imageService.ts        # IndexedDB + image processing
│   └── fileService.ts         # File validation, thumbnail generation
├── utils/
│   ├── imageUtils.ts          # Image compression, thumbnail generation
│   ├── dateUtils.ts           # Date formatting utilities
│   └── constants.ts           # App constants (max file size, etc.)
├── types/
│   └── index.ts               # TypeScript type definitions
├── pages/
│   ├── AlbumsPage.tsx         # Main page (album list)
│   └── AlbumDetailPage.tsx    # Album detail page (photo grid)
├── App.tsx                    # Main app with routing
└── main.tsx                   # Entry point
```

## Implementation Phases

### Phase 1: Foundation & Data Layer (MVP Core) 🎯
**Priority**: P1  
**Estimated Time**: 2-3 hours  
**Goal**: Set up data persistence and basic CRUD operations

**Tasks**:
1. **Create type definitions** (`types/index.ts`)
   - Define Album, Photo, and related interfaces
   - Export all types for use across the app

2. **Build storage services** (`services/`)
   - `storageService.ts`: LocalStorage wrapper with get/set/remove operations for albums and photos metadata
   - `imageService.ts`: IndexedDB setup with object stores for full images and thumbnails
   - `fileService.ts`: File validation (image types, size limits), thumbnail generation using Canvas API

3. **Create custom hooks** (`hooks/`)
   - `useLocalStorage.ts`: Generic hook for localStorage with type safety
   - `useIndexedDB.ts`: Hook for IndexedDB operations (open DB, add/get/delete images)
   - `useAlbums.ts`: Hook providing album CRUD operations (create, read, update, delete, reorder)
   - `usePhotos.ts`: Hook providing photo CRUD operations

4. **Setup basic routing**
   - Implement simple routing (manual or with react-router-dom if needed)
   - Create shell components for AlbumsPage and AlbumDetailPage

**Deliverable**: Working data layer with LocalStorage + IndexedDB integration, basic navigation skeleton

---

### Phase 2: Album List View (MVP - P1) 🎯
**Priority**: P1  
**Estimated Time**: 2-3 hours  
**Goal**: Display albums on main page

**Tasks**:
1. **Create AlbumsPage component** (`pages/AlbumsPage.tsx`)
   - Fetch all albums using useAlbums hook
   - Handle empty state (no albums)
   - Layout container for album grid

2. **Build AlbumGrid component** (`components/AlbumGrid.tsx`)
   - Responsive CSS Grid layout (2-4 columns depending on screen size)
   - Map albums to AlbumCard components
   - Sort albums by date (newest first) or custom order

3. **Build AlbumCard component** (`components/AlbumCard.tsx`)
   - Display album date, name, photo count
   - Show first photo as thumbnail (if available)
   - Click handler to navigate to album detail
   - Hover effects

4. **Create EmptyState component** (`components/EmptyState.tsx`)
   - Reusable component for empty albums/photos
   - Props: message, icon, action button

5. **Styling**
   - Responsive card design
   - CSS Grid for album layout
   - Hover effects and transitions

**Deliverable**: Functional main page showing all albums with proper styling and navigation

---

### Phase 3: Album Detail & Photo Grid (MVP - P1) 🎯
**Priority**: P1  
**Estimated Time**: 2-3 hours  
**Goal**: View photos within an album

**Tasks**:
1. **Create AlbumDetailPage component** (`pages/AlbumDetailPage.tsx`)
   - Get album ID from route params
   - Fetch album and its photos using hooks
   - Header with album name, date, photo count
   - Back button to main page
   - Handle empty album state

2. **Build PhotoGrid component** (`components/PhotoGrid.tsx`)
   - Responsive CSS Grid for photo tiles (2-6 columns)
   - Map photos to PhotoTile components
   - Lazy loading for better performance

3. **Build PhotoTile component** (`components/PhotoTile.tsx`)
   - Display photo thumbnail from IndexedDB
   - Hover effects (scale, shadow, border)
   - Click handler to open lightbox
   - Loading state while image loads

4. **Build Lightbox component** (`components/Lightbox.tsx`)
   - Modal overlay for full-size image
   - Next/previous navigation
   - Close on ESC key or click outside
   - Display full-size image from IndexedDB

5. **Image loading utilities** (`utils/imageUtils.ts`)
   - Function to load image blob from IndexedDB as data URL
   - Thumbnail generation (max 300x300px)
   - Image compression if needed

**Deliverable**: Working album detail page with responsive photo grid and lightbox viewer

---

### Phase 4: Album Creation (P2)
**Priority**: P2  
**Estimated Time**: 1-2 hours  
**Goal**: Allow users to create new albums

**Tasks**:
1. **Build CreateAlbumModal component** (`components/CreateAlbumModal.tsx`)
   - Form with date picker (default to today)
   - Optional album name field
   - Cancel and Create buttons
   - Form validation

2. **Add "Create Album" button to AlbumsPage**
   - Fixed or prominent button on main page
   - Opens CreateAlbumModal

3. **Implement album creation logic**
   - Use useAlbums hook to create new album
   - Generate unique ID (UUID or timestamp-based)
   - Save to LocalStorage
   - Redirect to new album or refresh list

4. **Date picker implementation**
   - Use native HTML5 date input (no library needed)
   - Format date properly for storage

**Deliverable**: Users can create new albums from main page

---

### Phase 5: Photo Upload (P2)
**Priority**: P2  
**Estimated Time**: 2-3 hours  
**Goal**: Add photos to albums

**Tasks**:
1. **Add "Add Photos" button to AlbumDetailPage**
   - Prominent button in album header
   - Triggers file input dialog

2. **Implement file upload handler**
   - Handle multiple file selection
   - Validate file types (JPEG, PNG, GIF, WebP)
   - Validate file sizes (max 10MB per file)
   - Show error messages for invalid files

3. **Build upload progress UI**
   - Progress indicator for each file
   - Overall progress if multiple files
   - Success/error states

4. **Image processing pipeline**
   - Read files using FileReader API
   - Generate thumbnails using Canvas API
   - Store full image in IndexedDB
   - Store thumbnail in IndexedDB
   - Add photo metadata to LocalStorage
   - Update album's photoIds array

5. **Batch processing**
   - Process multiple uploads asynchronously
   - Update UI incrementally as each photo completes

**Deliverable**: Users can add multiple photos to albums with progress feedback

---

### Phase 6: Drag & Drop Reordering (P2)
**Priority**: P2  
**Estimated Time**: 2-3 hours  
**Goal**: Reorder albums by dragging

**Tasks**:
1. **Choose DnD implementation**
   - Option A: Install react-beautiful-dnd (lightweight, good UX)
   - Option B: Use native HTML5 Drag & Drop API (no dependencies)
   - Decision: Start with Option B (native) to minimize libraries

2. **Make AlbumCard draggable**
   - Add `draggable="true"` attribute
   - Implement onDragStart, onDragEnd handlers
   - Visual feedback while dragging (opacity, cursor)

3. **Make AlbumGrid a drop zone**
   - Implement onDragOver, onDrop handlers
   - Show drop indicators (placeholder/highlight)
   - Calculate drop position

4. **Update album order**
   - Recalculate customOrder values for all albums
   - Persist to LocalStorage
   - Update UI immediately

5. **Polish DnD UX**
   - Smooth animations
   - Clear visual feedback
   - Handle edge cases (drop outside zone)

**Deliverable**: Functional drag-and-drop album reordering with good UX

---

### Phase 7: Delete Operations (P3)
**Priority**: P3  
**Estimated Time**: 1-2 hours  
**Goal**: Delete albums and photos

**Tasks**:
1. **Add delete album functionality**
   - Delete button/icon on AlbumCard
   - Confirmation modal ("Are you sure?")
   - Delete album from LocalStorage
   - Delete all associated photos from IndexedDB
   - Refresh album list

2. **Add delete photo functionality**
   - Delete button/icon on PhotoTile (shown on hover)
   - Confirmation dialog (optional, based on UX preference)
   - Remove photo from IndexedDB
   - Update album's photoIds array
   - Update photo grid

3. **Cascade delete logic**
   - When album is deleted, clean up all photos
   - Prevent orphaned data in IndexedDB

**Deliverable**: Users can delete albums and individual photos

---

### Phase 8: Polish & Responsive Design
**Priority**: P3  
**Estimated Time**: 2-3 hours  
**Goal**: Ensure responsive design and UX polish

**Tasks**:
1. **Responsive design refinement**
   - Test on various screen sizes (768px - 1920px)
   - Adjust grid columns: 2 cols (tablet), 3-4 cols (desktop)
   - Mobile-friendly touch interactions

2. **Performance optimization**
   - Lazy load images in photo grid
   - Implement virtual scrolling for large albums (if needed)
   - Optimize thumbnail sizes
   - Add loading skeletons

3. **UX improvements**
   - Smooth transitions and animations
   - Loading states for all async operations
   - Error boundaries for graceful error handling
   - Toast notifications for actions (album created, photo uploaded, etc.)

4. **Accessibility**
   - Keyboard navigation support
   - ARIA labels for screen readers
   - Focus management in modals

5. **Edge case handling**
   - Large image files (>10MB) - show warning
   - Corrupted images - show error state
   - Storage quota exceeded - notify user
   - Empty states for all views

**Deliverable**: Polished, responsive, accessible application

---

## Dependencies & Libraries

### Minimal Library Approach
**Required** (already installed):
- React 19.2.0
- React DOM 19.2.0
- TypeScript
- Vite

**Optional** (consider adding):
- `react-beautiful-dnd` or `@dnd-kit/core` (for better DnD UX) - ~50KB
  - **Decision**: Start with native HTML5 DnD, add library only if UX suffers
- `date-fns` or use native Intl API for date formatting
  - **Decision**: Use native `Intl.DateTimeFormat` (no dependency)
- `uuid` for generating unique IDs
  - **Decision**: Use `crypto.randomUUID()` (native browser API)

**Total new dependencies**: 0-1 (only if DnD library is needed)

---

## Data Flow Architecture

### Album Creation Flow
```
User clicks "Create Album"
  → CreateAlbumModal opens
  → User fills form (date, name)
  → Click "Create"
  → useAlbums.createAlbum()
  → Generate ID
  → Save to LocalStorage
  → Close modal
  → Refresh album list
```

### Photo Upload Flow
```
User clicks "Add Photos" in album
  → File input dialog opens
  → User selects multiple files
  → Validate each file (type, size)
  → For each valid file:
    → Read file with FileReader
    → Generate thumbnail with Canvas
    → Store full image in IndexedDB
    → Store thumbnail in IndexedDB
    → Create Photo metadata
    → Add photo ID to album
  → Update LocalStorage
  → Refresh photo grid
```

### Image Retrieval Flow
```
PhotoGrid renders
  → For each photo ID:
    → usePhotos.getPhotoThumbnail(id)
    → Query IndexedDB for thumbnail blob
    → Convert blob to object URL
    → Set as img src
  → When photo clicked:
    → usePhotos.getPhotoFull(id)
    → Query IndexedDB for full image
    → Open Lightbox with full image
```

### Drag & Drop Flow
```
User starts dragging album
  → onDragStart: Set drag data (album ID)
  → Visual feedback (opacity change)
User drags over another album
  → onDragOver: Show drop indicator
User drops album
  → onDrop: Get new position
  → Calculate new order for all albums
  → useAlbums.reorderAlbums(newOrder)
  → Update LocalStorage
  → Re-render with new order
```

---

## Testing Strategy

### Unit Tests (Optional but recommended)
- Test storage service functions
- Test image processing utilities
- Test date formatting functions

### Manual Testing Checklist
- [ ] Create album with custom date
- [ ] Create album without name (default behavior)
- [ ] Upload single photo to album
- [ ] Upload multiple photos (5+) at once
- [ ] Upload invalid file type (should show error)
- [ ] Upload file > 10MB (should show error/warning)
- [ ] View album with 0 photos (empty state)
- [ ] View album with 50+ photos (performance)
- [ ] Click photo to open lightbox
- [ ] Navigate with next/prev in lightbox
- [ ] Close lightbox (ESC, click outside, close button)
- [ ] Drag album to new position
- [ ] Drop album outside valid zone (should return)
- [ ] Delete photo from album
- [ ] Delete album (confirm dialog)
- [ ] Delete album with photos (all photos deleted)
- [ ] Refresh page (data persists)
- [ ] Resize window (responsive behavior)
- [ ] Test on different screen sizes (768px, 1024px, 1920px)

### Browser Storage Testing
- [ ] LocalStorage data structure is correct
- [ ] IndexedDB stores images properly
- [ ] Data persists after page refresh
- [ ] Handle storage quota exceeded gracefully

---

## Risk Mitigation

### Risk 1: IndexedDB Quota Exceeded
**Mitigation**: 
- Limit album size (max 100 photos per album)
- Show storage usage indicator
- Compress images before storing
- Warn user when approaching quota

### Risk 2: Performance with Large Albums
**Mitigation**:
- Use thumbnail images in grid (max 300x300px)
- Implement lazy loading
- Consider virtual scrolling for >100 photos
- Optimize image compression

### Risk 3: Browser Compatibility
**Mitigation**:
- Test in Chrome, Firefox, Safari, Edge
- Use feature detection for IndexedDB
- Provide fallback messages for unsupported browsers
- IndexedDB widely supported (can.iuse.com: 97%+)

### Risk 4: Drag & Drop UX Issues
**Mitigation**:
- Start with native HTML5 DnD
- If UX is poor, add react-beautiful-dnd
- Test on touch devices
- Provide alternative reorder method (up/down buttons)

---

## Success Metrics Alignment

- **SC-001** (2 clicks to album): ✅ Main page → Click album = 1 click
- **SC-002** (50 photos performant): ✅ Thumbnail optimization + lazy loading
- **SC-003** (DnD responsive <100ms): ✅ Native DnD with immediate visual feedback
- **SC-004** (5MB upload <10s): ✅ Async processing, progress indicators
- **SC-005** (95% success rate): ✅ Clear UI, intuitive flows, empty states
- **SC-006** (768px-1920px usable): ✅ Responsive CSS Grid, media queries
- **SC-007** (Delete <1s): ✅ LocalStorage/IndexedDB operations are fast
- **SC-008** (2-6 photos per row): ✅ CSS Grid with responsive columns

---

## Development Timeline Estimate

- **Phase 1** (Foundation): 2-3 hours
- **Phase 2** (Album List): 2-3 hours
- **Phase 3** (Photo Grid): 2-3 hours
- **Phase 4** (Album Creation): 1-2 hours
- **Phase 5** (Photo Upload): 2-3 hours
- **Phase 6** (Drag & Drop): 2-3 hours
- **Phase 7** (Delete Operations): 1-2 hours
- **Phase 8** (Polish): 2-3 hours

**Total Estimated Time**: 14-22 hours (2-3 full work days)

**MVP (P1 stories only)**: Phases 1-3 = 6-9 hours (1 full work day)

---

## Next Steps

1. Review and approve this plan
2. Set up git branch: `001-photo-albums`
3. Start with Phase 1: Foundation & Data Layer
4. Implement phases sequentially, testing after each
5. Demo MVP after Phase 3
6. Continue with P2/P3 features based on feedback

---

**Plan Status**: Ready for Review  
**Last Updated**: 2026-02-26
