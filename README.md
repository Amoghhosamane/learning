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

## API Routes

- GET /api/courses  
  Fetches all available courses

- GET /api/courses/[id]  
  Fetches a specific course by ID

- POST /api/auth/[...nextauth]  
  Handles authentication using NextAuth

All API routes are implemented using Next.js App Router and server functions.

Clone the repo: git clone https://github.com/Amoghhosamane/learning
