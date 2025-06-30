import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../shared/context/UserContext';

interface UserProfile {
  _id: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  weeklyWeightGoal: number;
}

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

interface Stats {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  remainingCalories: number;
}

const DashboardScreen: React.FC = () => {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const mockProfile: UserProfile = {
      _id: '1',
      email: user?.email || '',
      name: user?.name || '',
      age: 30,
      gender: 'male',
      weight: 70,
      height: 175,
      activityLevel: 'moderate',
      goal: 'lose',
      dailyCalories: 2000,
      protein: 150,
      carbs: 200,
      fat: 67,
      weeklyWeightGoal: -0.5
    };

    const mockMeals: Meal[] = [
      {
        _id: '1',
        name: 'Desayuno',
        calories: 400,
        protein: 25,
        carbs: 45,
        fat: 15,
        date: '2024-01-01',
        mealType: 'breakfast'
      }
    ];

    const mockStats: Stats = {
      totalCalories: 400,
      totalProtein: 25,
      totalCarbs: 45,
      totalFat: 15,
      remainingCalories: 1600
    };

    setProfile(mockProfile);
    setMeals(mockMeals);
    setStats(mockStats);
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Calorías</h1>
      
      {profile && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Perfil</h2>
          <p>Nombre: {profile.name}</p>
          <p>Calorías diarias: {profile.dailyCalories}</p>
        </div>
      )}

      {stats && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas del Día</h2>
          <p>Calorías consumidas: {stats.totalCalories}</p>
          <p>Calorías restantes: {stats.remainingCalories}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Comidas del Día</h2>
        {meals.map(meal => (
          <div key={meal._id} className="border-b py-2">
            <p>{meal.name}: {meal.calories} calorías</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardScreen; 