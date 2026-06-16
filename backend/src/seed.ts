import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение базы данных...');

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Создаём пользователя-администратора
  const user = await prisma.user.upsert({
    where: { id: 'user_1' },
    update: {},
    create: {
      id: 'user_1',
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Администратор',
    },
  });
  console.log('Пользователь:', user.email);

  // Создаём теги
  const tagsData = [
    { name: 'JavaScript', slug: 'javascript', description: 'Язык программирования для веба', authorId: user.id },
    { name: 'TypeScript', slug: 'typescript', description: 'Типизированный JavaScript', authorId: user.id },
    { name: 'Next.js', slug: 'nextjs', description: 'React-фреймворк', authorId: user.id },
    { name: 'Tailwind CSS', slug: 'tailwind', description: 'Утилитарный CSS', authorId: user.id },
    { name: 'Node.js', slug: 'nodejs', description: 'Серверный JavaScript', authorId: user.id },
  ];

  for (const tag of tagsData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log('Теги: 5 шт');

  // Получаем ID тегов
  const jsTag = await prisma.tag.findUnique({ where: { slug: 'javascript' } });
  const tsTag = await prisma.tag.findUnique({ where: { slug: 'typescript' } });
  const nextTag = await prisma.tag.findUnique({ where: { slug: 'nextjs' } });
  const tailwindTag = await prisma.tag.findUnique({ where: { slug: 'tailwind' } });
  const nodeTag = await prisma.tag.findUnique({ where: { slug: 'nodejs' } });

  // Удаляем старые посты
  await prisma.post.deleteMany({});

  // Создаём полные версии постов
  if (jsTag && tsTag && nextTag && tailwindTag && nodeTag) {
    const postsData = [
      {
        title: 'Создаём API на Express: полное руководство для начинающих',
        content: `Введение
Express — это минималистичный и гибкий веб-фреймворк для Node.js, который позволяет быстро создавать мощные API и веб-приложения. В этой статье мы создадим полноценное REST API с нуля, разберём основные концепции и лучшие практики.

Предварительные требования
Установленный Node.js (версия 14 или выше)
Базовое понимание JavaScript
Текстовый редактор (VS Code, Sublime и т.д.)

Шаг 1: Настройка проекта
Создайте новую директорию и инициализируйте проект:
mkdir my-express-api
cd my-express-api
npm init -y

Установите необходимые зависимости:
npm install express
npm install -D nodemon

express — основной фреймворк
nodemon — инструмент для автоматической перезагрузки сервера при изменениях

Шаг 2: Создание базового сервера
Создайте файл server.js:
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в мой API!' });
});

app.listen(PORT, () => {
  console.log(\`Сервер запущен на порту \${PORT}\`);
});

Шаг 3: Организация структуры проекта
my-express-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── server.js
└── package.json

Шаг 4: Создание CRUD операций
Модель данных, контроллеры, маршруты — полный цикл создания API.

Лучшие практики:
1. Используйте переменные окружения (dotenv)
2. Валидация данных (Joi)
3. Версионирование API (/api/v1/posts)
4. Документация (Swagger)
5. Обработка ошибок
6. Rate limiting
7. CORS настройка

Заключение
Вы создали полноценное REST API на Express! Теперь вы умеете:
- Настраивать сервер Express
- Организовывать код в MVC структуре
- Создавать CRUD операции
- Добавлять middleware
- Обрабатывать ошибки
- Подключать базу данных

Полезные ресурсы:
- Официальная документация Express
- Node.js Best Practices
- Express с TypeScript

Теперь вы готовы создавать масштабируемые API на Express!`,
        isPublished: true,
        tagId: nodeTag.id,
        authorId: user.id,
      },
      {
        title: 'Tailwind CSS за 10 минут: Полное руководство для начинающих',
        content: `Что такое Tailwind CSS?
Tailwind CSS — это utility-first CSS фреймворк, который позволяет создавать дизайны прямо в HTML, используя готовые классы-утилиты.

Быстрый старт через CDN:
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1 class="text-3xl font-bold underline text-blue-600">Hello Tailwind!</h1>
</body>
</html>

Основные классы-утилиты:

Типографика:
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-4xl
text-red-500, text-blue-600, text-green-700
font-bold, font-semibold, italic, underline, line-through
text-left, text-center, text-right

Отступы:
p-4, pt-4, pr-4, pb-4, pl-4, px-4, py-4 (padding)
m-4, mt-4, mr-4, mb-4, ml-4, mx-auto (margin)

Фон и градиенты:
bg-red-500, bg-blue-100, bg-gray-800
bg-gradient-to-r from-blue-500 to-purple-500

Flexbox:
flex, justify-between, justify-center, items-center, gap-4, flex-col

Grid:
grid, grid-cols-3, gap-4, col-span-2

Адаптивный дизайн:
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
text-sm md:text-base lg:text-lg
hidden md:block

Интерактивные состояния:
hover:bg-blue-700, focus:outline-none, active:scale-95

Кастомизация (tailwind.config.js):
colors, spacing, animation, fontFamily, boxShadow

Заключение:
Что вы узнали за 10 минут:
1. Как установить Tailwind CSS
2. Основные классы-утилиты
3. Создание макетов с Flexbox и Grid
4. Готовые компоненты
5. Адаптивный дизайн
6. Интерактивные состояния
7. Кастомизация темы

Полезные ресурсы:
- Официальная документация
- Tailwind Playground
- Tailwind Components

Теперь вы готовы создавать красивые сайты с Tailwind CSS!`,
        isPublished: true,
        tagId: tailwindTag.id,
        authorId: user.id,
      },
      {
        title: 'Next.js 14: Что нового',
        content: `Введение
Next.js 14 — это значительное обновление React-фреймворка, которое фокусируется на стабильности и производительности.

1. Server Actions (стабильно)
Server Actions — это функции, которые выполняются на сервере и могут вызываться прямо из React-компонентов.

Пример:
'use server';
export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  await db.post.create({ title, content });
  revalidatePath('/posts');
  redirect('/posts');
}

2. Turbopack
Новый инструмент сборки, значительно ускоряет разработку.
Добавьте --turbo в скрипт dev: "dev": "next dev --turbo"

3. Partial Prerendering (экспериментально)
Позволяет комбинировать статический и динамический рендеринг на одной странице.

4. Улучшенное кэширование и ревалидация
Более гибкие инструменты для управления кэшем данных:
- revalidatePath
- revalidateTag
- fetch с next: { revalidate: 60 }

5. Middleware
Позволяет выполнять код до того, как запрос достигнет страницы.

Как обновиться до Next.js 14:
npm i next@latest react@latest react-dom@latest

Важные изменения:
- Node.js 16.x больше не поддерживается (нужен 18.17+)
- next export удалён (используйте output: 'export')
- @next/font удалён (перейдите на next/font)

Итог:
Ключевые изменения в Next.js 14:
1. Server Actions стали стабильными
2. Turbopack ускоряет разработку
3. Partial Prerendering (эксперимент)
4. Улучшенное кэширование

Обновление безопасное — нет критических breaking changes.`,
        isPublished: true,
        tagId: nextTag.id,
        authorId: user.id,
      },
      {
        title: 'Почему TypeScript лучше JavaScript',
        content: `Введение
TypeScript — это надмножество JavaScript, которое добавляет статическую типизацию. Весь JavaScript-код является валидным TypeScript-кодом, но TypeScript предоставляет дополнительные возможности, которые делают разработку более надёжной и предсказуемой.

1. Статическая типизация
JavaScript: function add(a, b) { return a + b; }
add("5", 10); // "510" - неожиданный результат

TypeScript: function add(a: number, b: number): number { return a + b; }
add("5", 10); // Ошибка на этапе написания кода

2. Автодополнение в редакторе кода
TypeScript подсказывает свойства объектов прямо в редакторе.

3. Защита от null и undefined
TypeScript не позволяет обращаться к свойствам null или undefined.

4. Рефакторинг становится безопасным
Переименование переменной в TypeScript обновляет все использования.

5. Документация кода
Типы служат живой документацией.

6. Работа с API и внешними данными
interface User {
  name: string;
  email: string;
  age?: number;
}

async function getUser(): Promise<User> { ... }

7. Union Types
type Input = string | number;

8. Generic Types
function getItem<T>(key: string): T | null { ... }

9. Readonly свойства
readonly apiUrl: string;

10. Utility Types
Partial<T>, Pick<T, K>, Omit<T, K>, Record<K, T>

Когда TypeScript необходим:
- Крупные проекты с 1000+ строк кода
- Проекты, которые будут развиваться годами
- Команда из нескольких разработчиков
- API клиенты и библиотеки
- Backend на Node.js
- React/Vue/Angular приложения

Итог:
TypeScript делает разработку более предсказуемой и безопасной. Ошибки обнаруживаются на этапе написания кода, код становится самодокументируемым, рефакторинг безопасен и быстр.`,
        isPublished: true,
        tagId: tsTag.id,
        authorId: user.id,
      },
      {
        title: 'Введение в JavaScript',
        content: `Что такое JavaScript

JavaScript — это язык программирования, который делает веб-страницы интерактивными. HTML отвечает за структуру страницы, CSS — за внешний вид, а JavaScript — за поведение: реакции на действия пользователя, изменение содержимого, анимации, отправку данных на сервер и многое другое.

Где выполняется JavaScript
1. В браузерах (Chrome, Firefox, Safari, Edge)
2. На сервере (Node.js)
3. В мобильных приложениях (React Native)
4. В десктопных приложениях (Electron)

Основы синтаксиса

Переменные:
let name = 'Иван';
const PI = 3.14159;

Типы данных:
let age = 25;           // число
let firstName = 'Иван'; // строка
let isActive = true;    // булево
let user = { name: 'Иван', age: 25 }; // объект
let colors = ['красный', 'зелёный', 'синий']; // массив

Операторы:
5 + 3, 10 - 4, 6 * 3, 15 / 3, 10 % 3, 2 ** 3
===, !==, >, <, >=, <=
&&, ||, !

Условные операторы:
if (age >= 18) {
  console.log('Совершеннолетний');
} else {
  console.log('Несовершеннолетний');
}

Циклы:
for (let i = 0; i < 5; i++) { ... }
while (count < 5) { ... }

Функции:
function greet(name) {
  return 'Привет, ' + name + '!';
}

const multiply = (a, b) => a * b;

Объекты и массивы:
const user = { name: 'Иван', age: 25 };
const numbers = [1, 2, 3, 4, 5];
numbers.push(6);
numbers.forEach(n => console.log(n));
const doubled = numbers.map(n => n * 2);

Асинхронность:
setTimeout(() => { ... }, 1000);
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

async function getData() {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
}

Заключение
JavaScript — это мощный и гибкий язык, который позволяет создавать интерактивные веб-приложения.`,
        isPublished: true,
        tagId: jsTag.id,
        authorId: user.id,
      },
    ];

    for (const post of postsData) {
      await prisma.post.create({
        data: post,
      });
    }
    console.log('Посты: 5 шт');
  }

  console.log('База данных заполнена!');
}

main()
  .catch((e) => {
    console.error('Ошибка:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());