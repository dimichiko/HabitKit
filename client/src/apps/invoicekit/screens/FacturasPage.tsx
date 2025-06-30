import React, { useState, useEffect } from 'react';
import 'jspdf-autotable';
import SendInvoiceModal from '../components/SendInvoiceModal';
import { createFactura, updateFactura, deleteFactura, toggleFacturaPayment } from '../utils/api';

interface Invoice {
  _id: string;
  numero?: number;
  clienteId: string;
  items: InvoiceItem[];
  fechaEmision: string;
  fechaVencimiento?: string;
  subtotal: number;
  total: number;
  pagada: boolean;
  empresaId: string;
  tipo: string;
}

interface InvoiceItem {
  id?: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Cliente {
  _id: string;
  nombre: string;
}

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
}

interface Company {
  _id: string;
  nombre: string;
}

interface FacturaForm {
  clienteId: string;
  items: InvoiceItem[];
  fechaVencimiento: string;
  subtotal?: number;
  total?: number;
}

interface ItemForm {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface FacturasPageProps {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  clientes: Cliente[];
  productos: Producto[];
  currentCompany: Company;
}

const FacturasPage = ({ invoices, setInvoices, clientes, productos, currentCompany }: FacturasPageProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Invoice | null>(null);
  const [form, setForm] = useState<FacturaForm>({ clienteId: '', items: [], fechaVencimiento: '' });
  const [item, setItem] = useState<ItemForm>({ nombre: '', cantidad: 1, precio: 0 });
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const subtotal = form.items.reduce((acc: number, it: InvoiceItem) => acc + it.cantidad * it.precio, 0);
    setForm(f => ({ ...f, subtotal, total: subtotal }));
  }, [form.items]);

  const handleShowForm = (factura: Invoice | null = null) => {
    if (factura) {
      setEditingFactura(factura);
      setForm({ 
        clienteId: factura.clienteId || '', 
        items: factura.items,
        fechaVencimiento: factura.fechaVencimiento || ''
      });
    } else {
      setEditingFactura(null);
      setForm({ clienteId: '', items: [], fechaVencimiento: '', subtotal: 0, total: 0 });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFactura) {
        // Actualizar factura existente
        await updateFactura(editingFactura._id, form as any);
      } else {
        // Crear nueva factura
        await createFactura(form as any);
      }
      
      setShowForm(false);
      setEditingFactura(null);
      // Recargar facturas
      window.location.reload();
    } catch (error) {
      console.error('Error saving factura:', error);
    }
  };

  const handleDelete = async (facturaId: string) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await deleteFactura(facturaId);
      setInvoices(invoices.filter((inv: Invoice) => inv._id !== facturaId));
    } catch (error) {
      console.error("Error eliminando factura:", error);
    }
  };

  const handleTogglePayment = async (facturaId: string) => {
    try {
        const updatedFactura = await toggleFacturaPayment(facturaId);
        setInvoices(invoices.map((inv: Invoice) => inv._id === facturaId ? updatedFactura : inv));
    } catch (error) {
        console.error("Error cambiando estado de pago:", error);
    }
  };

  const handleSendEmail = (factura: Invoice) => {
    setSelectedInvoice(factura);
    setShowSendModal(true);
  };
  
  const handleEmailSent = () => {
    setShowSendModal(false);
  };

  // Función para obtener el nombre del cliente
  const getClienteName = (clienteId: string): string => {
    const cliente = clientes.find((c: Cliente) => c._id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  // Métrica mensual
  const now = new Date();
  const monthInvoices = invoices.filter((inv: Invoice) => new Date(inv.fechaEmision).getMonth() === now.getMonth() && new Date(inv.fechaEmision).getFullYear() === now.getFullYear());
  const monthTotal = monthInvoices.reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

  // Filtros y búsqueda
  const filteredInvoices = invoices.filter((f: Invoice) => {
    if (filter === 'pagada' && !f.pagada) return false;
    if (filter === 'pendiente' && f.pagada) return false;
    if (filter === 'vencida' && (!f.fechaVencimiento || f.pagada || new Date(f.fechaVencimiento) >= now)) return false;
    if (search && !getClienteName(f.clienteId).toLowerCase().includes(search.toLowerCase()) && !(f.numero || f._id).toString().includes(search)) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8" style={{paddingTop:'80px'}}>
      {/* Título jerárquico */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">🧾</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Facturas</h2>
          <p className="text-gray-500 text-sm">Lista de facturas generadas por tu empresa.</p>
        </div>
      </div>
      {/* Métrica mensual */}
      <div className="mb-6 flex items-center gap-2">
        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Total facturado este mes: ${monthTotal.toFixed(2)}</span>
      </div>
      {/* Filtros y buscador */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <div className="flex gap-2">
          <button onClick={()=>setFilter('all')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='all'?'bg-blue-500 text-white':'bg-gray-200 text-gray-700'}`}>Todas</button>
          <button onClick={()=>setFilter('pagada')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='pagada'?'bg-green-500 text-white':'bg-gray-200 text-gray-700'}`}>Pagadas</button>
          <button onClick={()=>setFilter('pendiente')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='pendiente'?'bg-orange-500 text-white':'bg-gray-200 text-gray-700'}`}>Pendientes</button>
          <button onClick={()=>setFilter('vencida')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='vencida'?'bg-red-500 text-white':'bg-gray-200 text-gray-700'}`}>Vencidas</button>
        </div>
        <input type="text" placeholder="Buscar por cliente o N°" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)} className="border rounded px-3 py-1 text-sm w-full md:w-64" />
      </div>
      {/* Botón flotante + */}
      <button onClick={()=>handleShowForm()} className="fixed bottom-8 right-8 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg transition-transform duration-200 hover:scale-105">
        +
      </button>
      {/* Estado vacío */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 flex flex-col items-center justify-center mt-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Aún no has creado ninguna factura. ¡Empieza ahora y organiza tus cobros!</h3>
          <button
            onClick={()=>handleShowForm()}
            className="mt-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-md transition px-6 py-3 rounded-lg text-white text-lg font-semibold flex items-center gap-2"
          >
            <span className="text-2xl">🧾</span> Crear Primera Factura
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Cliente</th>
                <th className="py-2 px-2">Fecha</th>
                <th className="py-2 px-2">Total</th>
                <th className="py-2 px-2">Estado</th>
                <th className="py-2 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((f: Invoice, i: number)=>(
                <tr key={f._id} className="bg-gray-50 even:bg-white">
                  <td className="py-2 px-2 font-medium">{f.numero || f._id}</td>
                  <td className="py-2 px-2">{getClienteName(f.clienteId)}</td>
                  <td className="py-2 px-2">{f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString('es-ES') : ''}</td>
                  <td className="py-2 px-2">${f.total}</td>
                  <td className="py-2 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${f.pagada ? 'bg-green-100 text-green-800' : (f.fechaVencimiento && !f.pagada && new Date(f.fechaVencimiento) < now ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-800')}`}>
                      {f.pagada ? 'Pagada' : (f.fechaVencimiento && !f.pagada && new Date(f.fechaVencimiento) < now ? 'Vencida' : 'Pendiente')}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex gap-1">
                    <button onClick={()=>handleShowForm(f)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1">👁️ Ver</button>
                    <button onClick={()=>handleShowForm(f)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs flex items-center gap-1">✏️ Editar</button>
                    <button onClick={()=>handleTogglePayment(f._id)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${f.pagada ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{f.pagada ? 'Marcar Pendiente' : 'Marcar Pagada'}</button>
                    <button onClick={()=>handleSendEmail(f)} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center gap-1">✉️ Email</button>
                    <button onClick={()=>handleDelete(f._id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1">🗑️ Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal para enviar email */}
      <SendInvoiceModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        factura={selectedInvoice}
        companyData={currentCompany}
        onSend={handleEmailSent}
      />
      {/* Formulario de factura */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-xl shadow-md fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
          <div className="mb-2">
            <label htmlFor="clienteId">Cliente:</label>
            <select id="clienteId" value={form.clienteId} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setForm(f=>({...f, clienteId:e.target.value}))} className="border rounded p-2 ml-2">
              <option value="">Selecciona</option>
              {clientes.map((c: Cliente, i: number)=>(<option key={i} value={c._id}>{c.nombre}</option>))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="fechaVencimiento">Fecha de vencimiento:</label>
            <input type="date" id="fechaVencimiento" value={form.fechaVencimiento} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setForm(f=>({...f, fechaVencimiento:e.target.value}))} className="border rounded p-2 ml-2" />
          </div>
          <div className="mb-2">
            <label htmlFor="productos">Productos:</label>
            <div className="flex gap-2 mt-2">
              <select id="productos" value={item.nombre} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
                const producto = productos.find((p: Producto) => p.nombre === e.target.value);
                setItem({ nombre: e.target.value, cantidad: 1, precio: producto ? producto.precio : 0 });
              }} className="border rounded p-2 flex-1">
                <option value="">Selecciona producto</option>
                {productos.map((p: Producto)=>(<option key={p._id} value={p.nombre}>{p.nombre} - ${p.precio}</option>))}
              </select>
              <input type="number" placeholder="Cant." value={item.cantidad} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setItem({...item, cantidad: parseInt(e.target.value) || 0})} className="border rounded p-2 w-20" />
              <input type="number" placeholder="Precio" value={item.precio} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setItem({...item, precio: parseFloat(e.target.value) || 0})} className="border rounded p-2 w-24" />
              <button type="button" onClick={()=>{
                if (item.nombre && item.cantidad > 0 && item.precio > 0) {
                  setForm(f=>({...f, items: [...f.items, {...item, id: Date.now()}]}));
                  setItem({ nombre: '', cantidad: 1, precio: 0 });
                }
              }} className="bg-blue-500 text-white px-3 py-2 rounded">+</button>
            </div>
          </div>
          <div className="mb-4">
            <h4>Items:</h4>
            <div className="max-h-32 overflow-y-auto">
              {form.items.map((it: InvoiceItem, i: number) => (
                <div key={it.id || i} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1">
                  <span>{it.nombre} x {it.cantidad}</span>
                  <div className="flex items-center gap-2">
                    <span>${(it.cantidad * it.precio).toFixed(2)}</span>
                    <button type="button" onClick={()=>setForm(f=>({...f, items: f.items.filter((_, index: number) => index !== i)}))} className="text-red-500">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 text-right">
            <strong>Total: ${form.total?.toFixed(2) || '0.00'}</strong>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex-1">Guardar</button>
            <button type="button" onClick={()=>setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FacturasPage; 