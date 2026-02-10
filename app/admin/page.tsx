'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import Card from '@/components/common/Card';

import { useAuth } from '@/hooks/useAuth';
import { useIdeas } from '@/hooks/useIdeas';
import { useConnections } from '@/hooks/useConnections';

/*
  👑 ADMIN DASHBOARD
  Only visible if user.role === 'admin'
*/

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // load global stats (admin sees everything)
  const { ideas } = useIdeas(undefined); // all ideas
  const { connections } = useConnections(null);

  /*
    🔒 protect route
  */
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) router.push('/login');
      if (user?.role !== 'admin') router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2"> Admin Control Panel</h1>
          <p className="text-lg opacity-90">
            Full system access • Manage platform • Monitor activity
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card>
            <div className="text-3xl font-bold text-secondary mb-2">
              {ideas?.length || 0}
            </div>
            <div>Total Ideas</div>
          </Card>

          <Card>
            <div className="text-3xl font-bold text-secondary mb-2">
              {connections?.length || 0}
            </div>
            <div>Total Connections</div>
          </Card>

          <Card>
            <div className="text-3xl font-bold text-secondary mb-2">
              {ideas?.reduce((sum, i) => sum + i.likes, 0) || 0}
            </div>
            <div>Total Likes</div>
          </Card>

          <Card>
            <div className="text-3xl font-bold text-red-500 mb-2">ADMIN</div>
            <div>Access Level</div>
          </Card>
        </div>

        {/* ================= ADMIN TOOLS ================= */}
        <Card className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">
            System Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Link
              href="/ideas"
              className="border-2 border-red-500 text-center py-6 rounded-lg hover:bg-red-500 hover:text-white transition"
            >
              <div className="text-3xl mb-2">🗑️</div>
              <div className="font-semibold">Delete / Moderate Ideas</div>
            </Link>

            <Link
              href="/users"
              className="border-2 border-blue-500 text-center py-6 rounded-lg hover:bg-blue-500 hover:text-white transition"
            >
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold">Manage Users</div>
            </Link>

            <Link
              href="/connections"
              className="border-2 border-green-500 text-center py-6 rounded-lg hover:bg-green-500 hover:text-white transition"
            >
              <div className="text-3xl mb-2">🔗</div>
              <div className="font-semibold">View Connections</div>
            </Link>
          </div>
        </Card>

        {/* ================= QUICK ACTIONS ================= */}
        <Card>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <Link
              href="/dashboard"
              className="border-2 border-secondary text-center py-5 rounded-lg hover:bg-secondary hover:text-white transition"
            >
              Back to User Dashboard
            </Link>

            <Link
              href="/ideas"
              className="border-2 border-highlight text-center py-5 rounded-lg hover:bg-highlight hover:text-white transition"
            >
              Browse Ideas
            </Link>

            <Link
              href="/mentors"
              className="border-2 border-primary text-center py-5 rounded-lg hover:bg-primary hover:text-white transition"
            >
              View Mentors
            </Link>

            <button
              onClick={() => alert('Future: analytics page')}
              className="border-2 border-purple-600 text-center py-5 rounded-lg hover:bg-purple-600 hover:text-white transition"
            >
              Analytics
            </button>

          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
