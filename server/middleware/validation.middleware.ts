
import { Request, Response, NextFunction } from 'express';

// ---------- Registration Validation ----------
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password, role } = req.body;
  const errors: string[] = [];

  // Name checks
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.trim().length > 50) {
    errors.push('Name must be at most 50 characters');
  }

  // Email checks
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please provide a valid email address');
    }
  }

  // Password checks
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 100) {
    errors.push('Password is too long');
  }

  // Role checks
  if (!role) {
    errors.push('Role is required');
  } else {
    const validRoles = ['entrepreneur', 'investor', 'mentor'];
    if (!validRoles.includes(role)) {
      errors.push('Role must be entrepreneur, investor, or mentor');
    }
  }

  // If errors exist, stop and return them
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

// ---------- Login Validation ----------
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

// ---------- Idea Validation ----------
export const validateIdea = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, category, fundingGoal } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  } else if (title.trim().length > 100) {
    errors.push('Title must be at most 100 characters');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required');
  } else if (description.trim().length < 50) {
    errors.push('Description must be at least 50 characters');
  }

  const validCategories = ['Technology', 'Agriculture', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Sustainability'];
  if (!category) {
    errors.push('Category is required');
  } else if (!validCategories.includes(category)) {
    errors.push('Please select a valid category');
  }

  if (fundingGoal === undefined || fundingGoal === null) {
    errors.push('Funding goal is required');
  } else if (typeof fundingGoal !== 'number' || isNaN(fundingGoal)) {
    errors.push('Funding goal must be a number');
  } else if (fundingGoal < 100) {
    errors.push('Funding goal must be at least $100');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

// ---------- Connection Validation ----------
export const validateConnection = (req: Request, res: Response, next: NextFunction): void => {
  const { toUserId, type } = req.body;
  const errors: string[] = [];

  if (!toUserId) {
    errors.push('Target user ID is required');
  }

  const validTypes = ['mentor', 'investor', 'partner'];
  if (!type) {
    errors.push('Connection type is required');
  } else if (!validTypes.includes(type)) {
    errors.push('Type must be mentor, investor, or partner');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

// ---------- Fund Idea Validation ----------
export const validateFunding = (req: Request, res: Response, next: NextFunction): void => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    res.status(400).json({ errors: ['Amount is required'] });
    return;
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    res.status(400).json({ errors: ['Amount must be a number'] });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({ errors: ['Amount must be greater than 0'] });
    return;
  }

  next();
};