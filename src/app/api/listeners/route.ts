import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RoomUser from "@/models/RoomUser";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const roomId = searchParams.get('roomId');
        const page = searchParams.get('page') || "1";
        const limit = searchParams.get('limit') || "10";
        const userId = request.cookies.get("SSID")?.value;
        if (!userId) {
            return NextResponse.json(
                { message: "roomId is required" },
                { status: 400 }
            );
        }

        //Connect to DB

        await dbConnect();

        //convert page and limit to number

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        //find the total number of documents for pagination metadata
        const totalUsers = await RoomUser.countDocuments({ roomId, active: true });

        //fetch the users based on the roomId, active status, and pagination
        const roomUsers = await RoomUser.find({
            roomId,
            active: true,
            userId: { $ne: userId },
        })
            .select("userId")
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate({
                path: "userId",
                select: "username imageUrl"
            });

            //return the paginated response with metadata
            return NextResponse.json(
                {
                    totalUsers,
                    currentPahe: pageNumber,
                    roomUsers
                },
                {status: 200}
            );
    } catch (err){
        return NextResponse.json({message: "no listeners"}, {status: 500});
    }
}