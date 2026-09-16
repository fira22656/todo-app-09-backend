import { Request, Response, NextFunction } from 'express';

export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { task, is_completed } = req.body;
  
  if (task === undefined || is_completed === undefined) {
    res.status(400).json({ success: false, message: 'Task dan status completion harus diisi.' });
    return;
  }
  
  next();
};