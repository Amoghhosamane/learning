'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Trending courses data (same as dashboard)
const TRENDING_COURSES = [
    {
        title: "Harvard CS50",
        desc: "Change your college degree",
        videoId: "LfaMVlDaQ24",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Algorithms & Computation",
        desc: "MIT OpenCourseWare",
        videoId: "ZA-tUyM_y7s",
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "CS50 Cybersecurity",
        desc: "Harvard University",
        videoId: "9HOpanT0GRs",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    }
];

export default function LatestPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white pb-20">
            {/* HEADER */}
            <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 to-black/0 backdrop-blur-sm transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-4 md:px-12">
                    <Link href="/" className="text-3xl font-bold text-red-600 tracking-tighter hover:scale-105 transition-transform">
                        SkillOrbit
                    </Link>
                    <nav className="hidden md:flex space-x-6 text-sm font-medium">
                        <Link href="/dashboard" className="text-white hover:text-gray-300 transition">Home</Link>
                        <Link href="/courses" className="text-gray-300 hover:text-white transition">Courses</Link>
                        <Link href="/my-courses" className="text-gray-300 hover:text-white transition">My Courses</Link>
                        <Link href="/latest" className="text-gray-300 hover:text-white transition">Latest</Link>
                    </nav>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-6 py-24 mt-20">
                <h1 className="text-3xl font-bold mb-6">Trending Now</h1>
                <div className="flex space-x-4 overflow-x-scroll scrollbar-hide py-4 pr-12 scroll-smooth">
                    {TRENDING_COURSES.map((item, i) => (
                        <Link key={i} href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`}>
                            <motion.div
                                className="flex-none w-64 md:w-80 aspect-video bg-gray-900 rounded-md relative overflow-hidden cursor-pointer border border-gray-800"
                                whileHover={{ scale: 1.05, zIndex: 10, transition: { duration: 0.3 } }}
                            >
                                <img src={item.image} alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2">TOP 10</span>
                                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">{item.title}</h3>
                                    <p className="text-xs text-gray-300 line-clamp-2 drop-shadow-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
