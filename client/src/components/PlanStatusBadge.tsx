import React from 'react';

interface PlanStatusBadgeProps {
  plan: 'free' | 'premium' | 'enterprise' | 'KitFull' | 'Flexible' | 'Individual';
  showDetails?: boolean;
  className?: string;
  variant?: string;
}

const PlanStatusBadge: React.FC<PlanStatusBadgeProps> = ({ plan, showDetails, className, variant }) => {
  const getPlanColor = () => {
    switch (plan) {
      case 'KitFull': return 'bg-purple-600 text-white';
      case 'Flexible': return 'bg-blue-600 text-white';
      case 'Individual': return 'bg-green-600 text-white';
      case 'premium': return 'bg-yellow-500 text-white';
      case 'enterprise': return 'bg-indigo-700 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const getPlanIcon = () => {
    return '📱';
  };

  const getPlanLabel = () => {
    switch (plan) {
      case 'KitFull': return 'Kit Full';
      case 'Flexible': return 'Flexible';
      case 'Individual': return 'Individual';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  const getStatusText = () => {
    return 'Básico';
  };

  // Variante compacta
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        <span>{getPlanIcon()}</span>
        <span className="hidden sm:inline">{getPlanLabel()}</span>
      </div>
    );
  }

  // Variante detallada
  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getPlanIcon()}</span>
            <div>
              <div className="font-semibold text-gray-800">{getPlanLabel()}</div>
              <div className="text-xs text-gray-500">{getStatusText()}</div>
            </div>
          </div>
          <a
            href="/pricing"
            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
          >
            Ver planes
          </a>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Apps disponibles:</span>
            <span className="font-medium">4 apps</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Historial:</span>
            <span className="text-green-600">Completo</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Respaldo:</span>
            <span className="text-green-600">Incluido</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Soporte:</span>
            <span className="font-medium">Prioritario</span>
          </div>
        </div>
      </div>
    );
  }

  // Variante por defecto
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlanColor()} ${className || ''}`}>{getPlanLabel()}</span>
  );
};

export default PlanStatusBadge; 