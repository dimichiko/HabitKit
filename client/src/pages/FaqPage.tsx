import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: '¿Cómo cancelo mi suscripción?',
    answer: 'Puedes cancelar tu suscripción desde tu perfil de usuario en cualquier momento.'
  },
  {
    question: '¿Ofrecen reembolsos?',
    answer: 'Sí, ofrecemos reembolsos completos dentro de los primeros 30 días de suscripción.'
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Absolutamente. Utilizamos encriptación de nivel bancario para proteger tu información.'
  },
  {
    question: '¿Tienen soporte en español?',
    answer: 'Sí, todo nuestro equipo de soporte habla español y está disponible 24/7.'
  }
];

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl text-gray-600">Resuelve tus dudas rápidamente</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="mb-8">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">❓</span>
                <h2 className="text-lg font-semibold text-gray-900">{faq.question}</h2>
              </div>
              <p className="text-gray-600 ml-8">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage; 