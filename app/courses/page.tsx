import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  await dbConnect();
  const courses = await Course.find({ published: true });

  const CATEGORIES = [
    "Full-Stack Development",
    "Data Science & AI",
    "Cyber Security",
    "Cloud & DevOps",
    "Digital Marketing",
    "Mobile App Development",
    "UI/UX & Design"
  ];

  return (
    <div className="min-h-screen bg-black text-white">


      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Categories</h2>
          <div className="space-y-2">
            <div className="p-2 bg-red-600/10 text-red-500 rounded border border-red-600/20 font-medium cursor-pointer">
              All Courses
            </div>
            {CATEGORIES.map((cat) => (
              <div key={cat} className="p-2 text-gray-400 hover:bg-gray-900 hover:text-white rounded cursor-pointer transition">
                {cat}
              </div>
            ))}
          </div>
        </aside>

        {/* Course Grid */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-gray-400 mb-10">Browse our complete course catalog</p>

          {courses.length === 0 && (
            <p className="text-gray-400 text-lg">No courses published yet 🚀</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link key={course._id.toString()} href={`/courses/${course._id.toString()}`}>
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition cursor-pointer h-full flex flex-col">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1">
                      by {course.instructor}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-400 mt-auto">
                      <span className="flex items-center">⭐ {course.rating || "New"}</span>
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs">{course.category || "General"}</span>
                    </div>
                    <div className="mt-4 text-red-400 font-bold text-lg">₹ {course.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
