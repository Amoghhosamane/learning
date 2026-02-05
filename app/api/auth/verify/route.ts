import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verification';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 });

    const result = await verifyToken(token);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });

    // Redirect to profile with a flag so the client can show success UI
    const redirectTo = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile?verified=1`;
    return NextResponse.redirect(redirectTo);
  } catch (err) {
    console.error('/api/auth/verify error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}