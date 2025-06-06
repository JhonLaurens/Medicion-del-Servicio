
import React from 'react';
import { StarIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-lg text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
           <StarIcon className="h-8 w-8 text-brand-accent"/>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Coltefinanciera
          </h1>
        </div>
        <h2 className="text-lg sm:text-xl font-light text-slate-200">Customer Satisfaction Analytics</h2>
      </div>
    </header>
  );
};

export default Header;
