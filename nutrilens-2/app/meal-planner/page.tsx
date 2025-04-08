"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Settings, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleGenerativeAI } from "@google/generative-ai";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const allergiesList = ["Dairy", "Gluten", "Nuts", "Shellfish", "Soy", "Eggs"];
const dietOptions = ["Vegetarian", "Vegan", "Keto", "Paleo", "Low-Carb"];

type MealType = {
  breakfast: string;
  lunch: string;
  dinner: string;
  preferences?: {
    diet: string;
    allergies: string[];
  };
};

type MealsState = Record<string, MealType>;

interface PreferencesType {
  diet: string;
  allergies: string[];
}

const MealPlanner = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [meals, setMeals] = useState<MealsState>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesType>({
    diet: "",
    allergies: [],
  });
  const [loading, setLoading] = useState(false);
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));
  const [error, setError] = useState("");
  const [swappingMeal, setSwappingMeal] = useState<{
    day: string;
    mealType: string;
  } | null>(null);

  const daysOfWeek = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart]
  );

  useEffect(() => {
    const storedMeals = localStorage.getItem("meals");
    if (storedMeals) {
      try {
        setMeals(JSON.parse(storedMeals));
      } catch (e) {
        console.error("Failed to parse stored meals", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const handleWeekNavigation = (direction: "prev" | "next") => {
    setWeekStart((prev) =>
      direction === "prev" ? prev.subtract(7, "day") : prev.add(7, "day")
    );
  };

  const handleDayClick = (day: dayjs.Dayjs) => {
    const formattedDay = day.format("YYYY-MM-DD");
    setSelectedDay(formattedDay);
    if (!meals[formattedDay]) setOpenDialog(true);
  };

  const handlePreferenceChange = (name: string, value: string | string[]) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value : value,
    }));
  };

  const generateFallbackMeal = (mealType?: string) => {
    const fallback = {
      breakfast: "",
      lunch: "",
      dinner: "",
    };

    if (mealType) {
      fallback[mealType] = generateSingleMeal(mealType);
    } else {
      fallback.breakfast = generateSingleMeal("breakfast");
      fallback.lunch = generateSingleMeal("lunch");
      fallback.dinner = generateSingleMeal("dinner");
    }

    return fallback;
  };

  const generateSingleMeal = (mealType: string): string => {
    const options: Record<string, string[]> = {
      breakfast: [
        "Oatmeal with fruits",
        "Yogurt with granola",
        "Avocado toast",
        "Smoothie bowl",
        "Pancakes with maple syrup",
      ],
      lunch: [
        "Quinoa salad",
        "Grilled chicken wrap",
        "Vegetable soup",
        "Pasta primavera",
        "Burrito bowl",
      ],
      dinner: [
        "Salmon with vegetables",
        "Stir-fried tofu",
        "Beef stew",
        "Vegetable lasagna",
        "Shrimp tacos",
      ],
    };

    const filteredOptions = options[mealType].filter((option) => {
      if (
        preferences.diet === "Vegan" &&
        /chicken|beef|shrimp|yogurt|salmon/i.test(option)
      ) {
        return false;
      }
      if (
        preferences.diet === "Vegetarian" &&
        /chicken|beef|shrimp|salmon/i.test(option)
      ) {
        return false;
      }
      return !preferences.allergies.some((allergy) =>
        option.toLowerCase().includes(allergy.toLowerCase())
      );
    });

    return (
      filteredOptions[Math.floor(Math.random() * filteredOptions.length)] ||
      generateFallbackSingleMeal(mealType)
    );
  };

  const generateFallbackSingleMeal = (mealType: string): string => {
    const fallbackOptions: Record<string, Record<string, string>> = {
      breakfast: {
        default: "Oatmeal with fruits",
        vegan: "Chia pudding with berries",
        vegetarian: "Whole grain toast with avocado",
        keto: "Avocado and spinach omelet",
        paleo: "Mixed fruit bowl with nuts",
        lowCarb: "Greek yogurt with berries",
      },
      lunch: {
        default: "Mixed greens salad",
        vegan: "Hummus and vegetable wrap",
        vegetarian: "Quinoa bowl with roasted vegetables",
        keto: "Cauliflower rice with vegetables",
        paleo: "Sweet potato and vegetable hash",
        lowCarb: "Vegetable soup with leafy greens",
      },
      dinner: {
        default: "Vegetable stir-fry",
        vegan: "Lentil and vegetable curry",
        vegetarian: "Eggplant parmesan",
        keto: "Zucchini noodles with pesto",
        paleo: "Roasted vegetables with herbs",
        lowCarb: "Cauliflower crust pizza with vegetables",
      },
    };

    const dietKey = preferences.diet
      ? preferences.diet.toLowerCase().replace("-", "")
      : "default";

    return (
      fallbackOptions[mealType]?.[dietKey] || fallbackOptions[mealType].default
    );
  };

  const generateMeal = async (options?: { day: string; mealType?: string }) => {
    const targetDay = options?.day || selectedDay;
    const mealType = options?.mealType;

    if (!targetDay) return;

    setLoading(true);
    setError("");
    setSwappingMeal(mealType ? { day: targetDay, mealType } : null);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyB-2vOKWlzqb-G0GmhL0nEx7kqplpCnWFE"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const dietPrompt = preferences.diet
        ? `${preferences.diet} diet`
        : "any diet";
      const allergyPrompt =
        preferences.allergies.length > 0
          ? `avoiding ${preferences.allergies.join(", ")}`
          : "no allergy restrictions";
      const mealTypePrompt = mealType
        ? `a ${mealType} meal`
        : "breakfast, lunch and dinner meals";

      const prompt = `Generate ${mealTypePrompt} for ${dietPrompt} ${allergyPrompt}.
        Never include ${
          preferences.allergies.length > 0
            ? preferences.allergies.join(", ")
            : "any allergens"
        }.
        Respond ONLY with this plain JSON format (no markdown, no code blocks, just the raw JSON):
        {
          "breakfast": "meal suggestion",
          "lunch": "meal suggestion",
          "dinner": "meal suggestion"
        }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      let cleanedText = text.trim();

      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }

      let generatedMeals;
      try {
        generatedMeals = JSON.parse(cleanedText);
      } catch (e) {
        console.error(
          "Failed to parse AI response:",
          e,
          "Text was:",
          cleanedText
        );
        generatedMeals = generateFallbackMeal(mealType);
      }

      setMeals((prev) => ({
        ...prev,
        [targetDay]: {
          ...prev[targetDay],
          ...(mealType
            ? { [mealType]: generatedMeals[mealType], preferences }
            : { ...generatedMeals, preferences }),
        },
      }));
    } catch (error) {
      console.error("Error generating meal:", error);
      setError("Failed to generate meal. Using fallback options.");
      const fallbackMeals = generateFallbackMeal(mealType);

      setMeals((prev) => ({
        ...prev,
        [targetDay]: {
          ...prev[targetDay],
          ...(mealType
            ? {
                [mealType]:
                  fallbackMeals[mealType as keyof typeof fallbackMeals],
                preferences,
              }
            : { ...fallbackMeals, preferences }),
        },
      }));
    } finally {
      setLoading(false);
      if (!mealType) setOpenDialog(false);
    }
  };

  const handleSwapMeal = (day: string, mealType: string) => {
    setSwappingMeal({ day, mealType });
    generateMeal({ day, mealType });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto pb-8">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold">Weekly Meal Planner</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenDialog(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleWeekNavigation("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="mx-2 text-sm">
          {weekStart.format("MMM D")} -{" "}
          {weekStart.add(6, "day").format("MMM D")}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleWeekNavigation("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap pb-2 mb-4">
        <div className="flex gap-2">
          {daysOfWeek.map((day) => {
            const formattedDate = day.format("YYYY-MM-DD");
            const hasMeal = !!meals[formattedDate];
            const isSelected = formattedDate === selectedDay;

            return (
              <Button
                key={formattedDate}
                variant={isSelected ? "default" : "outline"}
                className={`min-w-[70px] flex-col gap-0 h-16 ${
                  hasMeal ? "bg-primary/10" : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                <span className="text-sm font-normal">{day.format("ddd")}</span>
                <span
                  className={`text-lg ${
                    isSelected ? "font-bold" : "font-medium"
                  }`}
                >
                  {day.format("D")}
                </span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      {selectedDay && meals[selectedDay] && (
        <Card className="p-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h3 className="text-lg font-semibold">
              {dayjs(selectedDay).format("dddd, MMM D")}
            </h3>
            <div className="flex flex-wrap gap-1">
              {meals[selectedDay].preferences?.diet && (
                <Badge variant="default">
                  {meals[selectedDay].preferences?.diet}
                </Badge>
              )}
              {meals[selectedDay].preferences?.allergies.map((allergy) => (
                <Badge key={allergy} variant="secondary">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="my-3" />
          <div className="grid gap-4">
            {["breakfast", "lunch", "dinner"].map((mealType) => (
              <Card key={mealType} className="relative">
                <CardContent className="p-4 pr-12">
                  <h4 className="font-semibold">
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </h4>
                  <p className="text-sm">
                    {meals[selectedDay][mealType as keyof MealType]}
                  </p>
                </CardContent>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => handleSwapMeal(selectedDay, mealType)}
                  disabled={loading && swappingMeal?.mealType === mealType}
                >
                  {loading && swappingMeal?.mealType === mealType ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Meal Preferences</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="diet">Diet</Label>
              <Select
                value={preferences.diet || "none"} // Use "none" as the default value if no diet is selected
                onValueChange={(value) => {
                  const updatedValue = value === "none" ? "" : value; // Convert "none" back to an empty string
                  handlePreferenceChange("diet", updatedValue);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>{" "}
                  {/* Use "none" instead of "" */}
                  {dietOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Allergies</Label>
              <div className="flex flex-wrap gap-2">
                {allergiesList.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergy-${allergy}`}
                      checked={preferences.allergies.includes(allergy)}
                      onCheckedChange={(checked) => {
                        setPreferences((prev) => ({
                          ...prev,
                          allergies: checked
                            ? [...prev.allergies, allergy]
                            : prev.allergies.filter((a) => a !== allergy),
                        }));
                      }}
                    />
                    <Label
                      htmlFor={`allergy-${allergy}`}
                      className="text-sm font-normal"
                    >
                      {allergy}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={() => generateMeal()} disabled={loading}>
              {loading ? "Generating..." : "Generate Meal Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealPlanner;
