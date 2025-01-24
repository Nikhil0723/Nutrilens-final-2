import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full flex justify-start text-base border-none font-medium px-4 py-4 shadow-none gap-3 rounded-xl hover:bg-zinc-100">
        <LogOut size={24} strokeWidth={1.5} />
        Logout
      </DialogTrigger>
      <DialogContent className="p-6 sm:p-8 max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-4 mb-2 text-xl font-semibold">
            <LogOut size={50} className="border p-3 rounded-2xl" />
            Logout Confirmation
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <h1 className="text-base text-left">
          Are you sure you want to logout?{" "}
          <span className="font-bold">Your tasks will not be saved.</span>
        </h1>
        <div className="flex flex-row items-center justify-between sm:justify-end gap-4 mt-7">
          <DialogClose>
            <Button className="p-6 rounded-2xl text-sm font-medium text-purple-500 hover:bg-purple-100 bg-white border-none shadow-none">
              CANCEL
            </Button>
          </DialogClose>
          <Button
            className="p-6 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 bg-white border-none shadow-none "
            onClick={handleLogout}
          >
            <LogOut />
            LOGOUT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
