// server/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.config';
import authRoutes from './routes/auth.routes';
import ideasRoutes from './routes/ideas.routes';
import connectionsRoutes from './routes/connections.routes';
import usersRoutes from './routes/users.routes';
import { errorHandler } from './middleware/error.middleware';

// 1. Load environment variables from .env file
dotenv.config();

// 2. Create express app
const app = express();
const PORT = Number(process.env.PORT) || 5000; 

// ─────────────────────────────────────────────
// 3. MIDDLEWARE (runs before every request)
// ─────────────────────────────────────────────

// Allow requests from frontend (localhost:3000)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies (e.g., req.body)
app.use(express.json());

// Log every incoming request (helpful during development)
app.use((req, res, next) => {
  console.log(`  📨  ${req.method} ${req.url}`);
  next();
});

// ─────────────────────────────────────────────
// 4. CONNECT TO MONGODB
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// 5. ROUTES
// ─────────────────────────────────────────────

// Auth routes:        POST /api/auth/register | POST /api/auth/login | GET /api/auth/me
app.use('/api/auth', authRoutes);

// Ideas routes:       GET  /api/ideas | POST /api/ideas | POST /api/ideas/:id/like
app.use('/api/ideas', ideasRoutes);

// Connection routes:  GET  /api/connections/:userId | POST /api/connections
app.use('/api/connections', connectionsRoutes);

// User routes:        GET  /api/users/mentors | GET /api/users/investors
app.use('/api/users', usersRoutes);

// ─────────────────────────────────────────────
// 6. HEALTH CHECK (use this to test if server is alive)
//    Open browser → http://localhost:5000/health
// ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'YEN Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// 7. GLOBAL ERROR HANDLER (must be LAST)
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// 8. START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🚀  YEN Server Started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  🌐  URL      : http://localhost:${PORT}`);
  console.log(`  🏥  Health   : http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  📍  Available Routes:');
  console.log(`      POST  /api/auth/register`);
  console.log(`      POST  /api/auth/login`);
  console.log(`      GET   /api/auth/me`);
  console.log(`      GET   /api/ideas`);
  console.log(`      POST  /api/ideas`);
  console.log(`      POST  /api/ideas/:id/like`);
  console.log(`      POST  /api/ideas/:id/fund`);
  console.log(`      GET   /api/connections/:userId`);
  console.log(`      POST  /api/connections`);
  console.log(`      GET   /api/users/mentors`);
  console.log(`      GET   /api/users/investors`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
})