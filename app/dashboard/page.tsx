'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FEATURED = [
  {
    _id: "fullstack",
    title: "Full-Stack Development Bootcamp",
    description: "HTML, CSS, JavaScript, React — Learn Full Stack from zero.",
    bg: "https://i.imgur.com/UM3Vx2S.png",
    url: "/courses/6928a045da7e7f0e4d2a5969"
  },
  {
    _id: "cyber",
    title: "Cybersecurity for Beginners",
    description: "Understand how to protect systems and networks.",
    bg: "https://i.imgur.com/8rGeCbw.png",
    url: "/courses/6928a045da7e7f0e4d2a596c"
  }
];

const CATEGORIES = [
  { name: "Full-Stack" },
  { name: "Cybersecurity" },
  { name: "Data Science" },
  { name: "DSA" },
  { name: "System Design" },
  { name: "Aptitude" }
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* HEADER */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition">
            SkillOrbit
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/courses" className="text-gray-300 hover:text-white">Browse</Link>
            <Link href="/my-courses" className="text-gray-300 hover:text-white">My Learning</Link>
          </nav>

          <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 text-sm transition">
            Profile
          </button>
        </div>
      </header>

      {/* FEATURED SLIDER */}
      <section className="relative w-full overflow-x-scroll snap-x snap-mandatory flex gap-6 p-6 scrollbar-hide">
        {FEATURED.map((item) => (
          <div
            key={item._id}
            onClick={() => router.push(item.url)}
            className="snap-center min-w-[90%] md:min-w-[55%] lg:min-w-[45%] h-64 rounded-2xl cursor-pointer relative group border border-gray-800 hover:border-red-600 transition"
            style={{
              backgroundImage: `url(${item.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent rounded-2xl group-hover:from-red-900/40 transition duration-300"></div>

            <div className="absolute top-1/2 -translate-y-1/2 left-6 max-w-sm">
              <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-300 text-sm">{item.description}</p>
              <button className="mt-3 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 text-sm transition">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-red-600 transition cursor-pointer"
            >
              <h3 className="font-semibold text-white text-lg">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-6 text-center text-gray-500 text-sm mt-10">
        © {new Date().getFullYear()} SkillOrbit — Learn & Grow
      </footer>

    </div>
  );
}
