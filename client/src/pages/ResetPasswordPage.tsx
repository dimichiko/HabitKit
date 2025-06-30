import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface PasswordStrength {
  label: string;
  color: string;
}

interface ResetPasswordForm {
  password: string;
  confirm: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score < 2) return { label: 'Débil', color: 'bg-red-400' };
  if (score < 4) return { label: 'Media', color: 'bg-yellow-400' };
  return { label: 'Fuerte', color: 'bg-green-500' };
};

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordForm>({
    password: '',
    confirm: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const token = searchParams.get('token');
  const strength = getPasswordStrength(formData.password);
  const isLengthValid = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasNumbers = /[0-9]/.test(formData.password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirm && formData.confirm.length > 0;

  const handleInputChange = (field: keyof ResetPasswordForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    if (!isLengthValid) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!token) {
      setError('Token de reset inválido');
      return;
    }

    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Contraseña actualizada exitosamente');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-2">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center" style={{paddingTop: 40, paddingBottom: 40}}>
        {/* Logo y branding */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-2" aria-label="Lifehub logo">🌐</span>
          <h1 className="text-2xl font-bold text-indigo-700 mb-1">Lifehub</h1>
          <p className="text-gray-500 text-sm text-center">Crea una nueva contraseña segura para tu cuenta de Lifehub</p>
        </div>
        {success ? (
          <div className="text-green-600 text-center">Contraseña actualizada. Redirigiendo...</div>
        ) : (
          <form className="w-full space-y-5" onSubmit={handleSubmit} autoComplete="off">
            {/* Input contraseña */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                placeholder="Nueva contraseña"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                aria-label="Nueva contraseña"
                minLength={8}
              />
              <button 
                type="button" 
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Indicador de fuerza */}
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-2 rounded-full transition-all duration-300 ${strength.color}`} style={{width: 60}}></div>
              <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>
            </div>
            {/* Validaciones en vivo */}
            <ul className="text-xs text-gray-500 mb-2 space-y-1">
              <li className={isLengthValid ? 'text-green-600' : ''}>• Mínimo 8 caracteres</li>
              <li className={hasUpperCase ? 'text-green-600' : ''}>• Al menos una mayúscula</li>
              <li className={hasLowerCase ? 'text-green-600' : ''}>• Al menos una minúscula</li>
              <li className={hasNumbers ? 'text-green-600' : ''}>• Al menos un número</li>
              <li className={hasSpecialChar ? 'text-green-600' : ''}>• Al menos un símbolo</li>
            </ul>
            {/* Input confirmar */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                placeholder="Confirmar contraseña"
                value={formData.confirm}
                onChange={handleInputChange('confirm')}
                required
                aria-label="Confirmar contraseña"
                minLength={8}
              />
              <button 
                type="button" 
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Coincidencia */}
            <div className="text-xs mb-2" aria-live="polite">
              {formData.confirm.length > 0 && (passwordsMatch ? <span className="text-green-600">Las contraseñas coinciden</span> : <span className="text-red-500">Las contraseñas no coinciden</span>)}
            </div>
            {error && <div className="text-red-500 text-sm" aria-live="assertive">{error}</div>}
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLoading ? 'animate-pulse' : ''}`}
              disabled={isLoading || !isLengthValid || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar || !passwordsMatch}
              aria-label="Cambiar contraseña"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Cambiando...
                </>
              ) : (
                'Cambiar contraseña'
              )}
            </button>
            <div className="text-xs text-gray-400 mt-2 text-center">
              ℹ️ Este enlace es válido por una hora. Si no solicitaste este cambio, ignora este mensaje.
            </div>
            <div className="text-center mt-4">
              <a href="mailto:soporte@lifehub.app" className="text-indigo-600 hover:underline text-sm" tabIndex={0}>¿Tienes problemas? Contáctanos</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 