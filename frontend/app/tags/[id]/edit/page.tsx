'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { tagsApi } from '@/lib/api';
import { Tag } from '@/types';
import Button from '@/components/Button';

export default function EditTagPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    tagsApi.getById(id as string)
      .then((tag: Tag) => {
        setForm({
          name: tag.name,
          slug: tag.slug,
          description: tag.description || '',
        });
        setInitialLoading(false);
      })
      .catch(() => {
        setError('Тег не найден');
        setInitialLoading(false);
      });
  }, [id]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      setError('Название тега обязательно');
      return;
    }
    if (!form.slug.trim()) {
      setError('Slug обязателен');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await tagsApi.update(id as string, form);
      router.push(`/tags/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-4">
        <Link href={`/tags/${id}`} className="text-blue-600 hover:underline">
          ← Назад к тегу
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">✏️ Редактирование тега</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm({
                name,
                slug: generateSlug(name),
                description: form.description,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Сохранение...' : '💾 Сохранить'}
          </Button>
          <Link href={`/tags/${id}`}>
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}