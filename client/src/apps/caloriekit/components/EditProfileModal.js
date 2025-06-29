import React, { useState, useEffect } from 'react';
import { updateProfile } from '../utils/api';

const EditProfileModal = ({ isOpen, onClose, userProfile, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        weight: userProfile.weight || '',
        height: userProfile.height || '',
        activityLevel: userProfile.activityLevel || '',
        goal: userProfile.goal || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updatedProfile = await updateProfile(formData);
      onProfileUpdated(updatedProfile);
      onClose();
    } catch (error) {
      setError('Error al actualizar el perfil. Inténtalo de nuevo.');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activityLevels = [
    { id: 'sedentary', title: 'Sedentario', description: 'Poco o ningún ejercicio' },
    { id: 'lightlyActive', title: 'Ligeramente Activo', description: 'Ejercicio ligero 1-3 días/semana' },
    { id: 'moderatelyActive', title: 'Moderadamente Activo', description: 'Ejercicio moderado 3-5 días/semana' },
    { id: 'veryActive', title: 'Muy Activo', description: 'Ejercicio intenso 6-7 días/semana' },
    { id: 'extremelyActive', title: 'Extremadamente Activo', description: 'Ejercicio muy intenso, trabajo físico' }
  ];

  const goals = [
    { id: 'lose', title: 'Perder Peso', description: 'Crear un déficit calórico' },
    { id: 'maintain', title: 'Mantener Peso', description: 'Mantener peso actual' },
    { id: 'gain', title: 'Ganar Músculo', description: 'Crear un superávit calórico' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editprofile-name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    id="editprofile-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editprofile-age" className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                  <input
                    id="editprofile-age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="25"
                    min="13"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editprofile-gender" className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                  <select
                    id="editprofile-gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona...</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="editprofile-weight" className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                  <input
                    id="editprofile-weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="70"
                    min="30"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editprofile-height" className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                  <input
                    id="editprofile-height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="170"
                    min="100"
                    max="250"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tu Objetivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Objetivo">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    role="radio"
                    aria-checked={formData.goal === goal.id}
                    tabIndex={formData.goal === goal.id ? 0 : -1}
                    onClick={() => handleInputChange('goal', goal.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.goal === goal.id
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {goal.id === 'lose' ? '📉' : goal.id === 'maintain' ? '⚖️' : '💪'}
                      </span>
                      <div>
                        <h4 className="font-semibold text-lg">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nivel de Actividad */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Nivel de Actividad</h3>
              <div className="space-y-3" role="radiogroup" aria-label="Nivel de Actividad">
                {activityLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    role="radio"
                    aria-checked={formData.activityLevel === level.id}
                    tabIndex={formData.activityLevel === level.id ? 0 : -1}
                    onClick={() => handleInputChange('activityLevel', level.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.activityLevel === level.id
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">
                        {level.id === 'sedentary' ? '🛋️' : 
                         level.id === 'lightlyActive' ? '🚶' :
                         level.id === 'moderatelyActive' ? '🏃' :
                         level.id === 'veryActive' ? '🏋️' : '🔥'}
                      </span>
                      <div>
                        <h4 className="font-semibold text-lg">{level.title}</h4>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.age || !formData.gender || !formData.weight || !formData.height || !formData.goal || !formData.activityLevel}
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 