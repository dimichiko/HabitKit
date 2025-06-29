import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { FaSearch, FaTools, FaBalanceScale, FaCookieBite, FaLock, FaShieldAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  const { user } = useUser();
  
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 flex flex-col items-center px-4 py-12">
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
          if (nav) window.location.href = nav.path;
        }}
      />
      <div className="max-w-2xl w-full text-center mt-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4 flex items-center justify-center gap-2">
          <span className="text-3xl">🌐</span> Política de Privacidad de Lifehub
        </h1>
        {/* Tabla de contenido sticky */}
        <nav className="sticky top-4 z-10 bg-white/80 rounded-xl shadow mb-8 py-3 px-4 flex flex-wrap gap-3 justify-center border border-gray-200">
          <a href="#datos" className="text-indigo-600 hover:underline flex items-center gap-1"><FaSearch /> Datos que recopilamos</a>
          <a href="#uso" className="text-indigo-600 hover:underline flex items-center gap-1"><FaTools /> Uso de datos</a>
          <a href="#rights" className="text-indigo-600 hover:underline flex items-center gap-1"><FaBalanceScale /> Tus derechos</a>
          <a href="#cookies" className="text-indigo-600 hover:underline flex items-center gap-1"><FaCookieBite /> Cookies</a>
          <a href="#seguridad" className="text-indigo-600 hover:underline flex items-center gap-1"><FaLock /> Seguridad</a>
        </nav>
        <div className="bg-white rounded-xl shadow-md p-8 text-left flex flex-col gap-10 border border-gray-200">
          {/* Responsable legal */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2"><FaShieldAlt className="text-indigo-600" /><span className="font-bold text-indigo-700">Responsable del tratamiento</span></div>
            <p className="text-gray-700 text-sm mb-1">Lifehub SpA · contacto: <a href="mailto:soporte@lifehub.app" className="underline text-indigo-600">soporte@lifehub.app</a></p>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">Cumplimos con la Ley 19.628 sobre protección de la vida privada (Chile)</span>
          </div>
          {/* Bloque: Datos */}
          <div id="datos">
            <h2 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2"><FaSearch /> 🔍 Los datos que recopilamos</h2>
            <p className="text-gray-600 mb-2">Recopilamos solo la información necesaria para brindarte una experiencia personalizada y segura.</p>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Nombre y correo para tu cuenta</li>
              <li>Datos de uso de las apps (solo para mejorar el servicio)</li>
            </ul>
            <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">Nunca vendemos tus datos</span>
          </div>
          {/* Bloque: Uso */}
          <div id="uso">
            <h2 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2"><FaTools /> 🔧 Cómo usamos tu información</h2>
            <p className="text-gray-600 mb-2">Utilizamos tus datos para que puedas acceder a Lifehub y para mejorar continuamente nuestras herramientas.</p>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Para darte acceso a las apps</li>
              <li>Para mejorar la experiencia y seguridad</li>
            </ul>
          </div>
          {/* Bloque: Derechos */}
          <div id="rights">
            <h2 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2"><FaBalanceScale /> ⚖️ Tus derechos</h2>
            <p className="text-gray-600 mb-2">Tienes control total sobre tu información personal y puedes ejercer tus derechos en cualquier momento.</p>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Puedes acceder a tus datos personales.</li>
              <li>Puedes solicitar su modificación o eliminación.</li>
              <li>Puedes cerrar tu cuenta en cualquier momento desde el panel de usuario o escribiendo a <a href="mailto:soporte@lifehub.app" className="underline">soporte@lifehub.app</a>.</li>
            </ul>
          </div>
          {/* Bloque: Cookies */}
          <div id="cookies">
            <h2 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2"><FaCookieBite /> 🍪 Cookies</h2>
            <p className="text-gray-600 mb-2">Lifehub no utiliza cookies de seguimiento ni tecnologías de terceros para mostrar anuncios. Solo usamos cookies esenciales para el funcionamiento de la app.</p>
          </div>
          {/* Bloque: Seguridad */}
          <div id="seguridad">
            <h2 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2"><FaLock /> 🔒 Seguridad y almacenamiento</h2>
            <p className="text-gray-600 mb-2">Tus datos están almacenados en servidores seguros. Solo el equipo de Lifehub tiene acceso interno, y nunca se comparten con terceros.</p>
          </div>
          <div className="text-gray-400 text-sm mb-2">Última revisión: 23 de junio de 2025. Puedes consultar versiones anteriores escribiéndonos.</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage; 