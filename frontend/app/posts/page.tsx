'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsApi, tagsApi } from '@/lib/api';
import { PostWithTag, Tag } from '@/types';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext'; // импорт для проверки автора

export default function PostsPage() {
  const { user } = useAuth(); // текущий залогиненный пользователь

  const [posts, setPosts] = useState<PostWithTag[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Теги для фильтра
  useEffect(() => {
    tagsApi.getAll(1, 100)
      .then(res => setTags(res.items))
      .catch(() => setError('Ошибка загрузки тегов'));
  }, []);

  // Посты, поиск и фильтр
  useEffect(() => {
    setLoading(true);
    setError('');
    
    postsApi.getAll({
      page,
      limit,
      q: searchQuery || undefined,
      tagId: selectedTagId || undefined,
    })
      .then(res => {
        setPosts(res.items);
        setTotalPages(res.pages);
      })
      .catch(() => setError('Ошибка загрузки постов'))
      .finally(() => setLoading(false));
  }, [page, searchQuery, selectedTagId]);

  // Сброс страницы при изменении поиска
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedTagId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить пост "${title}"?`)) return;
    
    try {
      await postsApi.delete(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  if (loading && posts.length === 0) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Все посты</h1>
        <Link href="/posts/new">
          <Button variant="primary">+ Новый пост</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Поиск по заголовку или содержанию..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Все теги</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
          Постов не найдено
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition group">
                <Link href={`/posts/${post.id}`}>
                  <div className="p-5 cursor-pointer">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                        {post.tag?.name || 'Без тега'}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
                      {post.title}
                    </h2>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span></span>
                      <span>{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span>•</span>
                      <span>{post.isPublished ? 'Опубликован' : 'Черновик'}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                    </p>
                  </div>
                </Link>
                
                {user && user.id === post.authorId && (
                  <div className="border-t flex justify-end gap-2 p-2 bg-gray-50 rounded-b-lg">
                    <Link href={`/posts/${post.id}/edit`}>
                      <button className="text-yellow-600 hover:text-yellow-800 text-sm px-2 py-1 rounded">
                        Редактировать
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Назад
              </button>
              <span className="text-gray-600">
                Страница {page} из {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Далее
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}