import express from 'express';
import cors from 'cors';
import tagRoutes from './routes/tags';
import postRoutes from './routes/posts';

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/tags', tagRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📋 Теги: http://localhost:${PORT}/api/tags`);
  console.log(`📝 Посты: http://localhost:${PORT}/api/posts`);
});