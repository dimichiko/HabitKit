import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '⚡',
    title: 'Rápido y ligero',
    description: 'Apps que cargan al instante y no consumen recursos.'
  },
  {
    icon: '🔒',
    title: 'Privacidad',
    description: 'Tus datos están protegidos y nunca se comparten.'
  },
  {
    icon: '🧩',
    title: 'Modular',
    description: 'Elige solo las apps que necesitas, sin bloatware.'
  },
  {
    icon: '📱',
    title: 'Multi-dispositivo',
    description: 'Accede desde móvil, tablet o PC sin límites.'
  },
  {
    icon: '🌙',
    title: 'Modo oscuro',
    description: 'Cuida tu vista con un diseño adaptable.'
  },
  {
    icon: '🚀',
    title: 'Actualizaciones constantes',
    description: 'Mejoras y nuevas funciones cada mes.'
  }
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Características</h1>
          <p className="text-xl text-gray-600">Descubre por qué Lifehub es diferente</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage; 