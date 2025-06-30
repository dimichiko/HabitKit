import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardScreen from './DashboardScreen';
import HomePage from './HomePage';
import CalendarPage from './CalendarPage';
import StatsPage from './StatsPage';
import Header from '../../../shared/components/Header';

const themeConfig = {
  appNameText: 'text-green-700',
  activeNav: 'bg-green-500 text-white shadow',
  inactiveNav: 'text-gray-600 hover:bg-green-100',
};

const HabitKitApp = () => {
  const [userProfile] = useState({ name: 'Usuario', email: 'usuario@ejemplo.com', plan: 'free' });
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    // El path ya vendrá completo (ej: '/habitkit/stats')
    navigate(path);
  };
  
  const handleBackToAppSelector = () => {
    navigate('/apps');
  };

  const navigationItems = [
    { id: 'dashboard', path: '/habitkit', label: 'Dashboard', icon: '📊' },
    { id: 'habits', path: '/habitkit/habits', label: 'Hábitos', icon: '✅' },
    { id: 'calendar', path: '/habitkit/calendar', label: 'Calendario', icon: '📅' },
    { id: 'stats', path: '/habitkit/stats', label: 'Estadísticas', icon: '📈' }
  ];

  // Determina la página actual a partir de la ruta
  const currentPage = navigationItems.find(item => location.pathname === item.path)?.id || 'dashboard';

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
        userProfile={userProfile}
        onLogout={() => {}}
        onViewProfile={() => {}}
        onEditProfile={() => {}}
      />
      
      <main className="p-4 md:p-6">
        <Routes>
          <Route path="/" element={<DashboardScreen onNavigate={(path: string) => navigate(`/habitkit/${path}`)} />} />
          <Route path="/habits" element={<HomePage showAddModal={showAddModal} setShowAddModal={setShowAddModal} />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default HabitKitApp; 