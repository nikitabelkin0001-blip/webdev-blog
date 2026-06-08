import express from 'express';
import prisma from '../db/prisma';
import crypto from 'crypto';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: 'desc' }  // Сортируем: новые теги сверху
    });

    res.json({
      items: tags,
      total: tags.length,
      page: 1,
      pages: 1
    });
  } catch (error) {
    console.error('Ошибка при получении тегов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: req.params.id },
      include: { posts: true }  // Включаем посты этого тега
    });
    
    if (!tag) {
      return res.status(404).json({ error: 'Тег не найден' });
    }
    
    res.json(tag);
  } catch (error) {
    console.error('Ошибка при получении тега:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    
    if (!name || !slug) {
      return res.status(422).json({ error: 'name и slug обязательны' });
    }
    
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: name },
          { slug: slug }
        ]
      }
    });
    
    if (existingTag) {
      return res.status(422).json({ error: 'Тег с таким name или slug уже существует' });
    }
    
    const newTag = await prisma.tag.create({
      data: {
        name,
        slug,
        description: description || '',
        createdAt: new Date().toISOString()
      }
    });
    
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Ошибка при создании тега:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    
    const existingTag = await prisma.tag.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingTag) {
      return res.status(404).json({ error: 'Тег не найден' });
    }
    
    if (name && name !== existingTag.name) {
      const nameExists = await prisma.tag.findFirst({
        where: { name: name }
      });
      if (nameExists) {
        return res.status(422).json({ error: 'Тег с таким name уже существует' });
      }
    }
    
    if (slug && slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findFirst({
        where: { slug: slug }
      });
      if (slugExists) {
        return res.status(422).json({ error: 'Тег с таким slug уже существует' });
      }
    }
    
    const updatedTag = await prisma.tag.update({
      where: { id: req.params.id },
      data: {
        name: name || existingTag.name,
        slug: slug || existingTag.slug,
        description: description !== undefined ? description : existingTag.description
      }
    });
    
    res.json(updatedTag);
  } catch (error) {
    console.error('Ошибка при обновлении тега:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const postsWithTag = await prisma.post.findMany({
      where: { tagId: req.params.id }
    });
    
    if (postsWithTag.length > 0) {
      return res.status(400).json({ error: 'Нельзя удалить тег, у которого есть посты' });
    }
    
    await prisma.tag.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении тега:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;