"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const LEARNING_UPDATES = [
  { title: "HTML, CSS, JS", desc: "The building blocks of the web", videoId: "nu_pCVPKzTk" },
  { title: "React JS", desc: "Modern frontend library", videoId: "CgkZ7MvWUAA" },
  { title: "Next.js", desc: "The React Framework", videoId: "843nec-IvW0" },
];

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check local storage for video completion
    const checks: Record<string, boolean> = {};
    LEARNING_UPDATES.forEach(item => {
      if (item.videoId) {
        checks[item.videoId] = localStorage.getItem(`video_completed_${item.videoId}`) === 'true';
      }
    });
    setCompletedVideos(checks);

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

        {/* Current Learning Updates (Video Paths) */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            Current Learning Updates <span className="text-sm bg-red-600 text-white px-2 py-0.5 rounded-full">New</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_UPDATES.map((item, i) => (
              <Link key={i} href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-red-600 transition cursor-pointer group relative">
                  {/* Thumbnail Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-black p-6 flex flex-col justify-end relative">
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10`} />
                    <h3 className="text-xl font-bold text-white relative z-20 group-hover:scale-105 transition-transform">{item.title}</h3>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-400 text-sm mb-4 h-10">{item.desc}</p>
                    <div className="flex justify-between items-center">
                      {completedVideos[item.videoId] ? (
                        <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="text-red-500 text-sm font-bold group-hover:underline">
                          Start Learning →
                        </span>
                      )}
                      <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">Video</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>

        {courses.length === 0 && (
          <p className="text-gray-400">You haven't enrolled in any database courses yet.</p>
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
