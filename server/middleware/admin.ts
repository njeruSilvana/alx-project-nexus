import { Request, Response, NextFunction } from 'express';

/*
  Allows ONLY admin users
*/
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Admins only',
    });
  }

  next();
};
