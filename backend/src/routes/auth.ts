import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { UserModel } from '../models/User.js';
import { config } from '../config/env.js';

export const authRoutes = express.Router();

authRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      name,
      role = 'user',
    }: { email: string; password: string; name: string; role?: string } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password, name шаардлагатай' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Нууц үг 6-аас дээш тэмдэгт байх ёстой' });
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Энэ и-мэйл аль хэдийн бүртгэлтэй байна' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await new UserModel({
      _id: `user-${randomUUID()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      isVerified: role === 'user',
      status: 'active',
    }).save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as object
    );

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Бүртгэл амжилтгүй боллоо' });
  }
});

authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'И-мэйл болон нууц үг оруулна уу' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'И-мэйл эсвэл нууц үг буруу байна' });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ error: `Таны бүртгэл ${user.status} болсон байна` });
    }

    const validPassword = await bcrypt.compare(password, String(user.passwordHash || ''));
    if (!validPassword) {
      return res.status(401).json({ error: 'И-мэйл эсвэл нууц үг буруу байна' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as object
    );

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Нэвтрэх үйлдэл амжилтгүй боллоо' });
  }
});

authRoutes.post('/verify', (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ valid: false, error: 'Token олдсонгүй' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false, error: 'Token буруу байна' });
  }
});

export default authRoutes;
