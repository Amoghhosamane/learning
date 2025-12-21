"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    async function fetchMyCourses() {
      const res = await fetch("/api/courses/my-courses");
      const data = await res.json();
      setCourses(data.courses || []);
      setLoading(false);
    }

    fetchMyCourses();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-red-600">
            SkillOrbit
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">My Learning</h1>

        {courses.length === 0 && (
          <p className="text-gray-400">You haven't enrolled in any courses yet.</p>
        )}

        <div className="flex overflow-x-auto gap-6 pb-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 rounded-xl border border-gray-800 min-w-[280px] overflow-hidden hover:border-red-600 transition cursor-pointer"
              onClick={() => router.push(`/courses/${course._id}`)}
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {course.progress}% completed
                </p>

                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                <button className="w-full bg-red-600 py-2 rounded-md text-sm hover:bg-red-700">
                  Continue Learning →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
