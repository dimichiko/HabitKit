import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../shared/context/UserContext';
import Header from '../../../shared/components/Header';
import DashboardScreen from './DashboardScreen';
import FacturasPage from './FacturasPage';
import ClientsPage from './ClientsPage';
import ProductsPage from './ProductsPage';
import EmpresaForm from './EmpresaForm';
import { getEmpresas, getClientes, getProductos, getFacturas } from '../api/invoices';

interface Empresa {
  _id: string;
  name: string;
  logoUrl?: string;
  ruc?: string;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface Cliente {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Producto {
  _id: string;
  name: string;
  price: number;
  description?: string;
  categoria?: string;
  impuestos?: string;
}

interface Factura {
  _id: string;
  numero: number;
}

interface UserProfile {
  name?: string;
  email?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

type CurrentPage = 'dashboard' | 'invoices' | 'clients' | 'products';

const themeConfig = {
  appNameText: 'text-blue-700',
  activeNav: 'bg-blue-500 text-white shadow',
  inactiveNav: 'text-gray-600 hover:bg-blue-100',
};

const InvoiceKitApp = () => {
  const { user, logout } = useUser();
  const userId = user?.id;
  const [currentPage, setActiveScreen] = useState<CurrentPage>('dashboard');
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [currentCompany, setCurrentCompany] = useState<any>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [invoices, setInvoices] = useState<Factura[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompanySelector, setShowCompanySelector] = useState<boolean>(false);
  const [editingEmpresa, setEditingEmpresa] = useState<any>(null);
  const [isCompanyDataLoading, setIsCompanyDataLoading] = useState<boolean>(false);

  const getUserKey = useCallback((key: string) => `invoicekit_${key}_${userId}`, [userId]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Cargando datos iniciales de InvoiceKit...');
        const data = await getEmpresas();
        console.log('✅ Empresas cargadas:', data.length);
        setEmpresas(data);
        
        if (data.length === 0) {
          console.log('📝 No hay empresas, mostrando selector');
          setShowCompanySelector(true);
        } else {
          const lastCompanyId = localStorage.getItem(getUserKey('currentCompanyId'));
          const companyToSelect = data.find((e: Empresa) => e._id === lastCompanyId) || data[0];
          console.log('🏢 Empresa seleccionada:', companyToSelect.name);
          setCurrentCompany(companyToSelect);
        }
      } catch (err) {
        console.error('❌ Error cargando datos iniciales:', err);
        setError('No se pudieron cargar los datos de la empresa. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadInitialData();
    }
  }, [userId, getUserKey]);

  const loadCompanyData = async (companyId: string) => {
    console.log('🔄 Cargando datos de empresa:', companyId);
    setIsCompanyDataLoading(true);
    try {
      const [clientesData, productosData, invoicesData] = await Promise.all([
        getClientes(companyId),
        getProductos(companyId),
        getFacturas(companyId),
      ]);
      console.log('✅ Datos cargados:', { 
        clientes: clientesData.length, 
        productos: productosData.length, 
        facturas: invoicesData.length 
      });
      setClientes(clientesData);
      setProductos(productosData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error cargando datos de la empresa:", error);
      setError("Error al cargar los datos de esta empresa.");
    } finally {
      setIsCompanyDataLoading(false);
    }
  };

  useEffect(() => {
    if (currentCompany) {
      localStorage.setItem(getUserKey('currentCompanyId'), currentCompany._id);
      loadCompanyData(currentCompany._id);
    }
  }, [currentCompany, getUserKey]);

  useEffect(() => {
    const profile = localStorage.getItem('invoicekit_user_profile');
    if (profile) setUserProfile(JSON.parse(profile));
  }, []);

  const handleSaveEmpresa = (savedEmpresa: any) => {
    const exists = empresas.some((e: any) => e._id === savedEmpresa._id);
    if (exists) {
      setEmpresas(empresas.map((e: any) => e._id === savedEmpresa._id ? savedEmpresa : e));
    } else {
      setEmpresas([...empresas, savedEmpresa]);
    }
    setCurrentCompany(savedEmpresa);
    setShowCompanySelector(false);
    setEditingEmpresa(null);
  };

  const handleEditEmpresa = (empresa: any) => {
    setEditingEmpresa(empresa);
    setShowCompanySelector(true);
  };

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'invoices', label: 'Facturas', icon: '🧾' },
    { id: 'clients', label: 'Clientes', icon: '👥' },
    { id: 'products', label: 'Productos', icon: '📦' }
  ];

  const handleBackToAppSelector = () => {
    window.location.href = '/apps';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleNavigate = (route: string) => {
    setActiveScreen(route as CurrentPage);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Cargando InvoiceKit...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div></div>;
  }

  if (showCompanySelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {editingEmpresa ? (
           <EmpresaForm 
             empresaToEdit={editingEmpresa} 
             onSave={handleSaveEmpresa} 
             onBack={() => {
               setEditingEmpresa(null);
               if (empresas.length > 0) {
                 setShowCompanySelector(false);
               }
             }} 
           />
        ) : (
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Seleccionar Empresa</h2>
          <div className="space-y-3 mb-6">
            {empresas.map((company: Empresa) => (
              <div key={company._id} className="flex items-center gap-2">
              <button
                  onClick={() => {
                    setCurrentCompany(company);
                    setShowCompanySelector(false);
                  }}
                  className="w-full p-3 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-left"
              >
                <h3 className="font-semibold text-gray-800">{company.name}</h3>
              </button>
                <button onClick={()=> handleEditEmpresa(company)} className="text-blue-500 hover:underline text-xs p-2">Editar</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setEditingEmpresa({} as Empresa)}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            + Nueva Empresa
          </button>
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        appName="InvoiceKit"
        appLogo="💼"
        themeConfig={themeConfig}
        onBack={handleBackToAppSelector}
        navigationItems={navigationItems}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userProfile={userProfile as any}
        onLogout={handleLogout}
        onViewProfile={() => { /* Lógica para ver perfil */ }}
        onEditProfile={() => { /* Lógica para editar perfil */ }}
        extraActions={
          currentCompany && (
            <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition">
                    {currentCompany.logoUrl ? (
                        <img src={currentCompany.logoUrl} alt="logo" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {currentCompany.name?.[0] || 'E'}
                        </span>
                    )}
                    <span className="text-sm text-gray-700 font-medium">{currentCompany.name}</span>
                    <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                    <div className="py-2">
                        {empresas.map((company: Empresa) => (
                            <button key={company._id} onClick={() => { setCurrentCompany(company); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 transition text-left">
                                {company.logoUrl ? (
                                    <img src={company.logoUrl} alt="logo" className="w-5 h-5 rounded-full object-cover" />
                                ) : (
                                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{company.name?.[0] || 'E'}</span>
                                )}
                                <span className="text-sm text-gray-700">{company.name}</span>
                            </button>
                        ))}
                        <button onClick={() => setShowCompanySelector(true)} className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 text-left">+ Nueva Empresa</button>
                    </div>
                </div>
            </div>
          )
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCompanyDataLoading ? (
           <div className="flex justify-center items-center h-64"><div className="text-lg font-semibold">Cargando...</div></div>
        ) : (
          <>
            {currentPage === 'dashboard' && <DashboardScreen invoices={invoices as any} clientes={clientes as any} onNavigate={handleNavigate} />}
            {currentPage === 'invoices' && <FacturasPage invoices={invoices as any} setInvoices={setInvoices as any} clientes={clientes as any} productos={productos as any} currentCompany={currentCompany as any} />}
            {currentPage === 'clients' && <ClientsPage clientes={clientes as any} setClientes={setClientes as any} currentCompany={currentCompany as any} />}
            {currentPage === 'products' && <ProductsPage productos={productos as any} setProductos={setProductos as any} currentCompany={currentCompany as any} />}
          </>
        )}
      </main>
    </div>
  );
};

export default InvoiceKitApp; 