
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import Card from '@/components/common/Card';
import { useAuth } from '@/hooks/useAuth';
import { useIdeas } from '@/hooks/useIdeas';
import { useConnections } from '@/hooks/useConnections';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { ideas, loading: ideasLoading } = useIdeas(user?.id);
  const { connections, loading: connectionsLoading } = useConnections(user?.id || null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-xl">Role: <span className="capitalize font-semibold">{user.role}</span></p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-3xl font-bold text-secondary mb-2">{ideas.length}</div>
            <div className="text-text">My Ideas</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-secondary mb-2">{connections.length}</div>
            <div className="text-text">Connections</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-secondary mb-2">
              {ideas.reduce((sum, idea) => sum + idea.likes, 0)}
            </div>
            <div className="text-text">Total Likes</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Ideas */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">My Ideas</h2>
              {user.role === 'entrepreneur' && (
                <Link
                  href="/pitch"
                  className="bg-highlight text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition text-sm"
                >
                  + New Idea
                </Link>
              )}
            </div>

            {ideasLoading ? (
              <p className="text-text">Loading...</p>
            ) : ideas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text mb-4">You haven't pitched any ideas yet</p>
                {user.role === 'entrepreneur' && (
                  <Link href="/pitch" className="text-secondary hover:underline">
                    Create your first pitch
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {ideas.map(idea => (
                  <div key={idea.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-primary">{idea.title}</h3>
                      <span className="text-xs bg-secondary text-white px-2 py-1 rounded">
                        {idea.category}
                      </span>
                    </div>
                    <div className="text-sm text-text mb-2">
                      Funding: ${idea.currentFunding.toLocaleString()} / ${idea.fundingGoal.toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-highlight h-2 rounded-full"
                        style={{
                          width: `${Math.min((idea.currentFunding / idea.fundingGoal) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <div className="text-sm text-text">❤️ {idea.likes} likes</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Connections */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Connections</h2>
              <Link href="/mentors" className="text-secondary hover:underline text-sm">
                Find More
              </Link>
            </div>

            {connectionsLoading ? (
              <p className="text-text">Loading...</p>
            ) : connections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text mb-4">No connections yet</p>
                <Link href="/mentors" className="text-secondary hover:underline">
                  Connect with mentors and investors
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map(conn => (
                  <div key={conn.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-primary capitalize">{conn.type}</div>
                        <div className="text-sm text-text">
                          Status: <span className={`capitalize ${
                            conn.status === 'accepted' ? 'text-green-600' :
                            conn.status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{conn.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/ideas"
              className="border-2 border-secondary text-center py-6 rounded-lg hover:bg-secondary hover:text-white transition"
            >
              <div className="text-3xl mb-2">💡</div>
              <div className="font-semibold">Browse Ideas</div>
            </Link>
            <Link
              href="/mentors"
              className="border-2 border-secondary text-center py-6 rounded-lg hover:bg-secondary hover:text-white transition"
            >
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-semibold">Find Mentors</div>
            </Link>
            {user.role === 'entrepreneur' && (
              <Link
                href="/pitch"
                className="border-2 border-highlight text-center py-6 rounded-lg hover:bg-highlight hover:text-white transition"
              >
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-semibold">Pitch New Idea</div>
              </Link>
            )}
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}