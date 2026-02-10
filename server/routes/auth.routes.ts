// Base path: /api/auth

import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validation.middleware';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/auth/register  — open (no login needed)
router.post('/register', validateRegister, register);

// POST /api/auth/login     — open (no login needed)
router.post('/login', validateLogin, login);

// GET  /api/auth/me        — protected (must be logged in)
router.get('/me', verifyToken, getMe);

export default router;