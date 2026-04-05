import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client.ts"
import bcrypt from "bcryptjs"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {

  console.log("🌱 Seeding database...")

  // ─────────────────────────────────────────
  // 1. USERS
  // ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 8)

  const admin = await prisma.user.upsert({
    where: { email: "admin@lms.com" },
    update: {},
    create: {
      email: "admin@lms.com",
      password: hashedPassword,
      userName: "Admin",
      role: "ADMIN",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    }
  })

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@lms.com" },
    update: {},
    create: {
      email: "instructor@lms.com",
      password: hashedPassword,
      userName: "Ahmed Instructor",
      role: "INSTRUCTOR",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
    }
  })

  const student = await prisma.user.upsert({
    where: { email: "student@lms.com" },
    update: {},
    create: {
      email: "student@lms.com",
      password: hashedPassword,
      userName: "Mohamed Student",
      role: "STUDENT",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    }
  })

  console.log("✅ Users created")

  // ─────────────────────────────────────────
  // 2. COURSES
  // ─────────────────────────────────────────
  const course1 = await prisma.course.upsert({
    where: { title: "React from Zero to Hero" },
    update: {},
    create: {
      title: "React from Zero to Hero",
      description: "Learn React from scratch — components, hooks, state management, and more. Build real projects and understand the core concepts behind modern frontend development.",
      category: ["Frontend", "JavaScript"],
      level: "BEGINNER",
      language: "Arabic",
      price: 199,
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
      isPublished: true,
      isFeatured: true,
      instructorId: instructor.id,
    }
  })

  const course2 = await prisma.course.upsert({
    where: { title: "Node.js & Express API" },
    update: {},
    create: {
      title: "Node.js & Express API",
      description: "Build RESTful APIs with Node.js and Express. Learn routing, middleware, authentication, and how to connect your backend to a PostgreSQL database using Prisma.",
      category: ["Backend", "JavaScript"],
      level: "INTERMEDIATE",
      language: "Arabic",
      price: 149,
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
      isPublished: true,
      isFeatured: true,
      instructorId: instructor.id,
    }
  })

  const course3 = await prisma.course.upsert({
    where: { title: "Database Design with PostgreSQL" },
    update: {},
    create: {
      title: "Database Design with PostgreSQL",
      description: "Learn relational database design, normalization, SQL queries, indexes, and how to model real-world data effectively using PostgreSQL.",
      category: ["Database", "Backend"],
      level: "INTERMEDIATE",
      language: "Arabic",
      price: 89,
      thumbnailUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
      isPublished: true,
      isFeatured: false,
      instructorId: instructor.id,
    }
  })

  const course4 = await prisma.course.upsert({
    where: { title: "TypeScript for JavaScript Developers" },
    update: {},
    create: {
      title: "TypeScript for JavaScript Developers",
      description: "Add static typing to your JavaScript projects. Learn types, interfaces, generics, and how to use TypeScript with React and Node.js.",
      category: ["Frontend", "Backend", "JavaScript"],
      level: "INTERMEDIATE",
      language: "Arabic",
      price: 129,
      thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop",
      isPublished: true,
      isFeatured: true,
      instructorId: instructor.id,
    }
  })

  const course5 = await prisma.course.upsert({
    where: { title: "UI/UX Design Fundamentals" },
    update: {},
    create: {
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of user interface and user experience design. Covers typography, color theory, wireframing, and prototyping with Figma.",
      category: ["UI_UX"],
      level: "BEGINNER",
      language: "Arabic",
      price: 0,
      thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
      isPublished: false,
      isFeatured: false,
      instructorId: instructor.id,
    }
  })

  console.log("✅ Courses created")

  // ─────────────────────────────────────────
  // 3. LESSONS
  // ─────────────────────────────────────────

  // ── React Course ──────────────────────────
  await prisma.lesson.upsert({
    where: { title: "What is React?" },
    update: {},
    create: {
      courseId: course1.id,
      instructorId: instructor.id,
      title: "What is React?",
      category: "Introduction",
      overview: "We cover what React is, why it was created, and how it differs from vanilla JavaScript. We also look at the virtual DOM and why it makes React fast.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 300,
      orderIndex: 1,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Setting Up Your Environment" },
    update: {},
    create: {
      courseId: course1.id,
      instructorId: instructor.id,
      title: "Setting Up Your Environment",
      category: "Introduction",
      overview: "Install Node.js and create a React app using Vite. We explore the project structure and understand what each file does.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 480,
      orderIndex: 2,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Your First Component" },
    update: {},
    create: {
      courseId: course1.id,
      instructorId: instructor.id,
      title: "Your First Component",
      category: "Components",
      overview: "Learn what a component is, how to create one, and how to render it inside your app. We cover functional components and JSX syntax.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 600,
      orderIndex: 3,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Props and Data Flow" },
    update: {},
    create: {
      courseId: course1.id,
      instructorId: instructor.id,
      title: "Props and Data Flow",
      category: "Components",
      overview: "Understand how data flows from parent to child components using props. Learn prop types and default values.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 540,
      orderIndex: 4,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "useState Hook" },
    update: {},
    create: {
      courseId: course1.id,
      instructorId: instructor.id,
      title: "useState Hook",
      category: "Hooks",
      overview: "Understand state in React and how to use the useState hook to manage dynamic data inside your components.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 720,
      orderIndex: 5,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "useEffect Hook" },
    update: {},
    create: {
      courseId: course1.id,
      instructorId: instructor.id,
      title: "useEffect Hook",
      category: "Hooks",
      overview: "Learn how to run side effects in React components — fetching data, subscribing to events, and cleaning up.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 840,
      orderIndex: 6,
      isPublished: false,
    }
  })

  // ── Node.js Course ────────────────────────
  await prisma.lesson.upsert({
    where: { title: "What is Node.js?" },
    update: {},
    create: {
      courseId: course2.id,
      instructorId: instructor.id,
      title: "What is Node.js?",
      category: "Introduction",
      overview: "Introduction to Node.js — the runtime, the event loop, and why it is used for building APIs and server-side applications.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 360,
      orderIndex: 1,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Express Setup and First Route" },
    update: {},
    create: {
      courseId: course2.id,
      instructorId: instructor.id,
      title: "Express Setup and First Route",
      category: "Express",
      overview: "Install Express and create your first HTTP server. We set up routes and test them with Postman.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 540,
      orderIndex: 2,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Middleware in Express" },
    update: {},
    create: {
      courseId: course2.id,
      instructorId: instructor.id,
      title: "Middleware in Express",
      category: "Express",
      overview: "Learn what middleware is, how the request-response cycle works, and how to write custom middleware for logging, auth, and error handling.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 660,
      orderIndex: 3,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "JWT Authentication" },
    update: {},
    create: {
      courseId: course2.id,
      instructorId: instructor.id,
      title: "JWT Authentication",
      category: "Auth",
      overview: "Build a complete authentication system with JWT. We cover register, login, token generation, and protecting routes with middleware.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 900,
      orderIndex: 4,
      isPublished: true,
    }
  })

  // ── PostgreSQL Course ─────────────────────
  await prisma.lesson.upsert({
    where: { title: "Relational Database Concepts" },
    update: {},
    create: {
      courseId: course3.id,
      instructorId: instructor.id,
      title: "Relational Database Concepts",
      category: "Introduction",
      overview: "Understand tables, rows, columns, primary keys, and foreign keys. Learn what makes a database relational and why it matters.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 420,
      orderIndex: 1,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Writing SQL Queries" },
    update: {},
    create: {
      courseId: course3.id,
      instructorId: instructor.id,
      title: "Writing SQL Queries",
      category: "SQL",
      overview: "Learn SELECT, INSERT, UPDATE, DELETE. We cover WHERE clauses, ORDER BY, LIMIT, and how to filter and sort data effectively.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 780,
      orderIndex: 2,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Joins and Relations" },
    update: {},
    create: {
      courseId: course3.id,
      instructorId: instructor.id,
      title: "Joins and Relations",
      category: "SQL",
      overview: "Master INNER JOIN, LEFT JOIN, and how to query data across multiple tables. Learn when to use each type of join.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 840,
      orderIndex: 3,
      isPublished: true,
    }
  })

  // ── TypeScript Course ─────────────────────
  await prisma.lesson.upsert({
    where: { title: "Why TypeScript?" },
    update: {},
    create: {
      courseId: course4.id,
      instructorId: instructor.id,
      title: "Why TypeScript?",
      category: "Introduction",
      overview: "Understand the problems TypeScript solves, how it differs from JavaScript, and how to set it up in a new or existing project.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 300,
      orderIndex: 1,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Types and Interfaces" },
    update: {},
    create: {
      courseId: course4.id,
      instructorId: instructor.id,
      title: "Types and Interfaces",
      category: "Core Concepts",
      overview: "Learn the difference between type aliases and interfaces. Understand when to use each and how to define complex object shapes.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 600,
      orderIndex: 2,
      isPublished: true,
    }
  })

  await prisma.lesson.upsert({
    where: { title: "Generics in TypeScript" },
    update: {},
    create: {
      courseId: course4.id,
      instructorId: instructor.id,
      title: "Generics in TypeScript",
      category: "Core Concepts",
      overview: "Learn how to write reusable, type-safe functions and components using generics. Understand constraints and default types.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 720,
      orderIndex: 3,
      isPublished: true,
    }
  })

  console.log("✅ Lessons created")

  // ─────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────
  console.log("\n✅ Seed complete!")
  console.log("─────────────────────────────────────────")
  console.log("👤 Admin:      admin@lms.com      / password123")
  console.log("👤 Instructor: instructor@lms.com / password123")
  console.log("👤 Student:    student@lms.com    / password123")
  console.log("─────────────────────────────────────────")
  console.log("📚 Courses:  5 (4 published, 1 draft)")
  console.log("📖 Lessons:  16 (15 published, 1 draft)")
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })