import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Akses ditolak, token tidak ditemukan!' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { id: number };
    res.locals.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token tidak valid atau kadaluwarsa!' });
  }
};