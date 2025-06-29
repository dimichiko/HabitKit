import React from 'react';
import { FaCheckCircle, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const HabitCard = ({
  habit,
  status,
  checkinSuccess,
  onCheckin,
  onEdit,
  onDelete,
}) => {
  const statusIcons = {
    completed: '🟢',
    partial: '🟡',
    pending: '🔴',
  };

  return (
    <div
      key={habit._id}
      className={`relative bg-white rounded-xl shadow-md p-5 flex flex-col gap-4 border-t-4 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        checkinSuccess === habit._id
          ? 'ring-2 ring-green-400 bg-green-50 transform scale-105'
          : ''
      }`}
      style={{ borderTopColor: habit.color }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span style={{ color: habit.color }}>
            <FaCheckCircle />
          </span>
          {habit.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-700">
            {status.count}/{habit.timesPerDay}
          </span>
          <span className="text-sm">{statusIcons[status.status]}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => onCheckin(habit._id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow transition-all duration-200 ${
            status.count >= habit.timesPerDay
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 hover:scale-105'
          } focus:outline-none focus:ring-2 focus:ring-green-400`}
          style={{
            backgroundColor:
              status.count >= habit.timesPerDay ? undefined : habit.color,
          }}
          disabled={status.count >= habit.timesPerDay}
          title="Haz clic cuando termines este hábito"
        >
          <FaCheckCircle className="mr-1" /> Completar
        </button>

        {status.status === 'completed' && (
          <span className="ml-2 text-xs text-green-600 font-semibold">
            ¡Completado hoy!
          </span>
        )}

        <div className="flex space-x-2">
          <button
            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
            onClick={() => onEdit(habit)}
          >
            <FaEdit />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onDelete(habit._id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Feedback visual al completar */}
      {checkinSuccess === habit._id && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-50 bg-opacity-95 rounded-xl animate-pulse z-10">
          <div className="text-center">
            <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-3 animate-bounce" />
            <span className="text-green-700 text-xl font-bold">
              ¡Completado!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(HabitCard); 