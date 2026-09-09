import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsernameOrEmail } from '../models/userModel';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, dan password wajib diisi!' 
      });
    }

    const existingUser = await findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username atau Email sudah terdaftar!' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, email, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil!"
    });
  } catch (error: any) {
    console.error("Error Registrasi:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Terjadi kesalahan server"
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByUsernameOrEmail(username, username);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username atau password salah!' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username atau password salah!' 
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      token
    });
  } catch (error: any) {
    console.error("Error Login:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Terjadi kesalahan server"
    });
  }
};