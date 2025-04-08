"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Search } from "lucide-react";

interface NutritionData {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

interface SelectedIngredient extends NutritionData {
  id: string;
}

export default function MealCalculator() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NutritionData[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "2qWlMeegtqlWFPlWavAvyg==LNeJinKJ2suLEVbE";

  const searchNutrition = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://api.calorieninjas.com/v1/nutrition", {
        params: { query },
        headers: { "X-Api-Key": API_KEY },
      });
      setSearchResults(response.data.items || []);
      if (response.data.items.length === 0) {
        setError("No results found. Try a different search term.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch nutrition data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchNutrition();
  };

  const addIngredient = (ingredient: NutritionData) => {
    const newIngredient = { ...ingredient, id: `${ingredient.name}-${Date.now()}` };
    setSelectedIngredients((prev) => [...prev, newIngredient]);
    setQuery("");
    setSearchResults([]);
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCalories = selectedIngredients.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = selectedIngredients.reduce((sum, item) => sum + item.protein_g, 0);
  const totalCarbs = selectedIngredients.reduce((sum, item) => sum + item.carbohydrates_total_g, 0);
  const totalFat = selectedIngredients.reduce((sum, item) => sum + item.fat_total_g, 0);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Meal Nutrition Calculator</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search (e.g. '100g oats', '1 boiled egg')"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : <Search className="w-4 h-4" />}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {searchResults.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <h2 className="text-lg font-semibold mb-2">Search Results</h2>
            <div className="space-y-2">
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-md px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.calories} cal | {item.serving_size_g}g
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => addIngredient(item)}
                  >
                    <PlusCircle className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedIngredients.length > 0 && (
        <>
          <Card>
            <CardContent className="pt-4">
              <h2 className="text-lg font-semibold mb-2">Your Meal Composition</h2>
              <div className="space-y-2">
                {selectedIngredients.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded-md px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.calories} cal | {item.protein_g}g protein | {item.serving_size_g}g
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(item.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <h2 className="text-lg font-semibold mb-3">Nutrition Summary</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary text-white">
                  {totalCalories} cal
                </Badge>
                <Badge variant="outline" className="bg-green-600 text-white">
                  {totalProtein}g protein
                </Badge>
                <Badge variant="outline" className="bg-yellow-500 text-white">
                  {totalCarbs}g carbs
                </Badge>
                <Badge variant="outline" className="bg-red-500 text-white">
                  {totalFat}g fat
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <NutritionDetail label="Sodium" value={`${selectedIngredients[0].sodium_mg}mg`} />
                <NutritionDetail label="Potassium" value={`${selectedIngredients[0].potassium_mg}mg`} />
                <NutritionDetail label="Cholesterol" value={`${selectedIngredients[0].cholesterol_mg}mg`} />
                <NutritionDetail label="Fiber" value={`${selectedIngredients[0].fiber_g}g`} />
                <NutritionDetail label="Sugar" value={`${selectedIngredients[0].sugar_g}g`} />
                <NutritionDetail label="Saturated Fat" value={`${selectedIngredients[0].fat_saturated_g}g`} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function NutritionDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
