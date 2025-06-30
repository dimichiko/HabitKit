import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  const { user } = useUser();
  
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center px-4 py-12">
      <Helmet>
        <title>Términos de Uso - Lifehub</title>
        <meta name="description" content="Lee los términos y condiciones de uso de Lifehub. Transparencia y confianza para todos los usuarios." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🟣"
        navigationItems={publicNav}
        currentPage="terms"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) window.location.href = nav.path;
        }}
      />
      <main className="max-w-2xl w-full text-center mt-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">Términos de Uso</h1>
        <div className="bg-white rounded-xl shadow-md p-6 text-left">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">🔒 Uso aceptable</h2>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Usarás las apps de forma legal y respetuosa.</li>
              <li>No revenderás ni replicarás sus funcionalidades.</li>
              <li>No uses Lifehub para actividades ilegales.</li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">💳 Pago y acceso</h2>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Acceso a todas las apps con una suscripción activa.</li>
              <li>Puedes cancelar en cualquier momento, pero no hay reembolsos por ciclos activos.</li>
              <li>Las suscripciones no son reembolsables una vez iniciado el período.</li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">⚙️ Modificaciones del servicio</h2>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Lifehub es un conjunto de herramientas digitales en constante evolución.</li>
              <li>Lifehub puede actualizar, eliminar o modificar apps sin previo aviso.</li>
              <li>No hay garantía de uptime ni de continuidad de funciones específicas.</li>
            </ul>
          </div>
          <div className="text-gray-600 mb-2">Consulta también nuestra <a href="/privacy" className="text-indigo-600 underline">Política de Privacidad</a>.</div>
          <div className="text-gray-400 text-sm mb-2">Última actualización: 2024-06-24</div>
          <p className="text-gray-500">Para dudas legales, contáctanos a <a href="mailto:hola@kitapp.com" className="underline">hola@kitapp.com</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage; 