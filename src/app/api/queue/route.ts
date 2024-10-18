import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/queueModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const search = req.nextUrl.searchParams;
        const roomId = search.get("roomId");
        if(!roomId) {
            throw new Error("No roomId provided");
        }

        await dbConnect();
        const data = await Queue.find({roomId}).sort({createAt: -1, });
        return NextResponse.json(data, {status: 200});
    } catch(error: any) {
        return NextResponse.json({ message: "no songs in queue"})
    }
}