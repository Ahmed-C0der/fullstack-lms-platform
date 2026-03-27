import catchError from "../catchError.js";
import { prisma } from "../lib/prisma.ts";
import success from "../successufull.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
    });
    if (courses.length == 0) {
      return catchError(res);
    }
    success(res,200,courses)
  } catch (error) {
    catchError(res, error);
  }
};

export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isFeatured: true,
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        level: true,
        category: true,
        instructor: {
          select: { userName: true }
        }
      }
    })
    success(res,200,courses)

  } catch (error) {
    catchError(res, error)
  }
}


export const courseinfo = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    if (!course) {
      return res.status(404).json({ message: "this course not found" });
    }

        success(res,200,course)

  } catch (error) {
    catchError(res, error);
  }
};

export const postCourse = async (req, res) => {
  const { title,
    category,
    description,
    isFeatured = false,
    thumbnailUrl,
    level = "BEGINNER",
    isPublished = false,
    language = "Arabic" } = req.body
  const instructorId = req.user.id
  try {
    const course = await prisma.course.create({
      data: { ...req.body,instructorId
      }
    })
    success(res, 201,course)
  } catch (error) {
    catchError(res, error);

  }
}
export const putCourse = async (req, res) => {
  const instructorId = req.user.id
  try {
    const course = await prisma.course.update({
      where:{
        id:req.params.courseId
      },
      data: {
        ...req.body
      }
    })
    success(res, 201,course)
  } catch (error) {
    catchError(res, error);

  }
}

export const deleteCourse = async (req , res)=>{
  try {
    const course = await prisma.course.delete({
      where:{
        id:req.params.courseId
      }
    })
    success(res, 201,course)
    
  } catch (error) {
    catchError(res, error);
    
  }
}