import db from '../config/db';

export const findUserByUsernameOrEmail = async (username: string, email: string) => {
  const [rows]: any = await db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email]
  );
  return rows[0];
};

export const createUser = async (username: string, email: string, passwordHash: string) => {
  const [result] = await db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );
  return result;
};