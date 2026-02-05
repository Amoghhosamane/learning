import { NextResponse } from "next/server";
import { getIO } from "@/lib/socket";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { courseId, userId } = body;
    if (!courseId || !userId) return NextResponse.json({ error: 'courseId and userId required' }, { status: 400 });

    // @ts-ignore
    const map: Map<string, any> | undefined = (global as any).__liveClasses;
    if (!map) return NextResponse.json({ error: 'No live sessions' }, { status: 400 });

    const state = map.get(courseId);
    if (!state) return NextResponse.json({ error: 'Live session not found' }, { status: 404 });

    state.attendees.add(userId);

    const io = getIO();
    if (io) io.to(courseId).emit('attendanceUpdate', { courseId, count: state.attendees.size });

    return NextResponse.json({ success: true, count: state.attendees.size });
  } catch (err) {
    console.error('/api/dev/join error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}