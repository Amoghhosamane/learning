"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trophy, Play, Info, Share2, CornerUpRight } from "lucide-react";

interface VideoPlayerProps {
    videoId: string;
    title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const isCompleted = localStorage.getItem(`video_completed_${videoId}`);
        if (isCompleted) {
            setCompleted(true);
        }
    }, [videoId]);

    const handleComplete = () => {
        setCompleted(true);
        localStorage.setItem(`video_completed_${videoId}`, "true");
    };

    return (
        <div className="w-full space-y-12">
            {/* Cinematic Video Container */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)]">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="opacity-90 hover:opacity-100 transition-opacity duration-500"
                    ></iframe>
                </div>
            </div>

            {/* Premium Meta Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Play size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-0.5 bg-red-600 text-[8px] font-black tracking-widest uppercase rounded">HQ STREAM</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Digital Artifact 0{videoId.length}</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">{title}</h2>
                        <p className="text-gray-400 text-sm font-medium italic leading-relaxed max-w-xl">
                            Advance your knowledge base by fully absorbing the data presented in this transmission. Master the concepts to sync your orbit.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <Info size={14} /> MODULE SPECS
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <Share2 size={14} /> SHARE DATA
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        {completed ? (
                            <motion.div
                                key="completed"
                                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                    <Trophy className="text-green-500" size={32} />
                                </div>
                                <h4 className="text-lg font-black tracking-tighter uppercase mb-2 italic">PROTOCOL SYNCED</h4>
                                <p className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest mb-6">Badge Authenticated</p>
                                <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    EARNED 50 XP
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="incomplete"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center w-full"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                                    <CheckCircle className="text-gray-700" size={32} />
                                </div>
                                <h4 className="text-sm font-black tracking-widest uppercase mb-2">Sync Status</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Pending Completion</p>
                                <button
                                    onClick={handleComplete}
                                    className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/40 flex items-center justify-center gap-2"
                                >
                                    MARK AS MASTERED <CornerUpRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
