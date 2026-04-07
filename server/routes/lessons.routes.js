import express from "express"
import { 
  addNotes, deleteNote, 
  getAllAttachment, getAllLessons, getAllLessonsforEnrolled, 
  getAllLessonsForNotStudent, getAllOfCourseAttachment, 
  getLesson, getNote, getProgress, postAttachment, 
  postLesson, postOrPatch, putLesson, updateAttachment, updateNotes, 
  getAllNotes,
  deletLesson,
  deletAttachment
} from "../controllers/lessons.controller.js"
import { isEnrolled } from "../middleware/enrollment.js"
import { oneIsPublished } from "../middleware/coursePublished.js"
import { notStudent } from "../middleware/UserData.js"

const router = express.Router({ mergeParams: true })

// --- 1. المسارات الثابتة العامة (Static Routes) ---
// نضعها في البداية لأنها لا تحتوي على متغيرات (Params)
router.get("/", oneIsPublished, getAllLessons)
router.get("/admin", notStudent, getAllLessonsForNotStudent) // أضفت middleware الحماية هنا
router.get("/enrolled", isEnrolled, getAllLessonsforEnrolled)
router.get("/attachment", oneIsPublished, isEnrolled, getAllOfCourseAttachment)

// --- 2. عمليات الإدارة (Admin/Instructor Operations) ---
// المسارات التي تنشئ بيانات جديدة (بدون ID في الرابط)
router.post("/", notStudent, postLesson)

// --- 3. المسارات التي تعتمد على متغير (:lessonId) ---
// يجب أن تأتي بعد المسارات الثابتة تماماً
router.get("/:lessonId", isEnrolled, oneIsPublished, getLesson)
router.put("/:lessonId", notStudent, putLesson)
router.delete("/:lessonId", notStudent, deletLesson)

// --- 4. مسارات المرفقات الخاصة بدرس معين (Sub-resources) ---
// POST لإنشاء مرفق جديد لدرس معين (عادة لا نضع attachmentId في الـ POST)
router.post("/:lessonId/attachment", notStudent, postAttachment) 
router.get("/:lessonId/attachment", oneIsPublished, isEnrolled, getAllAttachment)
router.put("/:lessonId/attachment/:attachmentId", notStudent, updateAttachment)
router.delete("/:lessonId/attachment/:attachmentId", notStudent, deletAttachment)

// --- 5. المسارات التي تتطلب "تسجيل دخول/اشتراك" حصرياً (Middleware Grouping) ---
// نضع الـ use هنا ليطبق على كل ما تحته فقط
router.use(oneIsPublished, isEnrolled)

// Lesson progress
router.get("/:lessonId/progress", getProgress)
router.post("/:lessonId/progress", postOrPatch)

// Notes
router.get("/:lessonId/notes", getAllNotes)
router.post("/:lessonId/notes", addNotes)
router.get("/:lessonId/notes/:noteId", getNote)
router.patch("/:lessonId/notes/:noteId", updateNotes)
router.delete("/:lessonId/notes/:noteId", deleteNote)

export default router