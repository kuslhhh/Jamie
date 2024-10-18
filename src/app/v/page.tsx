import Home from "@/components/common/Home";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModels";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const roomId = searchParams?.room;
  const SSID = cookies().get("SSID")?.value;

  if (!SSID) return redirect(roomId ? `/?room=${roomId}` : "/");
  await dbConnect();
  const user = await User.findById(SSID);
  if (!user) return redirect(roomId ? `/?room=${roomId}` : "/");

  return <Home />;
}
