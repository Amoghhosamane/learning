"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, LayoutDashboard, PlayCircle, Library, Zap, Star, Shield } from "lucide-react";

function SessionArea() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl shadow-red-900/40 active:scale-95 flex items-center gap-2"
      >
        <Shield size={12} /> SIGN IN
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-900 to-black flex items-center justify-center text-white text-[10px] font-black shadow-2xl border border-white/20 transform group-hover:rotate-6 transition-transform">
          {session.user.name?.[0] || session.user.email?.[0]}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-black tracking-widest text-white uppercase leading-none mb-1">{session.user.name || "USER"}</p>
          <p className="text-[8px] font-black tracking-[0.2em] text-red-600 uppercase leading-none italic opacity-80">ONLINE</p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-4 w-64 rounded-[2rem] bg-black/95 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] p-3 z-50 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/5 mb-2">
                <p className="text-[9px] font-black tracking-widest text-gray-500 uppercase mb-1">Account Details</p>
                <p className="text-xs font-bold text-gray-400 italic truncate">{session.user.email}</p>
              </div>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="group-hover:text-red-500 transition-colors" />
                  <span className="text-[11px] font-black uppercase tracking-widest">My Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl hover:bg-red-950/20 text-red-500 hover:text-red-400 transition-all group"
                >
                  <LogOut size={18} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/" || pathname?.startsWith("/auth")) return null;

  const logoHref = session ? "/dashboard" : "/";

  const navLinks = [
    { name: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
    { name: "COURSES", href: "/courses", icon: Library },
    { name: "NEWS", href: "/latest", icon: PlayCircle },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 ${scrolled ? "py-4" : "py-8"}`}
    >
      <div
        className={`max-w-7xl mx-auto px-8 py-3 rounded-[2.5rem] border transition-all duration-700 flex items-center justify-between ${scrolled
          ? "bg-black/80 backdrop-blur-2xl border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="flex items-center gap-12">
          <Link href={logoHref} className="relative group flex items-center">
            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">
              SKILL<span className="text-red-600">ORBIT</span>
            </span>
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${isActive ? "text-white" : "text-gray-500 hover:text-white"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-premium"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <link.icon size={14} className={isActive ? "text-red-600" : "opacity-40"} />
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/live"
            className="hidden md:flex items-center gap-3 px-8 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-full transition-all duration-500 group overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,1)]" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">LIVE CLASSES</span>
          </Link>
          <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />
          <SessionArea />
        </div>
      </div>
    </motion.header>
  );
}
