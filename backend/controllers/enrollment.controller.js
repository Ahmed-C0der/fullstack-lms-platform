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
        lastLesson:req.body.lastLesson || fisrtLesson
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
        userId_courseId: {id, courseId},
      },
    });

    res.status(201).json({ enrollment });
  } catch (error) {
    catchError(res, error);
  }
};

export const update =async ( req, res) => {
  try {
    const {id} = req.user
    const {courseId} = req.params
    const {currentLesson} = req.body 

    const allLessons = await prisma.lesson.count({
        where:{
            courseId
        }
    })
    const percent = (currentLesson / allLessons) * 100
    const enrollment = await prisma.enrollment.update({
        where:{
            userId:id,
            courseId
        },
        data:{
            progressPercent:percent,
            lastLesson:currentLesson
        }
    })
  } catch (error) {
    catchError(res, error);
  }
};
