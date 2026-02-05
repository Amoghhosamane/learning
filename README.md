# Skill Orbit

Skill Orbit is a full-stack learning platform built using Next.js and MongoDB.  
It supports authenticated users, structured learning paths, and dynamic course content.

Tech: Next.js, TypeScript, MongoDB Atlas, NextAuth, Vercel

Key Features:
- User authentication and session management
- Dynamic course and video routes
- API routes with server-side rendering
- Cloud deployment with environment-based configuration

Deployed on Vercel with MongoDB Atlas as the production database.

## Project Architecture

- App Router used for routing and layouts
- API routes implemented under `app/api`
- Authentication handled via NextAuth
- MongoDB connection managed through a centralized utility
- Environment variables used for secrets and database configuration

Structure:
- app/        → Pages, layouts, and routes
- app/api/    → Backend API endpoints
- lib/        → Database and utility functions
- models/     → MongoDB models

## Real-time Live Classes (Socket.IO)

This project includes a lightweight Socket.IO real-time layer for "Live Classes".

Quick setup:

1. Install dependencies:

   npm install socket.io socket.io-client

2. The live socket endpoint is initialized on demand when a client calls `/api/socket` (the live page does this automatically).

3. Start a live session (instructor): POST `/api/live/start` { courseId }
4. End a live session (instructor): POST `/api/live/end` { courseId }

Added files:
- `lib/socket.ts` — Socket.IO initialization + in-memory live state
- `lib/models/LiveSession.ts` — schema to persist completed sessions
- `app/api/socket/route.ts` — socket init endpoint
- `app/api/live/start/route.ts` — start the live class (instructor only)
- `app/api/live/end/route.ts` — end the live class and persist session
- `app/live/[courseId]/page.tsx` + `LiveClient.tsx` — UI and real-time client

Notes:
- The implementation uses an in-memory map (Map) to track live sessions; completed sessions are persisted to MongoDB on end.
- The client automatically calls `/api/socket` to ensure the server socket is initialized.
- Ensure `MONGO_URI` and `NEXTAUTH_SECRET` are set in your environment when testing.

Environment (.env.local) sample:

```
# Copy to .env.local and fill values (do NOT commit .env.local)
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillorbit?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```


## API Routes

- GET /api/courses  
  Fetches all available courses

- GET /api/courses/[id]  
  Fetches a specific course by ID

- POST /api/auth/[...nextauth]  
  Handles authentication using NextAuth

All API routes are implemented using Next.js App Router and server functions.

Clone the repo: git clone https://github.com/Amoghhosamane/learning
