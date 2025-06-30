import React, { useState, useEffect } from 'react';
import { createEmpresa, updateEmpresa } from '../utils/api';

interface Empresa {
  _id: string;
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

interface EmpresaFormProps {
  onSave: (empresa: Empresa) => void;
  onBack: () => void;
  empresaToEdit: Empresa | null;
}

const EmpresaForm: React.FC<EmpresaFormProps> = ({ onSave, onBack, empresaToEdit }) => {
  const [form, setForm] = useState({
    name: '',
    ruc: '',
    address: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (empresaToEdit) {
      setForm({
        name: empresaToEdit.name || '',
        ruc: empresaToEdit.ruc || '',
        address: empresaToEdit.address || '',
        phone: empresaToEdit.phone || '',
        email: empresaToEdit.email || '',
        notes: empresaToEdit.notes || '',
      });
    }
  }, [empresaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let savedEmpresa: Empresa;
      
      if (empresaToEdit) {
        savedEmpresa = await updateEmpresa(empresaToEdit._id, {
          ...form,
          taxId: form.ruc,
          businessType: 'individual',
          currency: 'USD',
        });
      } else {
        savedEmpresa = await createEmpresa({
          ...form,
          taxId: form.ruc,
          businessType: 'individual',
          currency: 'USD',
        });
      }

      onSave(savedEmpresa);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : 'Error al guardar la empresa');
      setError('Error al guardar la empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {empresaToEdit ? 'Editar Empresa' : 'Nueva Empresa'}
          </h1>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre de la empresa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC *
              </label>
              <input
                type="text"
                name="ruc"
                value={form.ruc}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678901"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección *
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dirección completa"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+51 999 999 999"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="empresa@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Información adicional sobre la empresa..."
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : (empresaToEdit ? 'Actualizar Empresa' : 'Crear Empresa')}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpresaForm; 