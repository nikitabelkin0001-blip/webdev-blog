import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение базы данных...');

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash('123456', 10);

  // создаём пользователя
  const user = await prisma.user.upsert({
    where: { id: 'user_1' },
    update: {},
    create: {
      id: 'user_1',
      email: 'admin@gmail.com',
      password: hashedPassword,  // ← изменено
      name: 'Администратор',
    },
  });
  console.log('✅ Пользователь:', user.email);

  // создаём теги
  const tagsData = [
    { name: 'JavaScript', slug: 'javascript', description: 'Язык программирования для веба' },
    { name: 'TypeScript', slug: 'typescript', description: 'Типизированный JavaScript' },
    { name: 'Next.js', slug: 'nextjs', description: 'React-фреймворк' },
    { name: 'Tailwind CSS', slug: 'tailwind', description: 'Утилитарный CSS' },
    { name: 'Node.js', slug: 'nodejs', description: 'Серверный JavaScript' },
  ];

  for (const tag of tagsData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log('✅ Теги: 5 шт');

  // получаем ID тегов для создания постов
  const jsTag = await prisma.tag.findUnique({ where: { slug: 'javascript' } });
  const tsTag = await prisma.tag.findUnique({ where: { slug: 'typescript' } });
  const nextTag = await prisma.tag.findUnique({ where: { slug: 'nextjs' } });
  const tailwindTag = await prisma.tag.findUnique({ where: { slug: 'tailwind' } });
  const nodeTag = await prisma.tag.findUnique({ where: { slug: 'nodejs' } });

  // создаём посты
  if (jsTag && tsTag && nextTag && tailwindTag && nodeTag) {
    const postsData = [
      {
        title: 'Введение в JavaScript',
        content: 'JavaScript — это язык программирования, который работает в браузере и на сервере.',
        isPublished: true,
        tagId: jsTag.id,
        authorId: user.id,
      },
      {
        title: 'Почему TypeScript лучше JavaScript',
        content: 'TypeScript добавляет статическую типизацию, что помогает ловить ошибки.',
        isPublished: true,
        tagId: tsTag.id,
        authorId: user.id,
      },
      {
        title: 'Next.js 14: Что нового',
        content: 'App Router, Server Components, улучшенная производительность.',
        isPublished: false,
        tagId: nextTag.id,
        authorId: user.id,
      },
      {
        title: 'Tailwind CSS за 10 минут',
        content: 'Утилитарные классы позволяют верстать без отрыва от HTML.',
        isPublished: true,
        tagId: tailwindTag.id,
        authorId: user.id,
      },
      {
        title: 'Создаём API на Express',
        content: 'Express — минималистичный веб-фреймворк для Node.js.',
        isPublished: true,
        tagId: nodeTag.id,
        authorId: user.id,
      },
    ];

    for (const post of postsData) {
      await prisma.post.create({
        data: post,
      });
    }
    console.log('✅ Посты: 5 шт');
  }

  console.log('🎉 База данных заполнена!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());