import LiveClient from "./LiveClient";
import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";

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

  const title = course?.title || "Operational Meeting";
  const instructorId = course?.instructor ? String(course.instructor) : undefined;

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      <LiveClient courseId={courseId} instructorId={instructorId} initialTitle={title} />
    </div>
  );
}
