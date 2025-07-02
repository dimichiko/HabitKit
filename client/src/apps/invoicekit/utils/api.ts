import axios, { InternalAxiosRequestConfig } from 'axios';
import { config } from '../../../config';

const API_URL = config.API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: unknown) => {
  return Promise.reject(error);
});

// Helper para adaptar las llamadas existentes
const request = async (url: string, method: string = 'GET', body: any = null) => {
  try {
    const response = await apiClient.request({
      url,
      method,
      data: body
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as any;
    console.error('API Error:', axiosError.response ? axiosError.response.data : axiosError.message);
    throw new Error(axiosError.response?.data?.error || 'Ocurrió un error en la petición');
  }
};

// Re-exportar las funciones del archivo api/invoices.js
export {
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getFacturas,
  createFactura,
  updateFactura,
  deleteFactura,
  updateFacturaType,
  getInvoiceStats
} from '../api/invoices';

// Función adicional para toggle de pago
export const toggleFacturaPayment = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/invoices/${id}/toggle-payment`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Si tienes funciones como saveInvoice o updateInvoice, asegúrate de que incluyan el campo 'tipo'.
// Ejemplo:
// export async function saveInvoice(invoice) {
//   // invoice.tipo puede ser 'factura' o 'presupuesto'
//   // ...
// }
// export async function convertPresupuestoToFactura(id) {
//   // Lógica para actualizar el tipo
// } 