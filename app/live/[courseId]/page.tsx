import LiveClient from "./LiveClient";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = { params: { courseId: string } };

export default async function Page({ params }: Props) {
  const { courseId } = await params;
  await dbConnect();

  let course: any = null;
  const isValidId = /^[0-9a-fA-F]{24}$/.test(courseId);
  // Check database for course
  if (isValidId) {
    try {
      course = await Course.findById(courseId).lean();
    } catch (e) {
      console.warn("Invalid ID or course not found", e);
    }
  }

  // Fallback: Check global in-memory state (for instant meetings)
  let liveSession = null;
  try {
    const map: Map<string, any> | undefined = (global as any).__liveClasses;
    if (map && map.has(courseId)) {
      liveSession = map.get(courseId);
    }
  } catch (e) {
    // ignore
  }

  const title = course?.title || liveSession?.title || "Operational Meeting";
  const instructorId = course?.instructor ? String(course.instructor) : liveSession?.instructorId;

  // Access Control Check
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const hasAccessCookie = cookieStore.get(`access-live-${courseId}`);
  const isInstructor = session?.user?.id === instructorId;
  const isAdmin = (session?.user as any)?.role === 'admin';
  const isPublic = liveSession?.visibility === 'public';

  if (!isInstructor && !isAdmin && !hasAccessCookie && !isPublic) {
    redirect(`/live/${courseId}/join`);
  }

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      <LiveClient courseId={courseId} instructorId={instructorId} initialTitle={title} />
    </div>
  );
}
