'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Clipboard } from 'lucide-react';

function CopyInstructorButton() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<'idle' | 'loading' | 'copied'>('idle');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipId = React.useId();

  useEffect(() => {
    let t: any;
    if (status === 'copied') {
      // show tooltip briefly when copied
      setTooltipVisible(true);
      t = setTimeout(() => {
        setTooltipVisible(false);
      }, 1600);
    }
    return () => clearTimeout(t);
  }, [status]);

  if (!session?.user?.id) return null;

  const handleCopy = async () => {
    setStatus('loading');
    try {
      await navigator.clipboard.writeText(session.user.id);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.warn('copy failed', err);
      setStatus('idle');
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        aria-label="Copy my user id"
        aria-describedby={tooltipId}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
      >
        <Clipboard className={`w-4 h-4 opacity-90 transition-transform ${status === 'copied' ? 'scale-125 rotate-12' : 'scale-100'}`} />
        <span className="select-none">{status === 'copied' ? 'Copied ✓' : 'Copy My ID'}</span>
      </button>

      {/* Accessible tooltip */}
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!tooltipVisible}
        className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-xs text-white px-2 py-1 rounded transition-opacity duration-150 whitespace-nowrap ${tooltipVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {status === 'copied' ? 'Copied to clipboard' : 'Copy your user id'}
      </div>
    </div>
  );
}

