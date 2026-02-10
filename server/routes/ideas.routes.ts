// Base path: /api/ideas

import express from 'express';
import {
  getAllIdeas,
  getIdeaById,
  createIdea,
  likeIdea,
  fundIdea,
  getIdeasByUser,
} from '../controllers/ideas.controller';
import { validateIdea, validateFunding } from '../middleware/validation.middleware';
import { verifyToken, optionalAuth } from '../middleware/auth.middleware';

const router = express.Router();

// GET  /api/ideas          — open (anyone can browse)
router.get('/', getAllIdeas);

// GET  /api/ideas/:id      — open (anyone can view details)
router.get('/:id', getIdeaById);

// GET  /api/ideas/user/:userId — open (view a user's ideas)
router.get('/user/:userId', getIdeasByUser);

// POST /api/ideas          — protected (must be logged in to pitch)
router.post('/', verifyToken, validateIdea, createIdea);

// POST /api/ideas/:id/like — protected (must be logged in to like)
router.post('/:id/like', verifyToken, likeIdea);

// POST /api/ideas/:id/fund — protected (must be logged in to fund)
router.post('/:id/fund', verifyToken, validateFunding, fundIdea);

export default router;