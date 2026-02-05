import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import dbConnect from "./mongodb";
import LiveSessionModel from "./models/LiveSession";

type LiveClassState = {
  courseId: string;
  instructorId: string;
  startTime: Date;
  attendees: Set<string>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __io: IOServer | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __liveClasses: Map<string, LiveClassState> | undefined;
}

const ensureState = () => {
  if (!global.__liveClasses) global.__liveClasses = new Map();
  return global.__liveClasses as Map<string, LiveClassState>;
};

export function initSocket(server?: HTTPServer) {
  if (global.__io) return global.__io;

  const io = server
    ? new IOServer(server, { path: "/api/socket", cors: { origin: true } })
    : new IOServer({ path: "/api/socket", cors: { origin: true } });

  global.__io = io;
  ensureState();

  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("joinClass", ({ courseId, userId }: { courseId: string; userId: string }) => {
      try {
        const map = ensureState();
        const state = map.get(courseId);
        if (!state) return socket.emit("error", "Class not live");

        // add to attendees set
        state.attendees.add(userId);
        socket.join(courseId);
        // map socket to user
        (socket as any).userId = userId;
        (socket as any).courseId = courseId;

        const count = state.attendees.size;
        io.to(courseId).emit("attendanceUpdate", { courseId, count });
      } catch (err) {
        console.error("joinClass error", err);
      }
    });

    socket.on("leaveClass", () => {
      const userId = (socket as any).userId;
      const courseId = (socket as any).courseId;
      if (!courseId || !userId) return;
      const map = ensureState();
      const state = map.get(courseId);
      if (!state) return;
      state.attendees.delete(userId);
      socket.leave(courseId);
      io.to(courseId).emit("attendanceUpdate", { courseId, count: state.attendees.size });
    });

    // Chat messages within a live class
    socket.on("chatMessage", ({ courseId, userId, name, text }: { courseId: string; userId: string; name?: string; text: string }) => {
      try {
        const msg = { userId, name: name || "Unknown", text, time: new Date().toISOString() };
        io.to(courseId).emit("chatMessage", msg);
      } catch (err) {
        console.error("chatMessage error", err);
      }
    });

    socket.on("endClass", async ({ courseId }: { courseId: string }) => {
      // Instructor may emit this
      const map = ensureState();
      const state = map.get(courseId);
      if (!state) return;

      // persist
      try {
        await dbConnect();
        await LiveSessionModel.create({
          courseId,
          instructorId: state.instructorId,
          startTime: state.startTime,
          endTime: new Date(),
          attendees: Array.from(state.attendees),
        });
      } catch (err) {
        console.error("Failed to save live session", err);
      }

      io.to(courseId).emit("classEnded", { courseId });
      map.delete(courseId);
    });

    socket.on("disconnect", () => {
      const userId = (socket as any).userId;
      const courseId = (socket as any).courseId;
      if (!courseId || !userId) return;
      const map = ensureState();
      const state = map.get(courseId);
      if (!state) return;
      state.attendees.delete(userId);
      io.to(courseId).emit("attendanceUpdate", { courseId, count: state.attendees.size });
    });
  });

  return io;
}

export function getIO() {
  return global.__io;
}

export function startLive(courseId: string, instructorId: string) {
  const map = ensureState();
  if (map.has(courseId)) return map.get(courseId);

  const newState: LiveClassState = {
    courseId,
    instructorId,
    startTime: new Date(),
    attendees: new Set(),
  };

  map.set(courseId, newState);
  const io = getIO();
  if (io) io.to(courseId).emit("classStarted", { courseId });
  return newState;
}

export async function endLive(courseId: string) {
  const map = ensureState();
  const state = map.get(courseId);
  if (!state) return null;

  try {
    await dbConnect();
    await LiveSessionModel.create({
      courseId,
      instructorId: state.instructorId,
      startTime: state.startTime,
      endTime: new Date(),
      attendees: Array.from(state.attendees),
    });
  } catch (err) {
    console.error("endLive persist error", err);
  }

  map.delete(courseId);
  const io = getIO();
  if (io) io.to(courseId).emit("classEnded", { courseId });
  return true;
}

export function getLiveState(courseId: string) {
  const map = ensureState();
  return map.get(courseId) || null;
}
