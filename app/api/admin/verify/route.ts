import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.id) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    if ((session as any).user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await req.json();
    const userId = body?.userId;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.emailVerified = true;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('/api/admin/verify error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}