"use client";

import { IoMdFolderOpen, IoMdList, IoMdSwap } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

export const BottomMenuBar: React.FC = () => {
  const menuItems = [
    {
      label: "Tasks",
      icon: <IoMdList size={24} />,
      route: "/", // Adjust route as needed
    },
    {
      label: "Categories",
      icon: <IoMdFolderOpen size={24} />,
      route: "/categories",
    },
    {
      label: "",
      icon: <CiCirclePlus size={34} />,
      route: "/add",
      center: true,
    },

    {
      label: "Transfer",
      icon: <IoMdSwap size={24} />,
      route: "/transfer-tasks",
    },
    {
      label: "Profile",
      icon: <FaUser  size={18}/>,
      route: "/transfer-tasks",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t flex  justify-between px-4 md:hidden mx-auto py-2">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.route}
          className=" flex flex-col items-center justify-between"
        >
          {item.icon}
          <span className=" text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
