import React, { useState, useEffect } from 'react';

const NutritionTips = () => {
  const tips = [
    {
      id: 1,
      title: "Hidratación es clave",
      content: "Bebe al menos 8 vasos de agua al día. La hidratación mejora el metabolismo y ayuda a controlar el apetito.",
      icon: "💧",
      category: "hidratacion",
      color: "blue"
    },
    {
      id: 2,
      title: "Proteínas en cada comida",
      content: "Incluye una fuente de proteína magra en cada comida para mantener la masa muscular y sentirte satisfecho por más tiempo.",
      icon: "🥩",
      category: "proteinas",
      color: "red"
    },
    {
      id: 3,
      title: "Fibra para la saciedad",
      content: "Los alimentos ricos en fibra como frutas, verduras y granos enteros te ayudan a sentirte lleno por más tiempo.",
      icon: "🌾",
      category: "fibra",
      color: "green"
    },
    {
      id: 4,
      title: "Grasas saludables",
      content: "Incluye grasas saludables como aguacate, nueces y aceite de oliva. Son esenciales para la absorción de vitaminas.",
      icon: "🥑",
      category: "grasas",
      color: "yellow"
    },
    {
      id: 5,
      title: "Planificación de comidas",
      content: "Planifica tus comidas con anticipación para evitar decisiones impulsivas que pueden llevar a opciones menos saludables.",
      icon: "📋",
      category: "planificacion",
      color: "purple"
    },
    {
      id: 6,
      title: "Comer despacio",
      content: "Tómate tu tiempo para comer. Masticar bien y comer despacio ayuda a tu cerebro a registrar la saciedad.",
      icon: "⏰",
      category: "habitos",
      color: "orange"
    },
    {
      id: 7,
      title: "Variedad de colores",
      content: "Incluye frutas y verduras de diferentes colores en tu dieta. Cada color aporta diferentes nutrientes y antioxidantes.",
      icon: "🌈",
      category: "nutricion",
      color: "pink"
    },
    {
      id: 8,
      title: "Control de porciones",
      content: "Usa platos más pequeños y presta atención a las porciones. Es mejor comer menos de algo bueno que mucho de algo malo.",
      icon: "🍽️",
      category: "porciones",
      color: "indigo"
    }
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
      setAnimationKey(prevKey => prevKey + 1);
    }, 7000); // Cambia el consejo cada 7 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [tips.length]);

  const currentTip = tips[currentTipIndex];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200',
      pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getCategoryName = (category) => {
    const categories = {
      hidratacion: 'Hidratación',
      proteinas: 'Proteínas',
      fibra: 'Fibra',
      grasas: 'Grasas Saludables',
      planificacion: 'Planificación',
      habitos: 'Hábitos',
      nutricion: 'Nutrición',
      porciones: 'Porciones'
    };
    return categories[category] || category;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full">
      {/* Current Tip */}
      {currentTip && (
        <div 
          key={animationKey}
          className={`p-6 rounded-xl border-2 ${getColorClasses(currentTip.color)}`}
          style={{
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{currentTip.icon}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-lg font-semibold">{currentTip.title}</h4>
                <span className="px-2 py-1 text-xs font-medium bg-white dark:bg-gray-800 rounded-full opacity-80">
                  {getCategoryName(currentTip.category)}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{currentTip.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {tips.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentTipIndex ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }} />
    </div>
  );
};

export default NutritionTips; 