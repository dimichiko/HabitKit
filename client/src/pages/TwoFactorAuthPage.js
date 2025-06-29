import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import Header from '../shared/components/Header';
import apiClient from '../apps/habitkit/utils/api';

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup, verify, success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [token, setToken] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    initialize2FASetup();
  }, []);

  const initialize2FASetup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/setup-2fa');
      
      if (response.data && response.data.success) {
        const { qrCodeUrl, secret, backupCodes } = response.data.data;
        setQrCodeUrl(qrCodeUrl);
        setSecret(secret);
        setBackupCodes(backupCodes);
        setStep('setup');
      } else {
        setError('Error inicializando 2FA');
      }

    } catch (error) {
      console.error('Error inicializando 2FA:', error);
      
      if (error.response) {
        const { data } = error.response;
        setError(data.message || 'Error inicializando 2FA');
      } else {
        setError('Error de conexión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token.trim()) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/enable-2fa', {
        token: token.trim()
      });

      if (response.data && response.data.success) {
        setStep('success');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/apps');
        }, 3000);
      } else {
        setError('Error habilitando 2FA');
      }

    } catch (error) {
      console.error('Error verificando token:', error);
      
      if (error.response) {
        const { data } = error.response;
        setError(data.message || 'Código de verificación inválido');
      } else {
        setError('Error de conexión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copiado al portapapeles');
    }).catch(() => {
      alert('Error copiando al portapapeles');
    });
  };

  const renderSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Configura la autenticación de dos factores
        </h2>
        <p className="text-gray-600">
          Escanea el código QR con tu aplicación de autenticación
        </p>
      </div>

      {/* Código QR */}
      <div className="text-center">
        <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="Código QR para 2FA" 
              className="w-48 h-48"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
              <FaSpinner className="animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Secreto manual */}
      <div>
        <label htmlFor="secret" className="block text-sm font-medium text-gray-700 mb-2">
          Código secreto (si no puedes escanear el QR):
        </label>
        <div className="relative">
          <input
            id="secret"
            type={showSecret ? 'text' : 'password'}
            value={secret}
            readOnly
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50"
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showSecret ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          onClick={() => copyToClipboard(secret)}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
        >
          Copiar código
        </button>
      </div>

      {/* Códigos de respaldo */}
      <div>
        <label htmlFor="backupCodes" className="block text-sm font-medium text-gray-700 mb-2">
          Códigos de respaldo (guárdalos en un lugar seguro):
        </label>
        <div id="backupCodes" className="bg-gray-50 p-4 rounded-lg">
          {showBackupCodes ? (
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              {backupCodes.map((code, index) => (
                <div key={index} className="bg-white px-2 py-1 rounded border">
                  {code}
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setShowBackupCodes(true)}
              className="w-full py-2 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Mostrar códigos de respaldo
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Estos códigos te permitirán acceder a tu cuenta si pierdes tu dispositivo.
          Cada código solo se puede usar una vez.
        </p>
      </div>

      {/* Verificación */}
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
          Código de verificación:
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="000000"
          maxLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-center text-lg font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ingresa el código de 6 dígitos de tu aplicación de autenticación
        </p>
      </div>

      {/* Botón de verificación */}
      <button
        onClick={handleVerifyToken}
        disabled={isLoading || !token.trim()}
        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" />
            Verificando...
          </div>
        ) : (
          'Verificar y habilitar 2FA'
        )}
      </button>

      {/* Aplicaciones recomendadas */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Aplicaciones recomendadas:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Google Authenticator</li>
          <li>• Authy</li>
          <li>• Microsoft Authenticator</li>
          <li>• 1Password</li>
        </ul>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FaCheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800">
        ¡Autenticación de dos factores habilitada!
      </h2>
      
      <p className="text-gray-600">
        Tu cuenta ahora está protegida con autenticación de dos factores.
        Serás redirigido automáticamente.
      </p>
      
      <div className="text-sm text-gray-500">
        Redirigiendo en 3 segundos...
      </div>
    </div>
  );

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
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full">
          {/* Icono */}
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <FaShieldAlt className="w-10 h-10 text-indigo-600" />
          </div>
          
          {/* Contenido dinámico */}
          {step === 'setup' && renderSetupStep()}
          {step === 'success' && renderSuccessStep()}
          
          {/* Mensaje de error */}
          {error && (
            <div className="mt-4 w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
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

export default TwoFactorAuthPage; 