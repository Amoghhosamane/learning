
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/my-courses/:path*",
        "/live/instructor/:path*",
        "/live/student/:path*",
        "/profile/:path*",
        "/admin/:path*",
        "/courses/:path*/learn/:path*",
    ],
};
