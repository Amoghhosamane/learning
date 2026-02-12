"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Play, Globe, Shield, Zap, Users, Monitor } from "lucide-react";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#050505] z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 scale-105"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] uppercase bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Next-Gen Learning
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-tight">
              SKILL<span className="text-red-600">ORBIT</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join the world's most advanced learning orbit. Master code, design, and technology through immersive live sessions and expert-led paths.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="group relative px-10 py-4 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  START LEARNING <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/auth/signin"
                className="px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black rounded-full hover:bg-white/10 transition-all active:scale-95"
              >
                SIGN IN
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-12 text-white/40">
          {[
            { label: "COURSES", value: "500+" },
            { label: "LEARNERS", value: "20K+" },
            { label: "EXPERTS", value: "150+" }
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-white/60 tracking-tighter">{m.value}</div>
              <div className="text-[10px] font-bold tracking-widest">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Monitor,
                title: "Live Immersive Classes",
                desc: "High-definition video sessions with real-time code sharing and collaborative workspaces."
              },
              {
                icon: Zap,
                title: "Accelerated Paths",
                desc: "Hand-crafted curriculums designed to take you from beginner to job-ready in weeks, not years."
              },
              {
                icon: Shield,
                title: "Premium Mentorship",
                desc: "Direct access to industry veterans from top tech companies like Google, Meta & Netflix."
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-red-600/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <f.icon size={28} className="text-red-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent p-12 lg:p-20 rounded-[4rem] border border-white/10 backdrop-blur-xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight italic">
              THE FUTURE OF <br /> <span className="text-red-600 underline decoration-red-600/30 underline-offset-8">LEARNING IS HERE.</span>
            </h2>
            <p className="text-gray-400 mb-12 text-lg font-medium">
              Stop watching tutorials. Start building the future. Join SkillOrbit today and get 30% off your first premium path.
            </p>
            <Link
              href="/auth/signup"
              className="px-12 py-5 bg-red-600 text-white font-black rounded-full shadow-[0_20px_40px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all text-lg"
            >
              JOIN THE ORBIT
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-2xl font-black italic tracking-tighter">
            SKILL<span className="text-red-600">ORBIT</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold text-gray-500 tracking-widest">
            <Link href="#" className="hover:text-white transition">COURSES</Link>
            <Link href="#" className="hover:text-white transition">LIVE</Link>
            <Link href="#" className="hover:text-white transition">CAREERS</Link>
            <Link href="#" className="hover:text-white transition">PRIVACY</Link>
          </div>
          <div className="text-[10px] text-gray-700 font-bold tracking-widest">
            © 2024 SKILLORBIT VENTURES. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
