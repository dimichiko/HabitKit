import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaCheckCircle, FaTimes, FaUser, FaLock, FaCog, FaHistory, FaShieldAlt, FaCrown, FaCalendarAlt, FaSignOutAlt, FaEye, FaEyeSlash, FaGlobe, FaBell, FaPalette, FaInfoCircle, FaEnvelope, FaMobileAlt, FaIdBadge, FaAppleAlt, FaDumbbell, FaFileInvoice } from 'react-icons/fa';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import PrivateRoute from '../shared/components/PrivateRoute';
import { useUser } from '../shared/context/UserContext';
import apiClient from '../apps/habitkit/utils/api';

// --- Constantes ---
const TABS = [
  { id: 'profile', label: 'Datos', icon: <FaUser />, title: 'Datos de la cuenta', shortLabel: 'Datos' },
  { id: 'password', label: 'Contraseña', icon: <FaLock />, title: 'Cambiar contraseña', shortLabel: 'Pass' },
  { id: 'preferences', label: 'Preferencias', icon: <FaCog />, title: 'Preferencias', shortLabel: 'Pref' },
  { id: 'subscription', label: 'Suscripción', icon: <FaCrown />, title: 'Gestionar suscripción', shortLabel: 'Sub' },
  { id: 'activity', label: 'Actividad', icon: <FaHistory />, title: 'Actividad reciente', shortLabel: 'Act' },
  { id: 'security', label: 'Seguridad', icon: <FaShieldAlt />, title: 'Seguridad y privacidad', shortLabel: 'Seg' },
];

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: <FaCheckCircle className="text-blue-500" /> },
  { id: 'invoicekit', name: 'InvoiceKit', icon: <FaFileInvoice className="text-yellow-500" /> },
  { id: 'trainingkit', name: 'TrainingKit', icon: <FaDumbbell className="text-green-500" /> },
  { id: 'caloriekit', name: 'CalorieKit', icon: <FaAppleAlt className="text-red-500" /> },
];

// --- Utilidades ---
function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getColorFromName(name) {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500'
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
}

