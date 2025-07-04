import React from 'react';

const apps = [
  {
    name: 'HabitKit',
    icon: '✅',
    desc: 'Hábitos diarios',
    comingSoon: 'Próximamente en móvil',
  },
  {
    name: 'CalorieKit',
    icon: '🍎',
    desc: 'Control nutricional',
    comingSoon: 'Próximamente en móvil',
  },
  {
    name: 'InvoiceKit',
    icon: '📄',
    desc: 'Facturas simples',
    comingSoon: 'Próximamente en móvil',
  },
  {
    name: 'TrainingKit',
    icon: '🏋️',
    desc: 'Registro de entrenos',
    comingSoon: 'Próximamente en móvil',
  },
];

const HomeAppsSection = () => (
  <section className="w-full max-w-4xl mx-auto mb-16">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Apps disponibles</h2>
      <p className="text-lg text-gray-600">Elige las herramientas que necesitas para organizar tu vida</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {apps.map(app => (
        <div
          key={app.name}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center border border-gray-100 relative"
        >
          <span className="text-4xl mb-3">{app.icon}</span>
          <span className="font-bold text-lg text-gray-800 mb-2">{app.name}</span>
          <span className="text-gray-600 text-sm text-center mb-3">{app.desc}</span>
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">
            {app.comingSoon}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default HomeAppsSection; 