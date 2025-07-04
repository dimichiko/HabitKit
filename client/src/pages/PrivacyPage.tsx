import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { Helmet } from 'react-helmet-async';

const PrivacyPage: React.FC = () => {
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Helmet>
        <title>Política de Privacidad - Lifehub</title>
        <meta name="description" content="Conoce cómo protegemos tu privacidad en Lifehub. Tu información está segura con nosotros." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="privacy"
      />
      <main className="pt-28 max-w-4xl mx-auto px-4 flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Política de Privacidad</h1>
          <p className="text-gray-600 mb-6">Última actualización: Enero 2024</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Información que recopilamos</h2>
              <p className="text-gray-600 mb-4">
                Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
                utilizas nuestros servicios o te comunicas con nosotros.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Información de contacto (nombre, email)</li>
                <li>Datos de uso de nuestras aplicaciones</li>
                <li>Información técnica del dispositivo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cómo utilizamos tu información</h2>
              <p className="text-gray-600 mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Mejorar la funcionalidad de nuestras aplicaciones</li>
                <li>Comunicarnos contigo sobre actualizaciones</li>
                <li>Garantizar la seguridad de nuestros servicios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Protección de datos</h2>
              <p className="text-gray-600 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información 
                personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tus derechos</h2>
              <p className="text-gray-600 mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contacto</h2>
              <p className="text-gray-600">
                Si tienes preguntas sobre esta política de privacidad, contáctanos en: 
                <a href="mailto:privacy@lifehub.com" className="text-indigo-600 hover:text-indigo-700 ml-1">
                  privacy@lifehub.com
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

export default PrivacyPage; 