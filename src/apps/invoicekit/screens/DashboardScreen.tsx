import React, { useState, useEffect } from 'react';

const DashboardScreen = ({ invoices, clientes, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Load user profile
    const profile = localStorage.getItem('invoicekit_user_profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener el nombre del cliente
  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c._id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.pagada).length;
  const pendingInvoices = totalInvoices - paidInvoices;
  const totalRevenue = invoices.filter(inv => inv.pagada).reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = invoices.filter(inv => !inv.pagada).reduce((sum, inv) => sum + inv.total, 0);
  const overdueInvoices = invoices.filter(inv => {
    if (inv.pagada || !inv.fechaVencimiento) return false;
    return new Date(inv.fechaVencimiento) < new Date();
  }).length;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const getCurrencySymbol = (code) => {
    const currencies = { USD: '$', EUR: '€', GBP: '£', MXN: '$', COP: '$', ARS: '$' };
    return currencies[code] || code;
  };

  const currency = userProfile?.currency || 'USD';

  const quickActions = [
    {
      title: 'Nueva Factura',
      icon: '📄',
      action: () => onNavigate('invoices'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Agregar Cliente',
      icon: '👥',
      action: () => onNavigate('clients'),
      color: 'bg-green-500 hover:bg-green-600'
    },
  ];

  const getRecentInvoices = () => {
    return invoices
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5);
  };

  const getTopClients = () => {
    const clientTotals = {};
    invoices.forEach(invoice => {
      if (!clientTotals[invoice.clienteId]) {
        clientTotals[invoice.clienteId] = { total: 0, pagos: [], last: null };
      }
      clientTotals[invoice.clienteId].total += invoice.total;
      clientTotals[invoice.clienteId].pagos.push(invoice.pagada ? (new Date(invoice.fechaPago) - new Date(invoice.fecha)) : null);
      if (!clientTotals[invoice.clienteId].last || new Date(invoice.fecha) > new Date(clientTotals[invoice.clienteId].last.fecha)) {
        clientTotals[invoice.clienteId].last = invoice;
      }
    });
    return Object.entries(clientTotals)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 3)
      .map(([clientId, data]) => ({ clientId, ...data }));
  };

  // Notificaciones ejemplo
  const unsentInvoices = invoices.filter(inv => !inv.enviada).length;

  // Widget resumen mensual ejemplo
  const currentMonth = currentTime.getMonth();
  const currentYear = currentTime.getFullYear();
  const monthInvoices = invoices.filter(inv => new Date(inv.fecha).getMonth() === currentMonth && new Date(inv.fecha).getFullYear() === currentYear);
  const monthTotal = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const monthPaid = monthInvoices.filter(inv => inv.pagada).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Notificaciones */}
      {unsentInvoices > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">Tienes {unsentInvoices} facturas sin enviar</span>
        </div>
      )}
      {/* Widget resumen mensual */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Resumen {currentTime.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
          <span className="text-lg font-bold">{monthInvoices.length} facturas</span>
          <span className="text-green-600 font-semibold">{getCurrencySymbol(currency)}{monthTotal.toFixed(2)} facturado</span>
          <span className="text-xs text-gray-500">{monthPaid > 0 ? Math.round((monthPaid/monthInvoices.length)*100) : 0}% cobradas</span>
        </div>
        {/* Placeholder para gráfico de barras/pastel */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center col-span-2">
          <span className="text-xs text-gray-500 mb-2">(Gráfico de ingresos por cliente/mes aquí)</span>
          <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">[Gráfico]</div>
        </div>
      </div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {getGreeting()}, {userProfile?.name || 'Usuario'}
        </h2>
        <p className="text-gray-600">
          {currentTime.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
            <span className="text-3xl">📄</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Facturas</p>
            <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            <p className="text-xs text-gray-500 mt-1">{clientes.length} clientes activos</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Facturas Pagadas</p>
            <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
            <p className="text-xs text-gray-500 mt-1">{totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}% tasa de pago</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-lg flex items-center justify-center">
            <span className="text-3xl">⏳</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-orange-600">{pendingInvoices}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-red-500">{overdueInvoices} vencidas</span>
              {overdueInvoices > 0 && <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">¡Atención!</span>}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
            <span className="text-3xl">💰</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-blue-600">{getCurrencySymbol(currency)}{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{getCurrencySymbol(currency)}{pendingRevenue.toFixed(2)} pendientes</p>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={`action-${action.title}-${index}`}
              onClick={action.action}
              className={`${action.color} text-white py-3 px-2 rounded-xl shadow-sm flex items-center gap-2 justify-center text-sm font-semibold transition-all duration-300`}
            >
              <span className="text-xl">{action.icon}</span>
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Facturas Recientes</h3>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-4xl">🧾</div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Aún no tienes facturas creadas. ¡Empieza con la primera!</h4>
              <button
                onClick={() => onNavigate('invoices')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-2"
              >
                Crear Factura
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 px-2">N°</th>
                    <th className="py-2 px-2">Cliente</th>
                    <th className="py-2 px-2">Total</th>
                    <th className="py-2 px-2">Estado</th>
                    <th className="py-2 px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {getRecentInvoices().map((invoice, index) => (
                    <tr key={`invoice-${invoice.id || index}`} className="bg-gray-50 even:bg-white">
                      <td className="py-2 px-2 font-medium">#{invoice.numero || invoice.id}</td>
                      <td className="py-2 px-2">{getClienteName(invoice.clienteId)}</td>
                      <td className="py-2 px-2">{getCurrencySymbol(currency)}{invoice.total}</td>
                      <td className="py-2 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${invoice.pagada ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {invoice.pagada ? 'Pagada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="py-2 px-2 flex gap-1">
                        <button onClick={() => onNavigate('invoices')} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Ver</button>
                        <button onClick={() => onNavigate('invoices')} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Top Clients */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mejores Clientes</h3>
          {getTopClients().length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-4xl">👤</div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">¿Quieres ver qué cliente paga más rápido?</h4>
              <p className="text-gray-600 mb-4">Agrega al menos 3 facturas para obtener estadísticas.</p>
              <button
                onClick={() => onNavigate('clients')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Agregar Cliente
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {getTopClients().map((client, index) => (
                <div key={`client-${client.clientId}-${index}`} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-800">{getClienteName(client.clientId)}</p>
                      <p className="text-xs text-gray-500">Total: {getCurrencySymbol(currency)}{client.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">Promedio pago: {client.pagos.filter(Boolean).length > 0 ? (client.pagos.filter(Boolean).reduce((a,b)=>a+b,0)/client.pagos.filter(Boolean).length/86400000).toFixed(1) + ' días' : 'N/A'}</span>
                    <span className="text-xs text-gray-500">Última: {client.last ? new Date(client.last.fecha).toLocaleDateString('es-ES') : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen; 