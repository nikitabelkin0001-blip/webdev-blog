'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsApi } from '@/lib/api';
import { PostWithTag } from '@/types';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<PostWithTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi.getAll({ page: 1, limit: 10 }).then(res => {
      const publishedPosts = res.items.filter(post => post.isPublished);
      const sortedPosts = [...publishedPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestPosts(sortedPosts.slice(0, 3));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Добро пожаловать в блог
          </h1>
          <p className="text-xl mb-8">
            Статьи о программировании, JavaScript, React, Next.js и не только
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            📝 Последние посты
          </h2>
          <Link href="/posts" className="text-blue-600 hover:underline">
            Все посты →
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Постов пока нет
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100 h-full flex flex-col">
                  <div className="p-5">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                        {post.tag?.name || 'Без тега'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="mt-4 text-blue-500 text-sm font-medium">
                      Читать далее →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}