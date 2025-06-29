import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getMealsByDate, addMeal, deleteMeal } from '../utils/api';

const MealContext = createContext();

export const useMeals = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeals debe ser usado dentro de MealProvider');
  }
  return context;
};

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const loadingRef = useRef(false);

  const loadMeals = async (date = selectedDate) => {
    if (loadingRef.current) {
      console.log('Ya hay una carga en progreso, saltando...');
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando comidas para fecha:', date);
      const mealsData = await getMealsByDate(date);
      if (Array.isArray(mealsData)) {
        setMeals(mealsData);
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
      setError('Error al cargar las comidas');
      setMeals([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const addMealToContext = async (mealData) => {
    try {
      const newMeal = await addMeal({
        ...mealData,
        date: selectedDate
      });
      
      if (newMeal && newMeal._id) {
        setMeals(prev => [...prev, newMeal]);
        return newMeal;
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  };

  const removeMealFromContext = async (mealId) => {
    try {
      await deleteMeal(mealId);
      setMeals(prev => prev.filter(meal => meal._id !== mealId));
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };

  const changeDate = (date) => {
    setSelectedDate(date);
    loadMeals(date);
  };

  const refreshMeals = () => {
    loadMeals();
  };

  const value = {
    meals,
    loading,
    error,
    selectedDate,
    loadMeals,
    addMeal: addMealToContext,
    deleteMeal: removeMealFromContext,
    changeDate,
    refreshMeals,
    setError: (error) => setError(error)
  };

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  );
}; 