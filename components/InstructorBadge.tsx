"use client";

import React from 'react';
import { useSession } from 'next-auth/react';

export default function InstructorBadge({ instructorId }: { instructorId: string }) {
  const { data: session } = useSession();
  if (!session?.user?.id) return null;
  if (session.user.id !== instructorId) return null;

  return (
    <div className="inline-flex items-center bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold mt-2">
      You are the instructor
    </div>
  );
}
