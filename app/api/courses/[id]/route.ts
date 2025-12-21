import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const course = await Course.findById(params.id);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // later we can compute "enrolled" from user, for now false
  return NextResponse.json({ course, enrolled: false });
}
