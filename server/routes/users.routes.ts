//Base path: /api/users
// ============================================================
import express from 'express';
import { getMentors, getInvestors, getUserById, updateProfile } from '../controllers/users.controllers';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// GET  /api/users/mentors   — open (anyone can browse mentors)
router.get('/mentors', getMentors);

// GET  /api/users/investors — open (anyone can browse investors)
router.get('/investors', getInvestors);

// GET  /api/users/:id       — open (view any user profile)
router.get('/:id', getUserById);

// PUT  /api/users/profile   — protected (update own profile)
router.put('/profile', verifyToken, updateProfile);

export default router;