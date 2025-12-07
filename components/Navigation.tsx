"use client"
import React from 'react';
import { useTheme } from "@/contexts/ThemeProvider";

const Navigation: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <nav 
      className="w-screen h-15 sm:h-20 relative flex items-center px-4 sm:px-10 border-b border-border-color"
    >
      <div className='gap-2 flex items-center text-main-color'>
        <span className="text-1xl sm:text-2xl font-bold">{`HH Men's Wear`}</span>
      </div>

      <button 
        type="button" 
        onClick={toggleTheme}
        className='ml-auto rounded-full'
      >
        <span className="material-symbols-outlined">dark_mode</span>
      </button>
    </nav>
  );
};

export default Navigation;