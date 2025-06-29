import React, { useState, useEffect } from 'react';
import { getProfile, saveProfile } from '../utils/api';

const ProfilePage = ({ userProfile, onNavigate }) => {
  const [profile, setProfile] = useState(userProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const savedProfile = await saveProfile(updatedData);
      setProfile(savedProfile);
      setIsEditing(false);
    } catch (error) {
      setError('Error al guardar el perfil');
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile(userProfile);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityLevelText = (level) => {
    const levels = {
      'sedentary': 'Sedentario (poco o ningún ejercicio)',
      'light': 'Ligero (ejercicio ligero 1-3 días/semana)',
      'moderate': 'Moderado (ejercicio moderado 3-5 días/semana)',
      'active': 'Activo (ejercicio intenso 6-7 días/semana)',
      'veryActive': 'Muy activo (ejercicio muy intenso, trabajo físico)'
    };
    return levels[level] || level;
  };

  const getGoalText = (goal) => {
    const goals = {
      'lose': 'Perder peso',
      'maintain': 'Mantener peso',
      'gain': 'Ganar peso'
    };
    return goals[goal] || goal;
  };

  const getGenderText = (gender) => {
    const genders = {
      'male': 'Masculino',
      'female': 'Femenino',
      'other': 'Otro'
    };
    return genders[gender] || gender;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-2">
                Mi Perfil
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Información personal y objetivos nutricionales
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition"
              >
                Volver al Dashboard
              </button>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6" style={{paddingTop:'80px'}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información Personal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
              <span className="mr-3">👤</span>
              Información Personal
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {profile?.name || 'No especificado'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {profile?.email || 'No especificado'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Género:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {getGenderText(profile?.gender)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de nacimiento:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {formatDate(profile?.birthDate)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Altura:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {profile?.height ? `${profile.height} cm` : 'No especificada'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Peso actual:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {profile?.currentWeight ? `${profile.currentWeight} kg` : 'No especificado'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Nivel de actividad:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {getActivityLevelText(profile?.activityLevel)}
                </span>
              </div>
            </div>
          </div>

          {/* Objetivos y Metas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Objetivos y Metas
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Objetivo principal:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {getGoalText(profile?.goal)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Peso objetivo:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {profile?.targetWeight ? `${profile.targetWeight} kg` : 'No especificado'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Meta de peso:</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {getGoalText(profile?.weightGoal)}
                </span>
              </div>
            </div>
          </div>

          {/* Objetivos Nutricionales */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
              <span className="mr-3">🍎</span>
              Objetivos Nutricionales Diarios
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {profile?.calorieTarget || 2000}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Calorías</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">kcal/día</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {profile?.proteinTarget || 150}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Proteínas</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">g/día</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {profile?.carbTarget || 200}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Carbohidratos</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">g/día</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {profile?.fatTarget || 67}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Grasas</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">g/día</div>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Estadísticas Rápidas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {profile?.currentWeight && profile?.targetWeight 
                    ? Math.abs(profile.currentWeight - profile.targetWeight).toFixed(1)
                    : '0'
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.currentWeight && profile?.targetWeight 
                    ? profile.currentWeight > profile.targetWeight ? 'kg por perder' : 'kg por ganar'
                    : 'Diferencia de peso'
                  }
                </div>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {profile?.height ? Math.round(profile.height / 100 * 100) / 100 : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Altura en metros</div>
              </div>
              
              <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                  {profile?.currentWeight && profile?.height 
                    ? (profile.currentWeight / Math.pow(profile.height / 100, 2)).toFixed(1)
                    : '0'
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">IMC actual</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage; 