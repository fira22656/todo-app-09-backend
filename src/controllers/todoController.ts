import { Request, Response } from 'express';
import { todoModel } from '../models/todoModel';

// Ambil semua todo milik user
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const todos = await todoModel.getByUserId(userId);
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
  }
};

// Ambil 1 todo berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;
    const todos = await todoModel.getByUserId(userId);
    const todo = todos.find((item: any) => item.id === Number(id));

    if (!todo) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
      return;
    }

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
  }
};

// Tambah todo baru
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { task } = req.body;
    if (!task) {
      res.status(400).json({ success: false, message: 'Task tidak boleh kosong.' });
      return;
    }

    const id = await todoModel.create(task, userId);
    res.status(201).json({ success: true, message: 'Tugas berhasil ditambahkan!', data: { id, task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan tugas.' });
  }
};

// Update todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;
    const { task, is_completed } = req.body;

    const affectedRows = await todoModel.update(Number(id), task, is_completed, userId);
    if (affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Tugas berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui tugas.' });
  }
};

// Hapus todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;

    const affectedRows = await todoModel.delete(Number(id), userId);
    if (affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Tugas berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus tugas.' });
  }
};