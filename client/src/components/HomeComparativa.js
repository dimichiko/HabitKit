import React from 'react';

const HomeComparativa = () => (
  <section className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-6 mb-10">
    <h2 className="text-xl font-bold text-center mb-4 text-primary">Comparativa de beneficios</h2>
    <table className="w-full text-sm md:text-base">
      <thead>
        <tr className="text-gray-600">
          <th className="py-2">Función</th>
          <th className="py-2">Free</th>
          <th className="py-2">Lifehub Full</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="py-2">Acceso a apps</td>
          <td className="text-green-500 font-bold">✅ 1 app</td>
          <td className="text-green-500 font-bold">✅ Todas</td>
        </tr>
        <tr>
          <td className="py-2">Historial completo</td>
          <td className="text-red-400 font-bold">❌</td>
          <td className="text-green-500 font-bold">✅</td>
        </tr>
        <tr>
          <td className="py-2">Sin anuncios</td>
          <td className="text-red-400 font-bold">❌</td>
          <td className="text-green-500 font-bold">✅</td>
        </tr>
        <tr>
          <td className="py-2">Copias de seguridad</td>
          <td className="text-red-400 font-bold">❌</td>
          <td className="text-green-500 font-bold">✅</td>
        </tr>
        <tr>
          <td className="py-2">Soporte prioritario</td>
          <td className="text-red-400 font-bold">❌</td>
          <td className="text-green-500 font-bold">✅</td>
        </tr>
      </tbody>
    </table>
  </section>
);

export default HomeComparativa; 