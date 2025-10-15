import React from 'react';

interface FooterProps {
    content: any;
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  const year = new Date().getFullYear();
  const footerText = content?.footerText?.replace('{year}', year.toString()) || `© ${year} WebGL Learning Hub. All rights reserved.`;

  return (
    <footer className="bg-navy-900/50 mt-12">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-navy-400">
        <p>{footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