const AccountPage = () => {
  const { user, updateUser } = useUser();
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', avatarUrl: '', phone: '' });
  const [tab, setTab] = useState('profile');
  const [lang, setLang] = useState('es');
  const [theme, setTheme] = useState('light');
  const [notif, setNotif] = useState(true);
  const [activity] = useState([
    { date: '2024-06-25', action: 'Inicio de sesión', app: 'HabitKit', time: '14:30' },
    { date: '2024-06-24', action: 'Cambio de email', app: 'General', time: '09:15' },
    { date: '2024-06-23', action: 'Actualización de perfil', app: 'General', time: '16:45' },
    { date: '2024-06-22', action: 'Uso de TrainingKit', app: 'TrainingKit', time: '11:20' },
    { date: '2024-06-21', action: 'Factura creada', app: 'InvoiceKit', time: '13:10' },
  ]);
  const [twoFA, setTwoFA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [compact, setCompact] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [successPlan, setSuccessPlan] = useState('');
  const [errorPlan, setErrorPlan] = useState('');
  const [selectedApps, setSelectedApps] = useState(user.activeApps || ['habitkit']);

  // Deep linking de tabs
  useEffect(() => {
    const path = location.pathname.split('/')[2];
    if (path && TABS.some(t => t.id === path)) setTab(path);
  }, [location.pathname]);

  // Actualiza la URL al cambiar de tab
  useEffect(() => {
    if (location.pathname !== `/account/${tab}` && tab !== 'profile') {
      navigate(`/account/${tab}`, { replace: true });
    }
    if (tab === 'profile' && location.pathname !== '/account') {
      navigate('/account', { replace: true });
    }
  }, [tab, navigate, location.pathname]);

  // Carga datos de usuario para edición
  useEffect(() => {
    if (user) setEditData({ name: user.name, email: user.email, avatarUrl: user.avatarUrl || '', phone: user.phone || '' });
  }, [user]);

  // Feedback visual
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // --- Renderizado de cada tab ---
  const renderTab = () => {
    // Verificación de seguridad para user
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando datos del usuario...</p>
          </div>
        </div>
      );
    }

    switch (tab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-10 place-items-start w-full items-start md:auto-rows-fr">
            {/* Bloque de saludo */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full min-h-[180px] flex flex-col justify-center h-full flex-1">
              <div className="text-lg font-semibold text-gray-800 mb-1">Hola, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario'} 👋</div>
              <div className="text-gray-500 text-sm">¿Listo para aprovechar al máximo tu cuenta?</div>
            </div>
            {/* Avatar + CTA */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full flex flex-col items-center min-h-[180px] justify-center h-full flex-1">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 mb-2" />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-2 ${getColorFromName(user.name)}`}>{getInitials(user.name)}</div>
              )}
              <div className="text-2xl font-semibold text-gray-800 text-center w-full break-words mt-1">{user.name || user.email}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 bg-white text-indigo-700 flex items-center gap-1">
                  {user.plan === 'KitFull' ? '🌐 Lifehub Full' : user.plan === 'Flexible' ? '🔀 Plan Flexible' : user.plan === 'Individual' ? '👤 Plan Individual' : '🪙 Plan Free'}
                </span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaCrown className="text-xs" />Nivel {user.level || 1}</span>
                <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FaCalendarAlt className="text-xs" />{user.activeApps?.length || 0}/4 apps</span>
              </div>
              {/* Mini CTA */}
              <div className="w-full flex flex-col items-center mt-4">
                <div className="text-sm text-indigo-700 font-semibold mb-2 flex items-center gap-2">🎁 ¿Quieres más apps y sin límites?</div>
                <button className="border border-purple-300 bg-white text-purple-600 font-bold rounded-lg px-6 py-2 text-sm shadow-sm transition flex items-center gap-1 hover:bg-purple-50" onClick={() => window.location.href = '/pricing'}>
                  <span className="mr-1">��</span> Actualiza a Lifehub Full
                </button>
              </div>
            </div>
            {/* Información personal */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full flex flex-col justify-between h-full flex-1">
              <div className="flex items-center gap-2 text-lg font-semibold mb-2"><FaUser className="text-gray-500 w-5 h-5 inline-block align-middle" /> Información personal</div>
              {!edit && !compact ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><FaEnvelope className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Email:</span> {user.email}</div>
                  {user.phone && <div className="flex items-center gap-2"><FaMobileAlt className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Teléfono:</span> {user.phone}</div>}
                  <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Miembro desde:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'No disponible aún'}</div>
                </div>
              ) : edit ? (
                <form className="space-y-2" onSubmit={async e => {
                  e.preventDefault();
                  setLoading(true); setError(''); setSuccess('');
                  try {
                    const { data } = await apiClient.put('/auth/profile', {
                      name: editData.name,
                      email: editData.email,
                      phone: editData.phone
                    });
                    updateUser && updateUser(data);
                    setSuccess('Datos actualizados correctamente');
                    setEdit(false);
                  } catch (err) {
                    setError('Error al guardar los cambios');
                  } finally {
                    setLoading(false);
                  }
                }}>
                  <div>
                    <label htmlFor="edit-name" className="block text-xs font-semibold mb-1">Nombre</label>
                    <input id="edit-name" type="text" className="w-full border rounded-lg px-3 py-2" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} required minLength={3} />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-xs font-semibold mb-1">Email</label>
                    <input id="edit-email" type="email" className="w-full border rounded-lg px-3 py-2" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} required />
                  </div>
                  <div>
                    <label htmlFor="edit-phone" className="block text-xs font-semibold mb-1">Teléfono</label>
                    <input id="edit-phone" type="tel" className="w-full border rounded-lg px-3 py-2" value={editData.phone || ''} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-semibold transition" disabled={loading}><FaCheckCircle className="inline mr-1" /> Guardar</button>
                    <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 font-semibold transition" onClick={() => setEdit(false)} disabled={loading}><FaTimes className="inline mr-1" /> Cancelar</button>
                  </div>
                  {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                  {loading && <div className="text-indigo-500 text-sm mt-2">Guardando...</div>}
                  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                </form>
              ) : (
                <div className="flex flex-col gap-2">
                  <div><span className="font-semibold">Nombre:</span> {user.name || 'No disponible aún'}</div>
                  <div><span className="font-semibold">Email:</span> {user.email}</div>
                  <div><span className="font-semibold">Plan:</span> {user.plan === 'KitFull' ? 'Lifehub Full' : user.plan === 'Flexible' ? '🔀 Plan Flexible' : user.plan === 'Individual' ? '👤 Plan Individual' : '🪙 Plan Free'}</div>
                  <button className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition" onClick={() => setEdit(true)}><FaEdit /> Editar</button>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <label htmlFor="compact-toggle" className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-sm font-semibold text-gray-700">👁️ Vista compacta (Beta)</span>
                  <input id="compact-toggle" type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" checked={compact} onChange={() => setCompact(e => !e)} />
                </label>
              </div>
            </div>
            {/* Detalles de cuenta */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full flex flex-col justify-between h-full flex-1">
              <div className="flex items-center gap-2 text-lg font-semibold mb-2"><FaInfoCircle className="text-gray-500 w-5 h-5 inline-block align-middle" /> Detalles de cuenta</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2"><FaIdBadge className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">ID de usuario:</span> {user.id}</div>
                <div className="flex items-center gap-2"><FaHistory className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Último acceso:</span> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'No disponible aún'}</div>
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Apps usadas:</span> {user.activeApps?.length || 0}/4</div>
                <div className="flex items-center gap-2"><FaCheckCircle className={`text-${user.emailVerified ? 'green' : 'gray'}-400 w-5 h-5 inline-block align-middle`} /><span className="font-semibold">Email verificado:</span> {user.emailVerified ? 'Sí' : 'No'}</div>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-gray-800 text-center">{TABS.find(t => t.id === tab)?.title}</h3>
            
            <div className="w-full max-w-sm space-y-6">
              <div>
                <label className="block mb-3 font-semibold text-gray-700" htmlFor="currentPassword">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input 
                    id="currentPassword"
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg" 
                    type={showPassword.current ? "text" : "password"}
                    placeholder="••••••••" 
                    value={passwordData.current}
                    onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                    aria-label="Contraseña actual" 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    aria-label={showPassword.current ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-3 font-semibold text-gray-700" htmlFor="newPassword">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input 
                    id="newPassword"
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg" 
                    type={showPassword.new ? "text" : "password"}
                    placeholder="••••••••" 
                    value={passwordData.new}
                    onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                    aria-label="Nueva contraseña" 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    aria-label={showPassword.new ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Mínimo 8 caracteres</p>
              </div>
              
              <div>
                <label className="block mb-3 font-semibold text-gray-700" htmlFor="confirmPassword">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input 
                    id="confirmPassword"
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg" 
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="••••••••" 
                    value={passwordData.confirm}
                    onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    aria-label="Confirmar nueva contraseña" 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    aria-label={showPassword.confirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                onClick={() => {
                  if (passwordData.new === passwordData.confirm && passwordData.new.length >= 8) {
                    setSuccess('Contraseña actualizada correctamente');
                    setPasswordData({ current: '', new: '', confirm: '' });
                  } else {
                    setSuccess('Las contraseñas no coinciden o son muy cortas');
                  }
                }}
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-gray-800 text-center">{TABS.find(t => t.id === tab)?.title}</h3>
            
            <div className="w-full max-w-sm space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Idioma</span>
                    <p className="text-sm text-gray-500">Idioma de la interfaz</p>
                  </div>
                </div>
                <select 
                  value={lang} 
                  onChange={e => setLang(e.target.value)} 
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                  aria-label="Seleccionar idioma"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FaPalette className="text-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Tema</span>
                    <p className="text-sm text-gray-500">Apariencia de la aplicación</p>
                  </div>
                </div>
                <select 
                  value={theme} 
                  onChange={e => setTheme(e.target.value)} 
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                  aria-label="Seleccionar tema"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FaBell className="text-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Notificaciones</span>
                    <p className="text-sm text-gray-500">Recibir notificaciones por email</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notif} 
                  onChange={e => setNotif(e.target.checked)} 
                  className="w-6 h-6 text-indigo-600 focus:ring-indigo-500 rounded" 
                  aria-label="Activar notificaciones" 
                />
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-gray-800 text-center">{TABS.find(t => t.id === tab)?.title}</h3>
            <div className="w-full max-w-sm space-y-6">
              {/* Plan actual */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <FaCrown className="text-purple-600 text-2xl" />
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Plan actual</h4>
                    <p className="text-3xl font-bold text-purple-600">{user.plan === 'KitFull' ? 'Kit Full' : user.plan}</p>
                  </div>
                </div>
                {/* Si el plan es Flexible o Individual, permite elegir apps */}
                {(user.plan === 'Flexible' || user.plan === 'Individual') && (
                  <div className="mb-4">
                    <div className="font-semibold text-gray-700 mb-1">Selecciona tus apps:</div>
                    <div className="flex flex-wrap gap-2">
                      {APPS.map(app => (
                        <button
                          key={app.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold transition ${selectedApps.includes(app.id) ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                          onClick={() => {
                            if (selectedApps.includes(app.id)) {
                              if (selectedApps.length > 1) setSelectedApps(selectedApps.filter(a => a !== app.id));
                            } else {
                              if ((user.plan === 'Flexible' && selectedApps.length < 4) || user.plan === 'Individual') setSelectedApps([...selectedApps, app.id]);
                            }
                          }}
                        >
                          {app.icon} {app.name}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{user.plan === 'Flexible' ? 'Puedes elegir de 1 a 4 apps.' : 'Solo 1 app activa.'}</div>
                  </div>
                )}
                {/* Beneficios */}
                <div className="space-y-2 text-sm text-gray-600 mt-2">
                  {user.plan === 'Free' && <>
                    <div>✅ 1 app básica</div>
                    <div>🔒 Funciones limitadas</div>
                    <div>📢 Con anuncios</div>
                    <div>🚫 Sin backups</div>
                    <div>💬 Soporte limitado</div>
                  </>}
                  {user.plan === 'Individual' && <>
                    <div>✅ 1 app full</div>
                    <div>🔒 Sin anuncios</div>
                    <div>📁 Backups incluidos</div>
                    <div>💬 Soporte por email</div>
                  </>}
                  {user.plan === 'Flexible' && <>
                    <div>✅ {user.activeApps?.length || 1} apps full</div>
                    <div>🔒 Sin anuncios</div>
                    <div>📁 Backups incluidos</div>
                    <div>💬 Soporte por email</div>
                  </>}
                  {user.plan === 'KitFull' && <>
                    <div>✅ Todas las apps actuales y futuras</div>
                    <div>🔒 Sin anuncios</div>
                    <div>📁 Backups incluidos</div>
                    <div>💬 Soporte prioritario</div>
                    <div>🔗 Integraciones cruzadas</div>
                  </>}
                </div>
              </div>
              {/* Botones de acción */}
              <div className="space-y-4">
                <button className="w-full bg-purple-600 hover:bg-purple-700 transform hover:scale-105 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl" onClick={handlePlanUpdate} disabled={loadingPlan}>
                  {user.plan === 'KitFull' ? 'Gestionar suscripción' : 'Actualizar plan'}
                </button>
                {successPlan && <div className="text-green-600 font-semibold mt-2">{successPlan}</div>}
                {errorPlan && <div className="text-red-600 font-semibold mt-2">{errorPlan}</div>}
                {user.plan !== 'Free' && (
                  <button 
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200" 
                    onClick={() => setShowCancel(true)}
                  >
                    Cancelar suscripción
                  </button>
                )}
              </div>
            </div>
            {/* Modal de cancelación */}
            {showCancel && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
                  <button 
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors" 
                    onClick={() => setShowCancel(false)} 
                    aria-label="Cerrar cancelación"
                  >
                    <FaTimes size={24} />
                  </button>
                  
                  <div className="text-center">
                    <FaCrown className="text-red-500 text-5xl mx-auto mb-6" />
                    <h4 className="text-2xl font-bold mb-3 text-gray-800">¿Cancelar suscripción?</h4>
                    <p className="text-gray-600 mb-8 text-lg">
                      Perderás acceso a todas las funciones Pro. ¿Estás seguro?
                    </p>
                    
                    <div className="flex gap-4">
                      <button 
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors" 
                        onClick={() => setShowCancel(false)}
                      >
                        No, mantener
                      </button>
                      <button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors" 
                        onClick={() => {
                          setShowCancel(false);
                          setSuccess('Suscripción cancelada');
                        }}
                      >
                        Sí, cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'activity':
        return (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-gray-800 text-center">{TABS.find(t => t.id === tab)?.title}</h3>
            
            <div className="w-full max-w-sm space-y-4">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{a.action}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{a.date}</span>
                      <span>•</span>
                      <span>{a.time}</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-medium">{a.app}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-gray-800 text-center">{TABS.find(t => t.id === tab)?.title}</h3>
            
            <div className="w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <span className="font-semibold text-gray-800">Autenticación en dos pasos</span>
                  <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={twoFA} 
                  onChange={e => setTwoFA(e.target.checked)} 
                  className="w-6 h-6 text-indigo-600 focus:ring-indigo-500 rounded" 
                  aria-label="Activar autenticación en dos pasos" 
                />
              </div>
              
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200">
                Cerrar sesión en todos los dispositivos
              </button>
              
              <button 
                className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200" 
                onClick={() => setShowLogout(true)}
                aria-label="Cerrar sesión"
              >
                <FaSignOutAlt className="inline mr-2" />
                Cerrar sesión
              </button>
              
              <button 
                className="w-full bg-red-100 hover:bg-red-200 text-red-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200" 
                onClick={() => setShowDelete(true)}
                aria-label="Borrar cuenta"
              >
                Borrar cuenta
              </button>
            </div>

            {/* Modal de cerrar sesión */}
            {showLogout && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
                  <button 
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors" 
                    onClick={() => setShowLogout(false)} 
                    aria-label="Cerrar modal"
                  >
                    <FaTimes size={24} />
                  </button>
                  
                  <div className="text-center">
                    <FaSignOutAlt className="text-orange-500 text-5xl mx-auto mb-6" />
                    <h4 className="text-2xl font-bold mb-3 text-gray-800">¿Cerrar sesión?</h4>
                    <p className="text-gray-600 mb-8 text-lg">
                      Serás redirigido a la página de inicio.
                    </p>
                    
                    <div className="flex gap-4">
                      <button 
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors" 
                        onClick={() => setShowLogout(false)}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors" 
                        onClick={() => {
                          setShowLogout(false);
                          navigate('/');
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de borrar cuenta */}
            {showDelete && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
                  <button 
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors" 
                    onClick={() => setShowDelete(false)} 
                    aria-label="Cerrar borrado"
                  >
                    <FaTimes size={24} />
                  </button>
                  
                  <div className="text-center">
                    <FaShieldAlt className="text-red-500 text-5xl mx-auto mb-6" />
                    <h4 className="text-2xl font-bold mb-3 text-gray-800">¿Borrar cuenta?</h4>
                    <p className="text-gray-600 mb-8 text-lg">
                      Esta acción no se puede deshacer. Se perderán todos los datos.
                    </p>
                    
                    <div className="flex gap-4">
                      <button 
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors" 
                        onClick={() => setShowDelete(false)}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors" 
                        onClick={() => {
                          setShowDelete(false);
                          setSuccess('Cuenta eliminada');
                        }}
                      >
                        Borrar cuenta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handlePlanUpdate = async () => {
    setLoadingPlan(true); setSuccessPlan(''); setErrorPlan('');
    try {
      const { data } = await apiClient.put('/auth/plan', { plan: user.plan, activeApps: selectedApps });
      updateUser && updateUser(data);
      setSuccessPlan('¡Plan actualizado!');
    } catch (err) {
      setErrorPlan('Error al actualizar el plan');
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-indigo-50 pb-8">
        <Header
          appName="Kit"
          appLogo="🟣"
          navigationItems={[]}
          currentPage="account"
          onNavigate={() => {}}
          onViewProfile={() => {
            setTab('profile');
            if (location.pathname !== '/account') {
              navigate('/account');
            } else {
              navigate('/account', { replace: true });
            }
          }}
        />
        <main className="pt-28 max-w-4xl mx-auto px-4 py-10 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-10 place-items-start w-full items-start md:auto-rows-fr">
            {/* Bloque de saludo */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full min-h-[180px] flex flex-col justify-center h-full flex-1">
              <div className="text-lg font-semibold text-gray-800 mb-1">Hola, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario'} 👋</div>
              <div className="text-gray-500 text-sm">¿Listo para aprovechar al máximo tu cuenta?</div>
            </div>
            {/* Avatar + CTA */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full flex flex-col items-center min-h-[180px] justify-center h-full flex-1">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 mb-2" />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-2 ${getColorFromName(user.name)}`}>{getInitials(user.name)}</div>
              )}
              <div className="text-2xl font-semibold text-gray-800 text-center w-full break-words mt-1">{user.name || user.email}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 bg-white text-indigo-700 flex items-center gap-1">
                  {user.plan === 'KitFull' ? '🌐 Lifehub Full' : user.plan === 'Flexible' ? '🔀 Plan Flexible' : user.plan === 'Individual' ? '👤 Plan Individual' : '🪙 Plan Free'}
                </span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaCrown className="text-xs" />Nivel {user.level || 1}</span>
                <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FaCalendarAlt className="text-xs" />{user.activeApps?.length || 0}/4 apps</span>
              </div>
              {/* Mini CTA */}
              <div className="w-full flex flex-col items-center mt-4">
                <div className="text-sm text-indigo-700 font-semibold mb-2 flex items-center gap-2">🎁 ¿Quieres más apps y sin límites?</div>
                <button className="border border-purple-300 bg-white text-purple-600 font-bold rounded-lg px-6 py-2 text-sm shadow-sm transition flex items-center gap-1 hover:bg-purple-50" onClick={() => window.location.href = '/pricing'}>
                  <span className="mr-1">��</span> Actualiza a Lifehub Full
                </button>
              </div>
            </div>
            {/* Información personal */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full flex flex-col justify-between h-full flex-1">
              <div className="flex items-center gap-2 text-lg font-semibold mb-2"><FaUser className="text-gray-500 w-5 h-5 inline-block align-middle" /> Información personal</div>
              {!edit && !compact ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><FaEnvelope className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Email:</span> {user.email}</div>
                  {user.phone && <div className="flex items-center gap-2"><FaMobileAlt className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Teléfono:</span> {user.phone}</div>}
                  <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Miembro desde:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'No disponible aún'}</div>
                </div>
              ) : edit ? (
                <form className="space-y-2" onSubmit={async e => {
                  e.preventDefault();
                  setLoading(true); setError(''); setSuccess('');
                  try {
                    const { data } = await apiClient.put('/auth/profile', {
                      name: editData.name,
                      email: editData.email,
                      phone: editData.phone
                    });
                    updateUser && updateUser(data);
                    setSuccess('Datos actualizados correctamente');
                    setEdit(false);
                  } catch (err) {
                    setError('Error al guardar los cambios');
                  } finally {
                    setLoading(false);
                  }
                }}>
                  <div>
                    <label htmlFor="edit-name" className="block text-xs font-semibold mb-1">Nombre</label>
                    <input id="edit-name" type="text" className="w-full border rounded-lg px-3 py-2" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} required minLength={3} />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-xs font-semibold mb-1">Email</label>
                    <input id="edit-email" type="email" className="w-full border rounded-lg px-3 py-2" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} required />
                  </div>
                  <div>
                    <label htmlFor="edit-phone" className="block text-xs font-semibold mb-1">Teléfono</label>
                    <input id="edit-phone" type="tel" className="w-full border rounded-lg px-3 py-2" value={editData.phone || ''} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-semibold transition" disabled={loading}><FaCheckCircle className="inline mr-1" /> Guardar</button>
                    <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 font-semibold transition" onClick={() => setEdit(false)} disabled={loading}><FaTimes className="inline mr-1" /> Cancelar</button>
                  </div>
                  {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                  {loading && <div className="text-indigo-500 text-sm mt-2">Guardando...</div>}
                  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                </form>
              ) : (
                <div className="flex flex-col gap-2">
                  <div><span className="font-semibold">Nombre:</span> {user.name || 'No disponible aún'}</div>
                  <div><span className="font-semibold">Email:</span> {user.email}</div>
                  <div><span className="font-semibold">Plan:</span> {user.plan === 'KitFull' ? 'Lifehub Full' : user.plan === 'Flexible' ? '🔀 Plan Flexible' : user.plan === 'Individual' ? '👤 Plan Individual' : '🪙 Plan Free'}</div>
                  <button className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition" onClick={() => setEdit(true)}><FaEdit /> Editar</button>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <label htmlFor="compact-toggle" className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-sm font-semibold text-gray-700">👁️ Vista compacta (Beta)</span>
                  <input id="compact-toggle" type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" checked={compact} onChange={() => setCompact(e => !e)} />
                </label>
              </div>
            </div>
            {/* Detalles de cuenta */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 w-full flex flex-col justify-between h-full flex-1">
              <div className="flex items-center gap-2 text-lg font-semibold mb-2"><FaInfoCircle className="text-gray-500 w-5 h-5 inline-block align-middle" /> Detalles de cuenta</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2"><FaIdBadge className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">ID de usuario:</span> {user.id}</div>
                <div className="flex items-center gap-2"><FaHistory className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Último acceso:</span> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'No disponible aún'}</div>
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500 w-5 h-5 inline-block align-middle" /><span className="font-semibold">Apps usadas:</span> {user.activeApps?.length || 0}/4</div>
                <div className="flex items-center gap-2"><FaCheckCircle className={`text-${user.emailVerified ? 'green' : 'gray'}-400 w-5 h-5 inline-block align-middle`} /><span className="font-semibold">Email verificado:</span> {user.emailVerified ? 'Sí' : 'No'}</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default AccountPage; 