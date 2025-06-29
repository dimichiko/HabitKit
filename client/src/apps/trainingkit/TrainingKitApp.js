import React, { useState } from 'react';
import DashboardScreen from './screens/DashboardScreen';
import AddTrainingScreen from './screens/AddTrainingScreen';
import WeekSummaryScreen from './screens/WeekSummaryScreen';
import MapScreen from './screens/MapScreen';
import CalendarScreen from './screens/CalendarScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';
import Header from '../../shared/components/Header';

const navigationItems = [
  { id: 'dashboard', label: 'Inicio', icon: '🏠' },
  { id: 'calendar', label: 'Calendario', icon: '📅' },
  { id: 'stats', label: 'Estadísticas', icon: '📈' },
  { id: 'map', label: 'Mapa', icon: '📍' },
];

const themeConfig = {
  appNameText: 'text-purple-700',
  activeNav: 'bg-purple-100 text-purple-700',
  inactiveNav: 'text-gray-600 hover:bg-gray-100',
};

const userProfile = {
  name: localStorage.getItem('user_name') || 'Usuario',
  avatarUrl: localStorage.getItem('user_photo') || '',
};

const TrainingKitApp = () => {
  const [screen, setScreen] = useState('dashboard');
  const [editTraining, setEditTraining] = useState(null);

  const handleNavigate = (to, data) => {
    if (to === 'edit') {
      setEditTraining(data);
      setScreen('edit');
    } else if (to === 'logout') {
      window.location.href = '/';
    } else {
      setScreen(to);
      setEditTraining(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        appName="TrainingKit"
        appLogo="🏋️‍♂️"
        themeConfig={themeConfig}
        navigationItems={navigationItems}
        currentPage={screen}
        onNavigate={handleNavigate}
        userProfile={userProfile}
        onLogout={() => handleNavigate('logout')}
        onViewProfile={() => handleNavigate('profile')}
        onEditProfile={() => handleNavigate('profile')}
      />
      <div className="pt-4">
        {screen === 'add' && <AddTrainingScreen onNavigate={handleNavigate} />}
        {screen === 'edit' && <AddTrainingScreen onNavigate={handleNavigate} training={editTraining} />}
        {screen === 'week' && <WeekSummaryScreen onNavigate={handleNavigate} />}
        {screen === 'map' && <MapScreen onNavigate={handleNavigate} />}
        {screen === 'calendar' && <CalendarScreen onNavigate={handleNavigate} />}
        {screen === 'stats' && <StatsScreen onNavigate={handleNavigate} />}
        {screen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
        {screen === 'dashboard' && <DashboardScreen onNavigate={handleNavigate} />}
      </div>
    </div>
  );
};

export default TrainingKitApp; 