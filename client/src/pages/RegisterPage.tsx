// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../apps/habitkit/utils/api';
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaShieldAlt, FaMobileAlt, FaEnvelope, FaUser } from 'react-icons/fa';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas y números';
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      localStorage.setItem('token', data.token);
      if (data.user && data.user.role) localStorage.setItem('userRole', data.user.role);
      navigate('/');
    } catch (error: any) {
      // Manejo mejorado de errores
      if (error.response?.data?.errors) {
        // Errores de validación de express-validator
        const newErrors: FormErrors = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.param) {
            newErrors[err.param as keyof FormErrors] = err.msg;
          }
        });
        setErrors({ ...newErrors, submit: 'Corrige los errores del formulario.' });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Error al crear la cuenta' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const checkStrength = (pwd: string) => {
    if (!pwd) return '';
    if (pwd.length < 8) return 'Débil';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/.test(pwd)) return 'Fuerte';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd)) return 'Media';
    return 'Débil';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-2">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        {/* Branding/logo */}
        <div className="mb-4 flex flex-col items-center">
          <div className="text-4xl mb-2">🟣</div>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">Crear cuenta</h2>
          <p className="text-gray-500 text-center mt-2 text-base">Comienza con HabitKit. Apps que simplifican tu rutina.</p>
        </div>
        <form className="w-full mt-6 space-y-5" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 text-center text-sm" role="alert">
              <span>{errors.submit}</span>
            </div>
          )}
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={`rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full py-3 pl-10 pr-3 text-sm transition`}
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={`rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full py-3 pl-10 pr-3 text-sm transition`}
                placeholder="tu@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="relative">
              <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                pattern="^\+?\d{0,3}\s?\d{1,3}\s?\d{4,}$"
                className={`rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full py-3 pl-10 pr-3 text-sm transition`}
                placeholder="+56 9 1234 5678"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className={`rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full py-3 pl-10 pr-10 text-sm transition`}
                placeholder="Contraseña"
                value={formData.password}
                onChange={e => {
                  setFormData({ ...formData, password: e.target.value });
                  setPasswordStrength(checkStrength(e.target.value));
                }}
              />
              <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Indicador de seguridad */}
            {formData.password && (
              <div className="flex items-center gap-2 mt-1 text-xs">
                {passwordStrength === 'Débil' && <FaShieldAlt className="text-red-400" />} 
                {passwordStrength === 'Media' && <FaShieldAlt className="text-yellow-400" />} 
                {passwordStrength === 'Fuerte' && <FaCheckCircle className="text-green-500" />} 
                <span className={
                  passwordStrength === 'Débil' ? 'text-red-500' :
                  passwordStrength === 'Media' ? 'text-yellow-600' :
                  passwordStrength === 'Fuerte' ? 'text-green-600' : 'text-gray-400'
                }>
                  {passwordStrength ? `Seguridad: ${passwordStrength}` : ''}
                </span>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className={`rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full py-3 pl-10 pr-10 text-sm transition`}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          {/* Checkbox términos */}
          <div className="flex items-center gap-2 mt-2">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 select-none">
              Acepto los <a href="/terms" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Términos de uso</a> y la <a href="/privacy" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Política de privacidad</a>
            </label>
          </div>
          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold text-base mt-2 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>}
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          {/* Link login */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-indigo-600 hover:underline font-medium">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </form>
        {/* Mensaje de confianza */}
        <div className="text-xs text-gray-400 text-center mt-6 mb-2">Tu información está segura con nosotros. No compartimos tus datos.</div>
        {/* Mensaje de verificación */}
        <div className="text-xs text-indigo-500 text-center mb-2">Te enviaremos un correo para verificar tu cuenta.</div>
        {/* Beneficios */}
        <ul className="w-full mt-4 text-xs text-gray-600 space-y-1 border-t pt-4">
          <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Apps esenciales sin anuncios</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Una sola cuenta para todo</li>
          <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Siempre puedes cancelar</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterPage;