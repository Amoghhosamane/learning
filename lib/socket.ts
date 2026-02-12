import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import dbConnect from "./mongodb";
import LiveSessionModel from "./models/LiveSession";

// Structure for tracking a live class
type LiveClassState = {
  courseId: string;          // Course identifier
  instructorId: string;      // Instructor running the class
  startTime: Date;           // When class started
  attendees: Set<string>;    // Unique attendees (userIds)
};

declare global {
  var __io: IOServer | undefined;                // Singleton Socket.IO instance
  var __liveClasses: Map<string, LiveClassState> | undefined; // Global live class store
}

// Ensure live class map exists
const ensureState = () => {
  if (!global.__liveClasses) global.__liveClasses = new Map();
  return global.__liveClasses as Map<string, LiveClassState>;
};

export function initSocket(server?: HTTPServer) {
  // Reuse existing Socket.IO server if already created
  if (global.__io) return global.__io;

  // Initialize Socket.IO server
  global.__io = new IOServer(server, {
    path: "/api/socket",     // Custom socket path
    addTrailingSlash: false, // Prevent trailing slash issues
    cors: { origin: "*" },   // Allow all origins (dev-friendly)
  });

  ensureState(); // Initialize global live state
  const io = global.__io;

  // Handle new socket connections
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // User joins a live class
    socket.on("joinClass", ({ courseId, userId }) => {
      try {
        const map = ensureState();
        const state = map.get(courseId);

        if (!state) return socket.emit("error", "Class not live"); // Reject if class inactive

        state.attendees.add(userId); // Track attendee
        socket.join(courseId);       // Join socket room

        (socket as any).userId = userId;     // Attach userId to socket
        (socket as any).courseId = courseId; // Attach courseId to socket

        const count = state.attendees.size;  // Calculate attendee count
        io.to(courseId).emit("attendanceUpdate", { courseId, count }); // Notify room
      } catch (err) {
        console.error("joinClass error", err);
      }
    });

    // User leaves class manually
    socket.on("leaveClass", () => {
      const userId = (socket as any).userId;
      const courseId = (socket as any).courseId;

      if (!courseId || !userId) return; // Ignore if missing data

      const map = ensureState();
      const state = map.get(courseId);
      if (!state) return;

      state.attendees.delete(userId); // Remove attendee
      socket.leave(courseId);         // Leave room

      io.to(courseId).emit("attendanceUpdate", {
        courseId,
        count: state.attendees.size,  // Broadcast new count
      });
    });

    // Chat message inside class
    socket.on("chatMessage", ({ courseId, userId, name, text }) => {
      try {
        const msg = {
          userId,
          name: name || "Unknown", // Default name fallback
          text,
          time: new Date().toISOString(), // Timestamp
        };

        io.to(courseId).emit("chatMessage", msg); // Broadcast to class room
      } catch (err) {
        console.error("chatMessage error", err);
      }
    });

    // Instructor ends class via socket
    socket.on("endClass", async ({ courseId }) => {
      const map = ensureState();
      const state = map.get(courseId);
      if (!state) return;

      try {
        await dbConnect(); // Connect DB
        await LiveSessionModel.create({
          courseId,
          instructorId: state.instructorId,
          startTime: state.startTime,
          endTime: new Date(),
          attendees: Array.from(state.attendees), // Save attendees list
        });
      } catch (err) {
        console.error("Failed to save live session", err);
      }

      io.to(courseId).emit("classEnded", { courseId }); // Notify clients
      map.delete(courseId); // Remove from memory
    });

    // Handle unexpected disconnect
    socket.on("disconnect", () => {
      const userId = (socket as any).userId;
      const courseId = (socket as any).courseId;

      if (!courseId || !userId) return;

      const map = ensureState();
      const state = map.get(courseId);
      if (!state) return;

      state.attendees.delete(userId); // Cleanup attendee
      io.to(courseId).emit("attendanceUpdate", {
        courseId,
        count: state.attendees.size, // Update count
      });
    });
  });

  return io; // Return Socket.IO instance
}

// Get active Socket.IO instance
export function getIO() {
  return global.__io;
}

// Start a live class
export function startLive(courseId: string, instructorId: string) {
  const map = ensureState();

  if (map.has(courseId)) return map.get(courseId); // Prevent duplicate sessions

  const newState: LiveClassState = {
    courseId,
    instructorId,
    startTime: new Date(), // Record start time
    attendees: new Set(),  // Initialize empty attendee set
  };

  map.set(courseId, newState); // Store state

  const io = getIO();
  if (io) io.to(courseId).emit("classStarted", { courseId }); // Notify clients

  return newState;
}

// End a live class programmatically
export async function endLive(courseId: string) {
  const map = ensureState();
  const state = map.get(courseId);
  if (!state) return null;

  try {
    await dbConnect(); // Connect DB
    await LiveSessionModel.create({
      courseId,
      instructorId: state.instructorId,
      startTime: state.startTime,
      endTime: new Date(),
      attendees: Array.from(state.attendees), // Persist attendees
    });
  } catch (err) {
    console.error("endLive persist error", err);
  }

  map.delete(courseId); // Remove state

  const io = getIO();
  if (io) io.to(courseId).emit("classEnded", { courseId }); // Notify clients

  return true;
}

// Get current live class state
export function getLiveState(courseId: string) {
  const map = ensureState();
  return map.get(courseId) || null; // Return state or null
}
