"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Play, Info, Clock, Users, Video,
  ChevronRight, Star, ArrowRight, ShieldCheck,
  LayoutDashboard, Library, MonitorPlay, Zap
} from "lucide-react";

// --- DATA ---
const TRENDING_COURSES = [
  { title: "Harvard CS50", desc: "Computer Science Essentials", videoId: "LfaMVlDaQ24", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop", rating: 4.9 },
  { title: "MIT Algorithms", desc: "Master Complex Computation", videoId: "ZA-tUyM_y7s", image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=300&auto=format&fit=crop", rating: 4.8 },
  { title: "Cybersecurity 101", desc: "Protect Digital Assets", videoId: "9HOpanT0GRs", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300&auto=format&fit=crop", rating: 4.7 }
];

const LEARNING_PATHS = [
  {
    title: "Development Masterclass",
    items: [
      { title: "Next.js 14", desc: "Full-Stack React", videoId: "843nec-IvW0" },
      { title: "TypeScript Mastery", desc: "Safe Code Patterns", videoId: "nu_pCVPKzTk" },
      { title: "Prisma & SQL", desc: "Modern Databases", videoId: "_7UQPve99r4" }
    ]
  },
  {
    title: "AI & Data Science",
    items: [
      { title: "Python for AI", desc: "Core Fundamentals", videoId: "K5KVEU3aaeQ" },
      { title: "Linear Algebra", desc: "Math for ML", videoId: "PeMlggyqz0Y" },
      { title: "TensorFlow", desc: "Deep Learning Intro", videoId: "V_xro1bcAuA" }
    ]
  }
];

// --- COMPONENTS ---

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 pb-20 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] w-full flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
            alt="Hero Background"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-20 max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-red-600 text-[10px] font-black tracking-widest uppercase rounded">ORIGINAL</span>
              <span className="text-sm font-bold text-gray-400">SERIES / FULL-STACK</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-tight drop-shadow-2xl">
              CODE<span className="text-red-600">HORIZON</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg drop-shadow-md">
              The definitive journey for modern developers. Master the artifacts of the web and build the next generation of digital experiences.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/latest" className="px-8 py-3 bg-white text-black font-black rounded-full flex items-center gap-2 hover:bg-white/90 transition transform hover:scale-105 active:scale-95">
                <Play size={20} fill="black" /> START NOW
              </Link>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white font-black rounded-full flex items-center gap-2 hover:bg-white/20 transition">
                <Info size={20} /> MORE INFO
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUICK ACTIONS BAR --- */}
      <section className="relative z-30 -mt-16 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Link href="/live" className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:bg-red-600 transition-all duration-500 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Video className="text-red-600 group-hover:text-white" size={24} />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-gray-400 group-hover:text-white">Live Classes</span>
          </Link>

          <Link href="/courses" className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Library className="text-white" size={24} />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-gray-400 group-hover:text-white">Path Library</span>
          </Link>

          <Link href="/live/instructor" className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Zap className="text-yellow-500" size={24} />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-gray-400 group-hover:text-white">Host Class</span>
          </Link>

          <div className="md:col-span-2 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-xl font-black italic">
                {session?.user?.name?.[0] || "?"}
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight">{session?.user?.name || "Member"}</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Premium Learner</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-red-600 tracking-tighter italic">126 XP</span>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Orbit Rank #34</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT ROWS --- */}
      <section className="pt-24 space-y-16">

        {/* ROW: TRENDING */}
        <div className="container mx-auto px-6 lg:px-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter">TRENDING <span className="text-red-600">NOW</span></h2>
            <Link href="/latest" className="text-xs font-bold text-gray-500 tracking-widest hover:text-white transition flex items-center gap-2">
              VIEW ALL <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRENDING_COURSES.map((course, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-64 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all cursor-pointer"
                onClick={() => router.push(`/video/${course.videoId}?title=${course.title}`)}
              >
                <img src={course.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={course.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="absolute inset-x-6 bottom-6 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={12} className="text-red-600 fill-red-600" />
                    <span className="text-[10px] font-black text-white">{course.rating}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-none mb-1">{course.title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.desc}</p>
                </div>
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Play size={16} fill="white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROW: LEARNING PATHS */}
        {LEARNING_PATHS.map((path, i) => (
          <div key={i} className="container mx-auto px-6 lg:px-12 space-y-8">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">{path.title}</h2>

            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
              {path.items.map((item, j) => (
                <motion.div
                  key={j}
                  whileHover={{ scale: 1.05 }}
                  className="flex-none w-72 md:w-96 snap-start group cursor-pointer"
                  onClick={() => router.push(`/video/${item.videoId}?title=${item.title}`)}
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/5 mb-4 group-hover:border-red-600/50 transition-colors shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={40} className="text-white fill-white" />
                    </div>
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/40 group-hover:text-red-500 transition-colors">
                      VOL.{j + 1} / MOD.0{j + 1}
                    </div>
                  </div>
                  <h4 className="text-base font-black tracking-tight group-hover:text-red-500 transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium italic">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* --- PREMIUM CALL TO ACTION --- */}
      <section className="container mx-auto px-6 lg:px-12 pt-24 pb-12 text-center">
        <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-red-600/10 to-transparent border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full" />
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-6 uppercase">Upgrade to <span className="text-red-600">Elite</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-sm font-medium leading-relaxed">
            Unlock the full potential of SkillOrbit. Get exclusive access to the instructor workspace, dedicated mentorship, and verified certifications.
          </p>
          <button className="px-10 py-4 bg-red-600 text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(220,38,38,0.3)] group-hover:shadow-red-600/50">
            EXPLORE ELITE PLAN
          </button>
        </div>
      </section>

    </div>
  );
}
