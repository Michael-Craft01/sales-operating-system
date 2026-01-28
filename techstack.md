# PWA Sales Operating System – Tech Stack & Architecture

## Overview

This document details the **technical architecture** and **technology stack** for building a **desktop-first PWA Sales Operating System**.  
It focuses on a **robust, cost-effective, and maintainable** stack with web push notifications and headless lead processing.

---

## 1. Frontend (PWA)

### Technologies
- **Next.js (React + SSR/SSG)**  
  - Framework for building the PWA
  - Supports server-side rendering and static builds
  - Optimized performance and routing
- **TypeScript**  
  - Type safety, reduces bugs, consistent across full stack
- **Tailwind CSS**  
  - Fast, utility-first styling
  - Easily maintainable and responsive
- **Framer Motion**  
  - Smooth animations for lead board and UI interactions
- **Web Push API & Service Worker**  
  - Real-time notifications for new leads, follow-ups, scheduled calls
- **IndexedDB / LocalStorage (optional offline cache)**  
  - Store recent leads and last actions offline
- **React Query or SWR**  
  - Efficient data fetching and cache management

### Responsibilities
- Render lead operations board
- Lead detail workspace
- Handle web push notifications
- Trigger actions (Contact Lead, Schedule Call)
- Minimal business logic (delegated to backend)

---

## 2. Backend (API / Lead Orchestrator)

### Technologies
- **Node.js + TypeScript**  
  - Single language across stack
  - Fast, async-friendly for handling multiple leads and AI requests
- **Fastify / Express**  
  - Lightweight API framework
  - Handles incoming webhooks and frontend API requests
- **AI Integration (Gemini 3.27B / open-source alternatives)**  
  - Generate messages, proposals, follow-ups
  - Requests made via API from backend
- **Webhooks**  
  - Receive leads from scraper pipeline
  - Handle AI outputs for generated messages

### Responsibilities
- Lead ingestion
- Event processing (status updates, notifications)
- AI requests orchestration
- Push notifications trigger
- Database interface

---

## 3. Database (Single Source of Truth)

### Options
- **Supabase (PostgreSQL)**  
  - Hosted, free tier for small usage
  - Real-time database support (optional)
- **Alternative:** PostgreSQL on AWS RDS / VPS  
  - Full control, flexible scaling

### Responsibilities
- Store leads and metadata
- Track sales pipeline status
- Store AI-generated documents and message history
- Track events for notifications

### Schema Highlights
- `leads` table: name, contact, industry, source, message
- `lead_status_history`: lead_id, status, timestamp
- `notifications`: type, lead_id, sent_at, read
- `documents`: lead_id, AI-generated doc URLs

---

## 4. Notifications

### Web Push
- **Service Worker + Push API**
- Triggered from backend upon events:
  - New lead
  - Lead status change
  - Scheduled call reminder
- Actionable notifications → open lead detail in PWA

---

## 5. Integrations

- **Google Calendar API**
  - Schedule calls, track upcoming events
  - Link events to lead records
- **Google Maps API**
  - Display business locations in lead detail
- **WhatsApp (MVP: deep links)**
  - Contact lead through pre-filled WhatsApp messages
  - Future upgrade: WhatsApp Cloud API for full CRM integration

---

## 6. Hosting / Deployment

- **Railway / VPS (Alavps / AWS EC2)**
  - Dockerized backend + frontend
  - PWA served via static hosting or Node server
- **Docker**
  - Containerize backend + frontend
  - Simplifies deployment and future scaling

### Deployment Notes
- Backend exposes API routes for leads, notifications, AI requests
- Frontend consumes API
- Service Worker handles notifications
- Scheduled tasks (cron jobs or serverless scheduler) trigger lead refreshes every 6 hours

---

## 7. AI Orchestration

- **Gemini 3.27B (free tier)**
  - Generate outreach messages
  - Proposals and follow-ups
- **TypeScript wrapper / SDK**
  - Unified request interface
  - Handles retries, batching
- **Event-driven**
  - New lead → AI generates message → stored in DB → triggers notification

---

## 8. Security & Authentication

- **JWT Tokens** or Supabase Auth
- HTTPS only (TLS)
- Role-based permissions (future multi-user)
- Lead data never exposed publicly
- Push notifications authenticated

---

## 9. Architecture Diagram (Conceptual)


---

## 10. Key Advantages of This Stack

- **TypeScript all around** → fewer bugs, same language across frontend/backend
- **PWA** → desktop-first, offline-capable, push notifications
- **Dockerized** → consistent environment, portable
- **Free-tier friendly** → Supabase + Railway / VPS
- **AI-assisted workflow** → no human typing unless needed
- **Scalable** → architecture supports more leads, multi-user future

---

## 11. Next Steps (Technical)

1. Set up database schema and tables
2. Scaffold backend API in TypeScript
3. Create PWA frontend skeleton (Next.js + Tailwind)
4. Implement lead ingestion + webhook handling
5. Implement web push notification system
6. Integrate AI (Gemini) for messages
7. Add lead detail workspace and contact actions
8. Schedule automated lead refresh cron jobs

---

