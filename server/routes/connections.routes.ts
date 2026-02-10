// Base path: /api/connections
// ============================================================
import express from 'express';
import {
  getConnections,
  createConnection,
  acceptConnection,
  rejectConnection,
} from '../controllers/connections.controller';
import { validateConnection } from '../middleware/validation.middleware';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// GET    /api/connections/:userId — protected (view own connections)
router.get('/:userId', verifyToken, getConnections);

// POST   /api/connections          — protected (send request)
router.post('/', verifyToken, validateConnection, createConnection);

// PATCH  /api/connections/:id/accept — protected (accept request)
router.patch('/:id/accept', verifyToken, acceptConnection);

// PATCH  /api/connections/:id/reject — protected (reject request)
router.patch('/:id/reject', verifyToken, rejectConnection);

export default router;

