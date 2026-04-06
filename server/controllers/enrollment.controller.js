import catchError from "../catchError.js";
import { prisma } from "../lib/prisma.ts";
import success from "../successufull.js";
const getUserId =(req)=> req.user.id

  

export const createEnrollment = async (req, res) => {
  const id = getUserId(req)
  const { courseId } = req.params;
  try {
    const fisrtLesson = await prisma.lesson.findFirst({
      where:{
        courseId,
        orderIndex:1
      }
    })
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: id,
        courseId,
        lastLesson: fisrtLesson?.id ?? "not found"
      },
    });

    success(res,201,enrollment)
  } catch (error) {
    catchError(res, error);
  }
};

export const getAllEnrollment = async (req, res) => {
  const id = getUserId(req)
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        enrolledAt:"desc",
      },
      include:{
        course:true
      }
    });
    success(res,200,enrollments)
  } catch (error) {
    catchError(res, error);
  }
};

export const getSpeceficEnrollment = async (req, res) => {
  const id = getUserId(req)
  const { courseId } = req.params;
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {userId:id, courseId},
      },
    });

    res.status(201).json({ enrollment });
  } catch (error) {
    catchError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.user;
    const { courseId } = req.params;
    // convert to number to ensure calculations
    const currentLesson = Number(req.body.currentLesson); 
    let currentLessonNumber ; 
    if (!currentLesson || currentLesson == null){
      const lesson = await prisma.lesson.findFirst({
        where:{
          id:req.body.currentLesson
        }
      })
      if(!lesson || lesson == null){
        return res.status(404).json({ message: "lesson not found" })
      }
      currentLessonNumber = lesson.orderIndex 
    }
    const allLessons = await prisma.lesson.count({
      where: { courseId }
    });
    // make sure course has lessons if not return message
    if (allLessons === 0) {
      return success(res, 200, { message: "Course has no lessons yet" });
    }
    // make sure currentLesson not greater than allLessons
    const validatedLesson = currentLessonNumber > allLessons ? allLessons : currentLessonNumber;
    // calculate the percentage of the course progress
    const percent = parseFloat(((validatedLesson / allLessons) * 100).toFixed(2));
    // after we have put any needed steps we update the enrollment
    const enrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: { userId: id, courseId }
      },
      data: {
        progressPercent: percent,
        lastLesson: validatedLesson
      }
    });

    success(res, 200, enrollment); 
  } catch (error) {
    catchError(res, error);
  }
};