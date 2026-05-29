import { Tag, Post } from '../types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '..', '..', 'data.json');

//Для хранения данных в памяти

export let tags: Tag[] = [];
export let posts: Post[] = [];

//Загрузка данных из файла

function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      tags = data.tags || [];
      posts = data.posts || [];
      console.log('📂 Данные загружены из data.json');
    }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
  }
}

// Сохранение данных в файл
export function saveData() {
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ tags, posts }, null, 2));
    console.log('💾 Данные сохранены в data.json');
  } catch (err) {
    console.error('Ошибка сохранения данных:', err);
  }
}

// Заполнение тестовыми данными
export function initializeStore() {
  loadData();
  
  if (tags.length === 0 && posts.length === 0) {
    console.log('🔄 Заполняем тестовыми данными...');
    
    //Теги

    const tag1: Tag = {
      id: uuidv4(),
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Язык программирования для веба',
      createdAt: new Date().toISOString(),
    };
    const tag2: Tag = {
      id: uuidv4(),
      name: 'TypeScript',
      slug: 'typescript',
      description: 'Типизированный JavaScript',
      createdAt: new Date().toISOString(),
    };
    const tag3: Tag = {
      id: uuidv4(),
      name: 'Next.js',
      slug: 'nextjs',
      description: 'React-фреймворк',
      createdAt: new Date().toISOString(),
    };
    const tag4: Tag = {
      id: uuidv4(),
      name: 'Tailwind CSS',
      slug: 'tailwind',
      description: 'Утилитарный CSS',
      createdAt: new Date().toISOString(),
    };
    const tag5: Tag = {
      id: uuidv4(),
      name: 'Node.js',
      slug: 'nodejs',
      description: 'Серверный JavaScript',
      createdAt: new Date().toISOString(),
    };
    
    tags = [tag1, tag2, tag3, tag4, tag5];

    /// Постя
    
    const now = new Date().toISOString();
    posts = [
      {
        id: uuidv4(),
        title: 'Введение в JavaScript',
        content: 'JavaScript — это язык программирования, который работает в браузере и на сервере. Он позволяет создавать интерактивные веб-страницы.',
        isPublished: true,
        publishedAt: now,
        tagId: tag1.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Почему TypeScript лучше JavaScript',
        content: 'TypeScript добавляет статическую типизацию, что помогает ловить ошибки на этапе разработки, а не в рантайме.',
        isPublished: true,
        publishedAt: now,
        tagId: tag2.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Next.js 14: Что нового',
        content: 'App Router, Server Components, улучшенная производительность и новый рендеринг.',
        isPublished: false,
        tagId: tag3.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Tailwind CSS за 10 минут',
        content: 'Утилитарные классы позволяют верстать без отрыва от HTML и без написания CSS-файлов.',
        isPublished: true,
        publishedAt: now,
        tagId: tag4.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Создаём API на Express',
        content: 'Express — минималистичный веб-фреймворк для Node.js. Позволяет быстро создать REST API.',
        isPublished: true,
        publishedAt: now,
        tagId: tag5.id,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    saveData();
  }
}