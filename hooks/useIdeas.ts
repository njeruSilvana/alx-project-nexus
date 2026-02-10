'use client';

import { useState, useEffect } from 'react';
import { ideasAPI } from '@/lib/api';
import { Idea } from '@/types/idea.types';

export function useIdeas(userId?: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = userId 
        ? await ideasAPI.getByUserId(userId)
        : await ideasAPI.getAll();

      if (response.success && response.data) {
        setIdeas(response.data);
      } else {
        setError(response.error || 'Failed to fetch ideas');
      }
    } catch (err) {
      setError('An error occurred while fetching ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [userId]);

  const likeIdea = async (id: string) => {
    const response = await ideasAPI.like(id);
    if (response.success) {
      fetchIdeas(); // Refresh ideas
    }
  };

  const fundIdea = async (id: string, amount: number) => {
    const response = await ideasAPI.fund(id, amount);
    if (response.success) {
      fetchIdeas(); // Refresh ideas
    }
    return response;
  };

  return {
    ideas,
    loading,
    error,
    likeIdea,
    fundIdea,
    refetch: fetchIdeas,
  };
}