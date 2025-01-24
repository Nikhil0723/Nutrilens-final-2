"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import { MenuButton } from "./MenuButton";
import {
  IoMdCreate,
  IoMdFolderOpen,
  IoMdList,
  IoMdSwap,
  IoMdTrash,
} from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { Setting } from "./Setting";
import { Logout } from "./Logout";
import { User } from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  const menuItems = [
    {
      label: "Menu Tasks",
      icon: <IoMdList size={24} />,
      route: "/", // Adjust route as needed
    },
    {
      label: "Create Task",
      icon: <IoMdCreate size={24} />,
      route: "/add",
    },
    {
      label: "Categories",
      icon: <IoMdFolderOpen size={24} />,
      route: "/categories",
    },
    {
      label: "Delete Tasks",
      icon: <IoMdTrash size={24} />,
      route: "/delete",
    },
    {
      label: "Transfer Tasks",
      icon: <IoMdSwap size={24} />,
      route: "/transfer-tasks",
    },
  ];

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </SheetTrigger>

        <SheetContent className="rounded-tl-3xl p-6">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-6">
            <Image src="/Logo.png" height={53} width={53} alt="logo" />
            <h1 className="font-bold text-2xl md:text-3xl">
              <span className="text-[#B558FF]">Todo</span> App.
            </h1>
          </div>

          {/* Menu Section */}
          <div>
            <div>
              {menuItems.map((menu) => (
                <MenuButton
                  key={menu.label}
                  title={menu.label}
                  icon={menu.icon}
                  route={menu.route}
                />
              ))}
            </div>
            <Separator className="my-5" />

            {/* Logout and Settings Section */}
            <div className="flex flex-col gap-2">
              <Logout />
              <Setting />
            </div>
            <Separator className="my-5" />

            {/* User Section */}
            <Link href="/user">
              <div className="w-full flex justify-start items-center text-lg border-none font-medium px-4 py-3 shadow-none gap-3 rounded-xl bg-zinc-200 hover:bg-zinc-100">
                <User />
                User
              </div>
            </Link>

            <Separator className="my-5" />

            {/* Footer Section */}
            <div className="text-xs text-center">
              <p>Made with by nikhil0723</p>
              <p>Last update: 2 January 2025 at 4:58:07 am</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          :global(.sheet-content) {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
          }

          .sheet-content h1 {
            font-size: 1.5rem;
          }

          .sheet-content div {
            font-size: 0.9rem;
          }

          .sheet-content .menu-item {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};
