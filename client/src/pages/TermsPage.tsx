import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { Helmet } from 'react-helmet-async';

const TermsPage: React.FC = () => {
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Helmet>
        <title>Términos de Uso - Lifehub</title>
        <meta name="description" content="Consulta los términos de uso de Lifehub. Conoce las condiciones para usar nuestros servicios." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="terms"
      />
      <main className="pt-28 max-w-4xl mx-auto px-4 flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Términos de Uso</h1>
          <p className="text-gray-600 mb-6">Última actualización: Enero 2024</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Aceptación de términos</h2>
              <p className="text-gray-600 mb-4">
                Al acceder y utilizar Lifehub, aceptas estar sujeto a estos términos de uso. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción del servicio</h2>
              <p className="text-gray-600 mb-4">
                Lifehub proporciona aplicaciones modulares para gestión personal, incluyendo herramientas 
                para hábitos, entrenamiento, facturación y nutrición.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Uso aceptable</h2>
              <p className="text-gray-600 mb-4">
                Te comprometes a usar nuestros servicios solo para fines legales y de acuerdo con estos términos.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>No usar los servicios para actividades ilegales</li>
                <li>No intentar acceder a cuentas de otros usuarios</li>
                <li>No interferir con el funcionamiento de los servicios</li>
                <li>No transmitir contenido malicioso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cuenta de usuario</h2>
              <p className="text-gray-600 mb-4">
                Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. 
                Notifica inmediatamente cualquier uso no autorizado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Propiedad intelectual</h2>
              <p className="text-gray-600 mb-4">
                Lifehub y su contenido son propiedad de Lifehub SpA. No se permite la reproducción, 
                distribución o modificación sin autorización.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitación de responsabilidad</h2>
              <p className="text-gray-600 mb-4">
                Lifehub no será responsable por daños indirectos, incidentales o consecuentes 
                que resulten del uso de nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Modificaciones</h2>
              <p className="text-gray-600 mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios serán notificados a través de nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contacto</h2>
              <p className="text-gray-600">
                Si tienes preguntas sobre estos términos, contáctanos en: 
                <a href="mailto:legal@lifehub.com" className="text-indigo-600 hover:text-indigo-700 ml-1">
                  legal@lifehub.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage; 