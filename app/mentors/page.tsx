// app/mentors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

interface Mentor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [investors, setInvestors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mentors' | 'investors'>('mentors');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorsRes, investorsRes] = await Promise.all([
        fetch('http://localhost:5000/api/mentors'),
        fetch('http://localhost:5000/api/investors')
      ]);

      const mentorsData = await mentorsRes.json();
      const investorsData = await investorsRes.json();

      setMentors(mentorsData);
      setInvestors(investorsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (targetUserId: string, type: 'mentor' | 'investor') => {
    if (!user) {
      alert('Please login to connect with mentors and investors');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: user.id,
          toUserId: targetUserId,
          type
        })
      });

      if (response.ok) {
        alert('Connection request sent!');
      }
    } catch (err) {
      console.error('Error connecting:', err);
    }
  };

  const displayList = activeTab === 'mentors' ? mentors : investors;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-primary text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">YEN</Link>
          <div className="space-x-6">
            <Link href="/dashboard" className="hover:text-secondary transition">Dashboard</Link>
            <Link href="/ideas" className="hover:text-secondary transition">Browse Ideas</Link>
            <Link href="/pitch" className="bg-highlight px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
              Pitch Idea
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Connect with Experts</h1>
          <p className="text-text text-lg">Find experienced mentors and investors to guide your journey</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'mentors'
                ? 'bg-secondary text-white'
                : 'bg-white text-text hover:bg-gray-100'
            }`}
          >
            Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveTab('investors')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'investors'
                ? 'bg-secondary text-white'
                : 'bg-white text-text hover:bg-gray-100'
            }`}
          >
            Investors ({investors.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-text">Loading...</div>
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-text mb-4">
              No {activeTab} available yet
            </p>
            <Link href="/register" className="text-secondary hover:underline">
              Be the first to join as a {activeTab === 'mentors' ? 'mentor' : 'investor'}!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map(person => (
              <div key={person.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-primary">{person.name}</h3>
                    <span className="text-sm text-secondary capitalize">{person.role}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-text text-sm mb-2">
                    📧 {person.email}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-gray-100 text-text text-xs px-2 py-1 rounded">
                      {activeTab === 'mentors' ? 'Business Strategy' : 'Angel Investor'}
                    </span>
                    <span className="bg-gray-100 text-text text-xs px-2 py-1 rounded">
                      {activeTab === 'mentors' ? '5+ Years Experience' : '$50K - $500K'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleConnect(person.id, activeTab === 'mentors' ? 'mentor' : 'investor')}
                  className="w-full bg-highlight text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Become a {activeTab === 'mentors' ? 'Mentor' : 'Investor'}?</h2>
          <p className="mb-6">
            Share your expertise and help young entrepreneurs succeed
          </p>
          <Link
            href="/register"
            className="bg-highlight px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition inline-block"
          >
            Join as {activeTab === 'mentors' ? 'Mentor' : 'Investor'}
          </Link>
        </div>
      </div>
    </div>
  );
}