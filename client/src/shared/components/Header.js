import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaTh, FaCrown } from 'react-icons/fa';

// --- Subcomponentes ---

const AppsMenu = ({ user, onNavigate }) => {
  const navigate = useNavigate();
  
  if (!user) return null;

  return (
    <button 
      onClick={() => navigate('/apps')} 
      className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm md:text-base transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
      title="Ir a aplicaciones"
    >
      <FaTh className="w-4 h-4" />
      <span className="hidden sm:inline">Apps</span>
    </button>
  );
};

const ProfileMenu = ({ userProfile, onLogout, onViewProfile, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = React.useRef();

  if (!userProfile) return null;

  const handleOpen = () => {
    setIsOpen(true);
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.left + window.scrollX;
      const width = rect.width;
      // --- Ajuste para evitar overflow a la derecha ---
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8;
      }
      // --- Ajuste para evitar overflow abajo ---
      const dropdownHeight = 240; // estimado
      if (top + dropdownHeight > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 8;
      }
      setDropdownPos({ top, left, width });
    }
  };

  const dropdown = (
    <div
      className="w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-200"
      style={{
        position: 'absolute',
        top: dropdownPos.top,
        left: dropdownPos.left,
        zIndex: 9999
      }}
    >
      {/* Información del usuario */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{userProfile.name || 'Usuario'}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{userProfile.email}</div>
        <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1 flex items-center gap-1">
          <FaCrown className="w-3 h-3" />
          Plan {userProfile.plan}
        </div>
      </div>
      {/* Opciones del menú */}
      <div className="py-1">
        <button 
          onClick={() => { onViewProfile(); setIsOpen(false); }} 
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
        >
          <span className="text-lg">👤</span>
          Ver Perfil
        </button>
        {userProfile.plan !== 'Pro' && (
          <button 
            onClick={() => { window.location.href = '/pricing'; setIsOpen(false); }} 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <span className="text-lg">💼</span>
            Cambiar Plan
          </button>
        )}
        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <button 
          onClick={onLogout} 
          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
        >
          <span className="text-lg">🔓</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button ref={btnRef} onClick={isOpen ? () => setIsOpen(false) : handleOpen} className="flex items-center space-x-2">
        <img
          src={userProfile.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile.name}&background=random`}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-600"
        />
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
          {userProfile.name || 'Usuario'}
          <svg className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {isOpen && ReactDOM.createPortal(dropdown, document.body)}
    </div>
  );
};

// --- Componente Header Principal ---

const defaultThemeConfig = {
  appNameText: 'text-indigo-700',
  activeNav: 'bg-indigo-100 text-indigo-700',
  inactiveNav: 'text-gray-600 hover:bg-gray-100',
};

const Header = ({
  appName,
  appLogo,
  themeConfig = defaultThemeConfig,
  onBack,
  navigationItems = [],
  currentPage,
  onNavigate,
  onLogout,
  onViewProfile,
  onEditProfile,
  extraActions,
  centerNav,
  showAppsMenu = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, alert, setAlert } = useUser();

  const navLinkClasses = (item) => classnames(
    'px-3 py-2 rounded-lg font-medium text-sm transition flex items-center space-x-2',
    {
      [themeConfig.activeNav]: currentPage === item.id,
      [themeConfig.inactiveNav]: currentPage !== item.id,
    }
  );

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {alert && (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-500 text-white text-center py-2 font-semibold shadow-lg animate-fade-in">
          {alert}
          <button className="ml-4 px-2 py-1 bg-white text-red-600 rounded" onClick={() => setAlert(null)}>Cerrar</button>
        </div>
      )}
      <header className={centerNav ? "fixed top-0 left-0 w-full z-30 bg-white shadow-md py-3 px-4 md:px-8 flex items-center justify-between" : "fixed top-0 left-0 w-full z-30 bg-white shadow-md py-3 px-4 md:px-8 flex items-center justify-between"}>
        <div className="flex items-center gap-2 min-w-[120px]">
          <span className="text-2xl">{appLogo}</span>
          <span className="font-bold text-lg md:text-xl text-indigo-700">{appName}</span>
        </div>
        {centerNav ? (
          <div className="flex-1 flex justify-center">
            <nav className="flex gap-2 md:gap-4">
              {navigationItems?.filter(item => item.id !== 'account').map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${currentPage === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        ) : (
          <nav className="flex gap-2 md:gap-4">
            {navigationItems?.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${currentPage === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
        <div className="flex items-center space-x-2 min-w-[120px] justify-end">
          {extraActions}
          {user ? (
            <>
              {showAppsMenu && <AppsMenu user={user} onNavigate={handleNavigate} />}
              <ProfileMenu
                userProfile={user}
                onLogout={() => { logout(); navigate('/'); }}
                onViewProfile={onViewProfile || (() => navigate('/account'))}
              />
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-2 rounded-lg font-medium text-sm md:text-base transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header; 