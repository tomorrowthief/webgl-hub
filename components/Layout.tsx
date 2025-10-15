import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  isNextJs?: boolean;
  locale?: string;
  locales?: string[];
  commonContent?: any;
}

const Layout: React.FC<LayoutProps> = ({ children, isNextJs = false, locale = 'en', locales = ['en', 'zh-Hans'], commonContent }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isNextJs={isNextJs}
        locale={locale}
        locales={locales}
        content={commonContent}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer content={commonContent} />
    </div>
  );
};

export default Layout;