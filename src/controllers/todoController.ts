import type { Request, Response } from 'express';
import type { CreateTodoRequest, UpdateTodoRequest, TodoResponse, TodoRow } from '../types/todo';
import type { PaginationMeta } from '../types/common';
import { sendSuccess, sendSuccessPagination, sendError } from '../utils/response';
import { todoModel } from '../models/todoModel';

// Helper untuk parsing integer positif pada query pagination
const parsePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

// Ambil semua todo milik user dengan Pagination
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = res.locals.userId || (req as any).user?.id;
  const page = parsePositiveInt(req.query.page, 1);
  const perPage = Math.min(parsePositiveInt(req.query.perPage, 10), 50);
  const offset = (page - 1) * perPage;

  try {
    const [todos, total] = await Promise.all([
      todoModel.getByUserId(userId, perPage, offset),
      todoModel.countByUserId(userId)
    ]);

    const data: TodoResponse[] = (todos as TodoRow[]).map(({ id, task, is_completed }) => ({
      id,
      todo: task,
      completed: Boolean(is_completed)
    }));

    const pagination: PaginationMeta = {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage)
    };

    sendSuccessPagination(res, 'Berhasil!', data, pagination);
  } catch (error) {
    console.error(error);
    sendError(res, 'Gagal mengambil data.', 500);
  }
};

// Ambil 1 todo berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = res.locals.userId || (req as any).user?.id;

  try {
    const todo = await todoModel.getById(Number(id), userId);

    if (!todo) {
      sendError(res, 'Tugas tidak ditemukan!', 404);
      return;
    }

    const row = todo as TodoRow;
    const data: TodoResponse = {
      id: row.id,
      todo: row.task,
      completed: Boolean(row.is_completed)
    };

    sendSuccess(res, 'Berhasil!', data);
  } catch (error) {
    console.error(error);
    sendError(res, 'Gagal mengambil data.', 500);
  }
};

// Tambah todo baru
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const payload: CreateTodoRequest = req.body;
  const userId = res.locals.userId || (req as any).user?.id;

  try {
    const newId = await todoModel.create(payload.task, userId);
    
    const data: TodoResponse = {
      id: newId,
      todo: payload.task,
      completed: false
    };

    sendSuccess(res, 'Tugas berhasil ditambahkan!', data, 201);
  } catch (error) {
    console.error(error);
    sendError(res, 'Gagal menambahkan tugas.', 500);
  }
};

// Update todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const payload: UpdateTodoRequest = req.body;
  const userId = res.locals.userId || (req as any).user?.id;

  try {
    // Menggunakan payload.is_completed sesuai interface UpdateTodoRequest
    const completedValue = payload.is_completed ?? (payload as any).completed;
    const affectedRows = await todoModel.update(Number(id), payload.task, completedValue, userId);
    
    if (affectedRows === 0) {
      sendError(res, 'Tugas tidak ditemukan.', 404);
      return;
    }

    sendSuccess(res, 'Tugas berhasil diperbarui!');
  } catch (error) {
    console.error(error);
    sendError(res, 'Gagal memperbarui tugas.', 500);
  }
};

// Hapus todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = res.locals.userId || (req as any).user?.id;

  try {
    const affectedRows = await todoModel.delete(Number(id), userId);
    
    if (affectedRows === 0) {
      sendError(res, 'Tugas tidak ditemukan.', 404);
      return;
    }

    sendSuccess(res, 'Tugas berhasil dihapus!');
  } catch (error) {
    console.error(error);
    sendError(res, 'Gagal menghapus tugas.', 500);
  }
};