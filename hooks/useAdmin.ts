'use client';

export function useAdmin() {
  if (typeof window === 'undefined') return false;

  const userStr = localStorage.getItem('user');
  if (!userStr) return false;

  const user = JSON.parse(userStr);

  return user.role === 'admin';
}
