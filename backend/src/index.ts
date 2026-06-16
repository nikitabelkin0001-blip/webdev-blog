import express from 'express';
import cors from 'cors';
import tagsRouter from './routes/tags';
import postsRouter from './routes/posts';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin ||
      origin.includes('vercel.app') ||
      origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/tags', tagsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Backend is running!',
    status: 'ok',
    endpoints: ['/api/tags', '/api/posts', '/api/auth']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Tags: http://localhost:${PORT}/api/tags`);
  console.log(`Posts: http://localhost:${PORT}/api/posts`);
  console.log(`Auth: http://localhost:${PORT}/api/auth`);
});