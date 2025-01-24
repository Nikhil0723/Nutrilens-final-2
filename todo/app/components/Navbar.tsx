"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/"); // Navigate to the home route
  };

  // Get the current hour
  const currentHour = new Date().getHours();

  // Determine the greeting based on the current time
  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Quotes array for dynamic quotes
  const quotes = [
    "Get ready to make things happen!",
    "Start small, achieve big.",
    "Embrace the power of productivity!",
    "Stay focused, stay productive.",
    "Happy January! A great month for productivity!",
    "Harness the power of productivity!",
    "One task at a time, you've got this!",
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isChanging, setIsChanging] = useState(false); // Track the change

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Trigger transition and change quote every 5 seconds
      setIsChanging(true);
      setTimeout(() => {
        setCurrentQuote((prevQuote) => {
          const currentIndex = quotes.indexOf(prevQuote);
          const nextIndex = (currentIndex + 1) % quotes.length;
          return quotes[nextIndex];
        });
        setIsChanging(false);
      }, 300); // Set timeout to match transition duration
    }, 5000); // 5000ms = 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  });

  return (
    <div className="flex items-center justify-between mt-4 px-4 lg:px-8">
      <div>
        {pathname === "/" ? (
          <>
            <h2 className="font-bold text-2xl sm:text-3xl">
              {getGreeting()} 👋
            </h2>
            <p
              className={`font-medium italic mt-1 text-sm md:text-lg transition-transform duration-500 transform ease-in-out ${
                isChanging
                  ? "-translate-x-20 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {currentQuote}
            </p>
          </>
        ) : (
          <ArrowLeft
            className="text-xl sm:text-2xl cursor-pointer"
            onClick={handleGoHome}
          />
        )}
      </div>
      <div>
        <Sidebar />
      </div>
    </div>
  );
};
