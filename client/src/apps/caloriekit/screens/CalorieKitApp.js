import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../../shared/context/UserContext';
import Header from '../../../shared/components/Header';
import DashboardScreen from './DashboardScreen';
import FoodLogPage from './FoodLogPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import OnboardingScreen from './OnboardingScreen';
import EditProfileModal from '../components/EditProfileModal';
import CustomFoodsPage from './CustomFoodsPage';
import AchievementsSystem from '../components/AchievementsSystem';
import { ThemeProvider } from '../context/ThemeContext';
import { MealProvider } from '../context/MealContext';
import { getProfile, saveProfile } from '../utils/api';

const themeConfig = {
  appNameText: 'text-orange-700',
  activeNav: 'bg-orange-500 text-white shadow',
  inactiveNav: 'text-gray-600 hover:bg-orange-100',
};

const CalorieKitApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const profileLoadedRef = useRef(false);
  const { logout } = useUser();

  useEffect(() => {
    // Evitar llamadas múltiples
    if (profileLoadedRef.current) return;
    profileLoadedRef.current = true;
    
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getProfile();
        // Validar que el perfil tenga los datos clave
        const missing = !profile || !profile._id || !profile.weight || !profile.height || !profile.gender || !profile.goal || !profile.age;
        if (missing) {
          setShowOnboarding(true);
        } else {
          setUserProfile(profile);
          setShowOnboarding(false);
        }
      } catch (error) {
        setError('Error al cargar el perfil. Inténtalo de nuevo.');
        setShowOnboarding(true);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Debug currentPage changes
  useEffect(() => {
    console.log('Current page changed to:', currentPage);
  }, [currentPage]);

  const handleOnboardingComplete = async (profileData) => {
    try {
      // Validar datos del perfil
      if (!profileData || !profileData.name || typeof profileData.name !== 'string') {
        throw new Error('Datos de perfil inválidos');
      }
      
      const savedProfile = await saveProfile(profileData);
      
      if (savedProfile && savedProfile._id) {
        setUserProfile(savedProfile);
        setShowOnboarding(false);
        setCurrentPage('dashboard');
        setError(null);
      } else {
        throw new Error('Error al guardar el perfil');
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      setError('Error al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  const handleNavigate = (page) => {
    if (page && typeof page === 'string') {
      setCurrentPage(page);
      setError(null);
    }
  };

  const handleProfileUpdated = (updatedProfile) => {
    if (updatedProfile && typeof updatedProfile === 'object' && updatedProfile._id) {
      setUserProfile(updatedProfile);
      setError(null);
    }
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleViewProfile = () => {
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleBackToAppSelector = () => {
    window.location.href = '/apps';
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'foodlog', label: 'Registro', icon: '🍽️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'customfoods', label: 'Alimentos', icon: '🍎' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold">Cargando CalorieKit...</div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <ThemeProvider>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <MealProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
          <Header
            appName="CalorieKit"
            appLogo="🔥"
            themeConfig={themeConfig}
            onBack={handleBackToAppSelector}
            navigationItems={navigationItems}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            userProfile={userProfile}
            onLogout={handleLogout}
            onViewProfile={handleViewProfile}
            onEditProfile={handleEditProfile}
            extraActions={<AchievementsSystem />}
          />

          {/* Error Message */}
          {error && (
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="float-right text-red-800 hover:text-red-900"
                  aria-label="Cerrar mensaje de error"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Contenido principal */}
          <main>
            {currentPage === 'dashboard' && <DashboardScreen onNavigate={handleNavigate} userProfile={userProfile} />}
            {currentPage === 'foodlog' && <FoodLogPage userProfile={userProfile} />}
            {currentPage === 'analytics' && <AnalyticsPage userProfile={userProfile} />}
            {currentPage === 'customfoods' && <CustomFoodsPage userProfile={userProfile} />}
            {currentPage === 'profile' && <ProfilePage userProfile={userProfile} onNavigate={handleNavigate} />}
          </main>

          {/* Floating Action Button for quick add meal */}
          {currentPage !== 'foodlog' && (
            <button
              onClick={() => handleNavigate('foodlog')}
              className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
              aria-label="Agregar comida rápidamente"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}

          {/* Edit Profile Modal */}
          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            userProfile={userProfile}
            onProfileUpdated={handleProfileUpdated}
          />
        </div>
      </MealProvider>
    </ThemeProvider>
  );
};

export default CalorieKitApp; 