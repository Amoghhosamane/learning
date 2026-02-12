import dbConnect from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Link from "next/link";
import { Filter, Star, Clock, BookOpen, Search, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  await dbConnect();
  const courses = await Course.find({ published: true });

  const CATEGORIES = [
    "Full-Stack Development",
    "Data Science & AI",
    "Cyber Security",
    "Cloud & DevOps",
    "Digital Marketing",
    "Mobile App Development",
    "UI/UX & Design"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30">
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-red-600 uppercase mb-2 block">Course Catalog</span>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">EXPLORE <span className="text-red-600">COURSES</span></h1>
            <p className="text-gray-500 font-medium mt-2 max-w-lg italic">Learn high-demand skills with professional-grade courses.</p>
          </div>

          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-12 focus:outline-none focus:border-red-600/50 transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={18} className="text-red-600" />
                  <h2 className="text-sm font-black tracking-widest uppercase">Categories</h2>
                </div>
                <div className="space-y-1">
                  <div className="px-4 py-3 bg-red-600/10 text-white rounded-xl border border-red-600/20 text-xs font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-red-900/10">
                    All Courses
                  </div>
                  {CATEGORIES.map((cat) => (
                    <div key={cat} className="px-4 py-3 text-xs font-bold text-gray-500 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition uppercase tracking-widest mb-1">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-red-600/10 to-transparent border border-white/5 rounded-3xl">
                <h4 className="text-xs font-black uppercase text-red-500 mb-2">Pro Tip</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium italic">Complete the "Web Foundations" course to unlock 20% off advanced certifications.</p>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {courses.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <BookOpen size={30} className="text-gray-700" />
                </div>
                <h3 className="font-black tracking-tight mb-2">No Courses Active</h3>
                <p className="text-gray-500 text-sm">Our instructors are curating new content. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {courses.map((course: any) => (
                  <Link key={course._id.toString()} href={`/courses/${course._id.toString()}`} className="group">
                    <div className="h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-red-600/50 transition-all duration-500 shadow-2xl flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black flex items-center gap-1.5 uppercase">
                          <Star size={10} className="text-red-600 fill-red-600" />
                          {course.rating || "New"}
                        </div>
                      </div>

                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-red-600/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                            {course.category || "General"}
                          </span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-4 group-hover:text-red-500 transition-colors leading-tight">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500 mb-6 border-b border-white/5 pb-6">
                          <div className="flex items-center gap-1">
                            <Clock size={12} /> {course.duration || "Self-paced"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={12} /> {course.studentCount || "1k+"} Learners
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Price</span>
                            <span className="text-2xl font-black text-white italic tracking-tighter">₹ {course.price}</span>
                          </div>
                          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                            <ArrowRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
