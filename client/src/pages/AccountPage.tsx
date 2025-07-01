import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../shared/context/UserContext';
import Header from '../shared/components/Header';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  // Estados para formularios
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogout = (): void => {
    logout();
  };

  // Función para mostrar mensajes
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Función mock para actualizar perfil
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validaciones básicas
      if (!formData.name.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        throw new Error('El email no es válido');
      }
      
      showMessage('success', 'Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Función mock para cambiar contraseña
  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validaciones básicas
      if (!passwordData.currentPassword) {
        throw new Error('La contraseña actual es requerida');
      }
      if (!passwordData.newPassword) {
        throw new Error('La nueva contraseña es requerida');
      }
      if (passwordData.newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      
      showMessage('success', 'Contraseña cambiada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para redirigir a actualizar plan
  const handleUpdatePlan = () => {
    navigate('/pricing?from=account');
  };

  // Función para redirigir a configurar 2FA
  const handleConfigure2FA = () => {
    navigate('/2fa');
  };

  // Función para redirigir a reset password
  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Header appName="LifeHub" />
      
      {/* Mensaje de feedback */}
      {message && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="pt-28 flex justify-center items-start min-h-screen">
        <div className="max-w-4xl w-full px-6 pb-20">
          {/* Botón Volver */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ← Volver al inicio
            </Link>
          </div>

          {/* Tabs Horizontales */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📋 Perfil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'security'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🔒 Seguridad
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'billing'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  💳 Facturación
                </button>
              </nav>
            </div>

            {/* Contenido de Tabs */}
            <div className="p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Información del Perfil</h2>
                  
                  <div className="grid gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Datos Personales</h3>
                        <button 
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          {isEditing ? '❌ Cancelar' : '✏️ Editar'}
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={!isEditing || isLoading}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Guardando...
                          </>
                        ) : (
                          'Guardar Cambios'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Configuración de Seguridad</h2>
                  
                  <div className="grid gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Autenticación de Dos Factores</h3>
                      <p className="text-gray-600 mb-4">Añade una capa extra de seguridad a tu cuenta</p>
                      <button 
                        onClick={handleConfigure2FA}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Configurar 2FA
                      </button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Última Sesión</h3>
                      <p className="text-gray-600">Último acceso: <span className="font-medium">Hoy a las 14:30</span></p>
                      <p className="text-gray-600">Dispositivo: <span className="font-medium">Chrome en macOS</span></p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Cambiando...
                          </>
                        ) : (
                          'Cambiar Contraseña'
                        )}
                      </button>
                      <button 
                        onClick={handleResetPassword}
                        className="px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-all duration-200"
                      >
                        Olvidé mi contraseña
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Información de Facturación</h2>
                  
                  <div className="grid gap-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Actual</h3>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          Plan: <span className="font-semibold text-indigo-600">{user.plan || 'Gratuito'}</span>
                        </p>
                        <p className="text-gray-600 text-sm">
                          Próxima renovación: <span className="font-medium">No aplica</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Facturación</h3>
                      <p className="text-gray-600 mb-4">No hay transacciones recientes</p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={handleUpdatePlan}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Actualizar Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones Peligrosas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones de Cuenta</h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <span className="text-lg">🚪</span>
                Cerrar Sesión
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center gap-2">
                <span className="text-lg">🗑️</span>
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 