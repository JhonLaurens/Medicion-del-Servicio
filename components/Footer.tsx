
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary text-slate-300 py-6 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Coltefinanciera S.A. All rights reserved.</p>
        <p className="text-sm mt-1">Customer Insights Platform</p>
      </div>
    </footer>
  );
};

export default Footer;
