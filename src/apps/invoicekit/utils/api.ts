// Interfaces para los tipos de datos
interface EmpresaData {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  notes?: string;
  taxId: string;
  businessType: string;
  currency: string;
}

interface ClienteData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  empresaId: string;
}

interface ProductoData {
  name: string;
  description?: string;
  price: number;
  empresaId: string;
}

interface FacturaData {
  empresaId: string;
  numero: number;
  subtotal: number;
  total: number;
  fechaEmision: string;
  tipo: string;
  clienteId: string;
  items: Array<{
    productoId: string;
    quantity: number;
    price: number;
  }>;
  fechaVencimiento: string;
}

// Función request tipada
const request = async (url: string, method: string = 'GET', body: any = null) => {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('API Error:', error);
    throw new Error('Ocurrió un error en la petición');
  }
};

// Funciones de autenticación
export const login = (credentials: { email: string; password: string }) => 
  request('/auth/login', 'POST', credentials);

export const register = (userData: { name: string; email: string; password: string }) => 
  request('/auth/register', 'POST', userData);

export const getProfile = () => request('/auth/profile');

// Funciones de empresas
export const getEmpresas = () => request('/invoices/empresas');
export const createEmpresa = (empresaData: EmpresaData) => request('/invoices/empresas', 'POST', empresaData);
export const updateEmpresa = (id: string, empresaData: EmpresaData) => request(`/invoices/empresas/${id}`, 'PUT', empresaData);
export const deleteEmpresa = (id: string) => request(`/invoices/empresas/${id}`, 'DELETE');

// Funciones de clientes
export const getClientes = () => request('/invoices/clientes');
export const createCliente = (clienteData: ClienteData) => request('/invoices/clientes', 'POST', clienteData);
export const updateCliente = (id: string, clienteData: ClienteData) => request(`/invoices/clientes/${id}`, 'PUT', clienteData);
export const deleteCliente = (id: string) => request(`/invoices/clientes/${id}`, 'DELETE');

// Funciones de productos
export const getProductos = () => request('/invoices/productos');
export const createProducto = (productoData: ProductoData) => request('/invoices/productos', 'POST', productoData);
export const updateProducto = (id: string, productoData: ProductoData) => request(`/invoices/productos/${id}`, 'PUT', productoData);
export const deleteProducto = (id: string) => request(`/invoices/productos/${id}`, 'DELETE');

// Funciones de facturas
export const getFacturas = () => request('/invoices/facturas');
export const createFactura = (facturaData: FacturaData) => request('/invoices/facturas', 'POST', facturaData);
export const updateFactura = (id: string, facturaData: FacturaData) => request(`/invoices/facturas/${id}`, 'PUT', facturaData);
export const deleteFactura = (id: string) => request(`/invoices/facturas/${id}`, 'DELETE');
export const toggleFacturaPayment = async (id: string) => {
  return request(`/invoices/facturas/${id}/toggle-payment`, 'PUT');
}; 