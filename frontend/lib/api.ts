import { Tag, Post, PostWithTag, TagWithPosts, ApiResponse } from '@/types';

// Адрес бека
const API_BASE = 'http://localhost:4000/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
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
  // Получить все теги
  getAll: (page = 1, limit = 100) =>
    request<ApiResponse<Tag>>(`/tags?page=${page}&limit=${limit}`),

  // тег по id
  getById: (id: string) =>
    request<TagWithPosts>(`/tags/${id}`),

  // создание тега
  create: (data: { name: string; slug: string; description?: string }) =>
    request<Tag>('/tags', { method: 'POST', body: JSON.stringify(data) }),

  // обновление тега
  update: (id: string, data: { name?: string; slug?: string; description?: string }) =>
    request<Tag>(`/tags/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // удаление
  delete: (id: string) =>
    request<void>(`/tags/${id}`, { method: 'DELETE' }),
};

export const postsApi = {
  // Получить все посты
  getAll: (params?: { page?: number; limit?: number; tagId?: string; q?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.tagId) searchParams.append('tagId', params.tagId);
    if (params?.q) searchParams.append('q', params.q);
    return request<ApiResponse<PostWithTag>>(`/posts?${searchParams.toString()}`);
  },

  // Пост по id
  getById: (id: string) =>
    request<PostWithTag>(`/posts/${id}`),

  // созадние поста
  create: (data: { title: string; content: string; isPublished: boolean; tagId: string }) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),

  // обновление поста
  update: (id: string, data: { title?: string; content?: string; isPublished?: boolean; tagId?: string }) =>
    request<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // удаление поста
  delete: (id: string) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),
};