'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsApi, tagsApi } from '@/lib/api';
import { PostWithTag, Tag } from '@/types';

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithTag[]>([]);  // список постов
  const [tags, setTags] = useState<Tag[]>([]);            // список тегов (для фильтра)
  const [loading, setLoading] = useState(true);           // состояние загрузки
  const [searchQuery, setSearchQuery] = useState('');     // текст поиска
  const [selectedTagId, setSelectedTagId] = useState(''); // выбранный тег для фильтра
  const [error, setError] = useState('');                 // сообщение об ошибке

  useEffect(() => {
    tagsApi.getAll(1, 100)
      .then(res => setTags(res.items))
      .catch(() => setError('Ошибка загрузки тегов'));
  }, []);

  useEffect(() => {
    setLoading(true);
    postsApi.getAll({
      q: searchQuery || undefined,
      tagId: selectedTagId || undefined,
    })
      .then(res => setPosts(res.items))
      .catch(() => setError('Ошибка загрузки постов'))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedTagId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;
    
    try {
      await postsApi.delete(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 Все посты</h1>
        <Link href="/posts/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Новый пост
          </button>
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
          placeholder="🔍 Поиск по заголовку или содержанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">🏷️ Все теги</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
          Постов не найдено. Создайте первый пост!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span>🏷️ {post.tag?.name || 'Без тега'}</span>
                    <span>•</span>
                    <span>{post.isPublished ? '✅ Опубликован' : '📝 Черновик'}</span>
                    <span>•</span>
                    <span>📅 {new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <p className="text-gray-700 mt-3 line-clamp-2">
                    {post.content}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/posts/${post.id}/edit`}>
                    <button className="text-yellow-600 hover:text-yellow-800 p-1">
                      ✏️
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}