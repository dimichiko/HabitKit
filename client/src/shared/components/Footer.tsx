import React from 'react';
import { FaGlobeEurope, FaTwitter, FaInstagram, FaDiscord, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 text-gray-600 mt-12">
      <div className="w-full flex flex-col items-center py-8 px-4">
        {/* Mini logo central solo en desktop */}
        <div className="hidden md:flex items-center justify-center mb-6">
          <span className="text-3xl mr-2"><FaGlobeEurope className="inline-block align-middle text-indigo-700" /></span>
          <span className="font-bold text-indigo-700 text-xl align-middle">Lifehub</span>
        </div>
        <div className="w-full flex flex-col md:flex-row md:justify-center md:items-start gap-8 md:gap-16 max-w-5xl">
          {/* Marca */}
          <div className="flex flex-col gap-2 md:w-1/4 mb-6 md:mb-0">
            <div className="text-sm font-semibold text-gray-700 mb-1">Lifehub</div>
            <div className="text-gray-600 text-sm">Apps pequeñas, impacto grande.</div>
            <div className="text-gray-500 text-xs">Únete a cientos de personas que usan Lifehub cada día.</div>
          </div>
          {/* Navegación */}
          <div className="flex flex-col gap-2 md:w-1/5 mb-6 md:mb-0">
            <div className="text-sm font-semibold text-gray-700 mb-1">Navegación</div>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-indigo-600 hover:underline transition-colors">Inicio</a></li>
              <li><a href="/pricing" className="hover:text-indigo-600 hover:underline transition-colors">Precios</a></li>
              <li><a href="/about" className="hover:text-indigo-600 hover:underline transition-colors">Sobre nosotros</a></li>
              <li><a href="/contact" className="hover:text-indigo-600 hover:underline transition-colors">Contacto</a></li>
            </ul>
          </div>
          {/* Legal */}
          <div className="flex flex-col gap-2 md:w-1/5 mb-6 md:mb-0">
            <div className="text-sm font-semibold text-gray-700 mb-1">Legal</div>
            <ul className="space-y-2">
              <li><a href="/terms" className="hover:text-indigo-600 hover:underline transition-colors">Términos de uso</a></li>
              <li><a href="/privacy" className="hover:text-indigo-600 hover:underline transition-colors">Política de privacidad</a></li>
            </ul>
          </div>
          {/* Comunidad */}
          <div className="flex flex-col gap-2 md:w-1/5 mb-6 md:mb-0">
            <div className="text-sm font-semibold text-gray-700 mb-1">Comunidad</div>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/lifehubapp" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex items-center gap-2 hover:text-indigo-600 hover:underline transition-colors">
                  <FaTwitter className="h-5 w-5" /> Twitter (X)
                </a>
              </li>
              <li>
                <a href="https://instagram.com/lifehubapp" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-2 hover:text-indigo-600 hover:underline transition-colors">
                  <FaInstagram className="h-5 w-5" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://discord.gg/lifehub" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="flex items-center gap-2 hover:text-indigo-600 hover:underline transition-colors">
                  <FaDiscord className="h-5 w-5" /> Discord
                </a>
              </li>
            </ul>
          </div>
          {/* Soporte */}
          <div className="flex flex-col gap-2 md:w-1/5">
            <div className="text-sm font-semibold text-gray-700 mb-1">Soporte</div>
            <a href="mailto:hola@lifehub.app" className="flex items-center gap-2 hover:text-indigo-600 hover:underline transition-colors text-sm" aria-label="Email">
              <FaEnvelope className="h-5 w-5" /> <span className="align-middle">📬 hola@lifehub.app</span>
            </a>
          </div>
        </div>
        {/* Copy legal y autoría */}
        <div className="w-full border-t border-gray-200 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Lifehub. Todos los derechos reservados.<br />
          Lifehub es una marca de Proyecto Griego SpA
        </div>
      </div>
    </footer>
  );
};

export default Footer; 