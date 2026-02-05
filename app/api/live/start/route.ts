import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { initSocket, getIO, startLive } from "@/lib/socket";

export async function POST(req: Request) {
  const body = await req.json();
  const { courseId: providedId, type } = body;

  const session = await getServerSession(authOptions as any);
  if (!(session as any)?.user?.id)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  await dbConnect();

  let courseId = providedId;

  // HANDLE INSTANT MEETING
  if (type === 'instant' || !providedId) {
    // Generate a random 9-digit string (xxx-xxx-xxx format or just 9 chars)
    // Simple 9 char alphanumeric
    courseId = Math.random().toString(36).substring(2, 11);
  } else {
    // HANDLE COURSE MEETING
    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Ensure only the instructor can start
    if (String(course.instructor) !== (session as any).user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Initialize socket (best-effort)
  try {
    initSocket();
  } catch (err) {
    console.warn("Socket init warning:", err);
  }

  const state = startLive(courseId, (session as any).user.id);
  const io = getIO();
  if (io) io.to(courseId).emit("classStarted", { courseId });

  return NextResponse.json({ success: true, courseId, startedAt: state?.startTime });
}
