import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
    params: { videoId: string };
    searchParams: { title?: string };
}

export default async function VideoPage(props: { params: Promise<{ videoId: string }>; searchParams: Promise<{ title?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const title = searchParams.title || "Course Video";

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-500 hover:text-white mb-12 uppercase transition-all group bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-white/10"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Nexus
                </Link>

                <div className="mb-12">
                    <span className="text-[10px] font-black tracking-[0.3em] text-red-600 uppercase mb-3 block">Now Streaming</span>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight max-w-4xl">
                        {title}
                    </h1>
                </div>

                <VideoPlayer videoId={params.videoId} title={title} />
            </div>
        </div>
    );
}
