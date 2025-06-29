import React from 'react';

const testimonials = [
  { name: 'Ana G.', app: 'HabitKit', quote: '¡Por fin una app de hábitos que no me abruma!', avatar: 'A', color: 'bg-indigo-200' },
  { name: 'Luis P.', app: 'TrainingKit', quote: 'Registro mis entrenos en segundos, ¡me motiva mucho!', avatar: 'L', color: 'bg-purple-200' },
  { name: 'Marta S.', app: 'InvoiceKit', quote: 'Facturo a mis clientes sin dolores de cabeza.', avatar: 'M', color: 'bg-pink-200' },
];

const HomeTestimonios = () => (
  <section className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
    {testimonials.map(t => (
      <div key={t.name} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mb-2 ${t.color}`}>{t.avatar}</div>
        <p className="text-sm text-gray-700 text-center mb-1">“{t.quote}”</p>
        <span className="text-xs text-gray-400">— {t.name}</span>
      </div>
    ))}
  </section>
);

export default HomeTestimonios; 