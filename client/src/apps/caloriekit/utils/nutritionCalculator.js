// Nutrition calculation utilities for CalorieKit

// Calculate calories from macronutrients
export const calculateCaloriesFromMacros = (protein, carbs, fat) => {
  return (protein * 4) + (carbs * 4) + (fat * 9);
};

// Calculate macronutrient percentages
export const calculateMacroPercentages = (protein, carbs, fat) => {
  const totalCalories = calculateCaloriesFromMacros(protein, carbs, fat);
  
  if (totalCalories === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }
  
  return {
    protein: Math.round((protein * 4 / totalCalories) * 100),
    carbs: Math.round((carbs * 4 / totalCalories) * 100),
    fat: Math.round((fat * 9 / totalCalories) * 100)
  };
};

// Calculate BMI
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Get BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: 'Bajo peso', color: 'text-blue-600' };
  if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600' };
  if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
  return { category: 'Obesidad', color: 'text-red-600' };
};

// Calculate ideal weight range
export const calculateIdealWeightRange = (height, gender) => {
  const heightInMeters = height / 100;
  const bmiMin = 18.5;
  const bmiMax = 24.9;
  
  const minWeight = bmiMin * (heightInMeters * heightInMeters);
  const maxWeight = bmiMax * (heightInMeters * heightInMeters);
  
  return {
    min: Math.round(minWeight),
    max: Math.round(maxWeight)
  };
};

// Calculate daily water needs
export const calculateWaterNeeds = (weight, activityLevel = 'moderate') => {
  const baseWater = weight * 0.033; // 33ml per kg
  
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    veryActive: 1.4
  };
  
  return Math.round(baseWater * activityMultipliers[activityLevel] * 1000); // Convert to ml
};

// Calculate protein needs based on activity level
export const calculateProteinNeeds = (weight, activityLevel = 'moderate') => {
  const proteinMultipliers = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    veryActive: 1.6
  };
  
  return Math.round(weight * proteinMultipliers[activityLevel]);
};

// Calculate daily calorie deficit for weight loss
export const calculateWeightLossDeficit = (currentWeight, targetWeight, timeframeWeeks) => {
  const weightToLose = currentWeight - targetWeight;
  const totalCaloriesToLose = weightToLose * 7700; // 7700 calories = 1kg
  const dailyDeficit = totalCaloriesToLose / (timeframeWeeks * 7);
  
  return Math.round(dailyDeficit);
};

// Calculate daily calorie surplus for weight gain
export const calculateWeightGainSurplus = (currentWeight, targetWeight, timeframeWeeks) => {
  const weightToGain = targetWeight - currentWeight;
  const totalCaloriesToGain = weightToGain * 7700;
  const dailySurplus = totalCaloriesToGain / (timeframeWeeks * 7);
  
  return Math.round(dailySurplus);
};

// Calculate meal timing recommendations
export const calculateMealTiming = (dailyCalories, mealCount = 3) => {
  const baseMealCalories = dailyCalories / mealCount;
  
  const mealDistribution = {
    3: { breakfast: 0.3, lunch: 0.35, dinner: 0.35 },
    4: { breakfast: 0.25, snack: 0.15, lunch: 0.3, dinner: 0.3 },
    5: { breakfast: 0.2, snack1: 0.1, lunch: 0.25, snack2: 0.15, dinner: 0.3 },
    6: { breakfast: 0.2, snack1: 0.1, lunch: 0.25, snack2: 0.1, dinner: 0.25, snack3: 0.1 }
  };
  
  const distribution = mealDistribution[mealCount];
  const mealCalories = {};
  
  Object.keys(distribution).forEach(meal => {
    mealCalories[meal] = Math.round(baseMealCalories * distribution[meal]);
  });
  
  return mealCalories;
};

// Calculate nutrition score (0-100)
export const calculateNutritionScore = (meals, dailyGoal) => {
  if (meals.length === 0) return 0;
  
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);
  
  // Calorie score (40% weight)
  const calorieScore = Math.min((totalCalories / dailyGoal) * 100, 100);
  
  // Macro balance score (30% weight)
  const macroPercentages = calculateMacroPercentages(totalProtein, totalCarbs, totalFat);
  const proteinScore = Math.min((macroPercentages.protein / 25) * 100, 100); // Target 25%
  const carbScore = Math.min((macroPercentages.carbs / 50) * 100, 100); // Target 50%
  const fatScore = Math.min((macroPercentages.fat / 25) * 100, 100); // Target 25%
  const macroScore = (proteinScore + carbScore + fatScore) / 3;
  
  // Meal frequency score (30% weight)
  const mealFrequencyScore = Math.min((meals.length / 3) * 100, 100);
  
  const finalScore = (calorieScore * 0.4) + (macroScore * 0.3) + (mealFrequencyScore * 0.3);
  
  return Math.round(finalScore);
};

// Get nutrition score feedback
export const getNutritionScoreFeedback = (score) => {
  if (score >= 90) {
    return { 
      level: 'Excelente', 
      color: 'text-green-600',
      message: '¡Excelente trabajo! Tu nutrición está muy bien balanceada.'
    };
  } else if (score >= 75) {
    return { 
      level: 'Bueno', 
      color: 'text-blue-600',
      message: 'Buen trabajo. Hay algunas áreas que puedes mejorar.'
    };
  } else if (score >= 60) {
    return { 
      level: 'Regular', 
      color: 'text-yellow-600',
      message: 'Regular. Considera ajustar tu plan nutricional.'
    };
  } else {
    return { 
      level: 'Necesita mejora', 
      color: 'text-red-600',
      message: 'Necesitas mejorar tu nutrición. Consulta con un profesional.'
    };
  }
};

// Export all functions
export default {
  calculateCaloriesFromMacros,
  calculateMacroPercentages,
  calculateBMI,
  getBMICategory,
  calculateIdealWeightRange,
  calculateWaterNeeds,
  calculateProteinNeeds,
  calculateWeightLossDeficit,
  calculateWeightGainSurplus,
  calculateMealTiming,
  calculateNutritionScore,
  getNutritionScoreFeedback
}; 