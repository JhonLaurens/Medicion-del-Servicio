import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NavigationSidebar from './NavigationSidebar';

const Layout: React.FC = () => {
  const location = useLocation();
  const currentPage = location.pathname.substring(1) || 'inicio';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <NavigationSidebar currentPage={currentPage} onPageChange={() => {}} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
