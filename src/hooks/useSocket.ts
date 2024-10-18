"use client";

import { socket } from "@/app/socket";
import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import api from "@/lib/api";
import { listener, queue, searchResults, TUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export default function useSocket() {
  const { isConnected, setIsConnected } = useUserContext();
  const [transport, setTransport] = useState("N/A");
  const { roomId, setRoomId, setListener, setUser, setQueue, user } =
    useUserContext();
  const { play, seek } = useAudio();
  const router = useRouter();
  const socketRef = useRef(socket);

  const getQueues = useCallback(async () => {
    const res = await api.get(`/api/queue?roomId=${roomId}`);
    if (res.success) {
      const data = res.data as queue[];
      const songData = data.map((song) => song.songData);
      console.log(songData);

      setQueue(songData);
    }
  }, [roomId, setQueue]);

  const getListeners = useCallback(async () => {
    const res = await api.get(`/api/listeners?roomId=${roomId}`);
    if (res.success) {
      setListener(res.data as listener);
    }
  }, [setListener, roomId]);

  const onConnect = useCallback(async () => {
    try {
      setIsConnected(true);
      setTransport(socketRef.current.io.engine.transport.name);
      socketRef.current.emit("joinRoom", { roomId });
    } catch (error) {
      toast.error("Failed to connect");
    }

    socketRef.current.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }, [roomId, setIsConnected]);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    setTransport("N/A");
  }, [setIsConnected]);

  useEffect(() => {
    const currentSocket = socketRef.current;
    if (currentSocket.connected) {
      onConnect();
    }

    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);

    const handleNextSong = (nextSong: searchResults) => play(nextSong);
    const handlePrevSong = (prevSong: searchResults) => play(prevSong);

    currentSocket.on("nextSong", handleNextSong);
    currentSocket.on("prevSong", handlePrevSong);

    currentSocket.on(
      "joinedRoom",
      async ({ roomId, user }: { roomId: string; user: TUser }) => {
        router.push(`/v/?room=${roomId}`);
        setRoomId(roomId);
        setUser(user);
        await getListeners();
        await getQueues();
      },
    );

    currentSocket.on("userJoinedRoom", async ({ user }: { user: TUser }) => {
      toast(`${user.username} has joined`);
      await getListeners();
    });
    currentSocket.on("update", async () => {
      await getListeners();
    });

    currentSocket.on("userLeftRoom", async (user: TUser) => {
      toast(`${user.username} left `, {
        style: { backgroundColor: "#e94225" },
      });
      await getListeners();
    });

    currentSocket.on("error", (message: string) => {
      toast.error(message, {
        style: { background: "#e94625" },
      });
    });
    currentSocket.on("songQueue", async () => {
      await getQueues();
    });
    currentSocket.on(
      "seek",
      (data: { seek: number; role: string; userId: string }) => {
        if (data.role == "admin" && data.userId == user?._id) return;
        seek(data.seek);
      },
    );
    currentSocket.on("connect_error", (error: any) => {
      toast.error(error?.message || "Something went wrong", {
        style: { background: "#e94625" },
      });
    });
    return () => {
      currentSocket.off("connect_error");
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      currentSocket.off("nextSong", handleNextSong);
      currentSocket.off("prevSong", handlePrevSong);
      currentSocket.off("joinedRoom");
      currentSocket.off("userJoinedRoom");
      currentSocket.off("error");
      currentSocket.off("songQueue");
      currentSocket.off("userLeftRoom");
      currentSocket.off("update");
      currentSocket.off("seek");
    };
  }, [
    onConnect,
    onDisconnect,
    play,
    setRoomId,
    router,
    setUser,
    getListeners,
    getQueues,
    seek,
  ]);

  return {
    isConnected,
    transport,
  };
}
