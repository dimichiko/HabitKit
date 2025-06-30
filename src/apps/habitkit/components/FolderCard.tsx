import React from 'react';

interface Folder {
  _id: string;
  name: string;
  color: string;
  userId: string;
}

interface Habit {
  _id: string;
  name: string;
  description?: string;
  folderId?: string;
  daysOfWeek: number[];
  userId: string;
}

interface FolderCardProps {
  folder: Folder;
  habitsInFolder: Habit[];
  isSelected: boolean;
  progress: number;
  color: string;
  onSelect: (folderId: string) => void;
  onAddHabit: (folderId: string) => void;
  onRename: (folderId: string) => void;
  onDelete: (folderId: string) => void;
  renamingFolderId: string | null;
  renameValue: string;
  onRenameValueChange: (value: string) => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  folderError: string | null;
}

const FolderCard: React.FC<FolderCardProps> = ({
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
  const isRenaming = renamingFolderId === folder._id;

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(folder._id)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          {isRenaming ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => onRenameValueChange(e.target.value)}
                className="text-sm border rounded px-2 py-1"
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveRename();
                }}
                className="text-green-600 hover:text-green-800"
              >
                ✓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelRename();
                }}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ) : (
            <h3 className="font-semibold text-gray-800">{folder.name}</h3>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddHabit(folder._id);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename(folder._id);
            }}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ✎
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder._id);
            }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{habitsInFolder.length} hábitos</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>
      </div>

      {folderError && (
        <div className="text-red-500 text-sm mt-2">{folderError}</div>
      )}
    </div>
  );
};

export default FolderCard; 