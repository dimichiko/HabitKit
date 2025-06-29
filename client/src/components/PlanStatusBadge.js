import React from 'react';
import { useUser } from '../shared/context/UserContext';

const PlanStatusBadge = ({ 
  showDetails = false, 
  className = '',
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const { user, getPlanFeatures, canUpgradePlan } = useUser();

  if (!user) return null;

  const planFeatures = getPlanFeatures();
  const isPremium = user.isPremium;
  const isInTrial = user.isInTrial;
  const subscriptionExpired = user.subscriptionExpired;

  const getPlanColor = () => {
    if (subscriptionExpired) return 'red';
    if (isInTrial) return 'yellow';
    if (isPremium) return 'purple';
    return 'gray';
  };

  const getPlanIcon = () => {
    if (subscriptionExpired) return '⚠️';
    if (isInTrial) return '⭐';
    if (isPremium) return '👑';
    return '📱';
  };

  const getPlanLabel = () => {
    const planLabels = {
      Free: 'Gratis',
      Individual: 'Individual',
      Flexible: 'Flexible',
      KitFull: 'Kit Full'
    };
    return planLabels[user.plan] || user.plan;
  };

  const getStatusText = () => {
    if (subscriptionExpired) return 'Expirado';
    if (isInTrial) return 'Prueba';
    if (isPremium) return 'Premium';
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
          {canUpgradePlan() && (
            <button
              onClick={() => window.location.href = '/pricing'}
              className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
            >
              Actualizar
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Apps activas:</span>
            <span className="font-medium">{user.activeApps?.length || 0}/{planFeatures?.maxApps}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Historial:</span>
            <span className={planFeatures?.hasFullHistory ? 'text-green-600' : 'text-gray-500'}>
              {planFeatures?.hasFullHistory ? 'Completo' : 'Limitado'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Respaldo:</span>
            <span className={planFeatures?.hasBackups ? 'text-green-600' : 'text-gray-500'}>
              {planFeatures?.hasBackups ? 'Incluido' : 'No incluido'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Soporte:</span>
            <span className="font-medium capitalize">
              {planFeatures?.supportLevel === 'priority' ? 'Prioritario' : 
               planFeatures?.supportLevel === 'email' ? 'Email' : 'Limitado'}
            </span>
          </div>
        </div>

        {subscriptionExpired && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ⚠️ Tu suscripción ha expirado. Renueva para mantener el acceso completo.
          </div>
        )}

        {isInTrial && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            ⭐ Prueba gratuita activa. Actualiza antes de que expire.
          </div>
        )}
      </div>
    );
  }

  // Variante por defecto
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${className}`}>
      <span className="text-base">{getPlanIcon()}</span>
      <span>{getPlanLabel()}</span>
      {showDetails && (
        <span className="text-xs opacity-75">
          ({planFeatures?.maxApps} app{planFeatures?.maxApps !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default PlanStatusBadge; 