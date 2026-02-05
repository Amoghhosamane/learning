import LiveClient from "./LiveClient";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import InstructorBadge from '@/components/InstructorBadge';

type Props = { params: { courseId: string } };

export default async function Page({ params }: Props) {
  const { courseId } = await params;
  await dbConnect();

  let course: any = null;
  const isValidId = /^[0-9a-fA-F]{24}$/.test(courseId);

  if (isValidId) {
    try {
      course = await Course.findById(courseId).lean();
    } catch (e) {
      console.warn("Invalid ID or course not found", e);
    }
  }

  // If no course found (or invalid ID), assume it's an Instant Meeting
  // We still allow rendering the LiveClient so people can join by ID
  const title = course?.title || "Instant Meeting";
  const desc = course?.description || "Live Video Session";
  const instructorId = course?.instructor ? String(course.instructor) : undefined;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{title} — Live</h1>
      {instructorId && <InstructorBadge instructorId={instructorId} />}
      <p className="mt-2 text-sm text-gray-600">{desc}</p>

      <div className="mt-6">
        <LiveClient courseId={courseId} instructorId={instructorId} />
      </div>
    </div>
  );
}
