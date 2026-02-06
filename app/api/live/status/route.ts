import { NextResponse } from "next/server";
import { getLiveState } from "@/lib/socket";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";

export async function GET() {
  try {
    // We will attempt to build an array of live sessions
    // getLiveState isn't iterable, so we need to access the global map
    // ensure we still import Course for title lookup

    // Access global live map if exists
    // @ts-ignore
    const map = (global as any).__liveClasses as Map<string, any> | undefined;
    if (!map) return NextResponse.json({ sessions: [] });

    const sessions: any[] = [];
    await dbConnect();
    for (const [courseId, state] of map.entries()) {
      let title: string | null = null;
      try {
        const course = await Course.findById(courseId).lean() as any;
        title = course?.title || null;
      } catch (err) {
        title = null;
      }

      sessions.push({
        courseId,
        title,
        instructorId: state.instructorId,
        attendees: Array.from(state.attendees || []),
        count: (state.attendees && state.attendees.size) || 0,
        startTime: state.startTime,
      });
    }

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("/api/live/status error", err);
    return NextResponse.json({ sessions: [] }, { status: 500 });
  }
}
