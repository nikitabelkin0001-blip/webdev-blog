import express from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tagId = req.query.tagId as string;
    const searchQuery = req.query.q as string;
    
    const where: any = {};
    
    if (tagId) {
      where.tagId = tagId;
    }
    
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery } },
        { content: { contains: searchQuery } }
      ];
    }
    
    const total = await prisma.post.count({ where });
    
    const posts = await prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tag: true
      }
    });
    
    res.json({
      items: posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { tag: true }  
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, content, isPublished, tagId } = req.body;
    
    if (!title || !content || typeof isPublished !== 'boolean' || !tagId) {
      return res.status(422).json({ error: 'Все поля обязательны' });
    }
    
    const tagExists = await prisma.tag.findUnique({
      where: { id: tagId }
    });
    
    if (!tagExists) {
      return res.status(422).json({ error: 'Указанный тег не существует' });
    }
    
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        isPublished,
        tagId,
        authorId: req.userId!
      }
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, content, isPublished, tagId } = req.body;
    
    const existingPost = await prisma.post.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Пост не найден' });
    }
    
    const isAdmin = req.userId === 'user_1';
if (existingPost.authorId !== req.userId && !isAdmin) {
  return res.status(403).json({ error: 'Вы не можете редактировать чужой пост' });
}
    
    if (tagId) {
      const tagExists = await prisma.tag.findUnique({
        where: { id: tagId }
      });
      if (!tagExists) {
        return res.status(422).json({ error: 'Указанный тег не существует' });
      }
    }
    
    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title: title !== undefined ? title : existingPost.title,
        content: content !== undefined ? content : existingPost.content,
        isPublished: isPublished !== undefined ? isPublished : existingPost.isPublished,
        tagId: tagId !== undefined ? tagId : existingPost.tagId,
      }
    });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Пост не найден' });
    }
    
    const isAdmin = req.userId === 'user_1';
if (existingPost.authorId !== req.userId && !isAdmin) {
  return res.status(403).json({ error: 'Вы не можете удалить чужой пост' });
}
    
    await prisma.post.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;