import { useState } from 'react';
import { PostGrid } from '@/components/PostGrid';
import { PostDialog } from '@/components/PostDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/contexts/PostsContext';
import { AlertCircle, Plus } from 'lucide-react';
import type { Post } from '@/types/post.types';

function App() {
  const {
    posts,
    loading,
    error,
    refreshPosts,
    toggleLike,
    createPost,
    updatePost,
    deletePost,
  } = usePosts();

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // CRUD handlers
  const handleCreatePost = async (values: { title: string; body: string }) => {
    await createPost({
      ...values,
      userId: 1, // Using default user ID for demo
    });
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = async (values: { title: string; body: string }) => {
    if (!selectedPost) return;
    await updatePost({
      id: selectedPost.id,
      ...values,
    });
  };

  const handleDeletePost = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPost) return;
    await deletePost(selectedPost.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Social Media Posts
          </h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Post
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 p-4 bg-white rounded-lg border">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Error Loading Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error}
            </p>
            <button
              onClick={refreshPosts}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <PostGrid
            posts={posts}
            onLike={toggleLike}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        )}
      </main>

      {/* Create Post Dialog */}
      <PostDialog
        mode="create"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePost}
      />

      {/* Edit Post Dialog */}
      <PostDialog
        mode="edit"
        post={selectedPost || undefined}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdatePost}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Post?"
        description="This will permanently delete this post. This action cannot be undone."
      />
    </div>
  );
}

export default App;
