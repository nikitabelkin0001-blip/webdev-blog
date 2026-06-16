export interface Tag {
  id: string;           // уникальный идентификатор
  name: string;         // название (обязательное)
  slug: string;         // url-дружественное имя
  description?: string; // описание (необязательное)
  createdAt: string;    // дата создания
  authorId?: string;    // Автор тега
  author?: {
    id: string;
    name: string;
    email: string;
  }
}

export interface Post {
  id: string;           // уникальный идентификатор
  title: string;        // заголовок (обязательный)
  content: string;      // содержание (обязательное)
  isPublished: boolean; // опубликован или черновик
  publishedAt?: string; // дата публикации (если опубликован)
  tagId: string;        // id тега (связь с тегом)
  authorId: string;     // id автора (связь с пользователем)
  createdAt: string;    // дата создания
  updatedAt: string;    // дата обновления
}

export interface PostWithTag extends Post {
  tag?: Tag;
}

export interface TagWithPosts extends Tag {
  posts: Post[];
}

export interface ApiResponse<T> {
  items: T[];      // массив записей
  total: number;   // всего записей
  page: number;    // текущая страница
  pages: number;   // всего страниц
}