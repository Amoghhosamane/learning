"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function SessionArea() {
  const { data: session } = useSession();
  if (!session?.user) {
    return <Link href="/auth/signin" className="text-sm text-gray-300 hover:text-white">Sign in</Link>;
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/profile" className="text-sm text-gray-300 hover:text-white">{session.user.name || session.user.email}</Link>

    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();

  // Hide Navbar on Landing Page and Auth Pages
  if (pathname === "/" || pathname?.startsWith("/auth")) return null;

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-bold text-red-600 tracking-tighter">SkillOrbit</Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
            <Link href="/latest" className="hover:text-white transition-colors">Latest</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>

            {/* Live Section (hidden on auth pages) */}
            {!(pathname?.startsWith?.('/auth')) && (
              <Link
                href="/live"
                className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors font-semibold"
              >
                Join Live Classes
              </Link>
            )}

          </nav>
        </div>

        <div>
          {/** Show profile link when signed in, otherwise Sign in link */}
          <SessionArea />
        </div>
      </div>
    </header>
  );
}
