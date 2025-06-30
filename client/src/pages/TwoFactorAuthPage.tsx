import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import apiClient from '../apps/habitkit/utils/api';

const TwoFactorAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup, verify, success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [token, setToken] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    initializeTwoFactor();
  }, []);

  const initializeTwoFactor = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/2fa/init');
      setQrCodeUrl(response.data.qrCode);
      setSecret(response.data.secret);
      setBackupCodes(response.data.backupCodes);
      setStep('setup');
    } catch (error: any) {
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

  const verifyToken = async () => {
    if (!token.trim()) {
      setError('Ingresa el código de verificación');
      return;
    }

    try {
      setIsLoading(true);
      await apiClient.post('/auth/2fa/verify', { token });
      setStep('success');
      setTimeout(() => navigate('/account'), 2000);
    } catch (error: any) {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copiado al portapapeles');
    }).catch(() => {
      alert('No se pudo copiar al portapapeles');
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
              <span className="animate-spin text-2xl">🔄</span>
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
            {showSecret ? <span className="text-lg">🙈</span> : <span className="text-lg">👁️</span>}
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
        onClick={verifyToken}
        disabled={isLoading || !token.trim()}
        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-spin">🔄</span>
            Verificando...
          </div>
        ) : (
          'Verificar y habilitar 2FA'
        )}
      </button>

      {/* Aplicaciones recomendadas */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Aplicaciones recomendadas:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Google Authenticator</li>
          <li>• Authy</li>
          <li>• Microsoft Authenticator</li>
          <li>• 1Password</li>
        </ul>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl">✅</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-800">
        ¡Autenticación de dos factores habilitada!
      </h2>
      <p className="text-gray-600">
        Tu cuenta ahora está protegida con autenticación de dos factores.
        Serás redirigido en unos segundos...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header appName="Lifehub" appLogo="🛡️" />
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Autenticación de Dos Factores
            </h1>
            <p className="text-gray-600 mt-2">
              Protege tu cuenta con una capa adicional de seguridad
            </p>
          </div>

          {step === 'setup' && renderSetupStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthPage; 