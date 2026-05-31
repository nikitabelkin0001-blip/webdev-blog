'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { tagsApi } from '@/lib/api';
import { Tag } from '@/types';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    tagsApi.getAll(1, 100)
      .then(res => {
        setTags(res.items);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки тегов');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить тег "${name}"?`)) return;
    
    try {
      await tagsApi.delete(id);
      setTags(tags.filter(tag => tag.id !== id));
    } catch {
      alert('Ошибка при удалении тега');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🏷️ Все теги</h1>
        <Link href="/tags/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Новый тег
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {tags.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
          Тегов пока нет. Создайте первый тег!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/tags/${tag.id}`}>
                    <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                      {tag.name}
                    </h2>
                  </Link>
                  {tag.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {tag.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2 font-mono">
                    /{tag.slug}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/tags/${tag.id}/edit`}>
                    <button className="text-yellow-600 hover:text-yellow-800 p-1">
                      ✏️
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
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