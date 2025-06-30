import React from 'react';
import IntegrationCard from '../components/IntegrationCard';

interface Integration {
  name: string;
  description: string;
  emoji: string;
}

const integrations: Integration[] = [
  {
    name: 'Google Calendar',
    description: 'Sincroniza tus hábitos y eventos con Google Calendar.',
    emoji: '📅'
  },
  {
    name: 'Apple Health',
    description: 'Importa y exporta datos de salud fácilmente.',
    emoji: '🍏'
  },
  {
    name: 'Zapier',
    description: 'Automatiza tareas conectando Lifehub con miles de apps.',
    emoji: '🤖'
  },
  {
    name: 'Notion',
    description: 'Envía tus registros y hábitos a Notion.',
    emoji: '🗒️'
  }
];

const IntegrationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Integraciones</h1>
          <p className="text-xl text-gray-600">Conecta Lifehub con tus herramientas favoritas</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {integrations.map((integration, idx) => (
            <IntegrationCard
              key={idx}
              name={integration.name}
              description={integration.description}
              emoji={integration.emoji}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage; 