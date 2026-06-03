'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { tagsApi } from '@/lib/api';
import { TagWithPosts } from '@/types';
import Button from '@/components/Button';

export default function TagDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tag, setTag] = useState<TagWithPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    tagsApi.getById(id as string)
      .then(setTag)
      .catch(() => setError('Тег не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Удалить тег "${tag?.name}"? Посты с этим тегом останутся без тега.`)) return;
    
    setDeleting(true);
    try {
      await tagsApi.delete(id as string);
      router.push('/tags');
    } catch {
      alert('Ошибка при удалении');
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  if (error || !tag) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || 'Тег не найден'}</p>
        <Link href="/tags" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Вернуться к тегам
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/tags" className="text-blue-600 hover:underline">
          ← Назад к тегам
        </Link>
        <div className="flex gap-2">
          <Link href={`/tags/${id}/edit`}>
            <Button variant="secondary">✏️ Редактировать</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Удаление...' : '🗑️ Удалить'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{tag.name}</h1>
        <p className="text-gray-500 mb-4">/{tag.slug}</p>
        {tag.description && (
          <p className="text-gray-700">{tag.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-4">
          Создан: {new Date(tag.createdAt).toLocaleDateString('ru-RU')}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Посты с этим тегом ({tag.posts?.length || 0})
      </h2>

      {tag.posts?.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
          Нет постов с этим тегом
        </div>
      ) : (
        <div className="space-y-3">
          {tag.posts?.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {post.isPublished ? '✅ Опубликован' : '📝 Черновик'}
                </p>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {post.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}