import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Link from "next/link";

export default async function CoursesPage() {
  await dbConnect();
  const courses = await Course.find({ published: true });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 w-full z-50 bg-black p-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-red-600 hover:text-red-500">
            SkillOrbit
          </Link>
          <Link
            href="/dashboard"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            My Dashboard
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">All Courses</h1>
        <p className="text-gray-400 mb-10">Browse our complete course catalog</p>

        {courses.length === 0 && (
          <p className="text-gray-400 text-lg">No courses published yet 🚀</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Link key={course._id.toString()} href={`/courses/${course._id.toString()}`}>
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition cursor-pointer">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    by {course.instructor}
                  </p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>⭐ {course.rating || "New"}</span>
                    <span>🏷 {course.category}</span>
                    <span className="text-red-400">₹ {course.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
