interface EmpresaData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  businessType: string;
  currency: string;
}

interface ClienteData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  empresaId: string;
}

interface ProductoData {
  name: string;
  description: string;
  price: number;
  empresaId: string;
}

interface FacturaData {
  clienteId: string;
  empresaId: string;
  items: Array<{
    productoId: string;
    quantity: number;
    price: number;
  }>;
  tipo: 'factura' | 'presupuesto';
}

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

interface InvoiceStats {
  totalFacturas: number;
  totalPresupuestos: number;
  totalIngresos: number;
  facturasRecientes: any[];
  clientesTop: any[];
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5051/api';

// Función helper para hacer requests autenticados
const authenticatedRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Empresas
export const getEmpresas = async (): Promise<any[]> => {
  try {
    return await authenticatedRequest('/invoices/empresas');
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    return [];
  }
};

export const createEmpresa = async (empresaData: EmpresaData): Promise<any> => {
  return await authenticatedRequest('/invoices/empresas', {
    method: 'POST',
    body: JSON.stringify(empresaData),
  });
};

export const updateEmpresa = async (id: string, empresaData: EmpresaData): Promise<any> => {
  return await authenticatedRequest(`/invoices/empresas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(empresaData),
  });
};

export const deleteEmpresa = async (id: string): Promise<any> => {
  return await authenticatedRequest(`/invoices/empresas/${id}`, {
    method: 'DELETE',
  });
};

// Clientes
export const getClientes = async (empresaId: string): Promise<any[]> => {
  try {
    return await authenticatedRequest(`/invoices/clientes?empresaId=${empresaId}`);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

export const createCliente = async (clienteData: ClienteData): Promise<any> => {
  return await authenticatedRequest('/invoices/clientes', {
    method: 'POST',
    body: JSON.stringify(clienteData),
  });
};

export const updateCliente = async (id: string, clienteData: ClienteData): Promise<any> => {
  return await authenticatedRequest(`/invoices/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clienteData),
  });
};

export const deleteCliente = async (id: string): Promise<any> => {
  return await authenticatedRequest(`/invoices/clientes/${id}`, {
    method: 'DELETE',
  });
};

// Productos
export const getProductos = async (empresaId: string): Promise<any[]> => {
  try {
    return await authenticatedRequest(`/invoices/productos?empresaId=${empresaId}`);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};

export const createProducto = async (productoData: ProductoData): Promise<any> => {
  return await authenticatedRequest('/invoices/productos', {
    method: 'POST',
    body: JSON.stringify(productoData),
  });
};

export const updateProducto = async (id: string, productoData: ProductoData): Promise<any> => {
  return await authenticatedRequest(`/invoices/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productoData),
  });
};

export const deleteProducto = async (id: string): Promise<any> => {
  return await authenticatedRequest(`/invoices/productos/${id}`, {
    method: 'DELETE',
  });
};

// Facturas
export const getFacturas = async (empresaId: string): Promise<any[]> => {
  try {
    return await authenticatedRequest(`/invoices?empresaId=${empresaId}`);
  } catch (error) {
    console.error('Error obteniendo facturas:', error);
    return [];
  }
};

export const createFactura = async (facturaData: FacturaData): Promise<any> => {
  return await authenticatedRequest('/invoices/facturas', {
    method: 'POST',
    body: JSON.stringify(facturaData),
  });
};

export const updateFactura = async (id: string, facturaData: FacturaData): Promise<any> => {
  return await authenticatedRequest(`/invoices/facturas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(facturaData),
  });
};

export const deleteFactura = async (id: string): Promise<any> => {
  return await authenticatedRequest(`/invoices/facturas/${id}`, {
    method: 'DELETE',
  });
};

export const updateFacturaType = async (id: string, tipo: 'factura' | 'presupuesto'): Promise<any> => {
  return await authenticatedRequest(`/invoices/facturas/${id}/tipo`, {
    method: 'PATCH',
    body: JSON.stringify({ tipo }),
  });
};

// Estadísticas
export const getInvoiceStats = async (empresaId: string, days: number = 30): Promise<InvoiceStats> => {
  try {
    return await authenticatedRequest(`/invoices/stats?empresaId=${empresaId}&days=${days}`);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      totalFacturas: 0,
      totalPresupuestos: 0,
      totalIngresos: 0,
      facturasRecientes: [],
      clientesTop: []
    };
  }
}; 