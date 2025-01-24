"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const DevelopmentAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closeAlert = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 p-2 bg-yellow-500 z-50">
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          🚧 This app is still in development! Some features will be enabled in
          the future.
        </p>
        <Button
          onClick={closeAlert}
          className="text-white bg-red-500 hover:bg-red-600"
        >
          X
        </Button>
      </div>
    </div>
  );
};
