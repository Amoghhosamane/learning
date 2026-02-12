"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Clock, PlayCircle, Trophy, Zap } from "lucide-react";

const LEARNING_UPDATES = [
  { title: "HTML, CSS, JS", desc: "Digital Architecture Fundamentals", videoId: "nu_pCVPKzTk" },
  { title: "React JS", desc: "Interactive Component mastery", videoId: "CgkZ7MvWUAA" },
  { title: "Next.js", desc: "Server-side excellence", videoId: "843nec-IvW0" },
];

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<Record<string, boolean>>({});

  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 pb-20 overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-6 pt-32">

        {/* Header Area */}
        <div className="mb-16">
          <span className="text-[10px] font-black tracking-[0.3em] text-red-600 uppercase mb-3 block">Member Space</span>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
            MY <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">LEARNING</span> ORBIT
          </h1>
          <p className="text-gray-500 font-medium italic max-w-lg">Tracking your progress through the atmosphere of technology.</p>
        </div>

        {/* Current Learning Updates (Video Paths) */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-red-600" />
              <h2 className="text-sm font-black tracking-widest uppercase">RAPID PATHS</h2>
            </div>
            <span className="text-[9px] font-black bg-white text-black px-2 py-1 rounded">VOD CONTENT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEARNING_UPDATES.map((item, i) => (
              <Link key={i} href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden group-hover:border-red-600/50 transition-all duration-500 shadow-2xl"
                >
                  <div className="h-40 bg-gradient-to-br from-red-600/10 to-[#0a0a0a] p-8 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <PlayCircle size={100} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight relative z-10">{item.title}</h3>
                  </div>

                  <div className="p-8">
                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic mb-6 h-10 group-hover:text-gray-300 transition-colors">
                      {item.desc}
                    </p>
                    <div className="flex justify-between items-center bg-black/40 rounded-2xl p-4 border border-white/5">
                      {completedVideos[item.videoId] ? (
                        <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle size={14} /> COMPLETED
                        </div>
                      ) : (
                        <div className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                          CONTINUE <Zap size={10} fill="currentColor" />
                        </div>
                      )}
                      <Trophy size={16} className={completedVideos[item.videoId] ? "text-red-600" : "text-gray-800"} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Database Enrolled Courses */}
        <section>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <BookOpen size={20} className="text-red-600" />
            <h2 className="text-sm font-black tracking-widest uppercase">ENROLLED CERTIFICATIONS</h2>
          </div>

          {courses.length === 0 ? (
            <div className="p-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
              <Trophy size={48} className="mx-auto text-gray-800 mb-6" />
              <h3 className="text-lg font-black tracking-tight mb-2 uppercase">No Enrolled Paths</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto italic font-medium">Head over to the Catalog to start your official certification journey.</p>
              <Link href="/courses" className="inline-block mt-8 bg-white text-black text-xs font-black px-8 py-3 rounded-full hover:scale-110 active:scale-95 transition-all">
                BROWSE ALL PATHS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden group hover:border-red-600/30 cursor-pointer transition-all duration-500 shadow-2xl"
                  onClick={() => router.push(`/courses/${course._id}`)}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <span className="bg-red-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">OFFICIAL PATH</span>
                    </div>
                  </div>

                  <div className="p-10 pt-0">
                    <h3 className="text-xl font-black tracking-tight mb-6 group-hover:text-red-500 transition-colors">
                      {course.title}
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Atmosphere Sync</span>
                        <span className="text-sm font-black italic">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-red-600 h-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        />
                      </div>
                    </div>

                    <button className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all transform active:scale-95">
                      CONTINUE ASCENDING
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
