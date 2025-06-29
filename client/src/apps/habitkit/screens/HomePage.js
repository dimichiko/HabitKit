import React, { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../utils/api';
import { FaFolderPlus, FaFolder, FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';
import EditHabitModal from '../components/EditHabitModal';
import HabitCard from '../components/HabitCard';
import FolderCard from '../components/FolderCard';

const HomePage = ({ showAddModal, setShowAddModal }) => {
  const [allHabits, setAllHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({
    name: '',
    color: '#4ade80',
    timesPerDay: 1,
    folder: ''
  });
  const [checkinSuccess, setCheckinSuccess] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [deleteHabitId, setDeleteHabitId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [checkinCounts, setCheckinCounts] = useState({});
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolder, setRenamingFolder] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [folderMap, setFolderMap] = useState({});
  const hasInitialized = useRef(false);
  const [folderError, setFolderError] = useState('');
  const [habitError, setHabitError] = useState('');
  const [confirmDeleteFolder, setConfirmDeleteFolder] = useState(null);
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);

  const fetchFolders = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/habits/folders');
      const allHabitsFolder = { _id: 'all-habits', name: 'Todos los hábitos' };
      const fetchedFolders = [allHabitsFolder, ...data];
      setFolders(fetchedFolders);

      if (!selectedFolder) {
        setSelectedFolder('all-habits');
      }

      const folderData = {};
      fetchedFolders.forEach(f => {
        folderData[f._id] = f.name;
      });
      setFolderMap(folderData);
    } catch (error) {
      console.error('Error al cargar las carpetas:', error);
    }
  }, [selectedFolder]);

  const fetchHabits = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/habits');
      setAllHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  }, []);

  const fetchCheckinCounts = useCallback(async () => {
    if (!allHabits.length) {
      setCheckinCounts({});
      return;
    }
    const habitIds = allHabits.map(h => h._id);
    try {
      const { data } = await apiClient.post('/habits/checkins/counts', { habitIds });
      setCheckinCounts(data.counts || {});
    } catch (error) {
      console.error('Error fetching checkin counts:', error);
    }
  }, [allHabits]);

  useEffect(() => {
    if (!hasInitialized.current) {
      fetchFolders();
      fetchHabits();
      hasInitialized.current = true;
    }
  }, [fetchFolders, fetchHabits]);

  useEffect(() => {
    if (allHabits.length > 0) {
      fetchCheckinCounts();
    }
  }, [allHabits, fetchCheckinCounts]);

  useEffect(() => {
    if (showAddModal) {
      const selected = folders.find(f => f._id === selectedFolder);
      if (selected && selected._id !== 'all-habits') {
        setNewHabit(h => ({ ...h, folder: selected.name }));
      } else if (folders.length > 1 && folders[1].name) {
        setNewHabit(h => ({ ...h, folder: folders[1].name }));
      }
    }
    // eslint-disable-next-line
  }, [showAddModal, selectedFolder, folders.length]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    setHabitError('');
    try {
      await apiClient.post('/habits', {
        name: newHabit.name,
        color: newHabit.color,
        timesPerDay: newHabit.timesPerDay,
        folder: newHabit.folder || ''
      });
      setShowAddModal(false);
      setNewHabit({ name: '', color: '#4ade80', timesPerDay: 1, folder: '' });
      fetchHabits();
      fetchCheckinCounts();
      fetchFolders();
    } catch (error) {
      const msg = error?.response?.data?.error || 'Error al crear hábito';
      setHabitError(msg);
      setTimeout(() => setHabitError(''), 2500);
    }
  };

  const handleCheckin = async (habitId) => {
    try {
      await apiClient.post(`/habits/${habitId}/checkin`);
      setCheckinSuccess(habitId);
      fetchHabits();
      fetchCheckinCounts();
      fetchFolders();
      setTimeout(() => setCheckinSuccess(null), 1500);
    } catch (error) {
      console.error('Error checking in habit:', error);
    }
  };

  const handleDeleteHabit = async () => {
    if (!deleteHabitId) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/habits/${deleteHabitId}`);
      setDeleteHabitId(null);
      fetchHabits();
      fetchFolders();
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddFolder = async () => {
    setFolderError('');
    if (!newFolderName.trim() || folders.some(f => f.name === newFolderName.trim())) {
      setFolderError('Ya existe una carpeta con ese nombre');
      setTimeout(() => setFolderError(''), 2500);
      return;
    }
    try {
      await apiClient.post('/habits/folders', { name: newFolderName.trim() });
      setNewFolderName('');
      setShowAddFolderModal(false);
      setFolderError('');
      fetchFolders();
    } catch (err) {
      setFolderError(err?.response?.data?.error || 'Error al crear carpeta');
      setTimeout(() => setFolderError(''), 2500);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    // Buscar nombre de la carpeta
    const folder = folders.find(f => f._id === folderId);
    if (!folder) return;
    // Contar hábitos en esa carpeta
    const count = allHabits.filter(h => h.folder === folder.name).length;
    if (count > 0) {
      setConfirmDeleteFolder({ folderId, folderName: folder.name, habitsCount: count });
      return;
    }
    // Si no hay hábitos, eliminar directo
    try {
      await apiClient.delete(`/habits/folders/${folderId}`);
      fetchFolders();
      if (selectedFolder === folderId) setSelectedFolder('all-habits');
      fetchHabits();
    } catch (e) { console.error(e); }
  };

  const deleteFolderAndHabits = async () => {
    if (!confirmDeleteFolder) return;
    try {
      // Eliminar todos los hábitos de esa carpeta
      const { folderName, folderId } = confirmDeleteFolder;
      const habitsToDelete = allHabits.filter(h => h.folder === folderName);
      for (const h of habitsToDelete) {
        await apiClient.delete(`/habits/${h._id}`);
      }
      await apiClient.delete(`/habits/folders/${folderId}`);
      setConfirmDeleteFolder(null);
      fetchFolders();
      if (selectedFolder === folderId) setSelectedFolder('all-habits');
      fetchHabits();
    } catch (e) { console.error(e); }
  };

  const deleteFolderOnly = async () => {
    if (!confirmDeleteFolder) return;
    try {
      await apiClient.delete(`/habits/folders/${confirmDeleteFolder.folderId}`);
      setConfirmDeleteFolder(null);
      fetchFolders();
      if (selectedFolder === confirmDeleteFolder.folderId) setSelectedFolder('all-habits');
      fetchHabits();
    } catch (e) { console.error(e); }
  };

  const handleRenameFolder = async (folderId) => {
    setFolderError('');
    if (!renameValue.trim() || folders.some(f => f.name === renameValue.trim())) {
      setFolderError('Ya existe una carpeta con ese nombre');
      return;
    }
    try {
      await apiClient.put(`/habits/folders/${folderId}`, { name: renameValue.trim() });
      setRenamingFolder(null);
      setRenameValue('');
      fetchFolders();
      fetchHabits();
    } catch (err) {
      setFolderError(err?.response?.data?.error || 'Error al renombrar carpeta');
    }
  };

  const filteredHabits = allHabits.filter(habit => {
    if (selectedFolder === 'all-habits' || !selectedFolder) return true;
    const folderName = folderMap[selectedFolder] || '';
    return habit.folder === folderName;
  });

  const groupedHabits = filteredHabits.reduce((groups, habit) => {
    const folder = habit.folder || 'Sin categoría';
    if (!groups[folder]) groups[folder] = [];
    groups[folder].push(habit);
    return groups;
  }, {});

  const toggleFolderCollapse = (folderName) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const getFolderIcon = (folderName) => {
    const colors = ['#fbbf24', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    const colorIndex = folderName.length % colors.length;
    return colors[colorIndex];
  };

  const getFolderProgress = (folderName) => {
    if (folderName === 'Todos los hábitos') {
      const totalCompleted = Object.values(checkinCounts).reduce((sum, count) => sum + count, 0);
      const totalTargets = allHabits.reduce((sum, habit) => sum + habit.timesPerDay, 0);
      return { completed: totalCompleted, total: totalTargets };
    }
    
    const folderHabits = allHabits.filter(h => h.folder === folderName);
    const completed = folderHabits.reduce((sum, habit) => sum + (checkinCounts[habit._id] || 0), 0);
    const total = folderHabits.reduce((sum, habit) => sum + habit.timesPerDay, 0);
    return { completed, total };
  };

  const getHabitStatus = (habitId) => {
    const todayCount = checkinCounts[habitId] || 0;
    const habit = allHabits.find(h => h._id === habitId);
    if (!habit) return { status: 'pending', count: 0, total: 0 };
    
    if (todayCount >= habit.timesPerDay) {
      return { status: 'completed', count: todayCount, total: habit.timesPerDay };
    } else if (todayCount > 0) {
      return { status: 'partial', count: todayCount, total: habit.timesPerDay };
    } else {
      return { status: 'pending', count: todayCount, total: habit.timesPerDay };
    }
  };

  const renderEmptyState = () => (
    <div className="lg:col-span-2 flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl shadow-md">
      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
        <FaPlus className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        ¡Comienza tu viaje hacia mejores hábitos!
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Los pequeños cambios diarios crean resultados extraordinarios. ¿Qué hábito te gustaría desarrollar hoy?
      </p>
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <FaPlus /> Crear mi primer hábito
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controles de vista */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddFolderModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            <FaFolderPlus className="text-sm" />
            Nueva Carpeta
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredHabits.length} hábito{filteredHabits.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Layout de dos columnas en desktop */}
      {allHabits.length === 0 ? (
        // Estado vacío global - layout especial
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Columna izquierda: Carpetas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaFolder className="text-green-500" />
                Carpetas ({folders.length})
                <button
                  onClick={() => setShowAddFolderModal(true)}
                  className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold flex items-center gap-1"
                  title="Crear carpeta"
                  aria-label="Crear carpeta"
                >
                  <FaFolderPlus className="text-sm" /> Nueva
                </button>
              </h3>
              
              <div className="space-y-3">
                {folders.map(folder => {
                  const habitsInFolder = folder._id === 'all-habits' 
                    ? allHabits.length 
                    : allHabits.filter(h => h.folder === folder.name).length;
                  
                  return (
                    <FolderCard
                      key={folder._id}
                      folder={folder}
                      habitsInFolder={habitsInFolder}
                      isSelected={selectedFolder === folder._id}
                      progress={getFolderProgress(folder.name)}
                      color={getFolderIcon(folder.name)}
                      onSelect={setSelectedFolder}
                      onAddHabit={(folderName) => {
                        setNewHabit({ ...newHabit, folder: folderName });
                        setShowAddModal(true);
                      }}
                      onRename={(folderId, folderName) => {
                        setRenamingFolder(folderId);
                        setRenameValue(folderName);
                      }}
                      onDelete={handleDeleteFolder}
                      renamingFolderId={renamingFolder}
                      renameValue={renameValue}
                      onRenameValueChange={setRenameValue}
                      onSaveRename={handleRenameFolder}
                      onCancelRename={() => {
                        setRenamingFolder(null);
                        setRenameValue('');
                        setFolderError('');
                      }}
                      folderError={folderError}
                    />
                  )
                })}
              </div>
              
              {folders.length === 1 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Solo tienes la carpeta &quot;Todos los hábitos&quot;. ¡Crea más carpetas para organizar mejor!</p>
                </div>
              )}
            </div>
          </div>

          {/* Estado vacío motivacional */}
          {renderEmptyState()}
        </div>
      ) : (
        // Layout normal cuando hay hábitos
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Columna izquierda: Carpetas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaFolder className="text-green-500" />
                Carpetas ({folders.length})
                <button
                  onClick={() => setShowAddFolderModal(true)}
                  className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold flex items-center gap-1"
                  title="Crear carpeta"
                  aria-label="Crear carpeta"
                >
                  <FaFolderPlus className="text-sm" /> Nueva
                </button>
              </h3>
              
              <div className="space-y-3">
                {folders.map(folder => {
                  const habitsInFolder = folder._id === 'all-habits' 
                    ? allHabits.length 
                    : allHabits.filter(h => h.folder === folder.name).length;
                  
                  return (
                    <FolderCard
                      key={folder._id}
                      folder={folder}
                      habitsInFolder={habitsInFolder}
                      isSelected={selectedFolder === folder._id}
                      progress={getFolderProgress(folder.name)}
                      color={getFolderIcon(folder.name)}
                      onSelect={setSelectedFolder}
                      onAddHabit={(folderName) => {
                        setNewHabit({ ...newHabit, folder: folderName });
                        setShowAddModal(true);
                      }}
                      onRename={(folderId, folderName) => {
                        setRenamingFolder(folderId);
                        setRenameValue(folderName);
                      }}
                      onDelete={handleDeleteFolder}
                      renamingFolderId={renamingFolder}
                      renameValue={renameValue}
                      onRenameValueChange={setRenameValue}
                      onSaveRename={handleRenameFolder}
                      onCancelRename={() => {
                        setRenamingFolder(null);
                        setRenameValue('');
                        setFolderError('');
                      }}
                      folderError={folderError}
                    />
                  )
                })}
              </div>
              
              {folders.length === 1 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Solo tienes la carpeta &quot;Todos los hábitos&quot;. ¡Crea más carpetas para organizar mejor!</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Hábitos */}
          <div className="lg:col-span-2">
            {filteredHabits.length === 0 ? (
              // Estado vacío para carpeta seleccionada
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaFolder className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No hay hábitos aquí todavía
                </h3>
                <p className="text-gray-600 mb-4">
                  Agrega un hábito para esta carpeta y comienza a construir tu rutina.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <FaPlus /> Agregar hábito
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vista agrupada por carpetas */}
                {Object.entries(groupedHabits).map(([folderName, folderHabits]) => (
                  <div key={folderName} className="col-span-full">
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => toggleFolderCollapse(folderName)}
                        className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors"
                      >
                        {collapsedFolders[folderName] ? <FaChevronRight /> : <FaChevronDown />}
                        <FaFolder style={{ color: getFolderIcon(folderName) }} />
                        {folderName} ({folderHabits.length})
                      </button>
                    </div>
                    
                    {!collapsedFolders[folderName] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {folderHabits.map(habit => (
                          <HabitCard
                            key={habit._id}
                            habit={habit}
                            status={getHabitStatus(habit._id)}
                            checkinSuccess={checkinSuccess}
                            onCheckin={handleCheckin}
                            onEdit={setEditHabit}
                            onDelete={setDeleteHabitId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para Añadir Hábito */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Nuevo Hábito</h2>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  id="habit-name"
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
                {habitError && (
                  <div style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fca5a5',
                    borderRadius: 6,
                    padding: '8px 12px',
                    marginTop: 6,
                    fontWeight: 500,
                    boxShadow: '0 2px 8px #fca5a555',
                    transition: 'opacity 0.3s',
                    opacity: habitError ? 1 : 0
                  }}>
                    {habitError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="habit-timesPerDay" className="block text-sm font-medium text-gray-700">Veces por día</label>
                <div className="flex gap-2 mt-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setNewHabit({ ...newHabit, timesPerDay: n })}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${newHabit.timesPerDay === n ? 'bg-green-400 border-green-600 text-white scale-110' : 'bg-white border-gray-300 text-gray-500 hover:border-green-400'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="habit-color" className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  id="habit-color"
                  type="color"
                  value={newHabit.color}
                  onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="habit-folder" className="block text-sm font-medium text-gray-700">Carpeta</label>
                <select
                  id="habit-folder"
                  value={newHabit.folder}
                  onChange={e => setNewHabit({ ...newHabit, folder: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {folders.filter(f => f._id !== 'all-habits').map(folder => (
                    <option key={folder._id} value={folder.name}>{folder.name}</option>
                  ))}
                </select>
                {folderError && (
                  <div style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fca5a5',
                    borderRadius: 6,
                    padding: '8px 12px',
                    marginTop: 6,
                    fontWeight: 500,
                    boxShadow: '0 2px 8px #fca5a555',
                    transition: 'opacity 0.3s',
                    opacity: folderError ? 1 : 0
                  }}>
                    {folderError}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Crear Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Hábito */}
      {editHabit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <EditHabitModal
              habit={editHabit}
              folders={folders.filter(f => f._id !== 'all-habits')}
              onClose={() => setEditHabit(null)}
              onHabitUpdated={() => {
                setEditHabit(null);
                fetchHabits();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteHabitId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">¿Eliminar hábito?</h2>
            <p className="mb-6 text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteHabitId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteHabit}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación al eliminar carpeta con hábitos */}
      {confirmDeleteFolder && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0008',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:32,minWidth:320,boxShadow:'0 4px 32px #0003',textAlign:'center'}}>
            <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'#b91c1c'}}>¿Eliminar carpeta &quot;{confirmDeleteFolder.folderName}&quot;?</h3>
            <p style={{marginBottom:24}}>Esta carpeta contiene <b>{confirmDeleteFolder.habitsCount}</b> hábito(s).</p>
            <button onClick={deleteFolderAndHabits} style={{background:'#dc2626',color:'#fff',padding:'10px 18px',border:'none',borderRadius:8,fontWeight:600,marginRight:12,cursor:'pointer'}}>Eliminar carpeta y hábitos</button>
            <button onClick={deleteFolderOnly} style={{background:'#16a34a',color:'#fff',padding:'10px 18px',border:'none',borderRadius:8,fontWeight:600,marginRight:12,cursor:'pointer'}}>Eliminar solo carpeta</button>
            <button onClick={()=>setConfirmDeleteFolder(null)} style={{background:'#e5e7eb',color:'#374151',padding:'10px 18px',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer'}}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal para Crear Carpeta */}
      {showAddFolderModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Nueva Carpeta</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddFolder(); }} className="space-y-4">
              <div>
                <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700">Nombre de la carpeta</label>
                <input
                  id="folder-name"
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: Mañana, Ejercicio, Trabajo..."
                  required
                />
                {folderError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{folderError}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFolderModal(false);
                    setNewFolderName('');
                    setFolderError('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Crear Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 