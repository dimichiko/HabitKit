import React, { useState, useEffect } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaThumbsDown, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

interface Idea {
  id: number;
  text: string;
  author: string;
  authorId: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: Date;
}

const IdeasPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Simular datos iniciales
  useEffect(() => {
    const mockIdeas: Idea[] = [
      {
        id: 1,
        text: 'Me gustaría que HabitKit tenga recordatorios por WhatsApp',
        author: 'María García',
        authorId: 'user1',
        likes: 15,
        dislikes: 2,
        likedBy: ['user2', 'user3'],
        dislikedBy: ['user4'],
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        text: 'Sería genial tener un modo oscuro en InvoiceKit',
        author: 'Carlos López',
        authorId: 'user2',
        likes: 8,
        dislikes: 1,
        likedBy: ['user1'],
        dislikedBy: [],
        createdAt: new Date('2024-01-14')
      }
    ];
    setIdeas(mockIdeas);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    const idea: Idea = {
      id: Date.now(),
      text: newIdea,
      author: user?.name || 'Anónimo',
      authorId: user?.id || 'anonymous',
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      createdAt: new Date()
    };

    setIdeas([idea, ...ideas]);
    setNewIdea('');
    setShowForm(false);
  };

  const handleEdit = (id: number) => {
    const idea = ideas.find(i => i.id === id);
    if (idea) {
      setEditingId(id);
      setEditText(idea.text);
    }
  };

  const handleSaveEdit = (id: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, text: editText } : idea
    ));
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: number) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const handleLike = (id: number) => {
    if (!user) return;

    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        const hasLiked = idea.likedBy.includes(user.id);
        const hasDisliked = idea.dislikedBy.includes(user.id);

        if (hasLiked) {
          // Quitar like
          return {
            ...idea,
            likes: idea.likes - 1,
            likedBy: idea.likedBy.filter((uid: string) => uid !== user.id)
          };
        } else {
          // Agregar like
          return {
            ...idea,
            likes: idea.likes + 1,
            likedBy: [...idea.likedBy, user.id],
            dislikes: hasDisliked ? idea.dislikes - 1 : idea.dislikes,
            dislikedBy: hasDisliked ? idea.dislikedBy.filter((uid: string) => uid !== user.id) : idea.dislikedBy
          };
        }
      }
      return idea;
    }));
  };

  const handleDislike = (id: number) => {
    if (!user) return;

    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        const hasLiked = idea.likedBy.includes(user.id);
        const hasDisliked = idea.dislikedBy.includes(user.id);

        if (hasDisliked) {
          // Quitar dislike
          return {
            ...idea,
            dislikes: idea.dislikes - 1,
            dislikedBy: idea.dislikedBy.filter((uid: string) => uid !== user.id)
          };
        } else {
          // Agregar dislike
          return {
            ...idea,
            dislikes: idea.dislikes + 1,
            dislikedBy: [...idea.dislikedBy, user.id],
            likes: hasLiked ? idea.likes - 1 : idea.likes,
            likedBy: hasLiked ? idea.likedBy.filter((uid: string) => uid !== user.id) : idea.likedBy
          };
        }
      }
      return idea;
    }));
  };

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
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
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) navigate(nav.path);
        }}
      />
      <main className="pt-28 max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">💡 Ideas y Sugerencias</h1>
          <p className="text-lg text-gray-700">Comparte tus ideas para mejorar Lifehub</p>
        </div>

        {user && (
          <div className="mb-8">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                ➕
                Compartir una idea
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
                <textarea
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="Escribe tu idea aquí..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">{newIdea.length}/500</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!newIdea.trim()}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="space-y-4">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-white rounded-xl p-6 shadow-lg">
              {editingId === idea.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveEdit(idea.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 text-lg mb-4">{idea.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(idea.id)}
                          disabled={!user}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                            user && idea.likedBy.includes(user.id)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          ❤️
                          <span>{idea.likes}</span>
                        </button>
                        <button
                          onClick={() => handleDislike(idea.id)}
                          disabled={!user}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                            user && idea.dislikedBy.includes(user.id)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          👎
                          <span>{idea.dislikes}</span>
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        por {idea.author} • {formatDate(idea.createdAt)}
                      </span>
                    </div>
                    {user && (user.id === idea.authorId || user.role === 'admin') && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(idea.id)}
                          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {ideas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay ideas aún. ¡Sé el primero en compartir!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IdeasPage; 