import express from "express";
import { createEnrollment, getAllEnrollment, getSpeceficEnrollment, update } from "../controllers/enrollment.controller.js";
const router = express.Router({mergeParams:true})

// then he want to get all his enrollments to know his courses
router.get("/me",getAllEnrollment)
// then he want to get his enrollment to know his progress 
router.get("/:courseId",getSpeceficEnrollment)

// in the first time users will create enrollment to record course
router.post("/:courseId",createEnrollment)





// after get his enrollments he will watch his course then patch course progress
//  to calc presentProgress we will use how many lessons he watched
router.patch("/:courseId",update)


// NOTICE
// we have use courseId in req.params not enrollmentsId becasue we will use userId from token and courseId to get the enrollment to ensure it's his own

// maybe w should add DELETE method for admin or instructior

export default router
