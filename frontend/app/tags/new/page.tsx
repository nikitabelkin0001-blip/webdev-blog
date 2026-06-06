'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tagsApi } from '@/lib/api';
import Button from '@/components/Button';

export default function NewTagPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
  });

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
      await tagsApi.create(form);
      router.push('/tags');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания тега');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-4">
        <Link href="/tags" className="text-blue-600 hover:underline">
          ← Назад к тегам
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">➕ Новый тег</h1>
      
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
            placeholder="Например: JavaScript"
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
            placeholder="javascript"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-дружественное имя (латиница, цифры, дефисы)
          </p>
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
            placeholder="Краткое описание тега (необязательно)"
          />
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Создание...' : '➕ Создать тег'}
          </Button>
          <Link href="/tags">
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}