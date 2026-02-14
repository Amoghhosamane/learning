import dbConnect from '@/lib/mongodb';
import Course from '@/lib/models/Course';

export const dynamic = 'force-dynamic';

export default async function StudentLivePage() {
  // Reuse same logic as /live overview
  // @ts-ignore
  const map: Map<string, any> | undefined = (global as any).__liveClasses;
  if (!map || map.size === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Browse Live Classes</h1>
        <p className="mt-4 text-gray-400">No classes are live right now. Check back later or ask your instructor to start a session.</p>
      </div>
    );
  }

  await dbConnect();
  const sessions: any[] = [];

  for (const [courseId, state] of map.entries()) {
    if (state.visibility && state.visibility !== 'public') continue;

    let title: string | null = null;
    try {
      const course = await Course.findById(courseId).lean() as any;
      title = course?.title || null;
    } catch (err) {
      title = null;
    }

    sessions.push({
      courseId,
      title,
      instructorId: state.instructorId,
      count: (state.attendees && state.attendees.size) || 0,
      startTime: state.startTime,
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Browse Live Classes</h1>
      <p className="mt-2 text-gray-400">Join a live class to participate and view the stream (placeholder) and chat.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div key={s.courseId} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{s.title || s.courseId}</div>
                <div className="text-sm text-gray-400">Instructor: {s.instructorId}</div>
                <div className="text-sm text-gray-400 mt-1">Started: {s.startTime ? new Date(s.startTime).toLocaleString() : '—'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Attendees</div>
                <div className="text-2xl font-black text-white">{s.count}</div>
                <a href={`/live/${s.courseId}`} className="inline-block mt-3 text-sm text-blue-400 hover:underline">Join</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
