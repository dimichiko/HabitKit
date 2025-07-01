import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardScreen from './DashboardScreen';
import HomePage from './HomePage';
import CalendarPage from './CalendarPage';
import StatsPage from './StatsPage';
import Header from '../../../shared/components/Header';
import { useUser } from '../../../shared/context/UserContext';
import axios from 'axios';

const themeConfig = {
  appNameText: 'text-green-700',
  activeNav: 'bg-green-500 text-white shadow',
  inactiveNav: 'text-gray-600 hover:bg-green-100',
};

const HabitKitApp = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Protección de acceso: si no tiene acceso a habitkit, redirigir
  useEffect(() => {
    if (!isLoading && user && (!user.activeApps || !user.activeApps.includes('habitkit'))) {
      navigate('/pricing', { replace: true });
    }
  }, [isLoading, user, navigate]);

  // Loader si no hay usuario o está cargando
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  // Logs de depuración
  console.log('user:', user);
  console.log('token:', axios.defaults.headers.common.Authorization);
  console.log('activeApps:', user?.activeApps);

  const handleNavigate = (path: string) => {
    const fullPath = path === '' ? '/apps/habitkit' : `/apps/habitkit/${path}`;
    navigate(fullPath);
  };
  
  const handleBackToAppSelector = () => {
    navigate('/apps');
  };

  const navigationItems = [
    { id: 'dashboard', path: '', label: 'Dashboard', icon: '📊' },
    { id: 'habits', path: 'habits', label: 'Hábitos', icon: '✅' },
    { id: 'calendar', path: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'stats', path: 'stats', label: 'Estadísticas', icon: '📈' }
  ];

  const currentPage = navigationItems.find(item => location.pathname.endsWith(item.path))?.id || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        appName="HabitKit"
        appLogo="🌱"
        themeConfig={themeConfig}
        onBack={handleBackToAppSelector}
        navigationItems={navigationItems}
        currentPage={currentPage}
        onNavigate={(id: string) => {
            const item = navigationItems.find(i => i.id === id);
            if(item) handleNavigate(item.path);
        }}
        userProfile={{ name: user.name, email: user.email, plan: user.plan }}
        onLogout={() => {}}
        onViewProfile={() => {}}
        onEditProfile={() => {}}
      />
      <main className="p-4 md:p-6">
        <Routes>
          <Route path="/" element={<DashboardScreen onNavigate={(path: string) => navigate(`/apps/habitkit/${path}`)} />} />
          <Route path="/habits" element={<HomePage showAddModal={false} setShowAddModal={() => {}} />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default HabitKitApp; 