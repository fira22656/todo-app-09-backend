import express, { Request, Response, NextFunction } from 'express';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

// Main Routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler Middleware (Untuk menangkap endpoint yang tidak ada)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan!`
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Terjadi error:', err.message);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
});

export default app;