
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';


export default function Pitch() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    fundingGoal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('Please login to pitch an idea');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          fundingGoal: parseFloat(formData.fundingGoal)
        })
      });

      if (response.ok) {
        alert('Your idea has been submitted successfully!');
        router.push('/ideas');
      } else {
        setError('Failed to submit idea');
      }
    } catch (err) {
      setError('Connection error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-primary text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">YEN</Link>
          <div className="space-x-6">
            <Link href="/dashboard" className="hover:text-secondary transition">Dashboard</Link>
            <Link href="/ideas" className="hover:text-secondary transition">Browse Ideas</Link>
            <Link href="/mentors" className="hover:text-secondary transition">Mentors</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Pitch Your Idea</h1>
            <p className="text-text">Share your innovative business concept with investors and mentors</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text font-semibold mb-2">Idea Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="e.g., Mobile App for Local Farmers"
              />
            </div>

            <div>
              <label className="block text-text font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="Technology">Technology</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Sustainability">Sustainability</option>
              </select>
            </div>

            <div>
              <label className="block text-text font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Describe your business idea, target market, unique value proposition, and how it solves a problem..."
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 100 characters</p>
            </div>

            <div>
              <label className="block text-text font-semibold mb-2">Funding Goal (USD) *</label>
              <input
                type="number"
                name="fundingGoal"
                value={formData.fundingGoal}
                onChange={handleChange}
                required
                min="100"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="e.g., 50000"
              />
              <p className="text-sm text-gray-500 mt-1">How much funding do you need to get started?</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <h3 className="font-semibold text-primary mb-2">Tips for a Great Pitch</h3>
              <ul className="text-sm text-text space-y-1 list-disc list-inside">
                <li>Be clear and concise about the problem you're solving</li>
                <li>Explain your unique solution and competitive advantage</li>
                <li>Include market research and potential impact</li>
                <li>Be realistic about funding needs and timeline</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-highlight text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Pitch'}
              </button>
              <Link
                href="/ideas"
                className="flex-1 bg-gray-200 text-text py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}