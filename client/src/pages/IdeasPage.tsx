import React, { useState } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { Helmet } from 'react-helmet-async';

interface Idea {
  id: number;
  text: string;
  author: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
}

const IdeasPage: React.FC = () => {
  const [ideas] = useState<Idea[]>([
    {
      id: 1,
      text: "Me encantaría una app para organizar recetas y planificar comidas semanales",
      author: "María G.",
      likes: 24,
      dislikes: 2,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      text: "¿Podrían hacer una microapp para gestionar gastos compartidos entre roommates?",
      author: "Carlos L.",
      likes: 18,
      dislikes: 1,
      createdAt: new Date('2024-01-14')
    },
    {
      id: 3,
      text: "Una app para tracking de lectura y gestión de biblioteca personal sería genial",
      author: "Lucía M.",
      likes: 31,
      dislikes: 0,
      createdAt: new Date('2024-01-13')
    },
    {
      id: 4,
      text: "App para meditación y mindfulness con recordatorios personalizados",
      author: "Ana R.",
      likes: 42,
      dislikes: 3,
      createdAt: new Date('2024-01-12')
    },
    {
      id: 5,
      text: "Herramienta para organizar eventos y recordatorios importantes",
      author: "Diego S.",
      likes: 15,
      dislikes: 1,
      createdAt: new Date('2024-01-11')
    }
  ]);

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-indigo-50 font-sans pb-8">
      <Helmet>
        <title>Ideas y Sugerencias - Lifehub</title>
        <meta name="description" content="Comparte tus ideas y sugerencias para mejorar Lifehub. ¡Tu opinión nos importa!" />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="ideas"
      />
      <main className="pt-28 max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">💡 Ideas y Sugerencias</h1>
          <p className="text-lg text-gray-700">Comparte tus ideas para mejorar Lifehub</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">¿Tienes una idea?</h2>
          <p className="text-gray-600 mb-4">
            Nos encanta recibir sugerencias de nuestra comunidad. Si tienes una idea para una nueva app o mejora, 
            envíanos un mensaje a través de nuestra página de contacto.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Enviar sugerencia
          </a>
        </div>

        <div className="space-y-4">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-800 text-lg mb-4">{idea.text}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600">
                      ❤️
                      <span>{idea.likes}</span>
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600">
                      👎
                      <span>{idea.dislikes}</span>
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    por {idea.author} • {formatDate(idea.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-8">
          <p className="text-gray-600">
            ¿Te gusta alguna de estas ideas? ¡Vota con tu opinión!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IdeasPage; 