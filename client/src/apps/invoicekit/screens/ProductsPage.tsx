import React, { useState } from 'react';
import { createProducto, updateProducto, deleteProducto } from '../utils/api';

const ProductsPage = ({ productos, setProductos, currentCompany }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', impuestos: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [sort, setSort] = useState('');

  const handleShowForm = (producto = null) => {
    if (producto) {
      setEditingProducto(producto);
      setForm(producto);
    } else {
      setEditingProducto(null);
      setForm({ nombre: '', descripcion: '', precio: '', categoria: '', impuestos: '' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProducto(null);
    setForm({ nombre: '', descripcion: '', precio: '', categoria: '', impuestos: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio) {
      setError('El nombre y el precio son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const productoData = { ...form, precio: Number(form.precio) };
      if (editingProducto) {
        const updatedProducto = await updateProducto(editingProducto._id, productoData);
        setProductos(productos.map(p => p._id === editingProducto._id ? updatedProducto : p));
      } else {
        const newProducto = await createProducto({ ...productoData, companyId: currentCompany._id });
        setProductos([...productos, newProducto]);
      }
      handleCloseForm();
    } catch (err) {
      setError(err.message || 'Error al guardar el producto.');
      console.error("Error guardando producto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      await deleteProducto(productoId);
      setProductos(productos.filter((p) => p._id !== productoId));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  // Filtros, búsqueda y orden
  let filtered = productos.filter(p => {
    if (categoriaFilter && p.categoria !== categoriaFilter) return false;
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sort === 'precio') filtered = filtered.sort((a, b) => a.precio - b.precio);
  if (sort === 'precioDesc') filtered = filtered.sort((a, b) => b.precio - a.precio);

  // Métricas
  const totalActivos = productos.length;
  const promedio = productos.length ? (productos.reduce((acc, p) => acc + Number(p.precio), 0) / productos.length).toFixed(2) : '0.00';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título jerárquico */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">📦</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
          <p className="text-gray-500 text-sm">Gestiona tus servicios o productos que usas en tus facturas.</p>
        </div>
      </div>
      {/* Métricas */}
      <div className="mb-4 flex gap-4 text-xs text-gray-500">
        <span>Activos: <b>{totalActivos}</b></span>
        <span>Valor promedio: <b>${promedio}</b></span>
      </div>
      {/* Filtros y buscador */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <input type="text" placeholder="Buscar producto" value={search} onChange={e=>setSearch(e.target.value)} className="border rounded px-3 py-1 text-sm w-full md:w-64" />
        <select value={categoriaFilter} onChange={e=>setCategoriaFilter(e.target.value)} className="border rounded px-3 py-1 text-sm w-full md:w-48">
          <option value="">Todas las categorías</option>
          {Array.from(new Set(productos.map(p=>p.categoria).filter(Boolean))).map((cat,i)=>(<option key={i} value={cat}>{cat}</option>))}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="border rounded px-3 py-1 text-sm w-full md:w-40">
          <option value="">Ordenar</option>
          <option value="precio">Precio (menor a mayor)</option>
          <option value="precioDesc">Precio (mayor a menor)</option>
        </select>
        <div className="flex-1"></div>
        <button onClick={() => handleShowForm()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold ml-auto">+ Nuevo Producto</button>
      </div>
      {/* Estado vacío */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 flex flex-col items-center justify-center mt-12">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Todavía no has registrado productos. Aquí podrás agregarlos para usarlos en tus facturas fácilmente.</h3>
          <button
            onClick={()=>handleShowForm()}
            className="mt-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-md transition px-6 py-3 rounded-lg text-white text-lg font-semibold flex items-center gap-2"
          >
            <span className="text-2xl">+</span> Crear primer producto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">Nombre</th>
                <th className="py-2 px-2">Precio</th>
                <th className="py-2 px-2">Categoría</th>
                <th className="py-2 px-2">Impuestos</th>
                <th className="py-2 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium">{p.nombre}</td>
                  <td className="py-2 px-2">${Number(p.precio).toFixed(2)}</td>
                  <td className="py-2 px-2">{p.categoria || '-'}</td>
                  <td className="py-2 px-2">{p.impuestos || '-'}</td>
                  <td className="py-2 px-2 flex gap-1">
                    <button onClick={() => handleShowForm(p)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs flex items-center gap-1">✏️ Editar</button>
                    <button onClick={() => handleDelete(p._id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1">🗑 Eliminar</button>
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
            <h3 className="text-xl font-semibold mb-4">{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="producto-nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input id="producto-nombre" className="border rounded p-2 w-full" placeholder="Nombre *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label htmlFor="producto-descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input id="producto-descripcion" className="border rounded p-2 w-full" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div>
                <label htmlFor="producto-precio" className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <input id="producto-precio" className="border rounded p-2 w-full" type="number" placeholder="Precio *" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} step="0.01" />
              </div>
              <div>
                <label htmlFor="producto-categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input id="producto-categoria" className="border rounded p-2 w-full" placeholder="Categoría" value={form.categoria || ''} onChange={e => setForm({ ...form, categoria: e.target.value })} />
              </div>
              <div>
                <label htmlFor="producto-impuestos" className="block text-sm font-medium text-gray-700 mb-1">Impuestos (ej: 21% IVA)</label>
                <input id="producto-impuestos" className="border rounded p-2 w-full" placeholder="Impuestos (ej: 21% IVA)" value={form.impuestos || ''} onChange={e => setForm({ ...form, impuestos: e.target.value })} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={handleCloseForm} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-green-500 text-white rounded px-4 py-2" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 