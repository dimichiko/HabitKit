import React from 'react';

const apps = [
  {
    name: 'HabitKit',
    icon: '✅',
    desc: 'Hábitos diarios',
    path: '/apps/habitkit',
  },
  {
    name: 'CalorieKit',
    icon: '🍎',
    desc: 'Control nutricional',
    path: '/apps/caloriekit',
  },
  {
    name: 'InvoiceKit',
    icon: '📄',
    desc: 'Facturas simples',
    path: '/apps/invoicekit',
  },
  {
    name: 'TrainingKit',
    icon: '🏋️',
    desc: 'Registro de entrenos',
    path: '/apps/trainingkit',
  },
];

const HomeAppsSection = ({ onAppClick }: { onAppClick: any }) => (
  <section className="w-full max-w-4xl mx-auto mb-16">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Apps disponibles</h2>
      <p className="text-lg text-gray-600">Elige las herramientas que necesitas para organizar tu vida</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {apps.map(app => (
        <button
          key={app.name}
          type="button"
          onClick={() => onAppClick ? onAppClick(app.path) : window.location.assign(app.path)}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-100"
          style={{ cursor: 'pointer' }}
        >
          <span className="text-4xl mb-3">{app.icon}</span>
          <span className="font-bold text-lg text-gray-800 mb-2">{app.name}</span>
          <span className="text-gray-600 text-sm text-center">{app.desc}</span>
        </button>
      ))}
    </div>
  </section>
);

export default HomeAppsSection; 