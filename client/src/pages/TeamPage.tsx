import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  emoji: string;
  description: string;
}

const team: TeamMember[] = [
  {
    name: 'Dimi',
    role: 'Fundador & Dev',
    emoji: '👨‍💻',
    description: 'Creador de Lifehub, apasionado por la productividad y el diseño simple.'
  },
  {
    name: 'Sofi',
    role: 'Diseño UX/UI',
    emoji: '🎨',
    description: 'Encargada de que todo sea intuitivo y visualmente atractivo.'
  },
  {
    name: 'Lucas',
    role: 'Soporte',
    emoji: '💬',
    description: 'Siempre listo para ayudar a los usuarios con cualquier duda.'
  }
];

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Equipo</h1>
          <p className="text-xl text-gray-600">Personas detrás de Lifehub</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">{member.emoji}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h2>
              <div className="text-indigo-600 font-medium mb-2">{member.role}</div>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage; 