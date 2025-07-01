import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../shared/components/Header';
import apiClient from '../apps/habitkit/utils/api';
import { useUserContext } from '../shared/context/UserContext';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAlert, hasAppAccess, getAvailableApps, silentLogin } = useUserContext();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, expired, used
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [showResendInput, setShowResendInput] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMsg, setResendMsg] = useState('');

  const token = searchParams.get('token');

  const verifyEmail = useCallback(async (verificationToken: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/auth/verify-email', { token: verificationToken });
      
      // El backend ahora devuelve { message, user, token, refreshToken }
      if (response.data.message && response.data.message.includes('verificado correctamente')) {
        setStatus('success');
        
        // Login automático con los datos recibidos
        if (response.data.user && response.data.token && response.data.refreshToken) {
          // Hacer login silencioso usando el contexto
          silentLogin(response.data.user, response.data.token, response.data.refreshToken);
          
          // Mostrar mensaje de éxito
          setAlert({
            type: 'success',
            message: '¡Cuenta verificada e iniciada sesión automáticamente!'
          });
          
          // Redirigir según acceso a apps
          setTimeout(() => {
            const availableApps = getAvailableApps();
            if (availableApps.length > 0) {
              navigate('/apps');
            } else {
              navigate('/');
            }
          }, 3000);
        } else {
          // Fallback si no hay datos de login
          setTimeout(() => navigate('/login'), 3000);
        }
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
  }, [navigate, setAlert, getAvailableApps, silentLogin]);

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
    if (status === 'success' && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [status, redirectCountdown]);

  useEffect(() => {
    if ((status === 'expired' || status === 'used' || status === 'error' || status === 'network') && autoRedirect && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(c => c - 1), 1000);
      if (redirectCountdown === 1) navigate('/login');
      return () => clearTimeout(timer);
    }
  }, [status, autoRedirect, redirectCountdown, navigate]);

  const resendEmail = async () => {
    if (!email) {
      setResendMsg('Por favor ingresa tu email.');
      setResendStatus('error');
      return;
    }
    try {
      setIsLoading(true);
      setResendStatus('loading');
      setResendMsg('');
      await apiClient.post('/auth/resend-verification', { email });
      setResendStatus('success');
      setResendMsg('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (error: unknown) {
      setResendStatus('error');
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response: { data: { message?: string } } };
        const { data } = errorResponse.response;
        setResendMsg(data.message || 'Error reenviando el email');
      } else {
        setResendMsg('No pudimos conectarnos al servidor. Revisa tu conexión e intenta nuevamente.');
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
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Verificado">¡Email verificado!</h2>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido verificada exitosamente. Iniciando sesión automáticamente...
            </p>
            <div className="text-sm text-gray-500">
              Redirigiendo en {redirectCountdown} segundos...
            </div>
          </div>
        );
      case 'expired':
      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏰</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" aria-label="Enlace expirado">Token inválido o expirado.</h2>
            <p className="text-gray-600 mb-4">No pudimos verificar tu cuenta. Puedes solicitar un nuevo correo de verificación.</p>
            {!showResendInput ? (
              <button
                onClick={() => setShowResendInput(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors mb-4"
              >
                Reenviar verificación
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  aria-label="Email para reenviar verificación"
                  disabled={isLoading || resendStatus === 'success'}
                />
                <button
                  onClick={resendEmail}
                  disabled={isLoading || !email || resendStatus === 'success'}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Reenviar correo de verificación"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Reenviando...
                    </div>
                  ) : (
                    resendStatus === 'success' ? 'Correo enviado' : 'Reenviar correo de verificación'
                  )}
                </button>
                {resendMsg && (
                  <div className={`text-sm ${resendStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{resendMsg}</div>
                )}
              </div>
            )}
            <button
              onClick={() => navigate('/login')}
              className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
        );
      case 'used':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header appName="Lifehub" appLogo="🌍" />
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 