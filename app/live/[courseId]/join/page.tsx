"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, AlertCircle, Loader2, Radio, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function JoinLivePage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();
    const courseId = (params?.courseId as string) || '';

    const [meetingId, setMeetingId] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState('');
    const [courseTitle, setCourseTitle] = useState('Live Session');

    // Fetch course info
    useEffect(() => {
        const fetchCourseInfo = async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.course) {
                        setCourseTitle(data.course.title || 'Live Session');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch course info:', err);
            }
        };

        if (courseId) {
            fetchCourseInfo();
        }
    }, [courseId]);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!meetingId.trim()) {
            setError('Please enter the Meeting ID');
            return;
        }

        if (!session?.user?.id) {
            setError('You must be logged in to join');
            return;
        }

        setIsValidating(true);

        try {
            const res = await fetch('/api/live/validate-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meetingId: meetingId.trim(),
                    courseId,
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Validation successful - redirect to live classroom
                router.push(`/live/${courseId}`);
            } else {
                setError(data.error || 'Access denied');
            }
        } catch (err) {
            setError('Failed to validate. Please try again.');
            console.error('Validation error:', err);
        } finally {
            setIsValidating(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-red-600" />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                    <Lock size={40} className="text-red-600" />
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">
                    LOGIN <span className="text-red-600">REQUIRED</span>
                </h1>
                <p className="text-gray-500 font-medium italic max-w-sm mb-8">
                    You must be logged in to join live sessions.
                </p>
                <Link
                    href="/auth/login"
                    className="px-8 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all"
                >
                    LOGIN NOW
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
            <div className="max-w-2xl mx-auto px-6 pt-32 pb-24 lg:pt-44">

                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-8 border border-red-600/20 mx-auto">
                        <Radio size={32} className="text-red-600 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase mb-4 block italic">
                        Join Live Session
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                        VERIFY <span className="text-red-600 underline decoration-red-600/20 underline-offset-[12px]">MEETING</span>
                    </h1>
                    <p className="text-gray-500 font-medium italic max-w-md mx-auto">
                        Enter the Meeting ID to join <span className="text-white font-black">{courseTitle}</span>
                    </p>
                </div>

                {/* Validation Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-[3rem] blur opacity-20"></div>
                    <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl">

                        <form onSubmit={handleJoin} className="space-y-8">

                            {/* Meeting ID Input */}
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4 block">
                                    Meeting ID
                                </label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                                        <User size={20} className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={meetingId}
                                        onChange={(e) => setMeetingId(e.target.value)}
                                        placeholder="ENTER MEETING ID"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 pl-14 py-5 text-sm font-black tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-all uppercase"
                                        disabled={isValidating}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 font-medium italic mt-3 ml-1">
                                    Use the provided Meeting ID to access this session
                                </p>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl"
                                    >
                                        <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                                        <p className="text-sm font-medium text-red-400">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isValidating || !meetingId.trim()}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
                            >
                                {isValidating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        VALIDATING...
                                    </>
                                ) : (
                                    <>
                                        JOIN SESSION <ChevronRight size={16} />
                                    </>
                                )}
                            </button>

                            {/* Info */}
                            <div className="pt-6 border-t border-white/5 flex items-start gap-3">
                                <Shield size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        Security Notice
                                    </p>
                                    <p className="text-xs text-gray-600 font-medium italic leading-relaxed">
                                        Validation helps keep our sessions secure and prevents unauthorized access.
                                    </p>
                                </div>
                            </div>

                        </form>

                    </div>
                </motion.div>

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link
                        href="/live"
                        className="text-[10px] font-black tracking-widest text-gray-600 hover:text-red-600 transition-colors uppercase inline-flex items-center gap-2"
                    >
                        ← BACK TO LIVE SESSIONS
                    </Link>
                </div>

            </div>
        </div>
    );
}
