import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';

const TwoFactorAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'success'>('setup');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initializeTwoFactor();
  }, []);

  const initializeTwoFactor = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Simulación de datos para demo
      setTimeout(() => {
        setQrCodeUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMjQiIHk9IjI0IiB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjMyIiB5PSIzMiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNDgiIHk9IjQ4IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjU2IiB5PSI1NiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');
        setSecret('JBSWY3DPEHPK3PXP');
        setBackupCodes(['123456', '234567', '345678', '456789', '567890', '678901', '789012', '890123']);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Error al inicializar 2FA. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  const verifyToken = async () => {
    if (!token.trim()) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Simulación de verificación
      setTimeout(() => {
        if (token === '123456') {
          setStep('success');
          setTimeout(() => {
            navigate('/account');
          }, 2000);
        } else {
          setError('Código inválido. Intenta de nuevo.');
        }
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Error al verificar el código. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Código copiado al portapapeles');
    }).catch(() => {
      alert('No se pudo copiar al portapapeles');
    });
  };

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'account', label: '👤 Cuenta', path: '/account' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 overflow-hidden">
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="2fa"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) navigate(nav.path);
        }}
      />
      
      <main className="h-screen pt-28 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          {/* Error Alert - Fixed position */}
          {error && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm shadow-lg">
              {error}
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡2FA configurado exitosamente!</h2>
              <p className="text-gray-600 mb-4">
                Tu cuenta ahora está protegida con autenticación de dos factores.
              </p>
              <div className="text-sm text-gray-500">
                Redirigiendo a tu cuenta...
              </div>
            </div>
          )}

          {/* Setup Step - Two Column Layout */}
          {step === 'setup' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - QR and Setup */}
              <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-center">
                {/* Hero Section */}
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Autenticación en 2 Pasos</h1>
                  <p className="text-gray-600 text-sm">Protege tu cuenta con una capa adicional de seguridad</p>
                </div>

                {/* QR Code */}
                <div className="text-center mb-4">
                  <h2 className="text-base font-semibold text-gray-800 mb-2">Escanea el código QR</h2>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 inline-block">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="Código QR para 2FA" 
                        className="w-36 h-36"
                      />
                    ) : (
                      <div className="w-36 h-36 bg-gray-100 flex items-center justify-center rounded-lg">
                        <span className="animate-spin text-2xl">🔄</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Secret */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Código secreto (si no puedes escanear):
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={secret}
                      readOnly
                      className="w-full px-2 py-1 pr-8 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showSecret ? <span className="text-xs">🙈</span> : <span className="text-xs">👁️</span>}
                    </button>
                  </div>
                  <button
                    onClick={() => copyToClipboard(secret)}
                    className="mt-1 text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Copiar código
                  </button>
                </div>

                {/* Backup Codes */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Códigos de respaldo:
                  </label>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                    {showBackupCodes ? (
                      <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="bg-white px-1 py-1 rounded border text-center">
                            {code}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowBackupCodes(true)}
                        className="w-full py-1 text-indigo-600 hover:text-indigo-500 font-medium border-2 border-dashed border-indigo-200 rounded-lg hover:border-indigo-300 transition-colors text-xs"
                      >
                        Mostrar códigos de respaldo
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Guarda estos códigos en un lugar seguro.
                  </p>
                </div>
              </div>

              {/* Right Column - Verification */}
              <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Verificar configuración</h2>
                  <p className="text-gray-600 text-sm">Ingresa el código de tu aplicación de autenticación</p>
                </div>

                {/* Verification Input */}
                <div className="mb-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Ingresa el código de 6 dígitos de tu app
                  </p>
                </div>

                {/* Verify Button */}
                <button
                  onClick={verifyToken}
                  disabled={isLoading || !token.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      Verificando...
                    </div>
                  ) : (
                    'Verificar y habilitar 2FA'
                  )}
                </button>

                {/* Recommended Apps */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 text-center text-sm">Aplicaciones recomendadas:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-blue-200 text-center hover:shadow-md transition-shadow">
                      <span className="text-lg block mb-1">📱</span>
                      <p className="font-medium text-xs">Google Authenticator</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-200 text-center hover:shadow-md transition-shadow">
                      <span className="text-lg block mb-1">🔐</span>
                      <p className="font-medium text-xs">Authy</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-200 text-center hover:shadow-md transition-shadow">
                      <span className="text-lg block mb-1">🛡️</span>
                      <p className="font-medium text-xs">1Password</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-200 text-center hover:shadow-md transition-shadow">
                      <span className="text-lg block mb-1">🔑</span>
                      <p className="font-medium text-xs">Microsoft Authenticator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TwoFactorAuthPage; 