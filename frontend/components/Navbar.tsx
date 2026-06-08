'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-row justify-between items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition">
            <Image 
              src="/logotip.png" 
              alt="Логотип" 
              width={90} 
              height={90} 
              className="object-contain w-auto h-auto"
              loading="eager"
              priority
            />
          </Link>

          <nav className="flex gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition text-sm ${
                isActive('/') && pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              🏠 Главная
            </Link>
            <Link
              href="/posts"
              className={`px-3 py-1.5 rounded-lg transition text-sm ${
                isActive('/posts')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              📄 Посты
            </Link>
            <Link
              href="/tags"
              className={`px-3 py-1.5 rounded-lg transition text-sm ${
                isActive('/tags')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              🏷️ Теги
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}