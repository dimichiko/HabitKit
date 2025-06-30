import React, { useState, useEffect } from 'react';
import Header from '../../../shared/components/Header';
import OnboardingScreen from './OnboardingScreen';
import DashboardScreen from './DashboardScreen';
import FoodLogPage from './FoodLogPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import CustomFoodsPage from './CustomFoodsPage';
import { getProfile } from '../utils/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  targetWeight?: number;
  dailyCalories?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
}

interface ProfileData {
  name: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
}

type PageType = 'onboarding' | 'dashboard' | 'foodlog' | 'analytics' | 'profile' | 'customfoods';

const CalorieKitApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const profile = await getProfile();
      if (profile && profile.name) {
        setUserProfile(profile);
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('onboarding');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setCurrentPage('onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (profileData: ProfileData) => {
    try {
      setUserProfile(profileData as UserProfile);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserProfile(null);
    setCurrentPage('onboarding');
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleProfileUpdated = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'onboarding') {
    return (
      <OnboardingScreen onComplete={handleOnboardingComplete} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="CalorieKit"
        onLogout={handleLogout}
        userProfile={userProfile || undefined}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigate('foodlog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'foodlog'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Registro de Comidas
            </button>
            <button
              onClick={() => handleNavigate('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Análisis
            </button>
            <button
              onClick={() => handleNavigate('customfoods')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'customfoods'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Alimentos Personalizados
            </button>
            <button
              onClick={() => handleNavigate('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Perfil
            </button>
          </nav>
        </div>

        <div className="space-y-6">
          {currentPage === 'dashboard' && userProfile && (
            <DashboardScreen onNavigate={handleNavigate} userProfile={userProfile} />
          )}
          {currentPage === 'foodlog' && userProfile && (
            <FoodLogPage userProfile={userProfile} />
          )}
          {currentPage === 'analytics' && userProfile && (
            <AnalyticsPage userProfile={userProfile} />
          )}
          {currentPage === 'customfoods' && (
            <CustomFoodsPage />
          )}
          {currentPage === 'profile' && userProfile && (
            <ProfilePage 
              userProfile={userProfile} 
              onProfileUpdated={handleProfileUpdated}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CalorieKitApp; 