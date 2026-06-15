'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
              width={100}
              height={100}
              className="object-contain w-auto h-auto"
              loading="eager"
              priority
            />
          </Link>

          <nav className="hidden md:flex gap-2 items-center">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition text-sm ${isActive('/') && pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              Главная
            </Link>
            <Link
              href="/posts"
              className={`px-3 py-1.5 rounded-lg transition text-sm ${isActive('/posts')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              Посты
            </Link>
            <Link
              href="/tags"
              className={`px-3 py-1.5 rounded-lg transition text-sm ${isActive('/tags')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              Теги
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600 mr-2">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg transition text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex gap-2 ml-4">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg transition text-sm bg-blue-500 text-white hover:bg-blue-600"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-lg transition text-sm bg-green-500 text-white hover:bg-green-600"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  {user.name}
                </button>
              </div>
            )}
            {!user && (
              <div className="flex gap-1">
                <Link
                  href="/login"
                  className="px-2 py-1 rounded-lg text-xs bg-blue-500 text-white hover:bg-blue-600"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="px-2 py-1 rounded-lg text-xs bg-green-500 text-white hover:bg-green-600"
                >
                  Регистрация
                </Link>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg transition text-sm ${isActive('/') && pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                Главная
              </Link>
              <Link
                href="/posts"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg transition text-sm ${isActive('/posts')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                Посты
              </Link>
              <Link
                href="/tags"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg transition text-sm ${isActive('/tags')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                Теги
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className='px-3 py-2 text-red-600 rounded-lg transition text-left text-sm hover:bg-red-50'>
                  Выйти
                </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}