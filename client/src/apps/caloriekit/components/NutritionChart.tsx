import React from 'react';

interface Meal {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  mealType: string;
}

interface NutritionChartProps {
  meals: Meal[];
}

const NutritionChart: React.FC<NutritionChartProps> = ({ meals }) => {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Gráfico de Nutrición</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalCalories}</div>
          <div className="text-sm text-gray-600">Calorías</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
          <div className="text-sm text-gray-600">Proteínas</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{totalCarbs}g</div>
          <div className="text-sm text-gray-600">Carbohidratos</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalFat}g</div>
          <div className="text-sm text-gray-600">Grasas</div>
        </div>
      </div>

      <div className="space-y-2">
        {meals.map(meal => (
          <div key={meal._id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{meal.name}</p>
              <p className="text-sm text-gray-600">{meal.mealType}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{meal.calories} cal</p>
              <p className="text-sm text-gray-600">
                P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fat}g
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionChart; 