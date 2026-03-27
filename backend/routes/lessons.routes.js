import express from "express"

import { addNotes, deleteNote, deletLesson, getAllAttachment, getAllLessons, getAllNotes, getLesson, getNote, getProgress, postAttachment, postLesson, postOrPatch, putLesson, updateAttachment, updateNotes } from "../controllers/lessons.controller.js"
import { isEnrolled } from "../middleware/enrollment.js"
import { oneIsPublished } from "../middleware/coursePublished.js"
import { notStudent } from "../middleware/UserData.js"

const router = express.Router({mergeParams:true})

router.use(oneIsPublished,isEnrolled)

router.get("/",getAllLessons)
router.post("/",postLesson)
// get lesson data to play 
router.get("/:lessonId",getLesson)

router.put("/:lessonId",putLesson)
router.delete("/:lessonId",deletLesson)


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

router.get("/:lessonId/attachment",getAllAttachment)
router.post("/:lessonId/attachment/:attachmentId",notStudent,postAttachment)
router.put("/:lessonId/attachment/:attachmentId",notStudent,updateAttachment)
router.delete("/:lessonId/attachment/:attachmentId",notStudent,postAttachment)


export default router
