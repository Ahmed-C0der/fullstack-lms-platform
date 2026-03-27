import express from "express"
import { courseinfo, deleteCourse, getAllCourses ,getFeaturedCourses, postCourse, putCourse} from "../controllers/courses.controller.js"
import { oneIsPublished } from "../middleware/coursePublished.js"
import { getUserInfo, notStudent } from "../middleware/UserData.js"
const router = express.Router({mergeParams:true})

// all Courses
router.get("/",getAllCourses)
router.post("/",getUserInfo,notStudent,postCourse)
// featured Courses
router.get("/featured",getFeaturedCourses)

// get course detail public and privat (lessons) if he have enrolled
router.get("/:courseId",oneIsPublished,courseinfo)

router.put("/:courseId",getUserInfo,notStudent,putCourse)
router.delete("/:courseId",getUserInfo,notStudent,deleteCourse)

export default router