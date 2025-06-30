import React, { useState } from 'react';
import { useUser } from '../../../shared/context/UserContext';

const ProfileScreen = ({ onNavigate }: { onNavigate: any }) => {
  const { user, updateUser, logout } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [photo, setPhoto] = useState(user?.avatarUrl || '');

  const handleSave = () => {
    updateUser({ name, avatarUrl: photo });
    alert('Perfil actualizado');
  };

  const handleLogout = () => {
    logout();
    onNavigate('logout');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <label className="block mb-2">Nombre
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" />
      </label>
      <label className="block mb-2">Foto (URL)
        <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} className="w-full border rounded p-2" />
      </label>
      {photo && <img src={photo} alt="Foto" className="w-24 h-24 rounded-full mx-auto mb-4" />}
      <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleSave}>Guardar</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Cerrar sesión</button>
      <button className="mt-4 ml-2 bg-gray-300 px-4 py-2 rounded" onClick={() => onNavigate('dashboard')}>Volver</button>
    </div>
  );
};

export default ProfileScreen; 