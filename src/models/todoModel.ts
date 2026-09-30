import pool from '../config/db';

export const todoModel = {
  // Perbarui getByUserId untuk mendukung pagination
  getByUserId: async (userId: number, limit: number, offset: number) => {
    const [rows]: any = await pool.query(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows;
  },

  // Method baru untuk menghitung total todo milik user (untuk pagination)
  countByUserId: async (userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT COUNT(*) AS total FROM todos WHERE user_id = ?',
      [userId]
    );
    return rows[0].total as number;
  },

  // Ambil 1 todo berdasarkan id dan userId
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

  // Update task atau status is_completed secara dinamis
  update: async (
    id: number,
    task: string | undefined,
    isCompleted: boolean | undefined,
    userId: number
  ) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (task !== undefined) {
      fields.push('task = ?');
      values.push(task);
    }
    if (isCompleted !== undefined) {
      fields.push('is_completed = ?');
      values.push(isCompleted);
    }

    if (fields.length === 0) return 0;

    values.push(id, userId);

    const [result]: any = await pool.query(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
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