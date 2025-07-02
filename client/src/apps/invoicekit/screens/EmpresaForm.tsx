import React, { useState, useEffect } from 'react';
import { createEmpresa, updateEmpresa } from '../utils/api';

interface Empresa {
  _id?: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
}

interface EmpresaFormProps {
  onSave: (empresa: Empresa) => void;
  onBack: () => void;
  empresaToEdit: Empresa | null;
}

const EmpresaForm: React.FC<EmpresaFormProps> = ({ onSave, onBack, empresaToEdit }) => {
  const [empresa, setEmpresa] = useState<Empresa>({
    name: '',
    ruc: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (empresaToEdit) {
      setEmpresa({
        name: empresaToEdit.name || '',
        ruc: empresaToEdit.ruc || '',
        address: empresaToEdit.address || '',
        phone: empresaToEdit.phone || '',
        email: empresaToEdit.email || '',
        notes: empresaToEdit.notes || ''
      });
    }
  }, [empresaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmpresa(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let savedEmpresa: Empresa;
      if (empresaToEdit && empresaToEdit._id) {
        savedEmpresa = await updateEmpresa(empresaToEdit._id, empresa as any);
      } else {
        savedEmpresa = await createEmpresa(empresa as any);
      }
      onSave(savedEmpresa);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo guardar la empresa. Revisa tu conexión o vuelve a intentarlo.';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold mb-2">{empresaToEdit ? 'Editar Empresa' : 'Nueva Empresa'}</h2>
      <input className="border rounded p-2 w-full" name="name" placeholder="Nombre de la empresa" value={empresa.name} onChange={handleChange} required />
      <input className="border rounded p-2 w-full" name="ruc" placeholder="RUC / CUIT / NIT" value={empresa.ruc} onChange={handleChange} />
      <input className="border rounded p-2 w-full" name="address" placeholder="Dirección" value={empresa.address} onChange={handleChange} />
      <input className="border rounded p-2 w-full" name="phone" placeholder="Teléfono" value={empresa.phone} onChange={handleChange} />
      <input className="border rounded p-2 w-full" name="email" placeholder="Email" value={empresa.email} onChange={handleChange} />
      <textarea className="border rounded p-2 w-full" name="notes" placeholder="Notas" value={empresa.notes} onChange={handleChange} />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Guardando...' : 'Guardar Empresa'}
        </button>
        <button type="button" onClick={onBack} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-center mb-2">{error}</div>
      )}
    </form>
  );
};

export default EmpresaForm; 