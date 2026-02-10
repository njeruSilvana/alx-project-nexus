'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-primary text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          YEN
        </Link>
        
        <div className="space-x-6 flex items-center">
          <Link href="/ideas" className="hover:text-secondary transition">
            Explore Ideas
          </Link>
          <Link href="/mentors" className="hover:text-secondary transition">
            Find Mentors
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-secondary transition">
                Dashboard
              </Link>
              {user.role === 'entrepreneur' && (
                <Link
                  href="/pitch"
                  className="bg-highlight px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                  Pitch Idea
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-secondary transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-highlight px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
