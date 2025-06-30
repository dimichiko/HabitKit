import React from 'react';

const AchievementsSystem = () => {
    // Valores de marcador de posición
    const points = 0;
    const totalAchievements = 0;

    return (
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-yellow-600 dark:text-yellow-400">
            <span role="img" aria-label="Estrella de logros" className="text-lg">⭐</span>
            <span>{`${points}/${totalAchievements}`}</span>
        </div>
    );
};

export default AchievementsSystem; 