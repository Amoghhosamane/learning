"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function InstructorLivePage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]); // Added missing state
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

  const startById = async (idToStart?: string) => { // Updated to accept ID
    const targetId = idToStart || courseId;
    setError("");
    if (!targetId) return setError("Course id required");

    setLoading(true);
    try {
      const res = await fetch('/api/live/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: targetId }) });
      const json = await res.json();
      if (!res.ok) setError(json.error || 'Failed to start');
      else setCourseId('');
      await fetchSessions();
    } catch (err) {
      setError('Failed to start');
    } finally { setLoading(false); }
  };

  const endSession = async (id: string) => {
    try {
      const res = await fetch('/api/live/end', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: id }) });
      if (!res.ok) alert('Failed to end session');
      else await fetchSessions();
    } catch (e) {
      alert('Error ending session');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Instructor Live Dashboard</h1>
      <p className="mt-2 text-gray-400">Start or manage live sessions for your courses here.</p>

      {/* Course List for Quick Start */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        {loading && courses.length === 0 ? <div className="text-gray-500">Loading your courses...</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div key={course._id} className="bg-gray-800 border border-gray-700 p-5 rounded-xl hover:border-blue-500 transition">
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <p className="text-xs text-gray-400 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">ID: {course._id}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => { setCourseId(course._id); startById(course._id); }}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Start Live
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(course._id); alert('ID Copied'); }}
                  className="px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg"
                >
                  Copy ID
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Manual Entry Fallback */}
        <div className="mt-8 pt-8 border-t border-gray-800 max-w-md">
          <details>
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">Manual Entry (Advanced)</summary>
            <div className="mt-4">
              <label className="text-sm text-gray-300">Start live by Course ID</label>
              <div className="flex gap-2 mt-2">
                <input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="course id" className="flex-1 px-4 py-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500" />
                <button onClick={() => startById(courseId)} disabled={loading} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Start</button>
              </div>
            </div>
          </details>
        </div>
      </div>

      {error && <div className="text-red-400 mt-4 bg-red-900/20 border border-red-900 p-3 rounded-lg">{error}</div>}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Active Sessions</h2>
        {sessions.length === 0 && <div className="text-gray-400 mt-2">No active sessions right now</div>}
        <div className="mt-4 space-y-3">
          {sessions.map((s) => (
            <div key={s.courseId} className="bg-gray-900 border border-gray-800 p-4 rounded-md flex justify-between items-center">
              <div>
                <div className="text-white font-semibold">{s.title || s.courseId}</div>
                <div className="text-sm text-gray-400">Started: {s.startTime ? new Date(s.startTime).toLocaleString() : '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`/live/${s.courseId}`} className="text-blue-400 hover:underline text-sm">Open</a>
                <button onClick={() => endSession(s.courseId)} className="px-3 py-1 bg-red-600 text-white rounded">End</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
