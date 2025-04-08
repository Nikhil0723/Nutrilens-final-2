'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flame, Dumbbell, Droplets, Salad } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

type Meal = {
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [reminders, setReminders] = useState({
    water: true,
    logging: false,
    weeklyReports: true,
  });

  useEffect(() => {
    const storedMeals = localStorage.getItem('meals');
    const storedWater = localStorage.getItem('waterIntake');
    const storedReminders = localStorage.getItem('reminders');

    let parsedMeals: { [date: string]: { [type: string]: Meal } } = {};

    try {
      parsedMeals = storedMeals ? JSON.parse(storedMeals) : {};
    } catch (err) {
      parsedMeals = {};
    }

    const today = dayjs().format('YYYY-MM-DD');
    const todayMeals = parsedMeals[today] || {};
    const todayMealList: Meal[] = Object.values(todayMeals);

    setMeals(todayMealList);

    const totals = todayMealList.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fats += meal.fats;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    setSummary(totals);
    setWaterGlasses(storedWater ? parseInt(storedWater) : 0);
    setReminders(
      storedReminders
        ? JSON.parse(storedReminders)
        : { water: true, logging: false, weeklyReports: true }
    );
  }, []);

  const goals = {
    calories: 2000,
    protein: 120,
    carbs: 250,
    fats: 65,
    water: 8,
  };

  const handleGenerateMeals = () => {
    router.push('/meal-planner');
  };

  return (
    <div className="p-4 space-y-6 max-w-[600px] mx-auto">
      <div className="text-center">
        <h1 className="text-xl font-semibold">NutriTrack</h1>
        <p className="text-sm text-muted-foreground">{dayjs().format('dddd, MMMM D, YYYY')}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <Flame className="mb-1" />
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-bold">{summary.calories.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">/ {goals.calories} kcal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <Dumbbell className="mb-1" />
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="font-bold">{summary.protein}g</p>
            <p className="text-xs text-muted-foreground">/ {goals.protein}g</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <Salad className="mb-1" />
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="font-bold">{summary.carbs}g</p>
            <p className="text-xs text-muted-foreground">/ {goals.carbs}g</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <Droplets className="mb-1" />
            <p className="text-xs text-muted-foreground">Fats</p>
            <p className="font-bold">{summary.fats}g</p>
            <p className="text-xs text-muted-foreground">/ {goals.fats}g</p>
          </CardContent>
        </Card>
      </div>

      {/* Water Intake */}
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-sm font-medium">💧 Water Intake</p>
          <p className="text-xs text-muted-foreground">
            {waterGlasses} of {goals.water} glasses
          </p>
        </div>
        <Progress value={(waterGlasses / goals.water) * 100} />
      </div>

      {/* Today's Meals */}
      <div>
        <p className="text-sm font-medium mb-2">🍽️ Today's Meals</p>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {meals.map((meal, idx) => (
              <Card key={idx} className="overflow-hidden">
                <img src={meal.image} alt={meal.name} className="w-full h-24 object-cover" />
                <CardContent className="p-2 space-y-1">
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.time}</p>
                  <p className="text-xs">{meal.calories} kcal</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <CardContent>
              <p className="text-sm mb-3">No meals found for today.</p>
              <Button onClick={handleGenerateMeals}>Generate Today’s Meal</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reminders */}
      <div className="bg-muted/40 p-4 rounded-xl">
        <p className="text-sm font-medium mb-2">Reminders</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Water Reminder</span>
          <Switch checked={reminders.water} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Meal Logging</span>
          <Switch checked={reminders.logging} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Weekly Reports</span>
          <Switch checked={reminders.weeklyReports} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary">Scan Barcode</Button>
        <Button variant="secondary">AI Meal Generator</Button>
        <Button variant="secondary">Meal Calculator</Button>
        <Button variant="secondary">Profile</Button>
      </div>
    </div>
  );
}
