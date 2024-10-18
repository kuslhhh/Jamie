import { useUserContext } from "@/app/store/userStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useState } from "react";
import api from "@/lib/api";
import { socket } from "@/app/socket";
import { toast } from "sonner";

function Userprofile() {
  const { user } = useUserContext();
  const [name, setName] = useState(user?.username);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });
    const res = await api.post("/api/update", data);
    if (res.success) {
      toast.success("Username updated");
      socket.emit("update");
    }
  };
  return (
    <Dialog key={"user profile"}>
      <DialogTrigger>
        <Avatar className=" size-10 cursor-pointer rounded-full">
          <AvatarImage
            src={user?.imageUrl || "https://imagedump.vercel.app/notFound.jpg"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="w-[60%] bg-transparent border-none">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col bg-black/80 p-5 items-center justify-center w-[40%] overflow-hidden rounded-2xl">
            <Avatar className=" size-16 rounded-full">
              <AvatarImage
                src={
                  user?.imageUrl || "https://imagedump.vercel.app/notFound.jpg"
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <form
              onSubmit={handleSubmit}
              className=" flex gap-2.5 mt-4 mb-1.5 w-full flex-col"
            >
              {/* <Input placeholder="ID" readOnly value={user?._id} /> */}
              <Input
                placeholder="username"
                name="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                defaultValue={user?.username}
              />
              <DialogClose>
                <Button variant={"secondary"} className="w-full">
                  Update
                </Button>
              </DialogClose>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Userprofile;
