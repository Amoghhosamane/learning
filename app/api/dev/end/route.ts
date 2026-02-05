import { NextResponse } from "next/server";
import { endLive, getLiveState } from "@/lib/socket";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { courseId } = body;
    if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 });

    const state = getLiveState(courseId);
    if (!state) return NextResponse.json({ error: 'No active live session' }, { status: 404 });

    await endLive(courseId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('/api/dev/end error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}