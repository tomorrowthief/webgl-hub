
import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-navy-900/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-navy-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 21v-2.5M4 7l2 1M4 7l2-1M4 7v2.5M12 2.5V5m0 11.5a5.5 5.5 0 01-11 0 5.5 5.5 0 0111 0z" />
              </svg>
              <span>WebGL Hub</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;