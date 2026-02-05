import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.id) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const body = await req.json();
    const targetId = body?.userId || (session as any).user.id;

    // Only allow resending for self unless admin
    if (targetId !== (session as any).user.id && (session as any).user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const user = await User.findById(targetId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Create a verification token and send it (or log it in dev)
    const { createVerificationToken } = await import('@/lib/auth/verification');
    const token = await createVerificationToken(user._id.toString());
    const base = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
    const link = `${base}/api/auth/verify?token=${token}`;

    if (process.env.SMTP_HOST) {
      // send email via nodemailer (best-effort)
      const nodemailer = await import('nodemailer');
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: (process.env.SMTP_SECURE === 'true'),
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      } as any);

      await transport.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: user.email,
        subject: 'Verify your email',
        text: `Verify email by visiting: ${link}`,
        html: `<p>Verify email by clicking <a href="${link}">this link</a></p>`,
      });

      return NextResponse.json({ success: true, message: 'Verification email queued' });
    }

    // In dev: return the link so testers can complete the flow easily
    return NextResponse.json({ success: true, message: 'Dev verification link', link });
  } catch (err) {
    console.error('/api/auth/resend error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}