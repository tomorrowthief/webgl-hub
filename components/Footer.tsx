
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900/50 mt-12">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-navy-400">
        <p>&copy; {new Date().getFullYear()} WebGL Learning Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
