import React, { useState } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { FaTwitter, FaInstagram, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
  const { user } = useUser();
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: '',
    tipo: 'soporte',
    ideaProblema: '',
    ideaPersona: '',
  });

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviado(false);
    setError(false);
    // Validación simple
    if (!formData.name || !formData.email || !formData.message) {
      setError(true);
      return;
    }
    // Simula envío
    setTimeout(() => {
      setEnviado(true);
      setFormData({ ...formData, message: '', ideaProblema: '', ideaPersona: '' });
    }, 800);
  };

  const sugerencias = [
    '“Me encantaría una app para organizar recetas.”',
    '“¿Podrían hacer una microapp para gastos compartidos?”',
    '“La comunidad de Discord es genial para sugerir ideas.”',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center px-4 py-12">
      <Helmet>
        <title>Contacto y Feedback - Lifehub</title>
        <meta name="description" content="¿Tienes dudas, sugerencias o quieres proponer una nueva app? Contáctanos y ayúdanos a mejorar Lifehub." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="contact"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) {
            window.location.href = nav.path;
          }
        }}
      />
      <div className="max-w-lg w-full text-center mt-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">Contacto y Feedback</h1>
        <p className="text-lg text-gray-600 mb-6">¿Tienes dudas, sugerencias o quieres proponer una nueva app? ¡Escríbenos!</p>
        <form className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-2">
            <button type="button" onClick={() => setFormData({ ...formData, tipo: 'soporte' })} className={`px-3 py-1 rounded-full text-sm font-semibold ${formData.tipo === 'soporte' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>🔧 Soporte y dudas</button>
            <button type="button" onClick={() => setFormData({ ...formData, tipo: 'propuesta' })} className={`px-3 py-1 rounded-full text-sm font-semibold ${formData.tipo === 'propuesta' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>💡 Propuestas</button>
          </div>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" className="border rounded-lg px-4 py-2" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Tu correo" className="border rounded-lg px-4 py-2" />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder={formData.tipo === 'soporte' ? '¿En qué podemos ayudarte?' : 'Describe tu idea o sugerencia'} className="border rounded-lg px-4 py-2" rows={4}></textarea>
          {formData.tipo === 'propuesta' && (
            <>
              <input type="text" name="ideaProblema" value={formData.ideaProblema} onChange={handleChange} placeholder="¿Qué problema resuelve tu idea? (opcional)" className="border rounded-lg px-4 py-2" />
              <input type="text" name="ideaPersona" value={formData.ideaPersona} onChange={handleChange} placeholder="¿A quién ayudaría? (opcional)" className="border rounded-lg px-4 py-2" />
            </>
          )}
          <div className="text-sm text-gray-500 mb-2">🧠 Las mejores ideas podrían convertirse en la próxima app de Lifehub. ¡Queremos escucharte!</div>
          {enviado && <div className="text-green-600 font-semibold flex items-center gap-1 justify-center">✅ ¡Mensaje enviado!</div>}
          {error && <div className="text-red-500 font-semibold flex items-center gap-1 justify-center">❌ Completa todos los campos obligatorios.</div>}
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition">Enviar mensaje</button>
        </form>
        <div className="mb-4 flex flex-col items-center gap-2">
          <a href="mailto:hola@kitapp.com" className="flex items-center gap-2 text-indigo-600 underline font-medium"><FaEnvelope /> hola@kitapp.com <span className="text-gray-500 text-sm">O escríbenos directamente</span></a>
        </div>
        <div className="flex gap-4 justify-center mb-6">
          <button className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 bg-transparent border-none cursor-pointer"><FaTwitter /> Twitter</button>
          <button className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 bg-transparent border-none cursor-pointer"><FaInstagram /> Instagram</button>
          <button className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 bg-transparent border-none cursor-pointer"><FaDiscord /> Discord</button>
        </div>
        {/* Pruebas sociales */}
        <div className="bg-indigo-50 rounded-xl p-4 shadow mb-4">
          <div className="font-semibold text-indigo-700 mb-1">Apps sugeridas por la comunidad:</div>
          <ul className="text-gray-700 text-sm flex flex-col gap-1">
            {sugerencias.map((s, i) => <li key={i}>💬 {s}</li>)}
          </ul>
        </div>
        <div className="mt-4 text-gray-500">¿Qué app deberíamos crear? ¡Cuéntanos!</div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage; 