
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks for your interest! We'll contact you at ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Ideas Into Sustainable Businesses
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Youth Entrepreneur Network empowers young innovators to connect with
            investors, mentors, and partners. Stop job seeking, start job creating.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button variant="highlight" className="text-lg">
                Join as Entrepreneur
              </Button>
            </Link>
            <Link href="/ideas">
              <Button variant="primary" className="bg-orange text-black hover:bg-gray-100 text-lg">
                Explore Ideas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-secondary mb-2">10,000+</div>
            <div className="text-text">Young Entrepreneurs</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-secondary mb-2">$5M+</div>
            <div className="text-text">Funding Secured</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-secondary mb-2">500+</div>
            <div className="text-text">Active Mentors</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            How YEN Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Pitch Your Idea
              </h3>
              <p className="text-text">
                Share your innovative business concept with our global community
                of investors and mentors.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Connect & Collaborate
              </h3>
              <p className="text-text">
                Network with experienced mentors, potential investors, and like-minded
                entrepreneurs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Launch & Grow
              </h3>
              <p className="text-text">
                Access funding, resources, and guidance to turn your vision into
                a thriving business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Entrepreneurial Journey?
          </h2>
          <form onSubmit={handleEarlyAccess} className="flex gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button type="submit" variant="highlight">
              Get Early Access
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}