import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Course from '@/lib/models/Course';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.id) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    await dbConnect();
    const courses = await Course.find({ instructor: (session as any).user.id }).select('title').lean();
    return NextResponse.json({ success: true, courses });
  } catch (err) {
    console.error('/api/profile/instructor error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}