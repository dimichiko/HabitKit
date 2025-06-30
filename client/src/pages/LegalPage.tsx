import React from 'react';

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Aviso Legal</h1>
          <p className="text-xl text-gray-600">Información legal y condiciones de uso</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsabilidad</h2>
          <p className="text-gray-600 mb-4">
            Lifehub no se hace responsable por el uso indebido de la plataforma ni por daños derivados del uso de las aplicaciones.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Propiedad Intelectual</h2>
          <p className="text-gray-600 mb-4">
            Todo el contenido, marcas y logotipos son propiedad de sus respectivos dueños. Queda prohibida la reproducción sin autorización.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jurisdicción</h2>
          <p className="text-gray-600">
            Cualquier disputa será resuelta bajo la legislación vigente en Argentina.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage; 