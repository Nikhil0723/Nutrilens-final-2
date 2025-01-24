import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Setting = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-full flex justify-start text-lg border-none font-medium p-4 py-3 shadow-none gap-3 rounded-xl text-white bg-black hover:bg-stone-700 hover:text-white">
        <Settings size={24} />
        Setting
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl font-semibold flex flex-row items-center gap-4">
            <Settings size={50} className=" border p-3 rounded-2xl " />
            <div>
              Settings
              <p className=" text-base font-bold">
                Manage your settings and preferences.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div>Setting</div>
      </DialogContent>
    </Dialog>
  );
};
