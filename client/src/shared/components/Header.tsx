import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
}

interface HeaderProps {
  appName: string;
  appLogo?: React.ReactNode;
  navigationItems?: NavigationItem[];
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({
  appName,
  appLogo,
  navigationItems = [],
  currentPage,
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white shadow-md py-3 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-[120px]">
        <span className="text-2xl">{appLogo}</span>
        <span className="font-bold text-lg md:text-xl text-indigo-700">{appName}</span>
      </div>
      
      <nav className="flex gap-2 md:gap-4">
        {navigationItems?.map((item: NavigationItem) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`px-3 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${currentPage === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50'}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="flex items-center space-x-2 min-w-[120px] justify-end">
        <button
          onClick={() => navigate('/pricing')}
          className="px-3 py-2 rounded-lg font-medium text-sm md:text-base transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Comenzar
        </button>
      </div>
    </header>
  );
};

export default Header; 