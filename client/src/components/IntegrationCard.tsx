import React from 'react';

interface IntegrationCardProps {
  name: string;
  description: string;
  emoji: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ name, description, emoji }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center">
      <div className="text-5xl mb-4">{emoji}</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{name}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default IntegrationCard; 