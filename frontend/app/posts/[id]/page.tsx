'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsApi } from '@/lib/api';
import { PostWithTag } from '@/types';
import Button from '@/components/Button';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostWithTag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Загрузка постов при запуске страницы
  useEffect(() => {
    postsApi.getById(id as string)
      .then(setPost)
      .catch(() => setError('Пост не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  // Удаление
  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;
    
    setDeleting(true);
    try {
      await postsApi.delete(id as string);
      router.push('/posts');
    } catch {
      alert('Ошибка при удалении');
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || 'Пост не найден'}</p>
        <Link href="/posts" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Вернуться к списку постов
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl p-4">
      {/* Кнопки навигации и управления */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/posts" className="text-blue-600 hover:underline">
          ← Назад к постам
        </Link>
        <div className="flex gap-2">
          <Link href={`/posts/${id}/edit`}>
            <Button variant="secondary">✏️ Редактировать</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Удаление...' : '🗑️ Удалить'}
          </Button>
        </div>
      </div>

      <article className="bg-white rounded-lg border p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6 pb-4 border-b">
          <span>🏷️ Тег: {post.tag?.name || 'Без тега'}</span>
          <span>•</span>
          <span>{post.isPublished ? '✅ Опубликован' : '📝 Черновик'}</span>
          <span>•</span>
          <span>📅 Создан: {new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
          {post.updatedAt !== post.createdAt && (
            <>
              <span>•</span>
              <span>🔄 Обновлён: {new Date(post.updatedAt).toLocaleDateString('ru-RU')}</span>
            </>
          )}
        </div>
        
        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>
    </div>
  );
}