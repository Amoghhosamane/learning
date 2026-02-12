"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Zap, Copy, Terminal, Radio, StopCircle, Play, ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function InstructorLivePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/live/status");
      const data = await res.json();
      const my = data.sessions?.filter((s: any) => s.instructorId === session?.user?.id) || [];
      setSessions(my);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await fetch('/api/profile/instructor');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (e) {
      console.error("Failed to fetch courses", e);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchMyCourses();
    const t = setInterval(fetchSessions, 5000);
    return () => clearInterval(t);
  }, [session]);

  const startById = async (idToStart?: string) => {
    const targetId = idToStart || courseId;
    setError("");
    // If starting an instant meeting (no ID), the API handles it.
    // If starting a course meeting, an ID is required.

    setLoading(true);
    try {
      const res = await fetch('/api/live/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: targetId, type: !targetId ? 'instant' : undefined })
      });
      const json = await res.json();
      if (!res.ok) setError(json.error || 'Failed to initialize transmission');
      else {
        setCourseId('');
        router.push(`/live/${json.courseId}`);
      }
    } catch (err) {
      setError('Connection failure');
    } finally { setLoading(false); }
  };

  const endSession = async (id: string) => {
    try {
      const res = await fetch('/api/live/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: id })
      });
      if (!res.ok) alert('Failed to terminate session');
      else await fetchSessions();
    } catch (e) {
      alert('Error during termination process');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-500 hover:text-white mb-8 uppercase transition-all group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Dashboard
          </Link>
          <span className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase mb-4 block italic">Session Control</span>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            INSTRUCTOR <span className="text-red-600 underline decoration-red-600/20 underline-offset-[12px]">DASHBOARD</span>
          </h1>
          <p className="text-gray-500 font-medium italic max-w-xl text-lg">
            Share your knowledge with your students. Start a live session for any of your courses.
          </p>
        </motion.div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Wing (Controller) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Radio size={14} className="text-red-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest uppercase italic">Your Courses</span>
              </div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{courses.length} AVAILABLE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 hover:border-red-600/30 transition-all group overflow-hidden relative shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={80} />
                  </div>

                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 block italic">Ready</span>
                    <h3 className="text-xl font-black tracking-tight mb-4 uppercase italic leading-none">{course.title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mb-8">
                      <Terminal size={12} />
                      <span className="text-[9px] font-mono uppercase tracking-widest py-1 px-2 bg-white/5 rounded-md drop-shadow-md">ID: {course._id}</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startById(course._id)}
                        disabled={loading}
                        className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Play size={12} fill="currentColor" /> START
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {courses.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-gray-500 font-bold italic uppercase tracking-widest text-[10px]">No specific orbital targets detected</p>
                </div>
              )}
            </div>

            {/* Instant Meeting Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-10 bg-gradient-to-r from-red-600/10 via-transparent to-transparent border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={18} className="text-red-600" />
                  <h4 className="text-xl font-black tracking-tight italic uppercase leading-none">QUICK MEETING</h4>
                </div>
                <p className="text-[11px] font-medium text-gray-500 italic max-w-sm">Start an immediate live session without a specific course.</p>
              </div>
              <button
                onClick={() => startById()}
                disabled={loading}
                className="px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
              >
                START MEETING
              </button>
            </motion.div>

            {/* Manual Entry */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-12 border-t border-white/5"
            >
              <details className="group">
                <summary className="text-[10px] font-black text-gray-600 cursor-pointer hover:text-red-500 transition-colors uppercase tracking-[0.3em] list-none flex items-center gap-3">
                  <span className="w-1 h-3 bg-red-600 rounded-full" /> Manual ID Entry (Advanced)
                </summary>
                <div className="mt-8 bg-white/5 p-8 rounded-[2rem] border border-white/10 max-w-md">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Direct ID Entry</p>
                  <div className="flex gap-3">
                    <input
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      placeholder="COURSE_ID"
                      className="flex-1 px-6 py-4 bg-black border border-white/10 rounded-xl text-sm font-mono placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-all"
                    />
                    <button
                      onClick={() => startById(courseId)}
                      disabled={loading}
                      className="px-6 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                    >
                      START
                    </button>
                  </div>
                </div>
              </details>
            </motion.div>
          </div>

          {/* Active Sessions (Right) */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-3xl relative overflow-hidden h-full min-h-[500px]">
              <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/10 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <Radio size={16} className="text-red-600" />
                  <h2 className="text-xl font-black tracking-widest uppercase italic leading-none">ACTIVE SESSIONS</h2>
                </div>

                <AnimatePresence mode="popLayout">
                  {sessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/10">
                        <Radio size={24} className="text-gray-700" />
                      </div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">All systems ready</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((s) => (
                        <motion.div
                          key={s.courseId}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-black/40 border border-white/10 p-6 rounded-3xl group hover:border-red-600/30 transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 italic animate-pulse">LIVE NOW</p>
                              <h4 className="text-base font-black tracking-tight uppercase leading-none">{s.title || 'Untitled Session'}</h4>
                            </div>
                            <Link href={`/live/${s.courseId}`} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white text-black transition-all">
                              <Play size={14} fill="currentColor" />
                            </Link>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">
                              {s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ESTABLISHED'}
                            </span>
                            <button
                              onClick={() => endSession(s.courseId)}
                              className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                            >
                              <StopCircle size={12} /> END SESSION
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black p-4 rounded-2xl text-center uppercase tracking-widest italic"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              <span className="text-[10px] font-black tracking-widest text-white uppercase italic">Status: Active</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-gray-500" />
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Secure Portal V2.4</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">
            SkillOrbit Instructor Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}
