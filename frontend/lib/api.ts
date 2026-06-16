import { Tag, Post, PostWithTag, TagWithPosts, ApiResponse } from '@/types';

// Адрес бека
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

// Универсальный запрос с токеном
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка запроса');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const tagsApi = {
  getAll: (page = 1, limit = 100) =>
    request<ApiResponse<Tag>>(`/tags?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    request<TagWithPosts>(`/tags/${id}`),

  create: (data: { name: string; slug: string; description?: string }) =>
    request<Tag>('/tags', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { name?: string; slug?: string; description?: string }) =>
    request<Tag>(`/tags/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/tags/${id}`, { method: 'DELETE' }),
};

export const postsApi = {
  getAll: (params?: { page?: number; limit?: number; tagId?: string; q?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.tagId) searchParams.append('tagId', params.tagId);
    if (params?.q) searchParams.append('q', params.q);
    return request<ApiResponse<PostWithTag>>(`/posts?${searchParams.toString()}`);
  },

  getById: (id: string) =>
    request<PostWithTag>(`/posts/${id}`),

  create: (data: { title: string; content: string; isPublished: boolean; tagId: string }) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { title?: string; content?: string; isPublished?: boolean; tagId?: string }) =>
    request<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),
};