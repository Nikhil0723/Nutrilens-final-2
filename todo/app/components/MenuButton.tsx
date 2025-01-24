"use client";
import React, { JSX } from "react";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";

interface IMenuItemProps {
  title: string;
  icon: JSX.Element;
  route: string;
}

export const MenuButton = ({ title, icon, route }: IMenuItemProps) => {
  return (
    <SheetClose asChild> 
    <Link href={route}>
      <div className="w-full flex  justify-start text-base border-none font-medium px-4 py-4 shadow-none gap-3 rounded-xl  hover:bg-zinc-100">
        {icon}
        {title}
      </div>
    </Link>
    </SheetClose>
  );
};
