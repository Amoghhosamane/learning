"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface VideoPlayerProps {
    videoId: string;
    title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        // Check if already completed
        const isCompleted = localStorage.getItem(`video_completed_${videoId}`);
        if (isCompleted) {
            setCompleted(true);
        }
    }, [videoId]);

    const handleComplete = () => {
        setCompleted(true);
        localStorage.setItem(`video_completed_${videoId}`, "true");
        // visual feedback (badge animation) handled by UI state
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl mb-8">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-gray-400">Watch the full video to complete this lesson.</p>
                </div>

                <div className="mt-4 md:mt-0">
                    {completed ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-green-500/10 border border-green-500 text-green-500 px-6 py-3 rounded-full flex items-center space-x-2 font-semibold"
                        >
                            <span>🏅</span>
                            <span>Badge Earned: Completed</span>
                        </motion.div>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20"
                        >
                            Mark as Completed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
