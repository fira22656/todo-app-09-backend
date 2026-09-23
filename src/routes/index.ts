import { Router } from 'express';
import todoRoutes from './todoRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Sub-routes yang didaftarkan di bawah prefix /api
router.use('/todos', todoRoutes);
router.use('/auth', authRoutes);

export default router;