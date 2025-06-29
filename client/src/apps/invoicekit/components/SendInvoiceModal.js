import React, { useState } from 'react';

const SendInvoiceModal = ({ isOpen, onClose, factura, companyData, onSend }) => {
  const [email, setEmail] = useState('');
  const [emailService, setEmailService] = useState('gmail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/invoices/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          to: email,
          facturaData: factura,
          companyData: companyData,
          emailService: emailService
        })
      });

      const data = await response.json();

      if (data.success) {
        onSend(data);
        onClose();
      } else {
        setError(data.error || 'Error al enviar la factura');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Enviar Factura por Email
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="send-invoice-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email del Destinatario
            </label>
            <input
              id="send-invoice-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="cliente@ejemplo.com"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="send-invoice-service" className="block text-sm font-medium text-gray-700 mb-2">
              Servicio de Email
            </label>
            <select
              id="send-invoice-service"
              value={emailService}
              onChange={(e) => setEmailService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gmail">Gmail</option>
              <option value="outlook">Outlook/Hotmail</option>
              <option value="yahoo">Yahoo</option>
              <option value="custom">SMTP Personalizado</option>
            </select>
          </div>

          {emailService === 'custom' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Para SMTP personalizado, configura las variables de entorno en el servidor:
              </p>
              <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
                <li>SMTP_HOST</li>
                <li>SMTP_PORT</li>
                <li>SMTP_USER</li>
                <li>SMTP_PASS</li>
              </ul>
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Detalles de la Factura</h4>
            <p className="text-sm text-blue-700">
              <strong>Número:</strong> {factura.numero}<br/>
              <strong>Cliente:</strong> {factura.clienteId}<br/>
              <strong>Total:</strong> ${factura.total}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar Factura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendInvoiceModal; 