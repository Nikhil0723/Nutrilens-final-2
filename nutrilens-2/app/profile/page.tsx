"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type UserData = {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goal: string;
  dietType: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    dietType: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("appData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.user) {
        setFormData(parsed.user);
      }
    }
  }, []);

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const saved = localStorage.getItem("appData");
    const existing = saved ? JSON.parse(saved) : {};
    const updated = {
      ...existing,
      user: formData,
    };

    localStorage.setItem("appData", JSON.stringify(updated));
    toast.success("Profile updated!");
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-white">
      <h1 className="text-xl font-semibold mb-6 text-center">Your Profile</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="Enter your age"
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="e.g., 170"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="e.g., 65"
            />
          </div>

          <div className="space-y-2">
            <Label>Fitness Goal</Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => handleChange("goal", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
                <SelectItem value="maintain">Maintain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Diet Type</Label>
            <Select
              value={formData.dietType}
              onValueChange={(value) => handleChange("dietType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full mt-4" onClick={handleSave}>
            Save Changes
          </Button>

          <Button
            variant="destructive"
            className="w-full mt-2"
            onClick={handleLogout}
          >
            Logout & Clear Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
