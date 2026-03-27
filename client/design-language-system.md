# Design Language System (DLS) — Production-Grade LMS

A deep dive into a production-grade Design Language System tailored for a modern, high-performance LMS. Optimized for **Next.js**, **Shadcn**, and **GSAP** with a focus on component reusability and high-end motion.

---

## 1. Visual Foundations

### 🎨 The Color Matrix (Extended)

We use a Slate-centric palette for the UI to let the course content (videos/images) stand out, with a Brand Indigo for actions.

| Category | Shade | Tailwind Variable | Purpose |
|---|---|---|---|
| Primary | Indigo 600 | `primary` | Call to action, primary buttons. |
| Secondary | Slate 100 | `secondary` | Inactive tabs, background cards. |
| Success | Emerald 500 | `success` | Certificate earned, Lesson 100%. |
| Accent | Violet 500 | `accent` | Gamification elements, "Pro" features. |
| Muted | Slate 400 | `muted-foreground` | Timestamp, "Instructor Name" labels. |
| Border | Slate 200 | `border` | Divider between `Lessons` in the sidebar. |

#### Gradient Strategy

Use a **"Learning Flow"** gradient for the Hero section or Progress bars:

```
from-indigo-500 via-purple-500 to-pink-500
```

---

### ✍️ Typography & Scale

We use a **Modular Scale (1.250 ratio)** to ensure visual hierarchy remains consistent across mobile and desktop.

- **Font:** `Geist Sans` (Best for code/dev platforms) or `Inter`
- **Base Size:** 16px

| Role | Size | Modifiers |
|---|---|---|
| Display (Dashboard Hero) | 48px | `tracking-tighter` / `font-black` |
| H1 (Course Title) | 30px | `font-bold` |
| H2 (Section Header) | 24px | `font-semibold` |
| Body | 16px | `leading-relaxed` |
| Detail (Note/Attachment name) | 14px | `font-medium` |

---

## 2. Component Architecture (The LMS Atomic Units)

### A. The "Smart" Course Card

For the `Course` model, the UI shouldn't just show an image — it should show **State**.

- **Hover State:** Scale up `1.02x` using GSAP.
- **Visual Logic:** If `Enrollment` exists, show a `ProgressBar`. If not, show an "Enroll Now" price button.

---

### B. The Lesson Sidebar (The "Sticky" Navigator)

Since the DB has `LessonProgress`, the sidebar needs distinct active states:

- 🔒 **Locked Lesson:** Grayed out with a lock icon (`lucide-react`).
- ▶️ **Active Lesson:** Indigo left-border highlight.
- ✅ **Completed Lesson:** Checkmark icon + strikethrough text.

---

### C. The Note-Taking Panel

- **Floating Action Button (FAB):** A small icon at the bottom right that expands into a Markdown editor.
- **Auto-save Indicator:** A small "Saved to DB" checkmark that appears in the corner when the `Note` model updates via a debounce function.

---

## 3. Layout Patterns by Role

### 🏛️ Admin Dashboard (The "Control Center")

- **Layout:** High-density data tables using **TanStack Table**.
- **Key UI:** A "Quick Action" top bar to toggle `Role { STUDENT, INSTRUCTOR, ADMIN }` for testing purposes.
- **Course Builder:** A vertical timeline view where each `Lesson` is a draggable card (use `dnd-kit`).

---

### 🎓 Student Learning View (The "Focus Mode")

- **Layout:** 75% Video Player / 25% Sidebar.
- **UX Pattern:** When a video ends, a GSAP-animated countdown overlay appears: *"Next lesson starting in 5… 4…"*

---

## 4. Motion & Interaction (GSAP Specs)

These animations define the **"Expert"** feel of the platform:

**1. The "Success" Reveal**
When a `Certificate` is issued, trigger a confetti burst + a GSAP `stagger` animation that scales the certificate from the center.

**2. Lesson Transitions**
When switching lessons, don't just "jump." Use a horizontal **"Slide & Fade"** to make the content feel like it's flowing.

```js
gsap.fromTo(
  ".lesson-content",
  { x: 20, opacity: 0 },
  { x: 0, opacity: 1, duration: 0.4 }
);
```

**3. Progress Pulse**
When a user completes a task, the `LessonProgress` bar should briefly **pulse or glow** to provide dopamine feedback.

---

## 5. Technical Implementation (Folder Structure)

To keep this at an **"Expert"** level, organize your Next.js project like this:

```
/src
 ├── /components
 │    ├── /ui                        # Shadcn primitives
 │    └── /lms
 │         ├── CourseCard.tsx
 │         ├── ProgressBar.tsx
 │         ├── NoteEditor.tsx
 │         └── CertificateTemplate.tsx
 ├── /hooks
 │    ├── useLessonProgress.ts       # Logic for DB updates
 │    └── useConfetti.ts             # GSAP trigger
 ├── /styles
 │    └── globals.css                # Tailwind @layer base with design system vars
 └── /lib
      └── role-gate.ts               # Higher-Order Component to check Admin vs Student
```
