export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.id) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    if ((session as any).user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await dbConnect();

    const users = await User.find({ emailVerified: false }).select('email name _id').limit(50).lean();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error('/api/admin/unverified error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}