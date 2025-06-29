import React from 'react';
import { FaFolder, FaPlus, FaPen, FaTrash } from 'react-icons/fa';

const FolderCard = ({
  folder,
  habitsInFolder,
  isSelected,
  progress,
  color,
  onSelect,
  onAddHabit,
  onRename,
  onDelete,
  renamingFolderId,
  renameValue,
  onRenameValueChange,
  onSaveRename,
  onCancelRename,
  folderError,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
      }`}
      onClick={() => onSelect(folder._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(folder._id);
        }
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FaFolder
            className={`text-lg ${isSelected ? 'text-green-500' : ''}`}
            style={{ color: isSelected ? undefined : color }}
          />
          <span
            className={`font-medium ${
              isSelected ? 'text-green-700' : 'text-gray-700'
            }`}
          >
            {folder.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {folder._id !== 'all-habits' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddHabit(folder.name);
                }}
                className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                title="Agregar hábito a esta carpeta"
              >
                <FaPlus className="text-xs" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(folder._id, folder.name);
                }}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Renombrar"
              >
                <FaPen className="text-xs" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder._id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar"
              >
                <FaTrash className="text-xs" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-500">
          {habitsInFolder} hábito{habitsInFolder !== 1 ? 's' : ''}
        </div>
        {progress.total > 0 && (
          <div className="text-gray-600 font-medium">
            {progress.completed}/{progress.total} completados
          </div>
        )}
      </div>

      {/* Modal de renombrar carpeta */}
      {renamingFolderId === folder._id && (
        <div className="mt-3 p-3 bg-white rounded border">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => onRenameValueChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nuevo nombre"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onSaveRename(folder._id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar
            </button>
            <button
              onClick={onCancelRename}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
          {folderError && (
            <div className="mt-1 text-xs text-red-600">{folderError}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(FolderCard); 