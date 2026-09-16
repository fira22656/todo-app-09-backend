import pool from '../config/db';

export const todoModel = {
  // Ambil semua todo milik user berdasarkan userId
  getByUserId: async (userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT * FROM todos WHERE user_id = ?',
      [userId]
    );
    return rows;
  },

  // Ambil 1 todo berdasarkan id dan userId (Langkah 10a)
  getById: async (id: number, userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0]; // Kembalikan 1 data, atau undefined jika tidak ditemukan
  },

  // Tambah todo baru
  create: async (task: string, userId: number) => {
    const [result]: any = await pool.query(
      'INSERT INTO todos (task, user_id) VALUES (?, ?)',
      [task, userId]
    );
    return result.insertId;
  },

  // Update task atau status is_completed
  update: async (id: number, task: string, isCompleted: boolean, userId: number) => {
    const [result]: any = await pool.query(
      'UPDATE todos SET task = ?, is_completed = ? WHERE id = ? AND user_id = ?',
      [task, isCompleted, id, userId]
    );
    return result.affectedRows;
  },

  // Hapus todo berdasarkan id dan userId
  delete: async (id: number, userId: number) => {
    const [result]: any = await pool.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows;
  }
};