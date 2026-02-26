import { useState, useEffect } from 'react';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import { getCurrentPath } from './utils/navigation';
import { imageService } from './services/imageService';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    // Initialize IndexedDB on app start
    imageService.initDB().catch((error) => {
      console.error('Failed to initialize IndexedDB:', error);
    });

    // Listen for hash changes
    const handleHashChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple routing
  if (currentPath.startsWith('/album/')) {
    return <AlbumDetailPage />;
  }

  return <AlbumsPage />;
}

export default App;
