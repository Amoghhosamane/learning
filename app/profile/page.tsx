"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  if (loading) return <div className="text-gray-500 text-sm">Loading courses...</div>;
  if (courses.length === 0) return <div className="text-gray-500 text-sm">No enrolled courses yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {courses.map((course) => (
        <Link key={course._id} href={`/courses/${course._id}`}>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-red-600 transition cursor-pointer flex gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
              <img src={course.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-semibold text-sm line-clamp-1">{course.title}</h4>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{course.progress}% Completed</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ResumeUploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null); // In real app, fetch this from profile API

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResumeUrl("https://example.com/resume.pdf"); // Mock success
    setUploading(false);
    setFile(null);
    alert("Resume uploaded successfully! (Mock)");
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Your Resume</h3>
      <p className="text-gray-400 text-sm mb-4">Upload your resume for recruiters to see.</p>

      {!resumeUrl ? (
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-800/50 transition">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>

          {file ? (
            <div className="mb-4">
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">Drag and drop or click to upload PDF</p>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />

          {!file && (
            <label htmlFor="resume-upload" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer transition">
              Select File
            </label>
          )}

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-lg flex items-center justify-center">
              PDF
            </div>
            <div>
              <p className="text-sm font-medium text-white">My_Resume.pdf</p>
              <p className="text-xs text-gray-400">Uploaded just now</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-white p-2">
              View
            </button>
            <button onClick={() => setResumeUrl(null)} className="text-red-400 hover:text-red-300 p-2 text-sm">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            {/* User Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {user.name?.[0] || user.email?.[0] || 'U'}
              </div>
              <h2 className="text-xl font-bold">{user.name || 'User'}</h2>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>

              <div className="inline-block bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-300 mb-6">
                Student Account
              </div>

              {/* Host Live Class Button */}
              <Link href="/live/instructor">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-900/20">
                  <span className="text-lg">📹</span>
                  Host Live Class
                </button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">Start a Zoom-like session immediately</p>
            </div>

            {/* Resume Section */}
            <ResumeUploadSection />
          </div>

          {/* Right Column - Courses & Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* My Learning */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Courses</h3>
                <Link href="/courses" className="text-sm text-red-500 hover:text-red-400">Browse All</Link>
              </div>
              <EnrolledCoursesSection />
            </div>

            {/* Account Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                    <div className="font-medium">{user.name || 'Not set'}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <label className="text-xs text-gray-400 block mb-1">Email Address</label>
                    <div className="font-medium">{user.email}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl md:col-span-2">
                    <label className="text-xs text-gray-400 block mb-1">User ID</label>
                    <div className="font-mono text-sm break-all">{user.id}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
