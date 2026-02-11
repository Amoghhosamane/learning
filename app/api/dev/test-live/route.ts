import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import Course from "@/lib/models/Course";
import { startLive, initSocket, getIO } from "@/lib/socket";

export async function POST(req: Request) {
  // Dev-only safety
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    await dbConnect();

    // create or find a test instructor user
    const email = 'test-instructor@dev.local';
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: 'Test Instructor', email, password: 'password', role: 'admin' });
    }

    // create a test course
    const course = await Course.create({
      title: 'Test Live Course',
      description: 'A demo course for live session testing',
      instructor: user._id.toString(),
      price: 0,
      duration: '1h',
      category: 'Demo',
      image: '/images/placeholder.png',
      published: true,
    });

    // init socket if needed


    // start live session
    const state = startLive(course._id.toString(), user._id.toString());
    const io = getIO();
    if (io) io.to(course._id.toString()).emit('classStarted', { courseId: course._id.toString() });

    return NextResponse.json({ success: true, courseId: course._id.toString(), instructorId: user._id.toString(), startedAt: state?.startTime });
  } catch (err) {
    console.error('/api/dev/test-live error', err);
    return NextResponse.json({ error: 'Failed to create test live' }, { status: 500 });
  }
}