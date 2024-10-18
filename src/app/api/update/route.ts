import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("SSID")?.value;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const { username } = await req.json();
    await dbConnect();
    const user = await User.findByIdAndUpdate(userId, { username });
    if (!user) throw new Error("User not found");
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating" }, { status: 500 });
  }
}