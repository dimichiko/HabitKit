import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const TermsPage: React.FC = () => {
  const { user } = useUser();
  
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Términos de Uso - Lifehub</title>
        <meta name="description" content="Lee los términos y condiciones de uso de Lifehub. Transparencia y confianza para todos los usuarios." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
          <p className="text-xl text-gray-600">Lee atentamente antes de usar Lifehub</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Uso de la Plataforma</h2>
          <p className="text-gray-600 mb-4">
            Al utilizar Lifehub, aceptas cumplir con todas las normas y políticas establecidas. El uso indebido puede resultar en la suspensión de la cuenta.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacidad</h2>
          <p className="text-gray-600 mb-4">
            Nos comprometemos a proteger tu información personal. Consulta nuestra política de privacidad para más detalles.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Modificaciones</h2>
          <p className="text-gray-600">
            Lifehub se reserva el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios importantes.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage; 