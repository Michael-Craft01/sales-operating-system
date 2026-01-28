# PWA Sales Operating System – Features Specification

## Overview

This application is a **desktop-first Progressive Web App (PWA)** designed to operate as a **personal sales command center**.

It ingests automated leads from external intelligence systems, enforces a structured sales process, assists execution with AI-generated artifacts, and keeps the operator in flow via real-time web push notifications.

This is not a generic CRM.
It is a **Sales Operating System** optimized for a solo operator running high-volume outbound outreach.

---

## Core Principles

- Desktop-first experience
- Human-in-the-loop sales execution
- Automation assists, never impersonates
- Clear sales stages with enforced transitions
- One source of truth: the database
- Notifications are actionable, not noisy

---

## 1. Progressive Web App (PWA) Capabilities

### Installation & App Behavior
- Installable on desktop (Windows, macOS, Linux)
- Runs in standalone window (no browser chrome)
- App icon and name registered via Web App Manifest
- Fast cold start and persistent session

### Offline Behavior
- Read-only access when offline
- Cached leads and recent activity
- Clear offline state indicator
- Sync resumes automatically when online

---

## 2. Lead Ingestion & Management

### Automated Lead Intake
- Leads are received via backend API/webhook
- No manual lead entry required
- Each lead includes:
  - Business name
  - Industry
  - Location
  - Contact method(s)
  - Generated outreach message
  - Source metadata
  - Timestamp

### Lead Storage
- All leads stored in a centralized database
- Each lead has a unique identifier
- Duplicate detection (basic, non-destructive)

---

## 3. Sales Pipeline & Status System

### Pipeline Stages
- New
- Qualified
- Contacted
- Engaged
- Scheduled
- Closed – Won
- Closed – Lost

### Stage Rules
- Stages follow a defined progression
- Transitions are explicit (manual or event-driven)
- Each stage unlocks specific actions and AI tools
- Stage changes are timestamped and logged

---

## 4. Lead Operations Board (Primary View)

### Purpose
To answer one question:
> “What should I act on right now?”

### Displayed Information
- Business name
- Industry
- Location (Google Maps link)
- Contact method availability
- Message preview
- Current sales stage
- Last action timestamp

### Controls
- Filter by stage
- Sort by recency or priority
- Quick action buttons (Contact, Schedule, Update Status)

---

## 5. Lead Detail Workspace

Each lead has a dedicated execution workspace.

### Business Context
- Full business details
- Industry classification
- Google Maps embed
- Internal notes

### Outreach Panel
- Generated outreach message (editable)
- WhatsApp contact button
- Email contact button
- Contact history log

### Status & Activity
- Current pipeline stage
- Timeline of actions taken
- Internal comments and annotations

---

## 6. AI-Assisted Sales Execution

AI is used as a **task engine**, not a chatbot.

### AI Capabilities (Stage-Based)
- Rewrite or optimize outreach messages
- Generate follow-up messages
- Create proposals or pitch documents
- Draft agreements or invoices
- Summarize lead context and interactions

### AI Constraints
- AI outputs are editable
- No automatic sending on behalf of the user
- Outputs are tied to a specific lead and stage

---

## 7. Contact & Communication Handling

### WhatsApp (MVP Phase)
- Click-to-open WhatsApp or WhatsApp Business
- Pre-filled message content
- Manual send (human-in-the-loop)
- CRM tracks contact attempt internally

### Email
- Mailto-based outreach
- Subject and body pre-filled
- CRM logs contact attempt

---

## 8. Scheduling & Calendar Integration

### Google Calendar Integration
- Schedule calls directly from a lead
- Events linked to the lead record
- View upcoming and past calls per lead

### Calendar Awareness
- Call reminders
- Upcoming schedule overview
- Lead status auto-updated when a call is scheduled

---

## 9. Web Push Notifications

### Notification Triggers
- New lead received
- Lead becomes qualified
- Follow-up due
- Scheduled call reminder
- Key stage transitions

### Notification Behavior
- Clickable notifications
- Deep-link directly to the relevant lead
- No generic or non-actionable alerts

---

## 10. Metrics & Sales Intelligence

### Core Metrics
- Leads received per day
- Leads contacted
- Replies received
- Calls scheduled
- Deals closed
- Revenue generated
- Revenue in pipeline

### Philosophy
- No vanity metrics
- Metrics answer operational questions
- Metrics reflect execution, not activity for activity’s sake

---

## 11. Security & Access

### Access Model
- Single-user or controlled access
- Authentication required
- No public access to lead data

### Data Ownership
- All data owned by the operator
- Exportable lead and sales data
- No platform lock-in

---

## 12. Non-Goals (Explicitly Out of Scope)

- No automated WhatsApp impersonation
- No browser automation hacks
- No multi-user team management (initially)
- No marketing automation campaigns
- No app store distribution

---

## Summary

This PWA Sales Operating System is designed to:
- Turn automated lead intelligence into structured sales execution
- Keep the operator focused, fast, and in control
- Scale output without sacrificing safety or clarity

It is a tool for **doing the work**, not admiring dashboards.
