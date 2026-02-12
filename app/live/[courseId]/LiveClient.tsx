"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, MessageSquare, Users, Share, LogOut,
  Copy, Check, Edit2, ChevronLeft, ChevronRight, X, Info, Send,
  Maximize2, Settings, Shield, UserPlus, Radio, Monitor, Zap
} from "lucide-react";

type Message = { userId: string; name?: string; text: string; time: string; system?: boolean };
type Props = { courseId: string; instructorId?: string; initialTitle?: string };

export default function LiveClient({ courseId, instructorId, initialTitle }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // State
  const [isLive, setIsLive] = useState(false);
  const [attendance, setAttendance] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // AV State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Styling State
  const [title, setTitle] = useState(initialTitle || (courseId.length === 9 ? "Instant Meeting" : "Live Session"));
  const [copied, setCopied] = useState(false);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, isChatOpen]);

  // Socket Init
  useEffect(() => {
    fetch("/api/socket").catch((err) => console.warn("Socket fetch init failed", err));

    const s = io({ path: "/api/socket", reconnection: true });
    socketRef.current = s;

    s.on("connect", () => {
      console.log("Connected to live server");
    });

    s.on("classStarted", ({ courseId: id }) => { if (id === courseId) setIsLive(true); });
    s.on("classEnded", ({ courseId: id }) => {
      if (id === courseId) {
        setIsLive(false);
        router.push("/dashboard");
      }
    });

    s.on("attendanceUpdate", ({ courseId: id, count }) => { if (id === courseId) setAttendance(count); });

    s.on("chatMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => { if (s.connected) s.disconnect(); };
  }, [courseId, router]);

  // Join/Leave
  useEffect(() => {
    const s = socketRef.current;
    if (!s || !session?.user?.id) return;
    s.emit("joinClass", { courseId, userId: session.user.id });
    return () => { s.emit("leaveClass", { courseId }); };
  }, [session, courseId]);

  // Camera logic
  useEffect(() => {
    if (camOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: micOn })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => {
          setPermissionError("Camera access denied.");
          setCamOn(false);
        });
    } else {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }, [camOn]);

  const toggleMic = () => setMicOn(!micOn);
  const toggleCam = () => setCamOn(!camOn);

  const sendMessage = () => {
    if (!messageText.trim() || !socketRef.current || !session?.user?.id) return;
    socketRef.current.emit("chatMessage", {
      courseId,
      userId: session.user.id,
      name: session.user.name || "User",
      text: messageText,
    });
    setMessageText("");
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/live/${courseId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndClass = () => {
    if (confirm("End this live session for everyone?")) {
      socketRef.current?.emit("endClass", { courseId });
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-white font-sans selection:bg-red-500/30">

      {/* --------------------
          SIDEBAR: CHAT
      -------------------- */}
      <AnimatePresence mode="wait">
        {isChatOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col bg-white/[0.02] backdrop-blur-3xl border-r border-white/10 relative z-30 overflow-hidden"
          >
            <div className="h-20 flex items-center justify-between px-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                  <MessageSquare size={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-xs tracking-widest uppercase italic leading-none mb-1">Live Chat</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Class Channel</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-3 hover:bg-white/5 rounded-2xl transition-all group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30">
                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 shadow-2xl">
                    <Radio size={48} className="text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Session Started</p>
                    <p className="text-[12px] font-medium text-gray-500 italic max-w-[200px]">Start the conversation here...</p>
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                const isMe = m.userId === session?.user?.id;
                const isInstructor = m.userId === instructorId;

                return (
                  <motion.div
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    {!isMe && (
                      <div className="flex items-center gap-2 mb-2 ml-1">
                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase italic">
                          {m.name || "Attendee"}
                        </span>
                        {isInstructor && (
                          <div className="px-2 py-0.5 bg-red-600 rounded text-[9px] font-black tracking-widest text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                            HOST
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`
                      relative px-5 py-3 rounded-[1.5rem] text-sm leading-relaxed max-w-[90%] shadow-2xl border transition-all
                      ${isMe
                        ? "bg-red-600 text-white rounded-tr-none border-red-500/20"
                        : "bg-white/[0.03] text-gray-200 rounded-tl-none border-white/10"
                      }
                    `}>
                      {m.text}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-black">
              <div className="relative flex items-center group">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="TYPE A MESSAGE..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-[11px] font-black tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-600/50 transition-all uppercase"
                />
                <button
                  onClick={sendMessage}
                  className={`absolute right-3 p-3 rounded-xl transition-all ${messageText.trim() ? "bg-red-600 text-white shadow-xl shadow-red-900/40" : "text-gray-700 cursor-not-allowed"}`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isChatOpen && (
        <motion.button
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed left-8 top-1/2 -translate-y-1/2 p-4 bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-40 hover:scale-110 transition active:scale-95 group"
        >
          <MessageSquare size={20} className="group-hover:text-red-600 transition-colors" />
        </motion.button>
      )}

      {/* --------------------
          MAIN STAGE
      -------------------- */}
      <main className="flex-1 flex flex-col relative z-20">

        {/* Top Floating Bar */}
        <header className="absolute top-8 left-8 right-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-full shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
            <h1 className="text-xs font-black tracking-widest uppercase italic pr-6 border-r border-white/10">{title}</h1>
            <div className="flex items-center gap-3 pl-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Users size={14} className="text-red-600" />
              <span>{attendance} JOINED</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
              <Shield size={14} className="text-gray-500" />
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">SECURE SESSION</span>
            </div>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-3xl border border-white/10 rounded-full transition group shadow-2xl"
            >
              <Share size={18} className="group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </header>

        {/* Video Area */}
        <div className="flex-1 flex items-center justify-center p-12 lg:p-24 lg:pb-40">
          <div className="relative w-full h-full max-w-7xl aspect-video rounded-[3rem] overflow-hidden bg-[#0a0a0a] shadow-[0_64px_128px_rgba(0,0,0,0.8)] border border-white/10 group transition-all duration-700">
            <AnimatePresence mode="wait">
              {camOn ? (
                <motion.video
                  key="active-cam"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <motion.div
                  key="avatar-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-[#0a0a0a] via-black to-[#0a0a0a]"
                >
                  <div className="relative group/avatar">
                    <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-10 rounded-full animate-pulse group-hover/avatar:opacity-20 transition-opacity" />
                    <div className="w-56 h-56 rounded-[3.5rem] bg-black border border-white/10 flex items-center justify-center shadow-3xl relative z-10 overflow-hidden group-hover/avatar:rotate-6 transition-transform duration-700">
                      <span className="text-8xl font-black text-red-600 tracking-tighter italic opacity-60">
                        {session?.user?.name?.[0] || "?"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">CAMERA IS OFF</p>
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full inline-block">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Start your camera to appear here</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Video Labels */}
            <div className="absolute bottom-10 left-10 flex items-center gap-4 z-30">
              <div className="bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-3xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-[12px] font-black italic border border-white/10">
                  {session?.user?.name?.[0]}
                </div>
                <div>
                  <span className="text-sm font-black tracking-tight uppercase italic block mb-0.5">{session?.user?.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute top-10 right-10 opacity-20 flex flex-col items-end gap-1">
              <span className="text-[10px] font-black tracking-[0.5em] text-white uppercase italic leading-none">SKILLORBIT</span>
              <span className="text-[8px] font-black tracking-widest text-red-600 uppercase italic leading-none tracking-[0.2em]">LIVE FEED 0{courseId.slice(-1)}</span>
            </div>
          </div>
        </div>

        {/* Floating Control Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 bg-black/60 backdrop-blur-3xl border border-white/10 px-10 py-6 rounded-[3rem] shadow-[0_64px_128px_rgba(0,0,0,0.9)]"
          >
            <button
              onClick={toggleMic}
              className={`p-6 rounded-3xl transition-all duration-500 transform active:scale-90 shadow-2xl relative group ${micOn ? "bg-white/5 hover:bg-white/10 text-white border border-white/5" : "bg-red-600 text-white hover:bg-red-700 shadow-red-900/40"}`}
            >
              {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Toggle MIC</span>
            </button>

            <button
              onClick={toggleCam}
              className={`p-6 rounded-3xl transition-all duration-500 transform active:scale-90 shadow-2xl relative group ${camOn ? "bg-white/5 hover:bg-white/10 text-white border border-white/5" : "bg-red-600 text-white hover:bg-red-700 shadow-red-900/40"}`}
            >
              {camOn ? <Video size={24} /> : <VideoOff size={24} />}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Toggle CAM</span>
            </button>

            <div className="w-px h-12 bg-white/10 mx-4" />

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl transition-all text-white active:scale-90 border border-white/5 relative group"
            >
              <UserPlus size={24} />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Add Member</span>
            </button>

            <button
              className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl transition-all text-white active:scale-90 border border-white/5 relative group"
            >
              <Monitor size={24} />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Share Screen</span>
            </button>

            <button
              onClick={handleEndClass}
              className="p-6 bg-red-600 hover:bg-red-700 rounded-3xl transition-all hover:scale-110 active:scale-90 text-white shadow-[0_20px_40px_rgba(220,38,38,0.4)] border border-red-500/20 relative group"
            >
              <LogOut size={24} />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">End Session</span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* --------------------
          SHARE MODAL
      -------------------- */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] p-12 shadow-[0_64px_128px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-red-600 uppercase mb-2 block italic">Share Session</span>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">SHARE <span className="text-white/20">LINK</span></h2>
                  </div>
                  <button onClick={() => setIsShareModalOpen(false)} className="p-4 bg-white/5 hover:bg-red-600 hover:text-white rounded-2xl transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-black border border-white/5 rounded-3xl group">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-4 block">Invite Link</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 truncate text-xs font-mono text-gray-400 py-3 uppercase tracking-tighter">
                        skillorbit.io/live/{courseId}
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 hover:text-white transition-all transform active:scale-95 flex items-center gap-3 shadow-2xl"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "COPIED" : "COPY LINK"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/5 hover:border-red-600/30 transition-all group">
                      <Shield size={24} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Room</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/5 hover:border-red-600/30 transition-all group">
                      <Zap size={24} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Burst Mode</span>
                    </button>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-2">
                    <Info size={12} className="text-gray-600" />
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic leading-none">
                      Guests must be logged in to join this session
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
