import React from 'react';

const apps = [
  {
    name: 'TrainingKit',
    icon: '🏋️',
    desc: 'Registro de entrenos',
    path: '/trainingkit',
    bg: 'bg-white',
  },
  {
    name: 'HabitKit',
    icon: '✅',
    desc: 'Hábitos diarios',
    path: '/habitkit',
    bg: 'bg-indigo-50',
  },
  {
    name: 'InvoiceKit',
    icon: '📄',
    desc: 'Facturas simples',
    path: '/invoicekit',
    bg: 'bg-gray-50',
  },
];

const HomeAppsSection = ({ onAppClick }) => (
  <section className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
    {apps.map(app => (
      <button
        key={app.name}
        type="button"
        onClick={() => onAppClick ? onAppClick(app.path) : window.location.assign(app.path)}
        className={`rounded-xl shadow p-6 flex flex-col items-center justify-center transition hover:scale-105 ${app.bg}`}
        style={{ cursor: 'pointer' }}
      >
        <span className="text-4xl mb-2">{app.icon}</span>
        <span className="font-bold text-lg text-indigo-700 mb-1">{app.name}</span>
        <span className="text-gray-500 text-sm text-center">{app.desc}</span>
      </button>
    ))}
  </section>
);

export default HomeAppsSection; 