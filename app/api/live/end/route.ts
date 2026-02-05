import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import { getIO, endLive, getLiveState } from "@/lib/socket";

export async function POST(req: Request) {
  const body = await req.json();
  const { courseId } = body;

  const session = await getServerSession(authOptions as any);
  if (!(session as any)?.user?.id)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  await dbConnect();
  await dbConnect();

  // Only check Course DB if it looks like a valid ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(courseId)) {
    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    if (String(course.instructor) !== (session as any).user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } else {
    // For instant meetings, we rely on the in-memory state instruction check 
    // OR we just assume if they have the ID and are ending it, they are managing it.
    // Ideally we should check if they were the creator (instructorId in state).
    const liveState = getLiveState(courseId);
    if (liveState && liveState.instructorId !== (session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  const liveState = getLiveState(courseId);
  if (!liveState) return NextResponse.json({ error: "No active live session" }, { status: 400 });

  await endLive(courseId);

  return NextResponse.json({ success: true });
}
