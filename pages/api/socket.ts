import { NextApiRequest, NextApiResponse } from "next";
import { initSocket } from "../../lib/socket";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!(res.socket as any).server.io) {
        console.log("🔌 Initializing Socket.IO from pages/api/socket...");
        // Pass the HTTP server instance to initSocket
        initSocket((res.socket as any).server);
    } else {
        console.log("🔌 Socket.IO already running");
    }
    res.end();
}
