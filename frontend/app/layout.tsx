import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebDev Blog | Блог о веб-разработке',
  description: 'Посты и теги о веб-разработке',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 text-gray-400 py-6 mt-8">
            <div className="container mx-auto px-4 text-center text-sm">
              <p>&copy; 2026 WebDev Blog. Сделано на Next.js + Express + TypeScript</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}