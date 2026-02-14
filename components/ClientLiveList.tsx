"use client";

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Radio, Users, Clock, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

type LiveSession = {
    courseId: string;
    title?: string | null;
    instructorId?: string;
    instructorName?: string | null;
    count?: number;
    startTime?: string | Date;
    visibility?: string;
};

export default function LiveListPage() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/live/status');
                const data = await res.json();
                // Only public sessions
                const publicSessions = (data.sessions || []).filter((s: any) => !s.visibility || s.visibility === 'public');
                setSessions(publicSessions);
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();

        // Socket listeners for real-time updates
        const initSocket = async () => {
            await fetch('/api/socket');
            const socket = io({ path: '/api/socket', reconnection: true });

            socket.on('classStarted', () => {
                fetchSessions();
            });

            socket.on('classEnded', () => {
                fetchSessions();
            });

            socket.on('attendanceUpdate', ({ courseId, count }) => {
                setSessions(prev => prev.map(s => s.courseId === courseId ? { ...s, count } : s));
            });

            return () => {
                socket.disconnect();
            };
        };

        const cleanupSocket = initSocket();

        // Polling as a fallback every 10 seconds
        const interval = setInterval(fetchSessions, 10000);

        return () => {
            clearInterval(interval);
            cleanupSocket.then(cleanup => cleanup && cleanup());
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-red-600" />
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 opacity-40">
                    <Radio size={40} className="text-gray-500" />
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">NO ACTIVE <span className="text-red-600">SESSIONS</span></h1>
                <p className="text-gray-500 font-medium italic max-w-sm">Watching for live signals... New classes will appear here automatically.</p>
                <Link href="/dashboard" className="mt-10 text-[10px] font-black tracking-widest text-red-600 border-b border-red-600/30 pb-1 hover:text-red-500 transition-colors uppercase">
                    BACK TO DASHBOARD
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44">

                {/* Header */}
                <div className="mb-20">
                    <span className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase mb-4 block italic">Live Learning</span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                                LIVE <span className="text-red-600 underline decoration-red-600/20 underline-offset-[12px]">NOW</span>
                            </h1>
                            <p className="text-gray-500 font-medium italic max-w-xl text-lg">
                                Real-time sessions currently broadcasting. New classes appear automatically.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest uppercase italic">{sessions.length} ACTIVE ROOMS</span>
                        </div>
                    </div>
                </div>

                {/* Sessions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sessions.map((s) => (
                        <div key={s.courseId} className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden transition-all duration-500 group-hover:border-red-600/30">

                                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Radio size={120} />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                                            <span className="text-[10px] font-black tracking-widest text-red-600 uppercase italic">LIVE</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                                            <Users size={12} className="text-gray-500" />
                                            <span className="text-[10px] font-black">{s.count || 0} STUDENTS</span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-4 group-hover:text-red-600 transition-colors">
                                        {s.title || 'Untitled Session'}
                                    </h2>

                                    {s.instructorName && (
                                        <div className="mb-4 flex items-center gap-2">
                                            <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Instructor: <span className="text-white">{s.instructorName}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-6 mb-12">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">
                                                Started: {s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                            </span>
                                        </div>
                                        <div className="w-1 h-1 bg-white/10 rounded-full hidden sm:block" />
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                            ID: {s.courseId.slice(-8).toUpperCase()}
                                        </div>
                                    </div>

                                    <Link
                                        href={`/live/${s.courseId}/join`}
                                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/50"
                                    >
                                        JOIN SESSION <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Footer */}
                <div className="mt-32 text-center py-20 border-t border-white/5">
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
                        SkillOrbit Real-time Signal Processor
                    </p>
                </div>
            </div>
        </div>
    );
}
