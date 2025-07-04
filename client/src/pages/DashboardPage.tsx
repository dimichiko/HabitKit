import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-lg text-gray-600">Bienvenido a tu panel de control</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Apps Disponibles</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="font-medium">HabitKit</span>
                </div>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  Próximamente
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍎</span>
                  <span className="font-medium">CalorieKit</span>
                </div>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  Próximamente
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <span className="font-medium">InvoiceKit</span>
                </div>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  Próximamente
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏋️</span>
                  <span className="font-medium">TrainingKit</span>
                </div>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  Próximamente
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Cuenta</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Plan actual</p>
                <p className="font-medium text-gray-800">Gratuito</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-green-600">Activo</p>
              </div>
              <button
                onClick={() => navigate('/account')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Gestionar cuenta
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Próximas Funcionalidades</h3>
          <p className="text-gray-600 mb-4">
            Estamos trabajando en las versiones móviles de nuestras apps. 
            Pronto podrás acceder a todas las funcionalidades desde tu dispositivo móvil.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all"
            >
              Ver planes
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border border-indigo-500 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Contactar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
 