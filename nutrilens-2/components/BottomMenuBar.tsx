"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Search, ScanLine, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { path: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
  { path: "/nutri-calculator", icon: <Search className="w-5 h-5" />, label: "Search" },
  { path: "/scan", icon: <ScanLine className="w-5 h-5" />, label: "Scan" },
  { path: "/meal-planner", icon: <Calendar className="w-5 h-5" />, label: "Plans" },
  { path: "/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (path: string) => {
    if (pathname !== path) router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-zinc-950 shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        {routes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <button
              key={route.path}
              onClick={() => handleClick(route.path)}
              className={cn(
                "flex flex-col items-center justify-center text-xs gap-0.5 flex-1 transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {route.icon}
              <span>{route.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
