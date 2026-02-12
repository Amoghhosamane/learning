'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Play, ChevronRight, Zap } from 'lucide-react';

// Trending courses data (consistent with dashboard)
const TRENDING_COURSES = [
    {
        title: "Harvard CS50",
        desc: "Change your college degree",
        videoId: "LfaMVlDaQ24",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Algorithms & Computation",
        desc: "MIT OpenCourseWare",
        videoId: "ZA-tUyM_y7s",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop"
    },
    {
        title: "CS50 Cybersecurity",
        desc: "Harvard University",
        videoId: "9HOpanT0GRs",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Web Development 2024",
        desc: "Modern Frontend Stack",
        videoId: "3jWRrafhO7M",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
    }
];

export default function LatestPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <span className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase mb-4 block">Recently Added</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                        TRENDING <span className="text-red-600 underline decoration-red-600/20 underline-offset-[12px]">NOW</span>
                    </h1>
                    <p className="text-gray-500 font-medium italic max-w-lg text-lg">
                        Top videos and lessons being taken by students right now.
                    </p>
                </motion.div>

                {/* Trending Grid / Scroll */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-red-600" />
                            <span className="text-[10px] font-black tracking-widest uppercase">Popular Lessons</span>
                        </div>
                        <div className="h-px flex-1 bg-white/5 mx-6" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{TRENDING_COURSES.length} ITEMS</span>
                    </div>

                    <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x">
                        {TRENDING_COURSES.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-none w-[350px] md:w-[500px] snap-start group"
                            >
                                <Link href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`}>
                                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-red-600/50 transition-all duration-700 shadow-2xl">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                        <div className="absolute top-6 left-6 flex items-center gap-2">
                                            <span className="px-3 py-1 bg-red-600 text-[9px] font-black uppercase tracking-widest rounded-full">TOP COURSE</span>
                                            <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5">
                                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-[9px] font-black tracking-widest">4.9</span>
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                                <Play size={24} className="text-white fill-white ml-1" />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-8 left-10 right-10 z-20">
                                            <h3 className="text-2xl font-black tracking-tighter italic uppercase text-white mb-2 group-hover:text-red-500 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic group-hover:text-gray-200 transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Secondary Section Idea */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 p-16 bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[100px] rounded-full" />
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[9px] font-black tracking-[0.3em] text-red-600 uppercase mb-3 block">Selection Criteria</span>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-6">WHY THESE <span className="text-red-600">COURSES?</span></h2>
                            <p className="text-gray-500 font-medium italic leading-relaxed mb-8">
                                These videos represent the highest learning activity in the last 24 hours. Each course is highly rated by our student community.
                            </p>
                            <button className="flex items-center gap-3 text-[10px] font-black tracking-widest uppercase hover:text-red-500 transition-colors group">
                                LEARN ABOUT OUR SELECTION <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors" />
                            ))}
                        </div>
                    </div>
                </motion.div>Main Content
            </main>
        </div>
    );
}
