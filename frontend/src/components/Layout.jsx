import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] dark:bg-[var(--color-dark-bg)] transition-colors duration-300">
      <Sidebar />
      <TopNav />
      <main className="pt-16 md:pl-64 min-h-screen transition-all duration-200">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
