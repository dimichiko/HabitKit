import React, { useState } from 'react';
import Header from '../shared/components/Header';
import { FaEye, FaEyeSlash, FaGlobeEurope, FaEnvelope, FaLock, FaGoogle, FaGithub, FaApple, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../shared/context/UserContext';
import apiClient from '../apps/habitkit/utils/api';

interface FormErrors {
  email?: string;
  password?: string;
  twoFactorToken?: string;
  submit?: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: ''
  });
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(!!localStorage.getItem('rememberedEmail'));
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'El email es requerido';
      else if (!emailRegex.test(value)) error = 'Email inválido';
    }
    if (name === 'password') {
      if (!value) error = 'La contraseña es requerida';
    }
    if (name === 'twoFactorToken') {
      if (requiresTwoFactor && !value) error = 'Código de autenticación requerido';
      else if (value && value.length !== 6) error = 'El código debe tener 6 dígitos';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'password') {
      setFormData({ ...formData, [name]: value });
    } else if (name === 'twoFactorToken') {
      setTwoFactorToken(value);
    }
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    validateField('email', formData.email);
    validateField('password', formData.password);
    if (requiresTwoFactor) {
      validateField('twoFactorToken', twoFactorToken);
    }
    
    if (errors.email || errors.password || (requiresTwoFactor && errors.twoFactorToken)) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Llamada real al backend
      const loginData: {
        email: string;
        password: string;
        twoFactorToken?: string;
      } = {
        email: formData.email,
        password: formData.password
      };

      if (requiresTwoFactor) {
        loginData.twoFactorToken = twoFactorToken;
      }

      const response = await apiClient.post('/auth/login', loginData);

      if (response.data && response.data.success) {
        // Login usando el contexto
        await login(formData.email, formData.password);
        
        // Recordar email si está marcado
        if (remember) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Limpiar formulario
        setFormData({ email: remember ? formData.email : '', password: '' });
        setTwoFactorToken('');
        setRequiresTwoFactor(false);
        
        // Redirigir
        navigate('/');
        
      } else {
        setErrors({ submit: 'Error en el servidor. Inténtalo de nuevo.' });
      }
      
    } catch {
      setErrors({ submit: 'Error de conexión. Verifica tu internet.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implementar login social real
    setErrors({ submit: `Login con ${provider} no implementado aún` });
  };

  const resetForm = () => {
    setRequiresTwoFactor(false);
    setTwoFactorToken('');
    setErrors({});
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSent(false);
    try {
      await apiClient.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch {
      setForgotError('No se pudo enviar el correo. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-indigo-50 font-sans pb-8">
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={[]}
        currentPage="account"
        onNavigate={() => {}}
        showAppsMenu={false}
      />
      <main className="pt-28 max-w-md mx-auto px-4 flex flex-col items-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            {requiresTwoFactor ? 'Autenticación de dos factores' : 'Iniciar sesión'}
          </h2>
          
          {requiresTwoFactor && (
            <div className="w-full mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <FaShieldAlt />
                <span className="font-medium">Verificación requerida</span>
              </div>
              <p className="text-blue-700 text-sm">
                Ingresa el código de 6 dígitos de tu aplicación de autenticación.
              </p>
            </div>
          )}
          
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {/* Campos de email y contraseña (ocultos durante 2FA) */}
            {!requiresTwoFactor && (
              <>
                {/* Campo Email con ícono */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                
                {/* Campo Contraseña con ícono */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
              </>
            )}

            {/* Campo 2FA */}
            {requiresTwoFactor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="twoFactorToken">
                  Código de autenticación:
                </label>
                <input
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors text-center text-lg font-mono ${
                    errors.twoFactorToken ? 'border-red-300' : 'border-gray-300'
                  }`}
                  name="twoFactorToken"
                  id="twoFactorToken"
                  type="text"
                  placeholder="000000"
                  value={twoFactorToken}
                  onChange={handleChange}
                  maxLength={6}
                />
                {errors.twoFactorToken && <div className="text-red-500 text-sm">{errors.twoFactorToken}</div>}
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el código de 6 dígitos de tu aplicación de autenticación
                </p>
              </div>
            )}
            
            {/* Checkbox mejorado (solo visible en login normal) */}
            {!requiresTwoFactor && (
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span>🔒 Mantener sesión iniciada</span>
              </label>
            )}
            
            {/* Mensaje de error general */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                ❌ {errors.submit}
              </div>
            )}
            
            {/* Botón de login mejorado */}
            <button
              type="submit"
              disabled={isLoading || 
                (requiresTwoFactor ? !twoFactorToken.trim() : (!formData.email || !formData.password)) ||
                (requiresTwoFactor && !!errors.twoFactorToken) ||
                (!requiresTwoFactor && (!!errors.email || !!errors.password))
              }
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {requiresTwoFactor ? 'Verificando...' : 'Iniciando sesión...'}
                </div>
              ) : (
                requiresTwoFactor ? 'Verificar' : 'Entrar'
              )}
            </button>

            {/* Botón para volver atrás en 2FA */}
            {requiresTwoFactor && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                ← Volver
              </button>
            )}

            {/* Botón Olvidé mi contraseña */}
            {!requiresTwoFactor && (
              <button
                type="button"
                className="mt-2 text-sm text-indigo-600 hover:underline w-full text-center"
                onClick={() => setShowForgot(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </form>
          
          {/* Separador y login social (solo en login normal) */}
          {!requiresTwoFactor && (
            <>
              {/* Separador */}
              <div className="w-full flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">O entra con tu cuenta de</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* Botones de login social */}
              <div className="w-full space-y-3">
                <button
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaGoogle className="text-red-500" />
                  Google
                </button>
                
                <button
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaGithub />
                  GitHub
                </button>
                
                <button
                  onClick={() => handleSocialLogin('Apple')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaApple />
                  Apple
                </button>
              </div>
              
              {/* Link de registro mejorado */}
              <div className="text-sm text-center mt-6">
                <span className="text-gray-500">¿Primera vez en Lifehub?</span>{' '}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
                  Crea tu cuenta
                </a>
              </div>
            </>
          )}
        </div>
        
        {/* Footer mejorado */}
        <footer className="mt-12 text-zinc-400 text-xs text-center flex flex-col items-center gap-1">
          <span className="flex items-center gap-2 font-bold text-indigo-700"><FaGlobeEurope/> Lifehub</span>
          <span>© 2025 Lifehub. Todos los derechos reservados.</span>
        </footer>
      </main>

      {/* Modal Olvidé mi contraseña */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500" onClick={() => { setShowForgot(false); setForgotSent(false); setForgotError(''); }}>&times;</button>
            <h3 className="text-lg font-bold mb-4 text-indigo-700">Recuperar contraseña</h3>
            {forgotSent ? (
              <div className="text-green-600 text-center">Correo enviado. Revisa tu bandeja de entrada.</div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Tu email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                />
                {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">Enviar enlace</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;