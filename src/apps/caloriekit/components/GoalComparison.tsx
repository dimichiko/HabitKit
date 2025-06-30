import React from 'react';

interface WeightStats {
  entries: Array<{
    weight: number;
    date: string;
  }>;
}

interface GoalComparisonProps {
  currentWeight: number;
  targetWeight: number;
  goal: 'lose' | 'gain' | 'maintain';
  weightStats: WeightStats | null;
}

interface GoalTextMap {
  lose: string;
  gain: string;
  maintain: string;
}

const GoalComparison: React.FC<GoalComparisonProps> = ({
  currentWeight,
  targetWeight,
  goal,
  weightStats,
}) => {
  const weightDifference = currentWeight - targetWeight;
  const percentageToGoal = goal === 'maintain' 
    ? 100 
    : Math.abs(weightDifference) > 0 
      ? Math.min(100, (Math.abs(weightDifference) / Math.abs(targetWeight - currentWeight)) * 100)
      : 0;

  const getProgressTextColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrafficLightIcon = (percentage: number): string => {
    if (percentage >= 80) return '🟢';
    if (percentage >= 60) return '🟡';
    if (percentage >= 40) return '🟠';
    return '🔴';
  };

  const getWeightTrend = () => {
    if (!weightStats || !weightStats.entries || !Array.isArray(weightStats.entries) || weightStats.entries.length === 0) {
      return { trend: 'stable', change: 0 };
    }

    const entries = weightStats.entries;
    if (entries.length < 2) {
      return { trend: 'stable', change: 0 };
    }

    const currentWeight = weightStats.entries[weightStats.entries.length - 1]?.weight;
    const previousWeight = weightStats.entries[weightStats.entries.length - 2]?.weight;

    if (!currentWeight || !previousWeight) {
      return { trend: 'stable', change: 0 };
    }

    const change = currentWeight - previousWeight;
    const trend = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';

    return { trend, change: Math.abs(change) };
  };

  const { trend, change } = getWeightTrend();

  const goalText: GoalTextMap = {
    lose: 'Perder peso',
    gain: 'Ganar peso',
    maintain: 'Mantener peso',
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'increasing':
        return goal === 'gain' ? 'text-green-600' : 'text-red-600';
      case 'decreasing':
        return goal === 'lose' ? 'text-green-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Comparación con Objetivo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objetivo */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">Objetivo</h4>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Objetivo:</span> {goalText[goal]}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Peso objetivo:</span> {targetWeight} kg
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Diferencia:</span>{' '}
              <span className={weightDifference > 0 ? 'text-red-600' : 'text-green-600'}>
                {weightDifference > 0 ? '+' : ''}{weightDifference.toFixed(1)} kg
              </span>
            </p>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-800">Progreso</h4>
            <span className="text-2xl">{getTrafficLightIcon(percentageToGoal)}</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              <span className="font-medium">Completado:</span>{' '}
              <span className={getProgressTextColor(percentageToGoal)}>
                {percentageToGoal.toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${percentageToGoal}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800">Tendencia Reciente</h4>
          <span className="text-2xl">{getTrendIcon()}</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Dirección:</span>{' '}
            <span className={getTrendColor()}>
              {trend === 'increasing' ? 'Subiendo' : trend === 'decreasing' ? 'Bajando' : 'Estable'}
            </span>
          </p>
          {change > 0 && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Cambio:</span> {change.toFixed(1)} kg
            </p>
          )}
          <p className="text-sm text-gray-600">
            {trend === 'increasing' && goal === 'gain' && '¡Excelente! Vas en la dirección correcta.'}
            {trend === 'decreasing' && goal === 'lose' && '¡Excelente! Vas en la dirección correcta.'}
            {trend === 'stable' && goal === 'maintain' && '¡Perfecto! Manteniendo el peso objetivo.'}
            {((trend === 'increasing' && goal === 'lose') || (trend === 'decreasing' && goal === 'gain')) && 
              'Considera ajustar tu plan para alcanzar tu objetivo.'}
          </p>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Recomendaciones</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          {goal === 'lose' && (
            <>
              <p>• Mantén un déficit calórico de 300-500 calorías diarias</p>
              <p>• Aumenta tu actividad física</p>
              <p>• Prioriza proteínas magras y vegetales</p>
            </>
          )}
          {goal === 'gain' && (
            <>
              <p>• Consume 300-500 calorías extra diarias</p>
              <p>• Incluye entrenamiento de fuerza</p>
              <p>• Aumenta el consumo de proteínas</p>
            </>
          )}
          {goal === 'maintain' && (
            <>
              <p>• Mantén un balance calórico</p>
              <p>• Continúa con tu rutina de ejercicio</p>
              <p>• Monitorea tu peso semanalmente</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalComparison; 