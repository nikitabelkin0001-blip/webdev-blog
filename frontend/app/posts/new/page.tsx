'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsApi, tagsApi } from '@/lib/api';
import { Tag } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';

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

  const tagOptions = tags.map(tag => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-4">
        <Link href="/posts" className="text-blue-600 hover:underline">
          Назад к постам
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Создание нового поста</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Заголовок"
          name="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="Введите заголовок поста"
        />
        
        <Select
          label="Тег"
          name="tagId"
          value={form.tagId}
          onChange={(e) => setForm({ ...form, tagId: e.target.value })}
          options={tagOptions}
          required
        />
        
        <Textarea
          label="Содержание"
          name="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={8}
          placeholder="Введите текст поста..."
        />
        
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">
              Опубликовать сразу (если не отметить, пост будет черновиком)
            </span>
          </label>
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Создать пост'}
          </Button>
          <Link href="/posts">
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}