import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
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
        <title>Política de Privacidad - Lifehub</title>
        <meta name="description" content="Consulta la política de privacidad de Lifehub. Descubre cómo protegemos y usamos tus datos personales." />
      </Helmet>
      
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="privacy"
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
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Política de Privacidad</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros. Descubre cómo protegemos y utilizamos tu información personal.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-8">
            {/* Responsable legal */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-indigo-600">🛡️</span>
                Responsable del tratamiento
              </h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Lifehub SpA</strong><br />
                  Contacto: <a href="mailto:soporte@lifehub.app" className="text-indigo-600 hover:underline">soporte@lifehub.app</a>
                </p>
                <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-semibold">
                  Cumplimos con la Ley 19.628 sobre protección de la vida privada (Chile)
                </span>
              </div>
            </section>

            {/* Datos que recopilamos */}
            <section id="datos">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">🔍</span>
                Los datos que recopilamos
              </h2>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Recopilamos solo la información necesaria para brindarte una experiencia personalizada y segura.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Información de cuenta</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Nombre y apellido</li>
                    <li>• Correo electrónico</li>
                    <li>• Contraseña (encriptada)</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Datos de uso</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Actividad en las aplicaciones</li>
                    <li>• Preferencias de configuración</li>
                    <li>• Métricas de rendimiento</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                  Nunca vendemos tus datos a terceros
                </span>
              </div>
            </section>

            {/* Cómo usamos tu información */}
            <section id="uso">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">🛠️</span>
                Cómo usamos tu información
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos tus datos exclusivamente para brindarte acceso a Lifehub y mejorar continuamente nuestras herramientas.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block">🚀</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Acceso a apps</h3>
                  <p className="text-xs text-gray-600">Para darte acceso a todas las aplicaciones</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block">📊</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Mejoras</h3>
                  <p className="text-xs text-gray-600">Para mejorar la experiencia de usuario</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block">🔒</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Seguridad</h3>
                  <p className="text-xs text-gray-600">Para proteger tu cuenta y datos</p>
                </div>
              </div>
            </section>

            {/* Tus derechos */}
            <section id="rights">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">⚖️</span>
                Tus derechos
              </h2>
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Tienes control total sobre tu información personal y puedes ejercer tus derechos en cualquier momento.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Acceso y modificación</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Puedes acceder a tus datos personales</li>
                    <li>• Puedes solicitar su modificación</li>
                    <li>• Puedes actualizar tu información desde tu cuenta</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Eliminación y portabilidad</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Puedes solicitar la eliminación de datos</li>
                    <li>• Puedes exportar tu información</li>
                    <li>• Puedes cerrar tu cuenta en cualquier momento</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  Para ejercer estos derechos, contacta a <a href="mailto:soporte@lifehub.app" className="text-indigo-600 hover:underline">soporte@lifehub.app</a>
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">🍪</span>
                Cookies y tecnologías
              </h2>
              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Lifehub no utiliza cookies de seguimiento ni tecnologías de terceros para mostrar anuncios. 
                  Solo usamos cookies esenciales para el funcionamiento de la aplicación.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies que usamos</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Sesión de usuario</li>
                    <li>• Preferencias de idioma</li>
                    <li>• Configuraciones de tema</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Lo que NO hacemos</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• No rastreamos tu actividad</li>
                    <li>• No vendemos datos a terceros</li>
                    <li>• No mostramos anuncios personalizados</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seguridad */}
            <section id="seguridad">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">🔒</span>
                Seguridad y almacenamiento
              </h2>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  Tus datos están almacenados en servidores seguros con encriptación de nivel bancario. 
                  Solo el equipo autorizado de Lifehub tiene acceso interno.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block">🔐</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Encriptación</h3>
                  <p className="text-xs text-gray-600">SSL/TLS en todas las conexiones</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block">🏢</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Servidores seguros</h3>
                  <p className="text-xs text-gray-600">Infraestructura de nivel empresarial</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block">👥</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Acceso limitado</h3>
                  <p className="text-xs text-gray-600">Solo personal autorizado</p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-indigo-600">📞</span>
                ¿Tienes preguntas sobre privacidad?
              </h2>
              <p className="text-gray-600 mb-4">
                Si tienes alguna duda sobre cómo manejamos tu información, estamos aquí para ayudarte.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="mailto:soporte@lifehub.app" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-center"
                >
                  Contactar soporte
                </a>
                <button 
                  onClick={() => navigate('/terms')}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  Ver términos de uso
                </button>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última revisión: 7 de enero de 2025. Puedes consultar versiones anteriores escribiéndonos.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage; 