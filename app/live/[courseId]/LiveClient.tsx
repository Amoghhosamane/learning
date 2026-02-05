"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, Share, LogOut, Copy, Check, Edit2, ChevronLeft, ChevronRight } from "lucide-react";

type Props = { courseId: string; instructorId?: string };

export default function LiveClient({ courseId, instructorId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);
  const [attendance, setAttendance] = useState(0);
  const [messages, setMessages] = useState<Array<{ userId: string; name?: string; text: string; time: string }>>([]);
  const [messageText, setMessageText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true); // Default open for left side

  // Header State
  const [title, setTitle] = useState(courseId.length === 9 ? "Instant Meeting" : "Live Class");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [copied, setCopied] = useState(false);

  // AV State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isChatOpen]);

  // Initialize Socket
  useEffect(() => {
    fetch("/api/socket").catch((err) => console.warn("socket init failed", err));

    const s = io({ path: "/api/socket" });
    socketRef.current = s;

    s.on("classStarted", ({ courseId: id }: any) => {
      if (id === courseId) setIsLive(true);
    });

    s.on("classEnded", ({ courseId: id }: any) => {
      if (id === courseId) {
        setIsLive(false);
        setAttendance(0);
        alert("Class has ended.");
        router.push('/dashboard');
      }
    });

    s.on("attendanceUpdate", ({ courseId: id, count }: any) => {
      if (id === courseId) setAttendance(count);
    });

    s.on("chatMessage", (msg: any) => {
      if (msg && msg.text && msg.time) setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (s.connected) s.disconnect();
    };
  }, [courseId, router]);

  // Join/Leave Logic
  useEffect(() => {
    const s = socketRef.current;
    if (!s || !session?.user?.id) return;
    // Always join the class room to receive updates
    s.emit("joinClass", { courseId, userId: session.user.id });
    return () => {
      s.emit("leaveClass", { courseId });
    };
  }, [session, courseId, instructorId]);

  // Camera Logic
  useEffect(() => {
    if (camOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: micOn })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setPermissionError(null);
        })
        .catch(err => {
          console.error("AV Error:", err);
          setPermissionError("Could not access camera/microphone. Check permissions.");
          setCamOn(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }, [camOn]);

  const toggleMic = () => setMicOn(!micOn);
  const toggleCam = () => setCamOn(!camOn);

  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) return;
    const s = socketRef.current;
    if (!s || !session?.user?.id) return;
    const payload = { courseId, userId: session.user.id, name: session.user.name || 'User', text };
    s.emit('chatMessage', payload);
    setMessageText('');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(courseId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndClass = () => {
    if (confirm("Are you sure you want to end this live class?")) {
      const s = socketRef.current;
      if (s) s.emit("endClass", { courseId });
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex bg-gray-900 h-[calc(100vh-64px)] overflow-hidden text-white font-sans">

      {/* --------------------
          LEFT SIDE: CHAT (WhatsApp Style)
      -------------------- */}
      <div
        className={`${isChatOpen ? 'w-80 md:w-96' : 'w-0'} bg-[#111b21] border-r border-gray-800 flex flex-col transition-all duration-300 relative overflow-hidden`}
      >
        {/* Chat Header */}
        <div className="h-16 bg-[#202c33] px-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">Live Chat</h3>
              <p className="text-xs text-gray-400">{attendance} participants</p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="md:hidden text-gray-400">
            <ChevronLeft />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg opacity-90 overflow-y-auto p-4 space-y-2 relative">
          <div className="absolute inset-0 bg-[#0b141a]/95 -z-10"></div> {/* Dark overlay for background */}

          {messages.length === 0 && (
            <div className="text-center text-xs text-gray-500 bg-[#202c33] py-2 px-4 rounded-lg inline-block mx-auto mt-4 shadow-sm border border-gray-800">
              Messages are end-to-end encrypted. No one outside this chat, not even WhatsApp, can read or listen to them.
            </div>
          )}

          {messages.map((m, i) => {
            const isMe = m.userId === session?.user?.id;
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`relative px-3 py-1.5 rounded-lg text-sm max-w-[85%] shadow-sm ${isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
                    }`}
                >
                  {!isMe && <p className="text-[10px] font-bold text-orange-400 mb-0.5">{m.name}</p>}
                  <p className="leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                  <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-green-200' : 'text-gray-400'}`}>
                    {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2 flex-shrink-0">
          <input
            suppressHydrationWarning
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message"
            className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 text-sm focus:outline-none placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            className={`p-2 rounded-full transition ${messageText.trim() ? 'text-[#00a884]' : 'text-gray-500'}`}
          >
            <span className="sr-only">Send</span>
            <svg viewBox="0 0 24 24" width="24" height="24" className="">
              <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
            </svg>
          </button>
        </div>
      </div>

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#202c33] p-2 rounded-r-lg shadow-lg z-50 text-gray-400 hover:text-white"
        >
          <ChevronRight />
        </button>
      )}

      {/* --------------------
          RIGHT SIDE: VIDEO STAGE
      -------------------- */}
      <div className="flex-1 flex flex-col bg-black relative">

        {/* TOP HEADER (Meeting Info) */}
        <div className="h-16 bg-gray-900/90 backdrop-blur border-b border-gray-800 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            {isEditingTitle ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                className="bg-transparent text-xl font-bold border-b border-white outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-xl font-bold">{title}</h1>
                {session?.user?.id === instructorId && (
                  <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition">
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
            )}
            <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 flex items-center gap-2">
              ID: {courseId}
              <button onClick={handleCopyId} className="hover:text-white transition">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleCopyId} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
              <Share size={16} />
              Share
            </button>
            <button
              onClick={handleEndClass}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition animate-pulse hover:animate-none"
            >
              <LogOut size={16} />
              End Live
            </button>
          </div>
        </div>

        {/* MAIN VIDEO AREA */}
        <div className="flex-1 flex items-center justify-center relative p-4 bg-[#0c0c0c]">
          {camOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="h-full max-h-[70vh] w-full object-contain rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 gap-4 animate-in fade-in duration-700">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-5xl font-bold text-gray-600 shadow-inner">
                {session?.user?.name?.[0] || "U"}
              </div>
              <p className="text-lg font-light tracking-wide">Camera is off</p>
            </div>
          )}

          {permissionError && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur z-50">
              {permissionError}
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS (Floating) */}
        <div className="h-20 flex items-center justify-center gap-6 pb-6">
          <button onClick={toggleMic} className={`p-4 rounded-full transition-all duration-300 shadow-xl ${micOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button onClick={toggleCam} className={`p-4 rounded-full transition-all duration-300 shadow-xl ${camOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
            {camOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button onClick={() => { }} className="p-4 rounded-full bg-gray-800 text-green-400 hover:bg-gray-700 hover:text-green-300 transition-all shadow-xl">
            <Share size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}
