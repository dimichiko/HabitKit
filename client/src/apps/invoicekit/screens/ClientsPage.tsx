import React, { useState } from 'react';
import { createCliente, updateCliente, deleteCliente } from '../utils/api';

interface Cliente {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  empresa?: string;
}

interface Company {
  _id: string;
  name: string;
}

interface ClienteForm {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface ClientsPageProps {
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
  currentCompany: Company;
}

const ClientesPage: React.FC<ClientsPageProps> = ({ clientes, setClientes, currentCompany }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [form, setForm] = useState<ClienteForm>({ nombre: '', email: '', telefono: '', direccion: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const handleShowForm = (cliente: Cliente | null = null, editMode: boolean = false) => {
    if (cliente) {
      if (editMode) {
        setEditingCliente(cliente);
        setIsEditMode(true);
        setViewingCliente(null);
        setForm({
          nombre: cliente.name,
          email: cliente.email,
          telefono: cliente.phone || '',
          direccion: cliente.address || ''
        });
      } else {
        setViewingCliente(cliente);
        setIsEditMode(false);
        setEditingCliente(null);
      }
    } else {
      setEditingCliente(null);
      setViewingCliente(null);
      setIsEditMode(false);
      setForm({ nombre: '', email: '', telefono: '', direccion: '' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCliente(null);
    setViewingCliente(null);
    setIsEditMode(false);
    setForm({ nombre: '', email: '', telefono: '', direccion: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.nombre) {
      setError('El nombre es obligatorio.');
      return;
    }
    
    // Validar que hay una empresa seleccionada
    if (!currentCompany || !currentCompany._id) {
      setError('Debes seleccionar una empresa válida antes de agregar un cliente.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      if (editingCliente) {
        console.log('🔄 Editando cliente:', { clienteId: editingCliente._id, form, empresaId: currentCompany._id });
        const updatedCliente = await updateCliente(editingCliente._id, { ...form, empresaId: currentCompany._id } as any);
        console.log('✅ Cliente actualizado:', updatedCliente);
        setClientes(clientes.map((c: Cliente) => c._id === editingCliente._id ? updatedCliente : c));
      } else {
        console.log('➕ Creando nuevo cliente:', { form, empresaId: currentCompany._id });
        const newCliente = await createCliente({ ...form, empresaId: currentCompany._id } as any);
        console.log('✅ Cliente creado:', newCliente);
        setClientes([...clientes, newCliente]);
      }
      handleCloseForm();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el cliente.';
      setError(errorMessage);
      console.error("Error guardando cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clienteId: string) => {
    const cliente = clientes.find(c => c._id === clienteId);
    const clienteName = cliente?.name || 'este cliente';
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar a "${clienteName}"?\n\n` +
      'Esta acción no se puede deshacer y eliminará todas las referencias a este cliente en facturas existentes.'
    );
    
    if (!confirmed) return;
    
    try {
      console.log('🗑️ Eliminando cliente:', clienteId);
      await deleteCliente(clienteId);
      console.log('✅ Cliente eliminado correctamente');
      setClientes(clientes.filter((c: Cliente) => c._id !== clienteId));
      
      // Mostrar mensaje de éxito
      alert(`Cliente "${clienteName}" eliminado correctamente.`);
    } catch (err: unknown) {
      console.error("Error eliminando cliente:", err);
      alert('Error al eliminar el cliente: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  // Filtros y búsqueda
  const filteredClientes = clientes.filter((c: Cliente) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !(c.email || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título jerárquico */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">👥</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
          <p className="text-gray-500 text-sm">Gestiona tu base de clientes y vincúlalos fácilmente a tus facturas.</p>
        </div>
      </div>
      {/* Filtros y buscador */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <input type="text" placeholder="Buscar por nombre o email" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} className="border rounded px-3 py-1 text-sm w-full md:w-64" />
        <div className="flex-1"></div>
        <button 
          onClick={() => handleShowForm()} 
          disabled={!currentCompany || !currentCompany._id}
          className={`px-4 py-2 rounded-lg font-semibold ml-auto ${
            currentCompany && currentCompany._id 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={!currentCompany || !currentCompany._id ? 'Debes seleccionar una empresa primero' : ''}
        >
          + Nuevo Cliente
        </button>
      </div>
      {/* Estado vacío */}
      {filteredClientes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 flex flex-col items-center justify-center mt-12">
          <div className="text-6xl mb-4">👤</div>
          {!currentCompany || !currentCompany._id ? (
            <>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Selecciona una empresa primero</h3>
              <p className="text-gray-600 mb-4">Necesitas tener una empresa activa para poder agregar clientes.</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Aún no has agregado ningún cliente. Empieza ahora para emitir tus facturas correctamente.</h3>
              <button
                onClick={() => handleShowForm()}
                className="mt-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-md transition px-6 py-3 rounded-lg text-white text-lg font-semibold flex items-center gap-2"
              >
                <span className="text-2xl">➕</span> Agregar Cliente
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">Nombre</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Empresa</th>
                <th className="py-2 px-2">Teléfono</th>
                <th className="py-2 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((c: Cliente) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium">{c.name}</td>
                  <td className="py-2 px-2">{c.email}</td>
                  <td className="py-2 px-2">{c.empresa || '-'}</td>
                  <td className="py-2 px-2">{c.phone || '-'}</td>
                  <td className="py-2 px-2 flex gap-1">
                    <button onClick={() => handleShowForm(c, false)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1">👁 Ver</button>
                    <button onClick={() => handleShowForm(c, true)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs flex items-center gap-1">📝 Editar</button>
                    <button onClick={() => handleDelete(c._id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1">🗑 Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Formulario modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Editar Cliente' : viewingCliente ? 'Ver Cliente' : 'Nuevo Cliente'}
            </h3>
            
            {viewingCliente ? (
              // Modo Ver - Solo lectura
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <div className="border rounded p-2 w-full bg-gray-50">{viewingCliente.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="border rounded p-2 w-full bg-gray-50">{viewingCliente.email || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="border rounded p-2 w-full bg-gray-50">{viewingCliente.phone || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <div className="border rounded p-2 w-full bg-gray-50">{viewingCliente.address || '-'}</div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => handleShowForm(viewingCliente, true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Editar
                  </button>
                  <button type="button" onClick={handleCloseForm} className="bg-gray-200 px-4 py-2 rounded">
                    Volver
                  </button>
                </div>
              </div>
            ) : (
              // Modo Editar/Crear - Formulario editable
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  className="border rounded p-2 w-full" 
                  placeholder="Nombre *" 
                  value={form.nombre} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nombre: e.target.value })} 
                />
                <input 
                  className="border rounded p-2 w-full" 
                  type="email" 
                  placeholder="Email" 
                  value={form.email} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })} 
                />
                <input 
                  className="border rounded p-2 w-full" 
                  placeholder="Teléfono" 
                  value={form.telefono} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, telefono: e.target.value })} 
                />
                <input 
                  className="border rounded p-2 w-full" 
                  placeholder="Dirección" 
                  value={form.direccion} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, direccion: e.target.value })} 
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={handleCloseForm} className="bg-gray-200 px-4 py-2 rounded">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-green-500 text-white rounded px-4 py-2" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesPage; 