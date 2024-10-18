"use client";

import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const search = useSearchParams();
  useEffect(() => {
    api.get("/api/make").then(() => {
      const roomId = search.get("room");
      window.location.href = roomId ? `/v/?room=${roomId}` : "/v";
    });
  }, [search]);
}

export default Page;
