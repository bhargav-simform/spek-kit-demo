import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getPosts as fetchPosts,
  createPost as apiCreatePost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
} from '@/services/api.service';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/types/post.types';

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  toggleLike: (postId: number) => void;
  refreshPosts: () => Promise<void>;

  // CRUD operations
  createPost: (request: CreatePostRequest) => Promise<void>;
  updatePost: (request: UpdatePostRequest) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;

  // Loading states for CRUD operations
  creatingPost: boolean;
  updatingPostId: number | null;
  deletingPostId: number | null;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: ReactNode;
}

export function PostsProvider({ children }: PostsProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CRUD loading states
  const [creatingPost, setCreatingPost] = useState(false);
  const [updatingPostId, setUpdatingPostId] = useState<number | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback((postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isLiked: !post.isLiked } : post
      )
    );
  }, []);

  const refreshPosts = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  const createPost = useCallback(async (request: CreatePostRequest) => {
    setCreatingPost(true);
    setError(null);

    // Generate temporary post for optimistic update
    const tempId = Date.now();
    const tempPost: Post = {
      id: tempId,
      userId: request.userId,
      title: request.title,
      body: request.body,
      engagement: { likes: 0, comments: 0, shares: 0 },
      isLiked: false,
      timestamp: new Date(),
      hashtags: [],
    };

    // Optimistic update - add temp post to top of list
    setPosts(prevPosts => [tempPost, ...prevPosts]);

    try {
      const newPost = await apiCreatePost(request);
      // Replace temp post with actual post from API
      setPosts(prevPosts =>
        prevPosts.map(post => (post.id === tempId ? newPost : post))
      );
    } catch (err) {
      // Rollback - remove temp post on error
      setPosts(prevPosts => prevPosts.filter(post => post.id !== tempId));
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      throw err;
    } finally {
      setCreatingPost(false);
    }
  }, []);

  const updatePost = useCallback(
    async (request: UpdatePostRequest) => {
      setUpdatingPostId(request.id);
      setError(null);

      // Find existing post for rollback
      const existingPost = posts.find(post => post.id === request.id);
      if (!existingPost) {
        setUpdatingPostId(null);
        throw new Error('Post not found');
      }

      // Optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === request.id
            ? { ...post, title: request.title, body: request.body }
            : post
        )
      );

      try {
        const updatedPost = await apiUpdatePost(request);
        // Replace with actual updated post from API
        setPosts(prevPosts =>
          prevPosts.map(post => (post.id === request.id ? updatedPost : post))
        );
      } catch (err) {
        // Rollback - restore original post
        setPosts(prevPosts =>
          prevPosts.map(post => (post.id === request.id ? existingPost : post))
        );
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update post';
        setError(errorMessage);
        throw err;
      } finally {
        setUpdatingPostId(null);
      }
    },
    [posts]
  );

  const deletePost = useCallback(
    async (postId: number) => {
      setDeletingPostId(postId);
      setError(null);

      // Find post for rollback
      const postToDelete = posts.find(post => post.id === postId);
      if (!postToDelete) {
        setDeletingPostId(null);
        throw new Error('Post not found');
      }

      // Optimistic update - remove post
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

      try {
        await apiDeletePost(postId);
      } catch (err) {
        // Rollback - restore deleted post
        setPosts(prevPosts => {
          const index = prevPosts.findIndex(p => p.id > postId);
          if (index === -1) {
            return [...prevPosts, postToDelete];
          }
          return [
            ...prevPosts.slice(0, index),
            postToDelete,
            ...prevPosts.slice(index),
          ];
        });
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete post';
        setError(errorMessage);
        throw err;
      } finally {
        setDeletingPostId(null);
      }
    },
    [posts]
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const value: PostsContextType = {
    posts,
    loading,
    error,
    toggleLike,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    creatingPost,
    updatingPostId,
    deletingPostId,
  };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosts(): PostsContextType {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
