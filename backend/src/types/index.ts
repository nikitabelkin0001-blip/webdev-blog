// Типы данных для нашего приложения

// Тег — категория для постов
export interface Tag {
  id: string;           // Уникальный идентификатор (UUID)
  name: string;         // Название тега (обязательное)
  slug: string;         // URL-дружественное имя (например "javascript")
  description?: string; // Описание (необязательное, знак ?)
  createdAt: string;    // Дата создания
}

// Пост — статья в блоге
export interface Post {
  id: string;           // Уникальный идентификатор
  title: string;        // Заголовок (обязательное)
  content: string;      // Содержание (обязательное)
  isPublished: boolean; // Опубликован или черновик
  publishedAt?: string; // Дата публикации (если опубликован)
  tagId: string;        // ID тега (связь с тегом)
  createdAt: string;    // Дата создания
  updatedAt: string;    // Дата последнего обновления
}

// Пост с вложенным тегом (удобно для фронтенда)
export interface PostWithTag extends Post {
  tag?: Tag;
}

// Тег с вложенными постами
export interface TagWithPosts extends Tag {
  posts: Post[];
}

// Ответ API с пагинацией
export interface ApiResponse<T> {
  items: T[];      // Массив записей
  total: number;   // Всего записей
  page: number;    // Текущая страница
  pages: number;   // Всего страниц
}