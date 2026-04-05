import express from "express"

import { addNotes, deletAttachment, deleteNote, deletLesson, getAllAttachment, getAllLessons, getAllLessonsforEnrolled, getAllLessonsForNotStudent, getAllNotes, getAllOfCourseAttachment, getLesson, getNote, getProgress, postAttachment, postLesson, postOrPatch, putLesson, updateAttachment, updateNotes } from "../controllers/lessons.controller.js"
import { isEnrolled } from "../middleware/enrollment.js"
import { oneIsPublished } from "../middleware/coursePublished.js"
import { notStudent } from "../middleware/UserData.js"

const router = express.Router({mergeParams:true})


router.get("/",oneIsPublished,getAllLessons)
router.get("/admin",getAllLessonsForNotStudent)

// in rest routes we should check if oneIsPublished isEnrolled
// router.use(isEnrolled)
router.get("/enrolled",isEnrolled,getAllLessonsforEnrolled)
router.post("/",notStudent,postLesson)
// get lesson data to play 
router.get("/:lessonId",isEnrolled,oneIsPublished,getLesson)

router.put("/:lessonId",notStudent,putLesson)
router.delete("/:lessonId",notStudent,deletLesson)

router.post("/:lessonId/attachment/:attachmentId",notStudent,postAttachment)
router.put("/:lessonId/attachment/:attachmentId",notStudent,updateAttachment)
router.delete("/:lessonId/attachment/:attachmentId",notStudent,deletAttachment)

router.use(oneIsPublished , isEnrolled)
// Lesson progress
// get  lastWatchedAt to use in dashboard analatycs for more UX
//  , watchedSecond to resume watching from last time
router.get("/:lessonId/progress",getProgress)
router.post("/:lessonId/progress",postOrPatch)


// notes
router.get("/:lessonId/notes",getAllNotes)
router.post("/:lessonId/notes",addNotes)
router.get("/:lessonId/notes/:noteId",getNote)
router.patch("/:lessonId/notes/:noteId",updateNotes)
router.delete("/:lessonId/notes/:noteId",deleteNote)


// attachment

router.get("/attachment",getAllOfCourseAttachment)
router.get("/:lessonId/attachment",getAllAttachment)



export default router
