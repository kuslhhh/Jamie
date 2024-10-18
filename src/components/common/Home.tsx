"use client";
import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import Blur from "@/components/Blur";
import AddToQueue from "@/components/common/AddToQueue";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Player from "@/components/common/Player";
import useSocket from "@/Hooks/useSocket";
import { useEffect } from "react";

export default function Home() {
  const { currentSong, play } = useAudio();
  const { queue } = useUserContext();
  const { isConnected } = useSocket();
  useEffect(() => {
    if (currentSong) return;
    if (isConnected) {
      if (queue.length === 0) return;
      play(queue[0]);
    }
  }, [isConnected, play, queue, currentSong]);
  if (!isConnected) {
    return (
      <div className="h-dvh w-dvw flex gap-1 flex-col items-center justify-center">
        <p>Connecting...</p>
      </div>
    );
  }
  return (
    <div
      style={{
        backgroundImage: `url('${
          currentSong?.image[currentSong.image.length - 1].url || "/cache.jpg"
        }' ) `,
      }}
      className="h-dvh hidden bg-cover transition-all duration-700 bg-center overflow-hidden md:flex flex-col items-center justify-center py-4 w-full"
    >
      <Blur />
      <Header />
      <div className=" h-full z-40 flex overflow-hidden py-4 gap-4 w-6/12">
        <Player />
        <AddToQueue />
      </div>
      <Footer />
    </div>
  );
}
