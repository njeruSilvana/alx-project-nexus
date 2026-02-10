
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type so we can attach "userId" to it
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Get the token from the Authorization header
    //    Header looks like: "Bearer eyJhbG..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided or invalid format' });
      return;
    }

    // 2. Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key') as {
      id: string;
      role: string;
    };

    // 4. Attach the user ID and role to the request object
    //    so the next controller can use req.userId
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // 5. Move to the next middleware or controller
    next();

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token has expired. Please login again.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token. Please login again.' });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
};

// Optional: Use this on routes where login is OPTIONAL
// (e.g., browsing ideas — logged in users get extra features)
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key') as {
        id: string;
        role: string;
      };
      req.userId = decoded.id;
      req.userRole = decoded.role;
    }

    // Always continue — whether or not token exists
    next();
  } catch {
    // If token is bad, just continue without user info
    next();
  }
};