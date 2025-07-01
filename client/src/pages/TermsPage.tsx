import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const TermsPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Helmet>
        <title>Términos de Uso - Lifehub</title>
        <meta name="description" content="Lee los términos y condiciones de uso de Lifehub. Transparencia y confianza para todos los usuarios." />
      </Helmet>
      
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="terms"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) navigate(nav.path);
        }}
      />
      
      <main className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Términos y Condiciones</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lee atentamente estos términos antes de usar Lifehub. Al continuar, aceptas cumplir con todas las condiciones establecidas.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-8">
            {/* Uso de la Plataforma */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">🚀</span>
                Uso de la Plataforma
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Al utilizar Lifehub, aceptas cumplir con todas las normas y políticas establecidas. 
                  El uso indebido puede resultar en la suspensión de la cuenta.
                </p>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Debes proporcionar información veraz y actualizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>No puedes usar la plataforma para actividades ilegales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Eres responsable de mantener la seguridad de tu cuenta</span>
                </li>
              </ul>
            </section>

            {/* Privacidad */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">🔒</span>
                Privacidad y Datos
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Nos comprometemos a proteger tu información personal. 
                  Consulta nuestra política de privacidad para más detalles sobre cómo manejamos tus datos.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Datos que recopilamos</h3>
                  <p className="text-sm text-gray-600">Información básica para tu cuenta y uso de las aplicaciones</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Cómo los protegemos</h3>
                  <p className="text-sm text-gray-600">Encriptación avanzada y servidores seguros</p>
                </div>
              </div>
            </section>

            {/* Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">📝</span>
                Modificaciones
              </h2>
              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Lifehub se reserva el derecho de modificar estos términos en cualquier momento. 
                  Te notificaremos sobre cambios importantes a través de tu correo electrónico.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Notificaciones de cambios</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Recibirás un email 30 días antes de cambios importantes</li>
                  <li>• Los cambios menores se publicarán en esta página</li>
                  <li>• Puedes cancelar tu cuenta si no estás de acuerdo</li>
                </ul>
              </div>
            </section>

            {/* Responsabilidades */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">⚖️</span>
                Responsabilidades
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Nuestras responsabilidades</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Mantener la plataforma funcionando</li>
                    <li>• Proteger tu información personal</li>
                    <li>• Proporcionar soporte técnico</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Tus responsabilidades</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Usar la plataforma correctamente</li>
                    <li>• Mantener segura tu cuenta</li>
                    <li>• Respetar los derechos de otros usuarios</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-indigo-600">📞</span>
                ¿Tienes preguntas?
              </h2>
              <p className="text-gray-600 mb-4">
                Si tienes alguna duda sobre estos términos, no dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="mailto:soporte@lifehub.app" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-center"
                >
                  Contactar soporte
                </a>
                <button 
                  onClick={() => navigate('/privacy')}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  Ver política de privacidad
                </button>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última actualización: 7 de enero de 2025
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage; 