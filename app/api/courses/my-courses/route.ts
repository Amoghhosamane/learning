import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions as any);

        if (!(session as any)?.user?.id) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        const user = await User.findById((session as any).user.id).populate("enrolledCourses");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Mock progress data for demo if not in schema
        const coursesWithProgress = user.enrolledCourses.map((course: any) => ({
            ...course.toObject(),
            progress: Math.floor(Math.random() * 100), // Random progress for now
        }));

        return NextResponse.json({ courses: coursesWithProgress });
    } catch (error) {
        console.error("My courses fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
