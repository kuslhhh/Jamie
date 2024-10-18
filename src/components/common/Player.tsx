"use client";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAudio } from "@/app/store/AudioContext";
import { formatArtistName, formatElapsedTime } from "@/utils/utils";
import {
  MessageSquare,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import VolumeControl from "./VolumeControl";
import { useUserContext } from "@/app/store/userStore";
function Player() {
  const { user } = useUserContext();
  const {
    currentSong,
    progress,
    duration,
    togglePlayPause,
    isPlaying,
    playNext,
    playPrev,
    seek,
    volume,
  } = useAudio();

  const [formattedProgress, setFormattedProgress] = useState<string>("0:00");
  const [formattedDuration, setFormattedDuration] = useState<string>("0:00");

  useEffect(() => {
    setFormattedProgress(formatElapsedTime(progress));
    setFormattedDuration(formatElapsedTime(duration));
  }, [progress, duration]);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    if (user?.role !== "admin") return;
    seek(newTime);
  };

  return (
    <div className=" select-none h-full border border-[#49454F] flex-grow rounded-xl p-7 flex flex-col items-center justify-center gap-4">
      <div className=" size-56 overflow-hidden rounded-xl">
        <Avatar className="rounded-none object-cover h-full w-full">
          <AvatarImage
            src={
              currentSong?.image[currentSong.image.length - 1].url ||
              "/cache.jpg"
            }
          />
        </Avatar>
      </div>
      <div className=" text-center w-full items-center justify-center flex flex-col text-sm ">
        <p className=" text-xl font-medium w-60 truncate">
          {currentSong?.name || "Not Playing"}
        </p>
        <p className=" w-56 text-zinc-200 truncate">
          {(currentSong && formatArtistName(currentSong?.artists.primary)) ||
            "Unknown"}
        </p>
      </div>
      <div className=" flex text-zinc-500 gap-3 items-center">
        <Repeat className=" size-5" />
        {/* <Shuffle className=" size-5" /> */}
        <MessageSquare className=" size-5" />
      </div>
      <div className=" flex items-center gap-4 px-1.5 w-full text-xs">
        <p>{formattedProgress}</p>
        <input
          type="range"
          max={duration || 0}
          value={progress || 0}
          onChange={handleSeek}
          className="w-full h-1.5 bg-zinc-200/20 transition-all duration-300 overflow-hidden rounded-lg appearance-none cursor-pointer"
          aria-label="Seek control"
        />
        <p>{formattedDuration}</p>
      </div>
      <div className=" flex items-center justify-center gap-7 w-full">
        <SkipBack
          onClick={playPrev}
          aria-label="play prev"
          className={`${
            user?.role !== "admin" ? "text-zinc-700" : ""
          } cursor-pointer size-5`}
        />
        <div
          onClick={togglePlayPause}
          className=" bg-[#8D50F9] cursor-pointer p-4 rounded-full"
        >
          {isPlaying ? (
            <Pause className=" size-5" />
          ) : (
            <Play className=" size-5" />
          )}
        </div>
        <SkipForward
          onClick={playNext}
          aria-label="play next"
          className={`${
            user?.role !== "admin" ? "text-zinc-700" : ""
          } cursor-pointer size-5`}
        />
      </div>
      <div className="font-medium w-full mt-2 items-center justify-center select-none text-sm gap-2 flex">
        {volume == 0 ? (
          <VolumeX className=" size-4" />
        ) : volume < 0.5 ? (
          <Volume1 className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}

        <VolumeControl />
      </div>
    </div>
  );
}

export default Player;
