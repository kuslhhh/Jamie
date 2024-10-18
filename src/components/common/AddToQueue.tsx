"use client";
import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatArtistName } from "@/utils/utils";

import { Heart, Share2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
function AddToQueue() {
  const { queue, roomId, listener } = useUserContext();
  const { currentSong } = useAudio();

  const handleShare = useCallback(() => {
    try {
      navigator
        .share({
          url: window.location.origin + "/v/?room=" + roomId,
        })
        .then(() => {
          toast.success("Shared the link successfully!");
        });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [roomId]);
  return (
    <div className=" select-none max-h-full border flex flex-col gap-2 border-[#49454F] w-[45%] rounded-xl p-4">
      <div className=" flex items-center justify-between">
        <p className=" text-lg font-semibold">In Queue</p>
        <div className=" flex items-center gap-1.5">
          {/* <Button
            variant={"secondary"}
            className=" bg-[#8D50F9] p-2.5 trx rounded-md"
          >
            <Search className=" size-4" />
          </Button> */}
          {/* <Button
            variant={"secondary"}
            className=" bg-[#8D50F9] p-2.5 rounded-md"
          >
            <Plus className=" size-4" />
          </Button> */}
        </div>
      </div>
      <div className="h-full overflow-y-scroll">
        <div className="  py-2 flex flex-col overflow-hidden overflow-y-scroll gap-4">
          {queue
            ?.filter((r) => r.id !== currentSong?.id)
            .map((song, i) => (
              <div key={i} className=" flex gap-2 items-center justify-around">
                <div>
                  <Avatar className="size-12 rounded-md">
                    <AvatarImage src={song.image[song.image.length - 1].url} />
                  </Avatar>
                </div>
                <div className="flex flex-col text-sm w-7/12">
                  <p className=" font-semibold truncate">{song.name}</p>
                  <span className=" text-[#8D50F9] truncate text-[12px]">
                    {formatArtistName(song.artists.primary)}
                  </span>
                </div>
                <div className=" flex flex-col items-center gap-2">
                  <Heart />
                  <div className="flex items-center">
                    {/* <Avatar className="size-6 rounded-full">
                      <AvatarImage
                        src={song.image[song.image.length - 1].url}
                      />
                    </Avatar> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className=" flex items-center text-sm font-medium justify-between">
        <div className=" flex items-center gap-1">
          <p>Listening</p>

          <div className=" flex items-center">
            {listener?.roomUsers.slice(0, 3).map((roomUser, i) => (
              <TooltipProvider key={roomUser._id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar
                      className={` ${i !== 0 && "-ml-2.5"} size-6 rounded-full`}
                    >
                      <AvatarImage src={roomUser.userId.imageUrl} />
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className=" bg-[#9870d3] mb-1 text-white">
                    <p>{roomUser.userId.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        <Button
          onClick={handleShare}
          size={"sm"}
          variant={"secondary"}
          className=" bg-[#8D50F9] hover:bg-[#7140c5]"
        >
          {" "}
          <Share2 className="size-4 mr-2" /> Invite Friends
        </Button>
      </div>
    </div>
  );
}

export default AddToQueue;
