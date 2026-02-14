import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import Course from "@/lib/models/Course";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { meetingId, courseId } = await req.json();

        if (!meetingId || !courseId) {
            return NextResponse.json(
                { success: false, error: "Meeting ID is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify Meeting ID matches the Course ID
        // We allow case-insensitive match for user convenience
        if (meetingId.trim().toLowerCase() !== courseId.toLowerCase()) {
            return NextResponse.json(
                { success: false, error: "Invalid Meeting ID for this session" },
                { status: 400 }
            );
        }


        let course = null;
        const isValidId = /^[0-9a-fA-F]{24}$/.test(courseId);

        if (isValidId) {
            try {
                course = await Course.findById(courseId);
            } catch (e) {
                // ignore
            }
        }

        // If not found in DB, check memory (instant meeting)
        if (!course) {
            const map: Map<string, any> | undefined = (global as any).__liveClasses;
            if (!map || !map.has(courseId)) {
                return NextResponse.json(
                    { success: false, error: "Meeting not found" },
                    { status: 404 }
                );
            }
            // It is an instant meeting
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Optional: Check enrollment (uncomment if you want to enforce enrollment)
        // const isEnrolled = user.enrolledCourses.some(
        //   (id: any) => id.toString() === courseId
        // );
        // if (!isEnrolled && user.role !== "admin") {
        //   return NextResponse.json(
        //     { success: false, error: "You are not enrolled in this course" },
        //     { status: 403 }
        //   );
        // }

        // Create response
        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                memberId: user.memberId,
            },
        });

        // Set a cookie to grant access to this specific course
        response.cookies.set(`access-live-${courseId}`, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        console.error("Meeting ID validation error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
