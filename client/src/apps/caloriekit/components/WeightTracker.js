import React, { useState, useEffect } from 'react';
import { addWeightEntry, getLatestWeight, getWeightStats } from '../utils/api';

const WeightTracker = () => {
  const [latestWeight, setLatestWeight] = useState(null);
  const [weightStats, setWeightStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    notes: ''
  });

  useEffect(() => {
    loadWeightData();
  }, []);

  const loadWeightData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [latest, stats] = await Promise.all([
        getLatestWeight(),
        getWeightStats(7)
      ]);
      
      // Validar datos de peso más reciente
      if (latest && typeof latest === 'object' && typeof latest.weight === 'number') {
        setLatestWeight(latest);
      } else {
        setLatestWeight(null);
      }
      
      // Validar estadísticas de peso
      if (stats && typeof stats === 'object' && stats.entries) {
        setWeightStats(stats);
      } else {
        setWeightStats({
          totalEntries: 0,
          averageWeight: 0,
          weightChange: 0,
          trend: 'stable',
          entries: []
        });
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
      // No mostrar error si es solo que no hay datos
      if (error.message.includes('Respuesta vacía') || error.message.includes('404')) {
        setLatestWeight(null);
        setWeightStats({
          totalEntries: 0,
          averageWeight: 0,
          weightChange: 0,
          trend: 'stable',
          entries: []
        });
      } else {
        setError('Error al cargar datos de peso');
        setLatestWeight(null);
        setWeightStats(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight) return;

    setSubmitting(true);
    setError(null);
    try {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight) || weight <= 0) {
        throw new Error('Peso inválido');
      }

      const newEntry = await addWeightEntry({
        weight: weight,
        notes: formData.notes
      });
      
      if (newEntry && typeof newEntry === 'object' && typeof newEntry.weight === 'number') {
        setLatestWeight(newEntry);
        setFormData({ weight: '', notes: '' });
        setShowForm(false);
        
        // Reload stats to update the chart
        const stats = await getWeightStats(7);
        if (stats && typeof stats === 'object') {
          setWeightStats(stats);
        }
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error adding weight entry:', error);
      setError('Error al registrar el peso. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const getWeightTrend = () => {
    if (!weightStats || !weightStats.entries || !Array.isArray(weightStats.entries) || weightStats.entries.length < 2) {
      return null;
    }
    
    const entries = weightStats.entries;
    const current = entries[entries.length - 1].weight;
    const previous = entries[entries.length - 2].weight;
    
    if (typeof current !== 'number' || typeof previous !== 'number') {
      return null;
    }
    
    const difference = current - previous;
    
    return {
      difference: Math.abs(difference),
      isGaining: difference > 0,
      percentage: Math.abs((difference / previous) * 100)
    };
  };

  const getTrendIcon = (trend) => {
    if (!trend) return '⚖️';
    return trend.isGaining ? '📈' : '📉';
  };

  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-500';
    return trend.isGaining ? 'text-red-500' : 'text-green-500';
  };

  const getTrendText = (trend) => {
    if (!trend) return 'Sin cambios';
    return trend.isGaining ? 'Subió' : 'Bajó';
  };

  const getProgressIcon = () => {
    if (!weightStats || !weightStats.entries || weightStats.entries.length === 0) {
      return '⚖️';
    }
    
    const entries = weightStats.entries;
    if (entries.length < 2) return '⚖️';
    
    const current = entries[entries.length - 1].weight;
    const previous = entries[entries.length - 2].weight;
    const difference = current - previous;
    
    if (Math.abs(difference) < 0.5) return '⚖️';
    if (difference > 0) return '📈';
    return '📉';
  };

  const renderMiniChart = () => {
    if (!weightStats || !weightStats.entries || weightStats.entries.length < 2) {
      return null;
    }

    const entries = weightStats.entries.slice(-7); // Last 7 entries
    const weights = entries.map(entry => entry.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight || 1;

    return (
      <div className="flex items-end justify-between h-16 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 space-x-1">
        {weights.map((weight, index) => {
          const height = ((weight - minWeight) / range) * 100;
          const isLatest = index === weights.length - 1;
          
          return (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-300 ${
                isLatest 
                  ? 'bg-blue-500 shadow-lg' 
                  : 'bg-gray-400 dark:bg-gray-500'
              }`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando peso...</p>
        </div>
      </div>
    );
  }

  const trend = getWeightTrend();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <span className="text-2xl">{getProgressIcon()}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⚖️ Seguimiento de Peso</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registra tu progreso diario</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          aria-label={showForm ? 'Cerrar formulario' : 'Agregar peso'}
        >
          <span className="text-xl">{showForm ? '✕' : '➕'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fadeIn">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-800 hover:text-red-900"
            aria-label="Cerrar mensaje de error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Current Weight Display */}
      {latestWeight ? (
        <div className="mb-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {latestWeight.weight} kg
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Último registro: {new Date(latestWeight.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            
            {trend && (
              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className={`text-lg ${getTrendColor(trend)}`}>
                  {getTrendIcon(trend)}
                </span>
                <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                  {getTrendText(trend)} {trend.difference.toFixed(1)} kg
                </span>
                <span className="text-xs text-gray-500">
                  ({trend.percentage.toFixed(1)}%)
                </span>
              </div>
            )}

            {/* Mini Chart */}
            {renderMiniChart() && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Progreso (últimos 7 días)</p>
                {renderMiniChart()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center py-8">
          <div className="text-6xl mb-4 animate-bounce">⚖️</div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
            ¡Comienza tu seguimiento de peso!
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Registra tu peso diariamente para ver tu progreso
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center space-x-2">
              <span>➕</span>
              <span>Añadir Peso</span>
            </span>
          </button>
        </div>
      )}

      {/* Add Weight Form */}
      {showForm && (
        <div 
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 animate-fadeIn"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                step="0.1"
                min="30"
                max="300"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-all duration-200"
                placeholder="Ej: 70.5"
                required
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-all duration-200"
                placeholder="Ej: Después del ejercicio, por la mañana..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.weight}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </span>
                ) : (
                  'Guardar Peso'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weight Stats */}
      {weightStats && weightStats.entries && weightStats.entries.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estadísticas (7 días)</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {weightStats.averageWeight?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Promedio</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div className={`text-lg font-bold ${weightStats.weightChange > 0 ? 'text-red-600' : weightStats.weightChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {weightStats.weightChange ? (weightStats.weightChange > 0 ? '+' : '') + weightStats.weightChange.toFixed(1) : '0.0'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Cambio</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {weightStats.totalEntries || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Registros</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker; 