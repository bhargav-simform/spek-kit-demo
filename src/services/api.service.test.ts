import {
  getPosts,
  getUsers,
  getComments,
  createPost,
  updatePost,
  deletePost,
} from './api.service';
import type {
  User,
  Comment,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/types/post.types';

// Mock fetch globally
globalThis.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockPostsData = [
        { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
        { userId: 1, id: 2, title: 'Post 2', body: 'Body 2' },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsData,
      });

      const posts = await getPosts();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts'
      );
      expect(posts).toHaveLength(2);
      expect(posts[0]).toHaveProperty('id');
      expect(posts[0]).toHaveProperty('engagement');
      expect(posts[0]).toHaveProperty('isLiked', false);
      expect(posts[0]).toHaveProperty('timestamp');
      expect(posts[0]).toHaveProperty('hashtags');
    });

    it('should handle network errors', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(getPosts()).rejects.toThrow('Network error');
    });

    it('should handle HTTP errors', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getPosts()).rejects.toThrow('HTTP error! status: 404');
    });

    it('should transform data correctly', async () => {
      const mockPostData = [
        {
          userId: 1,
          id: 1,
          title: 'Test #hashtag',
          body: 'This is a #test post with #multiple hashtags',
        },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostData,
      });

      const posts = await getPosts();

      expect(posts[0].hashtags).toContain('hashtag');
      expect(posts[0].hashtags).toContain('test');
      expect(posts[0].hashtags).toContain('multiple');
      expect(posts[0].engagement).toEqual({
        likes: expect.any(Number),
        comments: expect.any(Number),
        shares: expect.any(Number),
      });
    });
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsersData: User[] = [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
        },
        {
          id: 2,
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'jane@example.com',
        },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsersData,
      });

      const users = await getUsers();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users'
      );
      expect(users).toHaveLength(2);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('username');
    });

    it('should handle errors', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(getUsers()).rejects.toThrow('Network error');
    });
  });

  describe('getComments', () => {
    it('should fetch comments for a post', async () => {
      const mockCommentsData: Comment[] = [
        {
          postId: 1,
          id: 1,
          name: 'Comment 1',
          email: 'user@example.com',
          body: 'Comment body',
        },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommentsData,
      });

      const comments = await getComments(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts/1/comments'
      );
      expect(comments).toHaveLength(1);
      expect(comments[0]).toHaveProperty('postId', 1);
    });

    it('should handle errors', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(getComments(1)).rejects.toThrow('Network error');
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const request: CreatePostRequest = {
        title: 'New Post',
        body: 'New post body with #hashtag',
        userId: 1,
      };

      const mockResponse = {
        id: 101,
        title: request.title,
        body: request.body,
        userId: request.userId,
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const post = await createPost(request);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );
      expect(post.id).toBe(101);
      expect(post.title).toBe(request.title);
      expect(post.hashtags).toContain('hashtag');
      expect(post).toHaveProperty('engagement');
    });

    it('should handle HTTP errors', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(
        createPost({ title: 'Test', body: 'Test', userId: 1 })
      ).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const request: UpdatePostRequest = {
        id: 1,
        title: 'Updated Title',
        body: 'Updated body with #newtag',
      };

      const mockResponse = {
        id: request.id,
        title: request.title,
        body: request.body,
        userId: 1,
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const post = await updatePost(request);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: request.title,
            body: request.body,
          }),
        }
      );
      expect(post.id).toBe(1);
      expect(post.title).toBe(request.title);
      expect(post.hashtags).toContain('newtag');
    });

    it('should handle HTTP errors', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        updatePost({ id: 999, title: 'Test', body: 'Test' })
      ).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deletePost(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts/1',
        {
          method: 'DELETE',
        }
      );
    });

    it('should handle HTTP errors', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(deletePost(999)).rejects.toThrow('HTTP error! status: 404');
    });
  });
});