function UnverifiedUsersCard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/unverified');
      const j = await res.json();
      if (res.ok && j.success) setUsers(j.users || []);
      else setError(j.error || 'Failed to fetch');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const verify = async (id: string) => {
    try {
      const res = await fetch('/api/admin/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: id }) });
      const j = await res.json();
      if (res.ok && j.success) setUsers(prev => prev.filter(u => u._id !== id));
      else alert('Failed to verify');
    } catch (err) { console.error(err); alert('Failed to verify'); }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Unverified Users</div>
          <div className="text-white font-semibold mt-2">{loading ? 'Loading...' : `${users.length} pending`}</div>
        </div>
        <div className="ml-4">
          <button onClick={fetchUsers} className="px-3 py-2 bg-gray-800 rounded text-white">Refresh</button>
        </div>
      </div>

      <div className="mt-4 space-y-2 max-h-40 overflow-auto">
        {error && <div className="text-sm text-red-400">{error}</div>}
        {users.length === 0 && !loading && <div className="text-sm text-gray-400">No pending verifications.</div>}
        {users.map(u => (
          <div key={u._id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
            <div>
              <div className="text-sm text-white">{u.email}</div>
              <div className="text-xs text-gray-400">{u.name || '—'}</div>
            </div>
            <div>
              <button onClick={() => verify(u._id)} className="px-3 py-1 bg-red-600 text-white rounded">Verify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function InstantMeetingCard() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");
  const [loading, setLoading] = useState(false);

  const createInstant = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'instant' })
      });
      const data = await res.json();
      if (data.success && data.courseId) {
        router.push(`/live/${data.courseId}`);
      } else {
        alert('Failed to create meeting');
      }
    } catch (e) {
      alert('Error creating meeting');
    } finally {
      setLoading(false);
    }
  };

  const joinMeeting = () => {
    if (!joinId) return;
    router.push(`/live/${joinId}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-800/50">
      <div className="text-sm text-blue-300 font-semibold mb-1">Instant Meeting</div>
      <h3 className="text-xl font-bold text-white mb-4">Zoom-style Video Call</h3>

      <div className="space-y-3">
        <button
          onClick={createInstant}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition hover:scale-[1.02]"
        >
          {loading ? 'Creating...' : 'New Meeting'}
        </button>

        <div className="flex gap-2">
          <input
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="Enter Meeting ID"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
          />
          <button
            onClick={joinMeeting}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium text-sm"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

const TRENDING_COURSES = [
  {
    title: "Harvard CS50",
    desc: "Change your college degree",
    videoId: "LfaMVlDaQ24",
    image: "/images/hav.png"
  },
  {
    title: "Algorithms & Computation",
    desc: "MIT OpenCourseWare",
    videoId: "ZA-tUyM_y7s",
    image: "/images/mit.png"
  },
  {
    title: "CS50 Cybersecurity",
    desc: "Harvard University",
    videoId: "9HOpanT0GRs",
    image: "/images/hav.png"
  }
];

const LEARNING_PATHS = [
  {
    title: "Full-Stack Development",
    image: "/images/web.png",
    items: [
      { title: "HTML, CSS, JS", desc: "The building blocks of the web", videoId: "nu_pCVPKzTk" },
      { title: "React JS", desc: "Modern frontend library", videoId: "CgkZ7MvWUAA" },
      { title: "Next.js", desc: "The React Framework", videoId: "843nec-IvW0" },
      { title: "Node.js, MongoDB", desc: "Backend & Database mastery", videoId: "_7UQPve99r4" },
      { title: "Projects", desc: "Build real-world applications", videoId: "rOpEN1JDaD0" },
    ]
  },
  {
    title: "Data Science & AI",
    image: "/images/ds aiml.png",
    items: [
      { title: "Python", desc: "The language of AI", videoId: "K5KVEU3aaeQ" },
      { title: "Machine Learning", desc: "Predictive algorithms", videoId: "PeMlggyqz0Y" },
      { title: "Deep Learning", desc: "Neural networks basics", videoId: "V_xro1bcAuA" },
      { title: "AI Tools", desc: "Leverage modern AI stack", videoId: "yHk7Vavmc7Q" },
    ]
  },
  {
    title: "Cyber Security",
    image: "/images/cyber.png",
    items: [
      { title: "Networking Basics", desc: "Protocols & Systems", videoId: "p3vaaD9pn9I" },
      { title: "Ethical Hacking", desc: "Penetration testing", videoId: "fNzpcB7ODxQ" },
      { title: "Web Security", desc: "Secure your applications", videoId: "GY07qJl6eZo" },
      { title: "OWASP Top 10", desc: "Critical risks explained", videoId: "-Q3wUMOFsio" },
    ]
  },
  {
    title: "Cloud & DevOps",
    image: "/images/cloud.png",
    items: [
      { title: "AWS / Azure", desc: "Cloud infrastructure", videoId: "AfP4mtmzyj4" },
      { title: "Docker", desc: "Containerization made easy", videoId: "pg19Z8LL06w" },
      { title: "CI/CD", desc: "Automated deployment pipelines", videoId: "scEDHsr3APg" },
      { title: "Linux", desc: "OS fundamentals", videoId: "wBp0Rb-ZJak" },
    ]
  },
  {
    title: "Digital Marketing",
    image: "/images/digit.png",
    items: [
      { title: "SEO", desc: "Search Engine Optimization", videoId: "xsVTqzratPs" },
      { title: "Social Media", desc: "Marketing strategies", videoId: "O9uInXzMv3Q" },
      { title: "Ads & Analytics", desc: "Data-driven growth", videoId: "m3vXQ_Vp-rM" },
    ]
  },
  {
    title: "Mobile App Development",
    image: "/images/mobile.png",
    items: [
      { title: "Android / iOS", desc: "Native development", videoId: "8yImX_v8f-k" },
      { title: "React Native / Flutter", desc: "Cross-platform apps", videoId: "NR3CH3JIwAY" },
    ]
  },
  {
    title: "UI/UX & Design",
    image: "/images/uiux.png",
    items: [
      { title: "Figma", desc: "Interface design tool", videoId: "1SNZRCVNizg" },
      { title: "Design Principles", desc: "Theory & Aesthetics", videoId: "c9Wg6Cb_YlU" },
      { title: "Prototyping", desc: "Interactive mockups", videoId: "FTFaQWZBqQ8" },
    ]
  }
];


export default function Dashboard() {
  const { data: session } = useSession();

  const CONTINUE_WATCHING = [
    { title: "HTML, CSS, JS", desc: "The building blocks of the web", videoId: "nu_pCVPKzTk" },
    { title: "React JS", desc: "Modern frontend library", videoId: "CgkZ7MvWUAA" },
    { title: "Next.js", desc: "The React Framework", videoId: "843nec-IvW0" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white pb-20">



      {/* HERO SECTION */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-1/4 left-6 md:left-12 max-w-xl space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
            Master Full-Stack
          </h1>
          <div className="flex items-center space-x-3 text-green-400 font-semibold text-sm">
            <span>98% Match</span>
            <span className="text-gray-300">2024</span>
            <span className="border border-gray-500 px-1 text-xs text-gray-300">18+</span>
            <span className="text-gray-300">6 Seasons</span>
          </div>
          <p className="text-gray-200 text-lg drop-shadow-md line-clamp-3">
            Become a top-tier developer by mastering the entire stack. From React frontends to Node.js backends, this journey will transform your career.
          </p>
          <div className="flex space-x-4 pt-4">
            <button className="bg-white text-black px-8 py-2 rounded font-bold flex items-center hover:bg-opacity-80 transition">
              ▶ Play
            </button>
            <button className="bg-gray-600/70 text-white px-8 py-2 rounded font-bold flex items-center hover:bg-gray-600/50 transition backdrop-blur-sm">
              ℹ More Info
            </button>

          </div>
        </div>
      </div>

      {/* ROWS */}
      <div className="relative z-10 -mt-24 space-y-8 pl-6 md:pl-12 overflow-x-hidden">

        {/* CONTINUE WATCHING FOR USER */}
        {session?.user && (
          <div className="space-y-3 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-100 hover:text-white transition cursor-pointer inline-block">
              Continue Watching for {session.user.name || "User"}
            </h2>
            <div className="group relative">
              <div className="flex space-x-4 overflow-x-scroll scrollbar-hide py-4 pr-12 scroll-smooth">
                {CONTINUE_WATCHING.map((item, i) => (
                  <Link key={i} href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`}>
                    <motion.div
                      className="flex-none w-64 md:w-80 aspect-video bg-gray-900 rounded-md relative overflow-hidden cursor-pointer border border-gray-800"
                      whileHover={{
                        scale: 1.05,
                        zIndex: 10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Fallback pattern since this is a custom list without category image */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-black p-6 flex flex-col justify-end from-red-900/40`}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <span className="text-6xl">▶</span>
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-white mb-1 leading-tight">{item.title}</h3>
                          <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-red-600 h-full w-1/3"></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">S1:E{i + 1}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRENDING NOW SECTION */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-100 hover:text-white transition cursor-pointer inline-block">
            Trending Now
          </h2>
          <div className="group relative">
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide py-4 pr-12 scroll-smooth">
              {TRENDING_COURSES.map((item, i) => (
                <Link key={i} href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`}>
                  <motion.div
                    className="flex-none w-64 md:w-80 aspect-video bg-gray-900 rounded-md relative overflow-hidden cursor-pointer border border-gray-800"
                    whileHover={{
                      scale: 1.05,
                      zIndex: 10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                    <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm w-fit mb-2">TOP 10</span>
                      <h3 className="text-lg font-bold text-white mb-1 leading-tight drop-shadow-md">{item.title}</h3>
                      <p className="text-xs text-gray-300 line-clamp-2 drop-shadow-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE CLASSES SUMMARY */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-100">Live Classes</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="text-sm text-gray-400">Active Sessions</div>
                <div className="text-2xl font-black text-white mt-2">See live sessions</div>
                <p className="text-gray-400 mt-2 text-sm">Join classes or manage sessions if you are an instructor.</p>
              </div>
              <div className="mt-4 flex gap-2">
                <a href="/live/student" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Browse Live</a>
                <a href="/live/instructor" className="px-4 py-2 bg-red-900/50 text-red-200 border border-red-900 rounded hover:bg-red-900 transition">Instructor</a>
              </div>
            </div>

            <InstantMeetingCard />

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="text-sm text-gray-400">Quick Tip</div>
              <div className="text-white font-semibold mt-2">Instructors can start a session from the course page</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="text-sm text-gray-400">Demo</div>
              <div className="text-white font-semibold mt-2">Use the developer endpoints to simulate joins & demo sessions</div>
            </div>
          </div>

          {/* Admin: Unverified users card */}
          {session?.user?.role === 'admin' && (
            <div className="mt-4 md:mt-6">
              <UnverifiedUsersCard />
            </div>
          )}
        </div>

        {LEARNING_PATHS.map((path: any, index) => (
          <div key={index} className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-100 hover:text-white transition cursor-pointer inline-block">
              {path.title}
            </h2>

            <div className="group relative">
              {/* Scroll Container */}
              <div className="flex space-x-4 overflow-x-scroll scrollbar-hide py-4 pr-12 scroll-smooth">
                {path.items.map((item: any, i: number) => {
                  const CardContent = (
                    <motion.div
                      className="flex-none w-64 md:w-80 aspect-video bg-gray-900 rounded-md relative overflow-hidden cursor-pointer border border-gray-800"
                      whileHover={{
                        scale: 1.05,
                        zIndex: 10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Image or Placeholder */}
                      {path.image ? (
                        <>
                          <img src={path.image} alt={path.title} className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </>
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-black p-6 flex flex-col justify-end
                                  ${i % 3 === 0 ? 'from-red-900/20' : ''} 
                                  ${i % 3 === 1 ? 'from-blue-900/20' : ''} 
                                  ${i % 3 === 2 ? 'from-purple-900/20' : ''}
                              `}></div>
                      )}

                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                        <h3 className="text-lg font-bold text-white mb-1 leading-tight drop-shadow-md">{item.title}</h3>
                        <p className="text-xs text-gray-300 line-clamp-2 drop-shadow-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  );

                  return item.videoId ? (
                    <Link key={i} href={`/video/${item.videoId}?title=${encodeURIComponent(item.title)}`}>
                      {CardContent}
                    </Link>
                  ) : (
                    <div key={i}>{CardContent}</div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
