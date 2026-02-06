import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth handler for GET/POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions }; // Re-export if needed, though lib/auth is preferred


