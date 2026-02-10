import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/User.model';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_secret_key';
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

/*
  helper to create JWT
*/
const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

/*
================================================
REGISTER
================================================
*/
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const cleanEmail = email.toLowerCase().trim();

    // check existing
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    /*
      ✅ MAKE ONLY YOU ADMIN
      change this email to yours
    */
    const finalRole =
      cleanEmail === 'silvananjeru25@gmail.com'
        ? 'admin'
        : role || 'entrepreneur';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: finalRole,
    });

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/*
================================================
LOGIN
================================================
*/
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/*
================================================
GET CURRENT USER
================================================
*/
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

