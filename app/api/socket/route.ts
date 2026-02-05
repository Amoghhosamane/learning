import { NextResponse } from "next/server";
import { initSocket } from "@/lib/socket";

export async function GET(req: Request) {
  // Try best-effort to get the underlying Node HTTP server that Next.js uses
  try {
    // @ts-ignore - Next.js adds socket.server on the underlying res object for pages API
    const maybeAny: any = (req as any);

    // When deployed to Node runtime, socket.server should be available on request
    const httpServer = maybeAny.socket?.server || (global as any).__server;

    if (httpServer) {
      // save globally so other requests can reuse
      (global as any).__server = httpServer;
      initSocket(httpServer);
      return NextResponse.json({ success: true });
    }

    // Fallback: initialize without attaching to http server – still works in some environments
    initSocket();
    return NextResponse.json({ success: true, warning: "No httpServer detected, initialized standalone io" });
  } catch (err) {
    console.error("Failed to initialize socket:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
