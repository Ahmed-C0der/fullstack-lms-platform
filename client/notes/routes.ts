import express from "express";
const router = express.Router();

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────
router.post("/auth/register");           // create new account
router.post("/auth/login");              // login, returns JWT
router.get("/auth/me");                  // get current logged-in user

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────
router.get("/users");                    // [admin] get all users
router.get("/users/:id");               // [admin] get one user by id
router.patch("/users/:id");             // [admin] update user info
router.delete("/users/:id");            // [admin] delete user

// ─────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────
router.get("/courses");                  // get all published courses (public)
router.get("/courses/:id");             // get one course + its lessons (public)
router.post("/courses");                // [instructor] create new course
router.patch("/courses/:id");           // [instructor] update course info
router.delete("/courses/:id");          // [instructor] delete course
router.patch("/courses/:id/publish");   // [instructor] toggle isPublished

// ─────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────
router.get("/courses/:courseId/lessons");            // get all lessons in a course
router.get("/courses/:courseId/lessons/:lessonId");  // get one lesson
router.post("/courses/:courseId/lessons");           // [instructor] create lesson
router.patch("/lessons/:id");                        // [instructor] update lesson
router.delete("/lessons/:id");                       // [instructor] delete lesson
router.patch("/lessons/:id/publish");                // [instructor] toggle isPublished
router.patch("/lessons/:id/reorder");                // [instructor] update orderIndex

// ─────────────────────────────────────────
// ENROLLMENTS
// ─────────────────────────────────────────
router.post("/enrollments");                         // [student] enroll in a course
router.get("/enrollments/my");                       // [student] get all my enrollments
router.get("/enrollments/:courseId");                // [student] get my enrollment for one course
router.delete("/enrollments/:courseId");             // [student] unenroll from a course

// ─────────────────────────────────────────
// PROGRESS
// ─────────────────────────────────────────
router.patch("/lessons/:id/progress");               // [student] heartbeat — update watchedSeconds
router.get("/courses/:id/progress");                 // [student] get full progress for a course
router.patch("/lessons/:id/complete");               // [student] manually mark lesson as complete

// ─────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────
router.get("/lessons/:id/notes");                    // [student] get all my notes for a lesson
router.post("/lessons/:id/notes");                   // [student] create a note
router.patch("/notes/:id");                          // [student] edit a note
router.delete("/notes/:id");                         // [student] delete a note

// ─────────────────────────────────────────
// ATTACHMENTS
// ─────────────────────────────────────────
router.get("/lessons/:id/attachments");              // get all attachments for a lesson
router.post("/lessons/:id/attachments");             // [instructor] upload attachment
router.delete("/attachments/:id");                   // [instructor] delete attachment

// ─────────────────────────────────────────
// CERTIFICATES
// ─────────────────────────────────────────
router.get("/certificates/my");                      // [student] get all my certificates
router.get("/certificates/:id");                     // get one certificate (public share link)

export default router;
