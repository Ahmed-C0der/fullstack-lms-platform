# LMS — Full System Design

> A complete reference guide for building a Learning Management System from schema to deployment.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [API Design](#5-api-design)
6. [Authentication System](#6-authentication-system)
7. [Video & Progress System](#7-video--progress-system)
8. [Certificate System](#8-certificate-system)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Role & Permission System](#10-role--permission-system)
11. [File Upload System](#11-file-upload-system)
12. [Build Order — What to Build First](#12-build-order--what-to-build-first)

---

## 1. Project Overview

### What We Are Building

A full-stack Learning Management System where:

- **Students** enroll in courses, watch video lessons, take notes, track progress, and earn certificates
- **Instructors** create and publish courses, upload lessons, attach files, and monitor student progress
- **Admins** manage users, courses, and platform settings

### Core Features

| Feature | Description |
|---|---|
| Course enrollment | Students enroll, system creates an Enrollment record |
| Video progress tracking | Heartbeat every 10s updates `watchedSeconds` |
| Auto-completion | Lesson marked complete at 90% watched |
| Course progress | Recomputed from completed lessons on every update |
| Certificates | Auto-generated when `progressPercent` hits 100% |
| Time-stamped notes | Notes linked to a video timestamp for instant replay |
| Role-based access | `student` / `instructor` / `admin` with different permissions |
| File attachments | Per-lesson downloadable files stored in cloud storage |

---

## 2. Tech Stack

### Recommended Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js (React) | File-based routing, SSR for SEO, API routes built-in |
| Styling | Tailwind CSS | Utility-first, fast to build |
| Backend | Node.js + Express (or Next.js API routes) | JavaScript end-to-end |
| ORM | Prisma | Type-safe DB queries, handles upsert cleanly |
| Database | PostgreSQL | Relational, handles all our join tables perfectly |
| Auth | JWT + bcrypt | Stateless auth, easy to implement |
| File Storage | Cloudinary or AWS S3 | Video and file uploads |
| Video Player | Video.js or custom HTML5 | Full control over playback events |

### Why PostgreSQL Over MongoDB

Our data is **relational by nature**. Every piece of data references another:

```
LessonProgress → User + Lesson → Course
Certificate    → User + Course
Note           → User + Lesson
```

MongoDB works well for unstructured data. Our data has clear relationships and needs JOIN queries (e.g. "get all completed lessons for user X across all enrolled courses"). PostgreSQL handles this naturally and efficiently.

---

## 3. Folder Structure

```
lms/
├── frontend/                     # Next.js app
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Student dashboard
│   │   ├── courses/
│   │   │   ├── page.tsx          # Course listing
│   │   │   ├── [courseId]/
│   │   │   │   ├── page.tsx      # Course detail + enroll
│   │   │   │   └── lessons/
│   │   │   │       └── [lessonId]/page.tsx  # Video player page
│   │   ├── instructor/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── courses/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [courseId]/edit/page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   ├── components/
│   │   ├── VideoPlayer.tsx       # Heartbeat logic lives here
│   │   ├── ProgressBar.tsx
│   │   ├── NotesSidebar.tsx
│   │   └── CourseCard.tsx
│   └── lib/
│       ├── api.ts                # Fetch wrapper
│       └── auth.ts               # Token helpers
│
├── backend/                      # Express API (or Next.js /api)
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── courses.routes.ts
│   │   ├── lessons.routes.ts
│   │   ├── progress.routes.ts
│   │   ├── notes.routes.ts
│   │   ├── enrollments.routes.ts
│   │   └── certificates.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── courses.controller.ts
│   │   ├── lessons.controller.ts
│   │   ├── progress.controller.ts
│   │   └── certificates.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # Verify JWT
│   │   └── role.middleware.ts    # Check role
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── certificates.ts      # PDF generation logic
│   └── app.ts
│
└── prisma/
    └── schema.prisma             # Single source of truth for DB
```

---

## 4. Database Schema

### Prisma Schema (Full)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  userName    String
  avatarUrl   String?
  role        Role     @default(STUDENT)
  createdAt   DateTime @default(now())
  // asseted tabels , data is changing from user to another
  enrollments     Enrollment[]
  lessonProgress  LessonProgress[]
  notes           Note[]
  certificates    Certificate[]
  courses         Course[]         // courses this user created (instructor)
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

// ─────────────────────────────────────────
// COURSE
// ─────────────────────────────────────────
model Course {
  id           String   @id @default(uuid())
  title        String
  category     String
  description  String
  thumbnailUrl String?
  level        Level    @default(BEGINNER)
  isPublished  Boolean  @default(false)
  createdAt    DateTime @default(now())

  instructorId String
  instructor   User     @relation(fields: [instructorId], references: [id])

  lessons      Lesson[]
  enrollments  Enrollment[]
  certificates Certificate[]
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

// ─────────────────────────────────────────
// LESSON
// ─────────────────────────────────────────
model Lesson {
  id              String   @id @default(uuid())
  courseId        String
  title           String
  category        String?
  overview        String?
  videoUrl        String?
  durationSeconds Int      @default(0)
  orderIndex      Int
  isPublished     Boolean  @default(false)

  course          Course           @relation(fields: [courseId], references: [id])
  lessonProgress  LessonProgress[]
  notes           Note[]
  attachments     Attachment[]
}

// ─────────────────────────────────────────
// ENROLLMENT  (User <-> Course join table)
// ─────────────────────────────────────────
model Enrollment {
  id              String    @id @default(uuid())
  userId          String
  courseId        String
  progressPercent Float     @default(0)
  enrolledAt      DateTime  @default(now())
  completedAt     DateTime?
  lastAccessedAt  DateTime?

  user   User   @relation(fields: [userId], references: [id])
  course Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])  // a user can only enroll once per course
}

// ─────────────────────────────────────────
// LESSON PROGRESS  (User <-> Lesson join table)
// ─────────────────────────────────────────
model LessonProgress {
  id             String    @id @default(uuid())
  userId         String
  lessonId       String
  watchedSeconds Int       @default(0)
  isCompleted    Boolean   @default(false)
  lastWatchedAt  DateTime?

  user   User   @relation(fields: [userId], references: [id])
  lesson Lesson @relation(fields: [lessonId], references: [id])
  // user have many lessons , lesson have many user so we make sure that don't repeat the user for the same user
  @@unique([userId, lessonId])  // one progress record per user per lesson
}

// ─────────────────────────────────────────
// NOTE
// ─────────────────────────────────────────
model Note {
  id             String   @id @default(uuid())
  userId         String
  lessonId       String
  content        String
  videoTimestamp Int      @default(0)  // seconds into video when note was written
  createdAt      DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  lesson Lesson @relation(fields: [lessonId], references: [id])
}

// ─────────────────────────────────────────
// ATTACHMENT
// ─────────────────────────────────────────
model Attachment {
  id       String @id @default(uuid())
  lessonId String
  fileUrl  String
  fileName String
  fileType String  // "pdf", "zip", "docx", etc.

  lesson Lesson @relation(fields: [lessonId], references: [id])
}

// ─────────────────────────────────────────
// CERTIFICATE
// ─────────────────────────────────────────
model Certificate {
  id             String   @id @default(uuid())
  userId         String
  courseId       String
  certificateUrl String
  issuedAt       DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  course Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])  // one certificate per user per course
}
```

### Entity Relationships Summary

```
User ──< Enrollment >── Course
User ──< LessonProgress >── Lesson
User ──< Note >── Lesson
User ──< Certificate >── Course
Course ──< Lesson
Lesson ──< Attachment
```

`──<` = one-to-many  
`>──<` = many-to-many (resolved via join table)

---

## 5. API Design

### Base URL

```
/api/v1
```

### Auth Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Create new account | Public |
| POST | `/auth/login` | Login, returns JWT | Public |
| GET | `/auth/me` | Get current user | Auth |

### Course Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/courses` | List all published courses | Public |
| GET | `/courses/:id` | Get course detail + lessons | Public |
| POST | `/courses` | Create new course | Instructor |
| PATCH | `/courses/:id` | Update course | Instructor (owner) |
| DELETE | `/courses/:id` | Delete course | Instructor (owner) |
| PATCH | `/courses/:id/publish` | Toggle isPublished | Instructor (owner) |

### Lesson Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/courses/:courseId/lessons` | Get all lessons in course | Auth |
| GET | `/courses/:courseId/lessons/:lessonId` | Get lesson detail | Auth |
| POST | `/courses/:courseId/lessons` | Create lesson | Instructor |
| PATCH | `/lessons/:id` | Update lesson | Instructor |
| DELETE | `/lessons/:id` | Delete lesson | Instructor |
| PATCH | `/lessons/:id/reorder` | Update orderIndex | Instructor |

### Enrollment Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/enrollments` | Enroll in a course | Student |
| GET | `/enrollments/my` | Get all my enrollments | Student |Instructor (see his created Courses) |Admin (see all enrollments)
| GET | `/enrollments/:courseId` | Get my enrollment for one course | Student |Instructor (see his created Courses) |Admin (see all enrollments)

### Progress Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| PATCH | `/lessons/:id/progress` | Update watchedSeconds (heartbeat) | Student |
| GET | `/courses/:id/progress` | Get my full progress for a course | Student (to present a percent of course completion)| 

### Notes Routes
// add in req.body {content , videoTimestamp}
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/lessons/:id/notes` | Get all my notes for a lesson | Student |
| POST | `/lessons/:id/notes` | Create a note | Student |
| PATCH | `/notes/:id` | Edit a note | Student (owner) |
| DELETE | `/notes/:id` | Delete a note | Student (owner) |

### Certificate Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/certificates/my` | Get all my certificates | Student |
| GET | `/certificates/:id` | Get one certificate (public share link) | Public |

---

## 6. Authentication System

### How JWT Auth Works

```
1. User sends email + password to POST /auth/login
2. Backend checks password with bcrypt.compare()
3. If valid → backend signs a JWT with { userId, role }
4. Frontend stores token in localStorage (or httpOnly cookie)
5. Every request sends: Authorization: Bearer <token>
6. auth.middleware.ts verifies token and attaches user to req.user
```

### Auth Middleware

```typescript
// middleware/auth.middleware.ts

import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Role Middleware

```typescript
// middleware/role.middleware.ts

export const requireRole = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Usage in routes:
router.post('/courses', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), createCourse);
```

---

## 7. Video & Progress System

### The Heartbeat Flow

```
Frontend (every 10s)
  └─ PATCH /lessons/:id/progress { watchedSeconds: 47 }
      └─ Backend receives request
          ├─ upsert LessonProgress (update if exists, create if not)
          ├─ check: watchedSeconds >= lesson.durationSeconds * 0.9 ?
          │   └─ if yes AND not already completed:
          │       ├─ set isCompleted = true
          │       └─ call recalculateCourseProgress()
          │           ├─ count completed lessons in course
          │           ├─ update Enrollment.progressPercent
          │           └─ if progressPercent == 100:
          │               ├─ set Enrollment.completedAt = now()
          │               └─ trigger generateCertificate()
          └─ return { ok: true }
```

### Frontend — VideoPlayer Component

```typescript
// components/VideoPlayer.tsx

'use client';
import { useEffect, useRef } from 'react';

interface Props {
  lessonId: string;
  videoUrl: string;
}

export default function VideoPlayer({ lessonId, videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const sendHeartbeat = async (seconds: number) => {
    await fetch(`/api/v1/lessons/${lessonId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ watchedSeconds: Math.floor(seconds) }),
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      intervalRef.current = setInterval(() => {
        sendHeartbeat(video.currentTime);
      }, 10000); // every 10 seconds
    };

    const onPause = () => clearInterval(intervalRef.current);
    const onEnded = () => {
      clearInterval(intervalRef.current);
      sendHeartbeat(video.duration); // send final position on end
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      clearInterval(intervalRef.current);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, [lessonId]);

  return <video ref={videoRef} src={videoUrl} controls className="w-full rounded-lg" />;
}
```

### Backend — Progress Controller

```typescript
// controllers/progress.controller.ts

import prisma from '../lib/prisma';

export const updateProgress = async (req, res) => {
  const { lessonId } = req.params;
  const { watchedSeconds } = req.body;
  const userId = req.user.userId;

  // 1. Get the lesson to know its total duration
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  // 2. Upsert the progress record
  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { watchedSeconds, lastWatchedAt: new Date() },
    create: { userId, lessonId, watchedSeconds, lastWatchedAt: new Date() },
  });

  // 3. Check for completion (90% threshold)
  const isNowComplete = watchedSeconds >= lesson.durationSeconds * 0.9;

  if (isNowComplete && !progress.isCompleted) {
    await prisma.lessonProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: { isCompleted: true },
    });

    // 4. Recalculate course-level progress
    await recalculateCourseProgress(userId, lesson.courseId);
  }

  // 5. Update lastAccessedAt on Enrollment
  await prisma.enrollment.update({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
    data: { lastAccessedAt: new Date() },
  });

  res.json({ ok: true, isCompleted: isNowComplete });
};

async function recalculateCourseProgress(userId: string, courseId: string) {
  const totalLessons = await prisma.lesson.count({
    where: { courseId, isPublished: true },
  });

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      isCompleted: true,
      lesson: { courseId },
    },
  });

  const progressPercent = totalLessons > 0
    ? (completedLessons / totalLessons) * 100
    : 0;

  const isComplete = progressPercent === 100;

  await prisma.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      progressPercent,
      completedAt: isComplete ? new Date() : null,
    },
  });

  // Trigger certificate generation if just completed
  if (isComplete) {
    await generateCertificate(userId, courseId);
  }
}
```

---

## 8. Certificate System

### When Is a Certificate Generated?

A certificate is created exactly once: when `recalculateCourseProgress()` sets `progressPercent = 100`. The function checks if a certificate already exists (via `@@unique([userId, courseId])`) so it never duplicates.

```typescript
// lib/certificates.ts

import prisma from './prisma';

export async function generateCertificate(userId: string, courseId: string) {
  // Check if already issued
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  // Generate a unique public URL
  // In production: generate a real PDF and upload to S3/Cloudinary
  const certificateUrl = `https://yourlms.com/certificates/${userId}-${courseId}`;

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      certificateUrl,
      issuedAt: new Date(),
    },
  });

  return certificate;
}
```

---

## 9. Frontend Architecture

### Pages Overview

```
/ (home)              → Landing page, featured courses
/courses              → Browse & search all courses
/courses/:id          → Course detail page + Enroll button
/courses/:id/lessons/:lessonId  → Video player + notes sidebar
/dashboard            → Student: enrolled courses, progress, certificates
/instructor/dashboard → Instructor: my courses, create/edit
/admin                → Admin panel
/login                → Login form
/register             → Register form
/certificates/:id     → Public certificate page (shareable)
```

### Dashboard Data (Computed Queries)

These numbers are never stored — always computed live at query time:

```typescript
// "My Stats" on the student dashboard

// Total enrolled courses
const totalEnrolled = await prisma.enrollment.count({ where: { userId } });

// Total completed courses
const totalCompleted = await prisma.enrollment.count({
  where: { userId, completedAt: { not: null } },
});

// Total watch hours
const result = await prisma.lessonProgress.aggregate({
  where: { userId },
  _sum: { watchedSeconds: true },
});
const totalHours = (result._sum.watchedSeconds ?? 0) / 3600;

// Total certificates
const totalCertificates = await prisma.certificate.count({ where: { userId } });
```

---

## 10. Role & Permission System

### Three Roles

| Role | Can Do |
|---|---|
| `STUDENT` | Enroll in courses, watch lessons, add notes, earn certificates |
| `INSTRUCTOR` | All of STUDENT + create/edit/publish their own courses and lessons |
| `ADMIN` | Everything — manage all users, courses, and platform settings |

### Route Protection Pattern

```typescript
// Every protected route uses this pattern:

// Public
router.get('/courses', getCourses);

// Must be logged in
router.get('/enrollments/my', requireAuth, getMyEnrollments);

// Must be instructor or admin
router.post('/courses', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), createCourse);

// Must own the resource (checked inside controller)
router.patch('/courses/:id', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), updateCourse);
```

### Ownership Check (Inside Controller)

```typescript
export const updateCourse = async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });

  // Instructor can only edit their own course
  if (req.user.role === 'INSTRUCTOR' && course.instructorId !== req.user.userId) {
    return res.status(403).json({ error: 'You do not own this course' });
  }

  // Admin can edit any course — no check needed
  // ... proceed with update
};
```

---

## 11. File Upload System

### Flow

```
1. Frontend selects file
2. POST /api/upload → Backend receives file via multer
3. Backend uploads to Cloudinary (or S3)
4. Cloudinary returns a URL
5. Backend saves URL to Attachment table
6. Frontend displays download link
```

### Backend Upload Endpoint

```typescript
import multer from 'multer';
import cloudinary from 'cloudinary';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/lessons/:lessonId/attachments',
  requireAuth,
  requireRole('INSTRUCTOR', 'ADMIN'),
  upload.single('file'),
  async (req, res) => {
    const result = await cloudinary.uploader.upload_stream(/* buffer */);

    await prisma.attachment.create({
      data: {
        lessonId: req.params.lessonId,
        fileUrl: result.secure_url,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
      },
    });

    res.json({ ok: true });
  }
);
```

---

## 12. Build Order — What to Build First

Build in this exact order. Each phase depends on the previous.

### Phase 1 — Foundation (Week 1–2)

- [ ] Set up PostgreSQL + Prisma schema
- [ ] Run `prisma migrate dev` to create tables
- [ ] Build `POST /auth/register` and `POST /auth/login`
- [ ] Build `auth.middleware.ts` and `role.middleware.ts`
- [ ] Test auth with Postman or Insomnia

### Phase 2 — Core Content (Week 3–4)

- [ ] CRUD for Courses (`/courses`)
- [ ] CRUD for Lessons (`/courses/:id/lessons`)
- [ ] `orderIndex` management for lesson reordering
- [ ] `isPublished` toggle for both Course and Lesson
- [ ] File attachment upload + Attachment table

### Phase 3 — Student Features (Week 5–6)

- [ ] `POST /enrollments` — enroll in course
- [ ] `PATCH /lessons/:id/progress` — heartbeat endpoint
- [ ] `recalculateCourseProgress()` function
- [ ] Notes CRUD
- [ ] Certificate generation on 100% completion

### Phase 4 — Frontend (Week 7–9)

- [ ] Auth pages (login / register)
- [ ] Course listing and detail pages
- [ ] Video player with heartbeat (`VideoPlayer.tsx`)
- [ ] Notes sidebar on lesson page
- [ ] Student dashboard (stats, enrolled courses, certificates)
- [ ] Instructor dashboard (create/edit courses and lessons)

### Phase 5 — Polish (Week 10+)

- [ ] Search and filter courses by category / level
- [ ] Admin panel for user and course management
- [ ] Public certificate page (shareable URL)
- [ ] Email notification on certificate issue
- [ ] Performance: add database indexes on FK columns

---

## Quick Reference — Computed Values

These values are **never stored**, always queried:

| Value | Query |
|---|---|
| Total watch hours | `SUM(LessonProgress.watchedSeconds) / 3600` WHERE userId |
| Course progress % | `COUNT(completed lessons) / COUNT(total lessons) * 100` |
| Total enrolled courses | `COUNT(Enrollment)` WHERE userId |
| Total completed courses | `COUNT(Enrollment WHERE completedAt IS NOT NULL)` |
| Total certificates | `COUNT(Certificate)` WHERE userId |

---

*Built with PostgreSQL + Prisma + Next.js + Node.js*
