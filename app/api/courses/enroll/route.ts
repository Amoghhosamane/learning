import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const { courseId } = await req.json();
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user?.id)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  await User.findByIdAndUpdate((session as any).user.id, {
    $addToSet: { enrolledCourses: courseId },
  });

  return NextResponse.json({ success: true });
}
