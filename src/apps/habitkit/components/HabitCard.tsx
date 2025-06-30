import React from 'react';

interface Habit {
  _id: string;
  name: string;
  description?: string;
  folderId?: string;
  daysOfWeek: number[];
  userId: string;
}

interface HabitStatus {
  status: 'completed' | 'partial' | 'pending';
  date: string;
}

interface HabitCardProps {
  habit: Habit;
  status: HabitStatus;
  checkinSuccess: boolean;
  onCheckin: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  status,
  checkinSuccess,
  onCheckin,
  onEdit,
  onDelete,
}) => {
  const statusIcons = {
    completed: '✅',
    partial: '🟡',
    pending: '⏳',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
  };

  const getDayNames = (days: number[]) => {
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map(day => dayNames[day]).join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {getDayNames(habit.daysOfWeek)}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${statusColors[status.status]}`}>
              <span className="text-sm">{statusIcons[status.status]}</span>
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(habit)}
            className="text-gray-600 hover:text-gray-800 p-1"
            title="Editar"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(habit._id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {status.status === 'completed' && '¡Completado hoy!'}
          {status.status === 'partial' && 'Parcialmente completado'}
          {status.status === 'pending' && 'Pendiente para hoy'}
        </div>
        
        <button
          onClick={() => onCheckin(habit._id)}
          disabled={status.status === 'completed'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            status.status === 'completed'
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status.status === 'completed' ? 'Completado' : 'Marcar'}
        </button>
      </div>

      {checkinSuccess && (
        <div className="mt-2 text-sm text-green-600">
          ¡Hábito marcado como completado!
        </div>
      )}
    </div>
  );
};

export default HabitCard; 