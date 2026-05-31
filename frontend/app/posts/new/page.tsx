'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsApi, tagsApi } from '@/lib/api';
import { Tag } from '@/types';

export default function NewPostPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    isPublished: false,
    tagId: '',
  });

  useEffect(() => {
    tagsApi.getAll(1, 100)
      .then(res => setTags(res.items))
      .catch(() => setError('Ошибка загрузки тегов'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      setError('Заголовок обязателен');
      return;
    }
    if (!form.content.trim()) {
      setError('Содержание обязательно');
      return;
    }
    if (!form.tagId) {
      setError('Выберите тег');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await postsApi.create(form);
      router.push('/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания поста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-4">
        <Link href="/posts" className="text-blue-600 hover:underline">
          ← Назад к постам
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">➕ Новый пост</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Заголовок <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Содержание <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тег <span className="text-red-500">*</span>
          </label>
          <select
            value={form.tagId}
            onChange={(e) => setForm({ ...form, tagId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Выберите тег</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isPublished" className="text-sm text-gray-700">
            Опубликовать сразу
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Создание...' : '📝 Создать пост'}
        </button>
      </form>
    </div>
  );
}