"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Shield, Award, Settings,
  FileText, Upload, Trash2, ExternalLink,
  Video, BookOpen, ChevronRight, Zap, Star
} from 'lucide-react';

function EnrolledCoursesSection() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const res = await fetch("/api/courses/my-courses");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (e) {
        console.error("Failed to fetch courses", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMyCourses();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-3 p-6 bg-white/5 rounded-3xl animate-pulse">
      <div className="w-12 h-12 bg-white/10 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/10 rounded-full w-24" />
        <div className="h-2 bg-white/10 rounded-full w-full" />
      </div>
    </div>
  );

  if (courses.length === 0) return (
    <div className="p-12 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
      <BookOpen className="mx-auto text-gray-700 mb-4" size={32} />
      <p className="text-gray-500 font-medium italic text-sm">No courses completed yet.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {courses.map((course, i) => (
        <motion.div
          key={course._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link href={`/courses/${course._id}`}>
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/10 hover:border-red-600/30 transition-all group flex items-center gap-5 shadow-xl">
              <div className="w-20 h-20 bg-gray-900 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                <img src={course.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm tracking-tight mb-3 line-clamp-1 group-hover:text-red-500 transition-colors uppercase">{course.title}</h4>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden mb-2">
                  <div className="bg-red-600 h-full shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ width: `${course.progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black italic text-gray-500">{course.progress}% COMPLETED</span>
                  <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function ResumeUploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResumeUrl("https://example.com/resume.pdf");
    setUploading(false);
    setFile(null);
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/5 blur-[60px] rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-red-600" size={20} />
          <h3 className="text-sm font-black tracking-widest uppercase">My Resume</h3>
        </div>

        {!resumeUrl ? (
          <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-red-600/30 transition-all">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <Upload className="text-gray-500" size={24} />
            </div>

            {file ? (
              <div className="mb-6">
                <p className="text-sm font-black text-white italic mb-1">{file.name}</p>
                <p className="text-[10px] font-bold text-gray-500 tracking-widest">{(file.size / 1024).toFixed(0)} KB / PDF</p>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Drag/Drop Your Resume</p>
            )}

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />

            {!file ? (
              <label htmlFor="resume-upload" className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all">
                Select File
              </label>
            ) : (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-10 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl shadow-red-900/20"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between bg-black/40 p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center font-black italic text-xs">
                PDF
              </div>
              <div>
                <p className="text-sm font-black tracking-tight mb-1">My_Resume.pdf</p>
                <p className="text-[10px] font-black text-white/30 tracking-widest uppercase leading-none">VERIFIED UPLOAD</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setResumeUrl(null)} className="text-gray-500 hover:text-red-600 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-32 space-y-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] text-red-600 uppercase mb-3 block">User Profile</span>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              MY <span className="text-white/20">ACCOUNT</span>
            </h1>
          </div>
          <Link href="/dashboard" className="text-[10px] font-black tracking-widest text-gray-500 hover:text-white transition uppercase flex items-center gap-2">
            <ChevronRight size={14} className="rotate-180" /> Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Wing - Profile Card */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 blur-[50px] rounded-full" />

              <div className="relative z-10">
                <div className="w-28 h-28 bg-gradient-to-br from-red-600 via-red-900 to-black rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-4xl font-black italic border-2 border-white/10 group-hover:rotate-6 transition-transform shadow-2xl">
                  {user.name?.[0] || user.email?.[0] || 'U'}
                </div>

                <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase">{user.name || 'Anonymous User'}</h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Shield size={14} className="text-red-600" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{user.role || 'USER'}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-left">
                    <span className="text-[9px] font-black text-gray-500 tracking-widest uppercase block mb-1">Account ID</span>
                    <span className="text-[11px] font-mono text-white opacity-40 break-all leading-tight">{user.id}</span>
                  </div>
                </div>

                {/* Host Action */}
                <div className="mt-10 pt-10 border-t border-white/5">
                  <Link href="/live/instructor">
                    <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/20">
                      <Video size={18} />
                      Host Live Class
                    </button>
                  </Link>
                  <p className="text-[10px] text-gray-600 font-bold tracking-widest mt-4 uppercase italic">Your Instructor Panel</p>
                </div>
              </div>
            </motion.div>

            <ResumeUploadSection />
          </div>

          {/* Right Wing - Courses & Account */}
          <div className="lg:col-span-8 space-y-12">

            {/* My Active Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Zap size={20} className="text-red-600" />
                  <h3 className="text-sm font-black tracking-widest uppercase">Active Courses</h3>
                </div>
                <Link href="/courses" className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-2">
                  COURSES <ExternalLink size={12} />
                </Link>
              </div>
              <EnrolledCoursesSection />
            </motion.div>

            {/* Verification & Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award size={20} className="text-red-600" />
                  <h4 className="text-[10px] font-black tracking-widest uppercase">My Achievements</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-gray-700">
                      <Star size={20} />
                    </div>
                  ))}
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-[9px] font-black text-gray-700 uppercase p-4">
                    Complete more courses to unlock
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail size={20} className="text-red-600" />
                  <h4 className="text-[10px] font-black tracking-widest uppercase">Contact Details</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Primary Email</span>
                    <div className="text-xs font-bold italic">{user.email}</div>
                  </div>
                  <button className="text-[10px] font-black text-white px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition uppercase tracking-widest">
                    Manage Emails
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Action Zone */}
            <div className="p-10 bg-gradient-to-r from-red-600/10 to-transparent border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="text-center md:text-left">
                <h4 className="text-xl font-black tracking-tight italic mb-1 uppercase">ACCOUNT SECURITY</h4>
                <p className="text-[11px] font-medium text-gray-500 italic max-w-sm">Ensure your login sessions are secure and your account is protected.</p>
              </div>
              <button className="px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all">
                SECURITY SETTINGS
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
