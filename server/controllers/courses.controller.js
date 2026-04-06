import catchError from "../catchError.js";
import { prisma } from "../lib/prisma.ts";
import success from "../successufull.js";

export const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const courses = await prisma.course.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
      where: { isPublished: true }
    })
    // const courses = await prisma.course.findMany({
    //   where: {
    //     isPublished: true,
    //   },
    // });
    if (courses.length == 0) {
      return catchError(res);
    }
    success(res, 200, courses)
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
    success(res, 200, courses)

  } catch (error) {
    catchError(res, error)
  }
}

export const getCoursesForBuilder = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user.id
      }
    })
    success(res, 200, courses)
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

    success(res, 200, course)

  } catch (error) {
    catchError(res, error);
  }
};

export const postCourse = async (req, res) => {
  const instructorId = req.user.id
  try {
    const { level, category, ...rest } = req.body
    const categoryArray = category.split(",").map((cat) => cat.trim().toUpperCase());
    const course = await prisma.course.create({
      data: {
        ...rest,
        level: level?.toUpperCase(), 
        category: categoryArray,
        instructorId
      }
    })
    success(res, 201, course)
  } catch (error) {
    catchError(res, error)
  }
}

export const putCourse = async (req, res) => {
  const instructorId = req.user.id
  const { level, category,isPublished,title,description,price,thumbnailUrl,isFeatured } = req.body
  const categoryArray = category.split(",").map((cat) => cat.trim().toUpperCase());
  try {
    const course = await prisma.course.update({
      where: {
        id: req.params.courseId,
        instructorId: instructorId 
      },
      data: {
        level: level?.toUpperCase(),
        category: categoryArray,
        isPublished,
        title,
        description,
        price,
        thumbnailUrl,
        isFeatured
      }
    })
    success(res, 201, course)
  } catch (error) {
    catchError(res, error);
  }
}

export const deleteCourse = async (req, res) => {
  const instructorId = req.user.id
  try {
    const course = await prisma.course.delete({
      where: {
        id: req.params.courseId,
        instructorId: instructorId
      }
    })
    success(res, 201, course)
  } catch (error) {
    catchError(res, error);
  }
}