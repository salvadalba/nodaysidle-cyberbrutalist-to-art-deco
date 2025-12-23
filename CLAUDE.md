# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FabrizioCorona** is the codename for the "Gilded Glitch Portfolio Platform" - an avant-garde portfolio website that transforms from cyber-brutalist to Art Deco aesthetics through scroll-based animations. The project positions designers as artists who bring order to digital chaos.

**Current State:** This is a **planning/specification folder only**. No implementation code exists yet. The actual code needs to be created following the specifications in PRD.md, ARD.md, TRD.md, and TASK.MD.

## Quick Start

Since this project has no implementation yet, start by following the setup goals in AGENT.md:

1. **Initialize React project with Vite**
   ```bash
   npm create vite@latest . -- --template react
   npm install
   ```

2. **Install Tailwind CSS** (parent directory already has v4.1.18)
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Set up folder structure**
   ```
   src/
   ├── components/     # React components
   ├── hooks/          # Custom hooks (useScrollPosition, useCaseStudy)
   ├── services/       # API clients (Contact, Analytics)
   ├── utils/          # Helper functions
   ├── contexts/       # React Context (AnimationStateManager)
   └── styles/         # CSS and Tailwind imports
   ```

4. **Validate each task** with: `npm run build`

## Tech Stack

- **Frontend:** React with Vite, Tailwind CSS v4.1.18, GSAP for animations
- **State:** React Context and hooks
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (for contact submissions and analytics)
- **Hosting:** Vercel/Netlify (frontend), Railway/Heroku (backend)

## Architecture Overview

The application is a **client-heavy SPA** with minimal backend services:

```
Frontend (React/Vite)
    ├── Animation Engine
    │   ├── useScrollPosition hook
    │   ├── AnimationStateManager context
    │   └── Theme transition system (cyber-brutalist → Art Deco)
    ├── Case Study System
    │   ├── CaseStudyViewer component
    │   ├── Media Loader
    │   └── useCaseStudy hook
    └── Services Layer
        ├── Contact Service (form validation, API calls)
        ├── Analytics Service (event tracking)
        └── API Client utility

Backend (Node/Express)
    ├── POST /api/contact (contact form submissions)
    └── POST /api/analytics (event tracking)
```

## Key Files Reference

| File | Purpose |
|------|---------|
| PRD.md | Product vision, features, success metrics |
| ARD.md | Frontend/backend architecture, infrastructure |
| TRD.md | API contracts, modules, data models, testing strategy |
| TASK.MD | Complete task breakdown with epics and dependencies |
| AGENT.md | Setup goals with validation criteria |

## Development Workflow

Follow TASK.MD epics in order:

1. **Foundation Setup** - React/Vite project, Node.js backend, PostgreSQL schema
2. **Core Frontend** - Layout components, scroll animations, theme transitions, custom cursor
3. **Case Study System** - Interactive viewer, media loading, navigation
4. **Backend APIs** - Contact and analytics endpoints with security
5. **Frontend Services** - Contact and Analytics services, API client
6. **Contact Form** - Form component with validation
7. **Performance** - Debounced scroll handlers, service worker, monitoring
8. **Testing** - Unit, integration, and E2E tests
9. **Deployment** - Production setup for frontend and backend

Each task in TASK.MD includes acceptance criteria and dependencies.

## Important Patterns

- **Animation performance:** Use CSS transforms, debounced scroll handlers, target 60fps
- **Security:** Rate limiting on public endpoints, SQL injection prevention, CORS configuration
- **Validation:** Client-side with server-side fallback for all forms
- **Error handling:** User-friendly messages, retry mechanisms for network failures

## Repository Context

This is part of a multi-project monorepo at `/Volumes/omarchyuser/projekti/`. The parent directory has shared Tailwind CSS dependencies already installed. Refer to the root AGENTS.md for universal conventions (commit format, branch strategy, etc.).

## API Contracts (from TRD.md)

**POST /api/contact**
- Request: `{ "name": "string", "email": "string", "message": "string" }`
- Response: `{ "success": "boolean", "message": "string" }`
- Errors: 400 (invalid email), 429 (rate limit), 500 (server error)

**POST /api/analytics**
- Request: `{ "event": "string", "page": "string", "timestamp": "number" }`
- Response: `{ "success": "boolean" }`
- Errors: 429 (rate limit), 500 (server error)
