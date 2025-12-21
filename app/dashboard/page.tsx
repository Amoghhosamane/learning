'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

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
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    items: [
      { title: "Python", desc: "The language of AI", videoId: "K5KVEU3aaeQ" },
      { title: "Machine Learning", desc: "Predictive algorithms", videoId: "PeMlggyqz0Y" },
      { title: "Deep Learning", desc: "Neural networks basics", videoId: "V_xro1bcAuA" },
      { title: "AI Tools", desc: "Leverage modern AI stack", videoId: "yHk7Vavmc7Q" },
    ]
  },
  {
    title: "Cyber Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    items: [
      { title: "Networking Basics", desc: "Protocols & Systems", videoId: "p3vaaD9pn9I" },
      { title: "Ethical Hacking", desc: "Penetration testing", videoId: "fNzpcB7ODxQ" },
      { title: "Web Security", desc: "Secure your applications", videoId: "GY07qJl6eZo" },
      { title: "OWASP Top 10", desc: "Critical risks explained", videoId: "-Q3wUMOFsio" },
    ]
  },
  {
    title: "Cloud & DevOps",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    items: [
      { title: "AWS / Azure", desc: "Cloud infrastructure", videoId: "AfP4mtmzyj4" },
      { title: "Docker", desc: "Containerization made easy", videoId: "pg19Z8LL06w" },
      { title: "CI/CD", desc: "Automated deployment pipelines", videoId: "scEDHsr3APg" },
      { title: "Linux", desc: "OS fundamentals", videoId: "wBp0Rb-ZJak" },
    ]
  },
  {
    title: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48",
    items: [
      { title: "SEO", desc: "Search Engine Optimization", videoId: "xsVTqzratPs" },
      { title: "Social Media", desc: "Marketing strategies", videoId: "O9uInXzMv3Q" },
      { title: "Ads & Analytics", desc: "Data-driven growth", videoId: "m3vXQ_Vp-rM" },
    ]
  },
  {
    title: "Mobile App Development",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    items: [
      { title: "Android / iOS", desc: "Native development", videoId: "8yImX_v8f-k" },
      { title: "React Native / Flutter", desc: "Cross-platform apps", videoId: "NR3CH3JIwAY" },
    ]
  },
  {
    title: "UI/UX & Design",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
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

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 to-black/0 backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <Link href="/" className="text-3xl font-bold text-red-600 tracking-tighter hover:scale-105 transition-transform">
            SkillOrbit
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="text-white hover:text-gray-300 transition">Home</Link>
              <Link href="/courses" className="text-gray-300 hover:text-white transition">Courses</Link>
              <Link href="/my-courses" className="text-gray-300 hover:text-white transition">My Courses</Link>
              <Link href="/latest" className="text-gray-300 hover:text-white transition">New & Popular</Link>
            </nav>
            <button className="text-white hover:bg-gray-800 p-2 rounded-full transition">
              🔍
            </button>
            <div className="w-8 h-8 bg-red-600 rounded-md cursor-pointer"></div>
          </div>
        </div>
      </header>

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
