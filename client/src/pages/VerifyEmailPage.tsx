import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaClock, FaMailBulk } from 'react-icons/fa';
import Header from '../shared/components/Header';
import apiClient from '../apps/habitkit/utils/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, expired, used
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  const token = searchParams.get('token');

  const verifyEmail = useCallback(async (verificationToken: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/auth/verify-email', { token: verificationToken });
      
      if (response.data.success) {
        setStatus('success');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data.message || 'Tu enlace puede haber expirado o ya fue utilizado.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response: { status: number; data: { message?: string } } };
        const { status: statusCode, data } = errorResponse.response;
        if (statusCode === 400 && data.message && data.message.toLowerCase().includes('expirado')) {
          setStatus('expired');
        } else if (statusCode === 400 && data.message && data.message.toLowerCase().includes('ya verificado')) {
          setStatus('already-verified');
        } else {
          setError(data.message || 'Error verificando email');
        }
      } else {
        setError('Error de conexión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setError('Token de verificación no encontrado');
    }
  }, [token, verifyEmail]);

  // Redirección automática
  useEffect(() => {
    if ((status === 'expired' || status === 'used' || status === 'error' || status === 'network') && autoRedirect && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(c => c - 1), 1000);
      if (redirectCountdown === 1) navigate('/login');
      return () => clearTimeout(timer);
    }
  }, [status, autoRedirect, redirectCountdown, navigate]);

  const resendEmail = async () => {
    if (!email) {
      setError('No hay email para reenviar');
      return;
    }

    try {
      setIsLoading(true);
      await apiClient.post('/auth/resend-verification', { email });
      setError('');
      alert('Email de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response: { data: { message?: string } } };
        const { data } = errorResponse.response;
        setError(data.message || 'Error reenviando el email');
      } else {
        setError('No pudimos conectarnos al servidor. Revisa tu conexión e intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Verificando">Verificando tu email...</h2>
            <p className="text-gray-600">Por favor espera mientras verificamos tu cuenta.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Verificado">¡Email verificado!</h2>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido verificada exitosamente. Serás redirigido automáticamente.
            </p>
            <div className="text-sm text-gray-500">
              Redirigiendo en 3 segundos...
            </div>
          </div>
        );
      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Enlace expirado">No pudimos verificar tu cuenta</h2>
            <p className="text-gray-600 mb-2">Tu enlace puede haber expirado o ya fue utilizado.</p>
            <p className="text-gray-500 text-sm mb-4">Esto puede suceder si ya usaste el enlace o si expiró.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Ingresa tu email para reenviar la verificación:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  aria-label="Email para reenviar verificación"
                />
              </div>
              <button
                onClick={resendEmail}
                disabled={isLoading || !email}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Reenviar correo de verificación"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Reenviando...
                  </div>
                ) : (
                  'Reenviar correo de verificación'
                )}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                aria-label="Iniciar sesión"
              >
                ¿Ya verificaste? Inicia sesión aquí
              </button>
              <div className="text-xs text-gray-500 mt-2">
                {autoRedirect ? (
                  <>
                    Serás redirigido en {redirectCountdown} segundos...{' '}
                    <button className="underline text-indigo-600" onClick={() => setAutoRedirect(false)} aria-label="Cancelar redirección">Cancelar</button>
                  </>
                ) : (
                  <span>Redirección automática cancelada.</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ¿Necesitas ayuda? <a href="mailto:soporte@lifehub.app" className="text-indigo-600 underline">soporte@lifehub.app</a>
              </div>
            </div>
          </div>
        );
      case 'used':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMailBulk className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Ya verificado">No pudimos verificar tu cuenta</h2>
            <p className="text-gray-600 mb-2">Este enlace ya fue utilizado para verificar tu cuenta.</p>
            <p className="text-gray-500 text-sm mb-4">Si ya verificaste tu cuenta, puedes iniciar sesión.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              aria-label="Iniciar sesión"
            >
              Iniciar sesión
            </button>
            <div className="text-xs text-gray-500 mt-2">
              {autoRedirect ? (
                <>
                  Serás redirigido en {redirectCountdown} segundos...{' '}
                  <button className="underline text-indigo-600" onClick={() => setAutoRedirect(false)} aria-label="Cancelar redirección">Cancelar</button>
                </>
              ) : (
                <span>Redirección automática cancelada.</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ¿Necesitas ayuda? <a href="mailto:soporte@lifehub.app" className="text-indigo-600 underline">soporte@lifehub.app</a>
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Error de red">No pudimos verificar tu cuenta</h2>
            <p className="text-gray-600 mb-2">No pudimos conectarnos al servidor. Revisa tu conexión e intenta nuevamente.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-2"
              aria-label="Reintentar"
            >
              Reintentar
            </button>
            <div className="text-xs text-gray-500 mt-2">
              {autoRedirect ? (
                <>
                  Serás redirigido en {redirectCountdown} segundos...{' '}
                  <button className="underline text-indigo-600" onClick={() => setAutoRedirect(false)} aria-label="Cancelar redirección">Cancelar</button>
                </>
              ) : (
                <span>Redirección automática cancelada.</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ¿Necesitas ayuda? <a href="mailto:soporte@lifehub.app" className="text-indigo-600 underline">soporte@lifehub.app</a>
            </div>
          </div>
        );
      case 'error':
      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Error de verificación">No pudimos verificar tu cuenta</h2>
            <p className="text-gray-600 mb-2">{error || 'Tu enlace puede haber expirado o ya fue utilizado.'}</p>
            <p className="text-gray-500 text-sm mb-4">Esto puede suceder si ya usaste el enlace o si expiró.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              aria-label="Iniciar sesión"
            >
              Iniciar sesión
            </button>
            <div className="text-xs text-gray-500 mt-2">
              {autoRedirect ? (
                <>
                  Serás redirigido en {redirectCountdown} segundos...{' '}
                  <button className="underline text-indigo-600" onClick={() => setAutoRedirect(false)} aria-label="Cancelar redirección">Cancelar</button>
                </>
              ) : (
                <span>Redirección automática cancelada.</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ¿Necesitas ayuda? <a href="mailto:soporte@lifehub.app" className="text-indigo-600 underline">soporte@lifehub.app</a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-indigo-50 font-sans">
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={[]}
        currentPage="account"
        onNavigate={() => {}}
        showAppsMenu={false}
      />
      <main className="pt-28 max-w-md mx-auto px-4 flex flex-col items-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center w-full">
          {/* Icono de email */}
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <FaEnvelope className="w-10 h-10 text-indigo-600" />
          </div>
          {/* Contenido dinámico */}
          {renderContent()}
        </div>
        {/* Footer */}
        <footer className="mt-12 text-zinc-400 text-xs text-center flex flex-col items-center gap-1">
          <span className="flex items-center gap-2 font-bold text-indigo-700">🌐 Lifehub</span>
          <span>© 2025 Lifehub. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
};

export default VerifyEmailPage; 