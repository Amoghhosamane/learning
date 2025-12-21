import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";

interface PageProps {
    params: { videoId: string };
    searchParams: { title?: string };
}

export default async function VideoPage(props: { params: Promise<{ videoId: string }>; searchParams: Promise<{ title?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const title = searchParams.title || "Course Video";

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition group"
            >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Back to Dashboard
            </Link>

            <VideoPlayer videoId={params.videoId} title={title} />
        </div>
    );
}
