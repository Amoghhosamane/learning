import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Link from "next/link";
import InstructorBadge from '@/components/InstructorBadge';

interface CourseDetailsPageProps {
  params: { id: string };
}

export default async function CourseDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();

  let courseDoc;

  try {
    courseDoc = await Course.findById(params.id);
  } catch (e) {
    courseDoc = null;
  }

  if (!courseDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Link href="/courses" className="text-gray-400 hover:text-white mb-6 block">
          ← Back to Courses
        </Link>
        <h1 className="text-3xl font-bold mb-3">Course not found</h1>
        <p className="text-gray-400">
          The course you are looking for does not exist or was removed.
        </p>
      </div>
    );
  }

  const course = JSON.parse(JSON.stringify(courseDoc));
  const firstLesson = course.lessons?.[0];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Link href="/courses" className="text-gray-400 hover:text-white mb-6 block">
        ← Back to Courses
      </Link>

      <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
      <InstructorBadge instructorId={String(course.instructor)} />
      <p className="text-gray-400 mb-6">{course.description}</p>

      {firstLesson ? (
        <iframe
          src={firstLesson.videoUrl}
          title={firstLesson.title}
          width="100%"
          height="420"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="rounded-xl border border-gray-700 mb-10"
        ></iframe>
      ) : (
        <p className="text-gray-500 mb-10">No lessons yet</p>
      )}

      <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
      <div className="space-y-3">
        {course.lessons?.map((lesson: any, index: number) => (
          <div
            key={lesson._id ?? index}
            className="bg-gray-900 p-4 rounded-xl border border-gray-800"
          >
            <h3 className="font-medium text-white">
              {index + 1}. {lesson.title}
            </h3>
            <p className="text-sm text-gray-400">Duration: {lesson.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
