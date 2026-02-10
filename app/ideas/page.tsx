'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import IdeaCard from '@/components/ideas/IdeaCard';
import Button from '@/components/common/Button';
import { useIdeas } from '@/hooks/useIdeas';

export default function Ideas() {
  const { ideas, loading, likeIdea } = useIdeas();
  const [filter, setFilter] = useState('all');

  const filteredIdeas = filter === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.category === filter);

  const categories = ['all', 'Technology', 'Agriculture', 'Healthcare', 'Education', 'Finance'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Explore Business Ideas</h1>
          <p className="text-text text-lg">Discover innovative ideas from young entrepreneurs worldwide</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              onClick={() => setFilter(cat)}
              variant={filter === cat ? 'secondary' : 'outline'}
              className={filter === cat ? '' : 'bg-white'}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-text">Loading ideas...</div>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-text mb-4">No ideas found</p>
            <Link href="/pitch" className="text-secondary hover:underline">
              Be the first to pitch an idea!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} onLike={likeIdea} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
