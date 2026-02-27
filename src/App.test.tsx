import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { PostsProvider } from './contexts/PostsContext';
import * as apiService from './services/api.service';

// Mock the API service
jest.mock('./services/api.service');

const mockPosts = [
  {
    userId: 1,
    id: 1,
    title: 'Test Post',
    body: 'Test content',
  },
];

const mockUsers = [
  {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
  },
];

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', async () => {
    (apiService.getPosts as jest.Mock).mockResolvedValue([]);

    render(
      <PostsProvider>
        <App />
      </PostsProvider>
    );

    expect(screen.getByText(/Social Media Posts/i)).toBeInTheDocument();
  });

  it('should show loading skeleton initially', () => {
    (apiService.getPosts as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <PostsProvider>
        <App />
      </PostsProvider>
    );

    // Check for skeleton loaders
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display posts after loading', async () => {
    (apiService.getPosts as jest.Mock).mockResolvedValue([
      {
        ...mockPosts[0],
        user: mockUsers[0],
        engagement: { likes: 10, comments: 2, shares: 1 },
        isLiked: false,
        timestamp: new Date(),
        hashtags: [],
        imageUrl: undefined,
      },
    ]);

    render(
      <PostsProvider>
        <App />
      </PostsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should show error message when loading fails', async () => {
    const errorMessage = 'Failed to load posts';
    (apiService.getPosts as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <PostsProvider>
        <App />
      </PostsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Posts/i)).toBeInTheDocument();
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show empty state when no posts', async () => {
    (apiService.getPosts as jest.Mock).mockResolvedValue([]);

    render(
      <PostsProvider>
        <App />
      </PostsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });
  });
});
