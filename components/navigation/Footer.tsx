import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-text text-white py-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">YEN</h3>
            <p className="text-sm">
              Empowering young entrepreneurs to transform ideas into sustainable businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ideas" className="hover:text-secondary">Browse Ideas</Link></li>
              <li><Link href="/mentors" className="hover:text-secondary">Find Mentors</Link></li>
              <li><Link href="/pitch" className="hover:text-secondary">Pitch Your Idea</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-secondary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-secondary">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-secondary">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-secondary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-secondary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center border-t border-gray-700 pt-6">
          <p className="text-sm">&copy; 2026 Youth Entrepreneur Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
