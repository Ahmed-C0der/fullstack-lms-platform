import { PrismaClient } from "../lib/generated/prisma/client.js"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

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
    }
  })

  console.log("✅ Users created")

  // ─────────────────────────────────────────
  // 2. COURSES
  // ─────────────────────────────────────────
  const course1 = await prisma.course.upsert({
    where: { id: "course-001" },
    update: {},
    create: {
      id: "course-001",
      title: "React from Zero to Hero",
      description: "Learn React from scratch — components, hooks, state management, and more.",
      category: "Frontend",
      level: "BEGINNER",
      language: "Arabic",
      thumbnailUrl: "https://placehold.co/600x400?text=React+Course",
      isPublished: true,
      isFeatured: true,
      instructorId: instructor.id,
    }
  })

  const course2 = await prisma.course.upsert({
    where: { id: "course-002" },
    update: {},
    create: {
      id: "course-002",
      title: "Node.js & Express API",
      description: "Build RESTful APIs with Node.js, Express, and PostgreSQL.",
      category: "Backend",
      level: "INTERMEDIATE",
      language: "Arabic",
      thumbnailUrl: "https://placehold.co/600x400?text=Node+Course",
      isPublished: true,
      isFeatured: false,
      instructorId: instructor.id,
    }
  })

  const course3 = await prisma.course.upsert({
    where: { id: "course-003" },
    update: {},
    create: {
      id: "course-003",
      title: "Database Design with PostgreSQL",
      description: "Learn relational database design, SQL, and advanced queries.",
      category: "Database",
      level: "INTERMEDIATE",
      language: "Arabic",
      thumbnailUrl: "https://placehold.co/600x400?text=DB+Course",
      isPublished: false,   // draft — مش ظاهر للطلاب
      isFeatured: false,
      instructorId: instructor.id,
    }
  })

  console.log("✅ Courses created")

  // ─────────────────────────────────────────
  // 3. LESSONS
  // ─────────────────────────────────────────

  // React Course Lessons
  const lesson1 = await prisma.lesson.upsert({
    where: { id: "lesson-001" },
    update: {},
    create: {
      id: "lesson-001",
      courseId: course1.id,
      title: "What is React?",
      category: "Introduction",
      overview: "In this lesson we cover what React is, why it was created, and how it differs from vanilla JavaScript.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 300,
      orderIndex: 1,
      isPublished: true,
    }
  })

  const lesson2 = await prisma.lesson.upsert({
    where: { id: "lesson-002" },
    update: {},
    create: {
      id: "lesson-002",
      courseId: course1.id,
      title: "Setting Up Your Environment",
      category: "Introduction",
      overview: "Install Node.js, create a React app with Vite, and explore the project structure.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 480,
      orderIndex: 2,
      isPublished: true,
    }
  })

  const lesson3 = await prisma.lesson.upsert({
    where: { id: "lesson-003" },
    update: {},
    create: {
      id: "lesson-003",
      courseId: course1.id,
      title: "Your First Component",
      category: "Components",
      overview: "Learn what a component is, how to create one, and how to render it.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 600,
      orderIndex: 3,
      isPublished: true,
    }
  })

  const lesson4 = await prisma.lesson.upsert({
    where: { id: "lesson-004" },
    update: {},
    create: {
      id: "lesson-004",
      courseId: course1.id,
      title: "useState Hook",
      category: "Hooks",
      overview: "Understand state in React and how to use the useState hook to manage it.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 720,
      orderIndex: 4,
      isPublished: true,
    }
  })

  const lesson5 = await prisma.lesson.upsert({
    where: { id: "lesson-005" },
    update: {},
    create: {
      id: "lesson-005",
      courseId: course1.id,
      title: "useEffect Hook",
      category: "Hooks",
      overview: "Learn how to run side effects in React components using useEffect.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 840,
      orderIndex: 5,
      isPublished: false,   // draft
    }
  })

  // Node.js Course Lessons
  const lesson6 = await prisma.lesson.upsert({
    where: { id: "lesson-006" },
    update: {},
    create: {
      id: "lesson-006",
      courseId: course2.id,
      title: "What is Node.js?",
      category: "Introduction",
      overview: "Introduction to Node.js — the runtime, the event loop, and why it is used for APIs.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 360,
      orderIndex: 1,
      isPublished: true,
    }
  })

  const lesson7 = await prisma.lesson.upsert({
    where: { id: "lesson-007" },
    update: {},
    create: {
      id: "lesson-007",
      courseId: course2.id,
      title: "Express Setup",
      category: "Express",
      overview: "Install Express and create your first HTTP server with routes.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      durationSeconds: 540,
      orderIndex: 2,
      isPublished: true,
    }
  })

  console.log("✅ Lessons created")

  // ─────────────────────────────────────────
  // 4. ATTACHMENTS
  // ─────────────────────────────────────────
  await prisma.attachment.upsert({
    where: { id: "attach-001" },
    update: {},
    create: {
      id: "attach-001",
      lessonId: lesson1.id,
      fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1",
      fileName: "react-intro-slides.pdf",
      fileType: "pdf",
    }
  })

  await prisma.attachment.upsert({
    where: { id: "attach-002" },
    update: {},
    create: {
      id: "attach-002",
      lessonId: lesson3.id,
      fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1",
      fileName: "component-cheatsheet.pdf",
      fileType: "pdf",
    }
  })

  console.log("✅ Attachments created")

  // ─────────────────────────────────────────
  // 5. ENROLLMENTS
  // ─────────────────────────────────────────
  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course1.id,
      progressPercent: 50,
      enrolledAt: new Date(),
    }
  })

  const enrollment2 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course2.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course2.id,
      progressPercent: 0,
      enrolledAt: new Date(),
    }
  })

  console.log("✅ Enrollments created")

  // ─────────────────────────────────────────
  // 6. LESSON PROGRESS
  // ─────────────────────────────────────────
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: student.id,
        lessonId: lesson1.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      lessonId: lesson1.id,
      watchedSeconds: 300,
      isCompleted: true,
      lastWatchedAt: new Date(),
    }
  })

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: student.id,
        lessonId: lesson2.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      lessonId: lesson2.id,
      watchedSeconds: 240,
      isCompleted: false,
      lastWatchedAt: new Date(),
    }
  })

  console.log("✅ Lesson progress created")

  // ─────────────────────────────────────────
  // 7. NOTES
  // ─────────────────────────────────────────
  await prisma.note.upsert({
    where: { id: "note-001" },
    update: {},
    create: {
      id: "note-001",
      userId: student.id,
      lessonId: lesson1.id,
      content: "React is a JavaScript library not a framework — important distinction",
      videoTimestamp: 45,
    }
  })

  await prisma.note.upsert({
    where: { id: "note-002" },
    update: {},
    create: {
      id: "note-002",
      userId: student.id,
      lessonId: lesson1.id,
      content: "Virtual DOM is the key concept behind React's performance",
      videoTimestamp: 120,
    }
  })

  console.log("✅ Notes created")

  // ─────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────
  console.log("\n✅ Seed complete!")
  console.log("─────────────────────────────")
  console.log("👤 Admin:      admin@lms.com      / password123")
  console.log("👤 Instructor: instructor@lms.com / password123")
  console.log("👤 Student:    student@lms.com    / password123")
  console.log("─────────────────────────────")
  console.log("📚 Courses:    3 (2 published, 1 draft)")
  console.log("📖 Lessons:    7 (6 published, 1 draft)")
  console.log("📝 Notes:      2")
  console.log("📎 Attachments: 2")
  console.log("🎓 Enrollments: 2")
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
