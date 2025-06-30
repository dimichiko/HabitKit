import React from 'react';

interface NutritionTip {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  icon: string;
}

interface NutritionTipsProps {
  tips: NutritionTip[];
}

type ColorType = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'indigo';
type CategoryType = 'hidratacion' | 'proteinas' | 'fibra' | 'grasas' | 'planificacion' | 'habitos' | 'nutricion' | 'porciones';

const NutritionTips: React.FC<NutritionTipsProps> = ({ tips }) => {
  const getColorClasses = (color: ColorType): string => {
    const colorMap: Record<ColorType, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      pink: 'bg-pink-50 border-pink-200 text-pink-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    };
    return colorMap[color] || colorMap.blue;
  };

  const getCategoryName = (category: CategoryType): string => {
    const categories: Record<CategoryType, string> = {
      hidratacion: 'Hidratación',
      proteinas: 'Proteínas',
      fibra: 'Fibra',
      grasas: 'Grasas',
      planificacion: 'Planificación',
      habitos: 'Hábitos',
      nutricion: 'Nutrición',
      porciones: 'Porciones',
    };
    return categories[category] || category;
  };

  if (!tips || tips.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          💡 Consejos de Nutrición
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🥗</div>
          <p>No hay consejos disponibles en este momento.</p>
          <p className="text-sm">Completa tu perfil para recibir consejos personalizados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        💡 Consejos de Nutrición
      </h3>
      
      <div className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className={`p-4 rounded-lg border-l-4 ${getColorClasses(tip.color as ColorType)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{tip.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{tip.title}</h4>
                  <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                    {getCategoryName(tip.category as CategoryType)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{tip.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💭 Recuerda</h4>
        <p className="text-sm text-blue-700">
          Los consejos de nutrición son recomendaciones generales. Siempre consulta con un 
          profesional de la salud para obtener asesoramiento personalizado.
        </p>
      </div>
    </div>
  );
};

export default NutritionTips; 