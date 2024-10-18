"use client";
import { listener, searchResults, TUser } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface UserContextType {
  queue: searchResults[];
  setQueue: React.Dispatch<SetStateAction<searchResults[]>>;
  roomId: string | null;
  setRoomId: React.Dispatch<SetStateAction<string | null>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<SetStateAction<boolean>>;
  user: TUser | null;
  setUser: React.Dispatch<SetStateAction<TUser | null>>;
  setListener: React.Dispatch<SetStateAction<listener | null>>;
  listener: listener | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const search = useSearchParams();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [queue, setQueue] = React.useState<searchResults[]>([]);
  const [user, setUser] = React.useState<TUser | null>(null);
  const [listener, setListener] = React.useState<listener | null>(null);
  const [roomId, setRoomId] = React.useState<string | null>(
    () => search.get("room") || null
  );

  return (
    <UserContext.Provider
      value={{
        queue,
        setQueue,
        roomId,
        setRoomId,
        setIsConnected,
        isConnected,
        user,
        setUser,
        listener,
        setListener,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContext };
