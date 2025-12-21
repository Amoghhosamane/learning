import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";

// GET all published courses
export async function GET() {
  await dbConnect();
  const courses = await Course.find({ published: true }).sort({ createdAt: -1 });
  return NextResponse.json(courses);
}

// POST - Admin create course
export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const course = await Course.create(data);
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
