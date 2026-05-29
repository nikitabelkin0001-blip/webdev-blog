import express from 'express';
import { initializeStore, tags, posts, saveData } from './store/memoryStore';
import cors from 'cors';
import crypto from 'crypto';

// create server

const app = express();
const PORT = 4000;

// loading date or create testing
initializeStore();

app.use(cors({ origin: 'http://localhost:3000' })); // razreshaem front
app.use(express.json()); // pars js 

// receiv all tag

app.get('/api/tags', (req, res) => {
  res.json({
    items: tags, //mass tag
    total: tags.length, //skolko vsego
    page: 1,
    pages: 1,
  });
});

// create tag
app.post('/api/tags', (req, res) => {
  const { name, slug, description } = req.body;
  
  //check requeried fields 
  if (!name || !slug) {
    return res.status(422).json({ error: 'name и slug обязательны' });
  }
  
  // check unikalnost
  const existingTag = tags.find(t => t.name === name || t.slug === slug);
  if (existingTag) {
    return res.status(422).json({ error: 'Тег с таким name или slug уже существует' });
  }
  
  // create new tag
  const newTag = {
    id: crypto.randomUUID(), 
    name,
    slug,
    description: description || '', 
    createdAt: new Date().toISOString(),
  };
  
  tags.push(newTag);
  saveData(); // Сохраняем в файл
  res.status(201).json(newTag);
});

// poluchit one tag
app.get('/api/tags/:id', (req, res) => {
  const tag = tags.find(t => t.id === req.params.id);
  if (!tag) {
    return res.status(404).json({ error: 'Тег не найден' });
  }
  const tagPosts = posts.filter(p => p.tagId === tag.id);
  res.json({ ...tag, posts: tagPosts });
});

// update tag
app.patch('/api/tags/:id', (req, res) => {
  const tagIndex = tags.findIndex(t => t.id === req.params.id);
  if (tagIndex === -1) {
    return res.status(404).json({ error: 'Тег не найден' });
  }
  
  const { name, slug, description } = req.body;
  
  // chech unikalnost name if update
  if (name && name !== tags[tagIndex].name) {
    const existing = tags.find(t => t.name === name);
    if (existing) {
      return res.status(422).json({ error: 'Тег с таким name уже существует' });
    }
    tags[tagIndex].name = name;
  }
  
  // chech unikalnost slug if update
  if (slug && slug !== tags[tagIndex].slug) {
    const existing = tags.find(t => t.slug === slug);
    if (existing) {
      return res.status(422).json({ error: 'Тег с таким slug уже существует' });
    }
    tags[tagIndex].slug = slug;
  }
  
  // update opisanie
  if (description !== undefined) {
    tags[tagIndex].description = description;
  }
  
  saveData();
  res.json(tags[tagIndex]);
});

// delete tag
app.delete('/api/tags/:id', (req, res) => {
  const tagIndex = tags.findIndex(t => t.id === req.params.id);
  if (tagIndex === -1) {
    return res.status(404).json({ error: 'Тег не найден' });
  }
  
  // check posts with this tag 
  const hasPosts = posts.some(p => p.tagId === req.params.id);
  if (hasPosts) {
    return res.status(400).json({ error: 'Нельзя удалить тег, у которого есть посты' });
  }
  
  tags.splice(tagIndex, 1);
  saveData();
  res.status(204).send();
});

// poluchit all posts
app.get('/api/posts', (req, res) => {
  let filteredPosts = [...posts]; //copy mass 
  
  // filter po tag
  const tagId = req.query.tagId as string;
  if (tagId) {
    filteredPosts = filteredPosts.filter(p => p.tagId === tagId);
  }
  
  // search text 
  const query = req.query.q as string;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.content.toLowerCase().includes(lowerQuery)
    );
  }
  
  // paginacia
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const paginatedPosts = filteredPosts.slice(start, start + limit);
  
  const postsWithTag = paginatedPosts.map(post => ({
    ...post,
    tag: tags.find(t => t.id === post.tagId),
  }));
  
  res.json({
    items: postsWithTag,
    total: filteredPosts.length,
    page,
    pages: Math.ceil(filteredPosts.length / limit),
  });
});

// create new post
app.post('/api/posts', (req, res) => {
  const { title, content, isPublished, tagId } = req.body;
  
  // check requeried field
  if (!title || !content || typeof isPublished !== 'boolean' || !tagId) {
    return res.status(422).json({ error: 'Все поля обязательны' });
  }
  
  // check does it exist post
  const tagExists = tags.some(t => t.id === tagId);
  if (!tagExists) {
    return res.status(422).json({ error: 'Указанный тег не существует' });
  }
  
  const now = new Date().toISOString();
  const newPost = {
    id: crypto.randomUUID(),
    title,
    content,
    isPublished,
    publishedAt: isPublished ? now : undefined,
    tagId,
    createdAt: now,
    updatedAt: now,
  };
  
  posts.push(newPost);
  saveData();
  res.status(201).json(newPost);
});

// poluchit post po ID
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Пост не найден' });
  }
  const tag = tags.find(t => t.id === post.tagId);
  res.json({ ...post, tag });
});

// update post 
app.patch('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Пост не найден' });
  }
  
  const { title, content, isPublished, tagId } = req.body;
  
  if (title) posts[postIndex].title = title;
  if (content) posts[postIndex].content = content;
  
  if (typeof isPublished === 'boolean') {
    posts[postIndex].isPublished = isPublished;
    if (isPublished && !posts[postIndex].publishedAt) {
      posts[postIndex].publishedAt = new Date().toISOString();
    }
  }
  
  if (tagId) {
    const tagExists = tags.some(t => t.id === tagId);
    if (!tagExists) {
      return res.status(422).json({ error: 'Указанный тег не существует' });
    }
    posts[postIndex].tagId = tagId;
  }
  
  posts[postIndex].updatedAt = new Date().toISOString();
  saveData();
  res.json(posts[postIndex]);
});

// delete post 
app.delete('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Пост не найден' });
  }
  
  posts.splice(postIndex, 1);
  saveData();
  res.status(204).send();
});

// zapusk server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📋 Теги: http://localhost:${PORT}/api/tags`);
  console.log(`📝 Посты: http://localhost:${PORT}/api/posts`);
});